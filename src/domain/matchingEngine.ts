/**
 * Matching Engine
 * Computes coverage between a job opportunity's requirements and
 * the candidate's evidence items using n-gram similarity scoring.
 *
 * Scoring approach:
 * - Tokenizes requirement text and evidence text into normalized terms
 * - Computes Jaccard similarity between token sets
 * - Applies weighted scoring: direct name match > token overlap > partial match
 * - Classifies match status based on score thresholds (not hardcoded lookups)
 * - Must-have gaps are explicitly surfaced, never hidden
 */

import {
  Opportunity,
  OpportunityRequirement,
  EvidenceItem,
  RequirementMatch,
  EvidenceCoverage,
  GroundedResumeBullet,
  ProjectSource,
  EvidenceStatus,
} from './types';

// Stop words filtered during tokenization
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
  'experience', 'using', 'including', 'such', 'ability', 'knowledge',
  'understanding', 'strong', 'proficiency', 'proficient', 'familiar',
  'deep', 'demonstrated', 'proven', 'excellent', 'good', 'working',
]);

export class MatchingEngine {
  /**
   * Matches an opportunity against candidate evidence.
   * Returns matches, coverage stats, ranked projects, and grounded bullets.
   */
  public static matchOpportunity(
    opportunity: Opportunity,
    evidenceItems: EvidenceItem[],
    projects: ProjectSource[]
  ): {
    matches: RequirementMatch[];
    coverage: EvidenceCoverage;
    rankedProjects: {
      projectId: string;
      projectName: string;
      relevanceReason: string;
      matchCount: number;
    }[];
    groundedBullets: GroundedResumeBullet[];
  } {
    const rawRequirements = opportunity?.requirements || [];
    const requirements = rawRequirements.length > 0
      ? rawRequirements
      : this.deriveRequirementsFromDescription(opportunity);

    const matches: RequirementMatch[] = requirements.map((req) =>
      this.evaluateRequirement(req, evidenceItems)
    );

    const coverage = this.calculateCoverage(matches);
    const rankedProjects = this.rankProjects(matches, projects, evidenceItems);
    const groundedBullets = this.synthesizeGroundedBullets(matches, evidenceItems);

    return { matches, coverage, rankedProjects, groundedBullets };
  }

  /**
   * Derives baseline requirements from job description text when
   * structured requirements aren't provided.
   */
  private static deriveRequirementsFromDescription(
    opportunity: Opportunity
  ): OpportunityRequirement[] {
    const desc = (opportunity?.descriptionRaw || '').toLowerCase();
    const title = (opportunity?.title || '').toLowerCase();
    const combined = `${title} ${desc}`;

    const derived: OpportunityRequirement[] = [];

    // Extract technology mentions as requirements
    const techPatterns: { pattern: RegExp; name: string; category: 'technical_core' | 'infrastructure' | 'architecture' | 'tooling' }[] = [
      { pattern: /\b(python)\b/i, name: 'Python Development', category: 'technical_core' },
      { pattern: /\b(typescript|javascript)\b/i, name: 'TypeScript / JavaScript', category: 'technical_core' },
      { pattern: /\b(react|react\s*native)\b/i, name: 'React / React Native', category: 'technical_core' },
      { pattern: /\b(node\.?js|express)\b/i, name: 'Node.js Backend', category: 'technical_core' },
      { pattern: /\b(go|golang)\b/i, name: 'Go Development', category: 'technical_core' },
      { pattern: /\b(rust)\b/i, name: 'Rust Development', category: 'technical_core' },
      { pattern: /\b(java|kotlin|spring)\b/i, name: 'Java / Kotlin', category: 'technical_core' },
      { pattern: /\b(docker|container)\b/i, name: 'Docker & Containerization', category: 'infrastructure' },
      { pattern: /\b(kubernetes|k8s|helm)\b/i, name: 'Kubernetes & Orchestration', category: 'infrastructure' },
      { pattern: /\b(aws|gcp|azure|cloud)\b/i, name: 'Cloud Infrastructure', category: 'infrastructure' },
      { pattern: /\b(ci\/?cd|github\s*actions|jenkins)\b/i, name: 'CI/CD Pipelines', category: 'infrastructure' },
      { pattern: /\b(api|rest|graphql|grpc)\b/i, name: 'API Design', category: 'architecture' },
      { pattern: /\b(sql|postgres|mysql|database)\b/i, name: 'Database & SQL', category: 'architecture' },
      { pattern: /\b(machine\s*learning|ml|ai|deep\s*learning)\b/i, name: 'Machine Learning / AI', category: 'technical_core' },
      { pattern: /\b(testing|test\s*suite|jest|pytest)\b/i, name: 'Testing & QA', category: 'tooling' },
      { pattern: /\b(security|auth|cryptograph)/i, name: 'Security & Authentication', category: 'architecture' },
    ];

    let reqIndex = 0;
    for (const { pattern, name, category } of techPatterns) {
      if (pattern.test(combined)) {
        derived.push({
          id: `req_derived_${reqIndex++}`,
          category,
          name,
          description: `Mentioned in job description/title.`,
          isMustHave: reqIndex <= 3, // first 3 matches treated as must-haves
        });
      }
    }

    // Always add a generic systems requirement as fallback
    if (derived.length === 0) {
      derived.push({
        id: 'req_derived_general',
        category: 'technical_core',
        name: 'Software Engineering',
        description: 'General software development capability.',
        isMustHave: true,
      });
    }

    return derived;
  }

  /**
   * Evaluates a single requirement against evidence using similarity scoring.
   *
   * Scoring:
   * - Tokenize the requirement name + description
   * - Tokenize each evidence item's skill name + claim
   * - Compute Jaccard similarity between token sets
   * - Boost for exact skill name containment
   * - Classify result based on best score
   */
  public static evaluateRequirement(
    req: OpportunityRequirement,
    evidence: EvidenceItem[]
  ): RequirementMatch {
    const reqTokens = this.tokenize(`${req.name} ${req.description}`);

    const scored: { item: EvidenceItem; score: number }[] = [];

    for (const ev of evidence) {
      const evTokens = this.tokenize(`${ev.skillName} ${ev.claim}`);
      let score = this.jaccardSimilarity(reqTokens, evTokens);

      // Boost: if the skill name directly appears in the requirement text
      const reqText = `${req.name} ${req.description}`.toLowerCase();
      const skillLower = ev.skillName.toLowerCase();
      if (reqText.includes(skillLower) || skillLower.includes(req.name.toLowerCase())) {
        score += 0.3;
      }

      // Boost for direct source evidence vs supported/partial
      if (ev.evidenceStatus === 'direct') {
        score *= 1.1;
      }

      if (score > 0.05) {
        scored.push({ item: ev, score: Math.min(score, 1.0) });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      return {
        requirementId: req.id,
        requirementName: req.name,
        category: req.category,
        isMustHave: req.isMustHave,
        status: 'not_found',
        supportingEvidenceIds: [],
        rationale: `No matching evidence found for "${req.name}".`,
      };
    }

    const best = scored[0];
    const status = this.classifyMatchStatus(best.score, best.item);
    const supporting = scored.slice(1, 4).map((s) => s.item.id);

    return {
      requirementId: req.id,
      requirementName: req.name,
      category: req.category,
      isMustHave: req.isMustHave,
      status,
      primaryEvidenceId: best.item.id,
      supportingEvidenceIds: supporting,
      rationale: `${best.item.claim} (score: ${best.score.toFixed(2)}, from ${best.item.projectName})`,
      topProjectName: best.item.projectName,
    };
  }

  /**
   * Classifies match quality into evidence status based on score + evidence type.
   */
  private static classifyMatchStatus(score: number, ev: EvidenceItem): EvidenceStatus {
    if (score >= 0.25 && (ev.evidenceStatus === 'direct' || ev.sourceType === 'source_file')) {
      return 'direct';
    }
    if (score >= 0.15) {
      return 'supported';
    }
    if (score >= 0.08) {
      return 'partial';
    }
    return 'not_found';
  }

  /**
   * Tokenizes text into a set of normalized, stemmed-ish terms.
   * Removes stop words, lowercases, filters short tokens.
   */
  private static tokenize(text: string): Set<string> {
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s.#+]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

    return new Set(tokens);
  }

  /**
   * Jaccard similarity: |A ∩ B| / |A ∪ B|
   */
  private static jaccardSimilarity(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) return 0;

    let intersection = 0;
    for (const token of a) {
      if (b.has(token)) intersection++;
    }

    const union = a.size + b.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Calculates coverage statistics from match results.
   */
  public static calculateCoverage(matches: RequirementMatch[]): EvidenceCoverage {
    let directCount = 0;
    let supportedCount = 0;
    let partialCount = 0;
    let notFoundCount = 0;
    let totalMustHaves = 0;
    let coveredMustHaves = 0;

    for (const match of matches) {
      if (match.isMustHave) {
        totalMustHaves++;
        if (match.status === 'direct' || match.status === 'supported') {
          coveredMustHaves++;
        }
      }

      switch (match.status) {
        case 'direct': directCount++; break;
        case 'supported': supportedCount++; break;
        case 'partial': partialCount++; break;
        case 'not_found':
        default: notFoundCount++; break;
      }
    }

    const summarySentence = `${directCount} directly supported, ${supportedCount} supported, ${partialCount} partial, and ${notFoundCount} gap${notFoundCount === 1 ? '' : 's'}. Covers ${coveredMustHaves}/${totalMustHaves} must-haves.`;

    return {
      directCount,
      supportedCount,
      partialCount,
      notFoundCount,
      totalMustHaves,
      coveredMustHaves,
      summarySentence,
    };
  }

  /**
   * Ranks projects by how many requirement matches they contribute to.
   */
  public static rankProjects(
    matches: RequirementMatch[],
    projects: ProjectSource[],
    evidence: EvidenceItem[]
  ): {
    projectId: string;
    projectName: string;
    relevanceReason: string;
    matchCount: number;
  }[] {
    const projectStats = new Map<string, { count: number; skills: Set<string> }>();

    for (const m of matches) {
      if (m.primaryEvidenceId) {
        const ev = evidence.find((e) => e.id === m.primaryEvidenceId);
        if (ev) {
          const entry = projectStats.get(ev.projectId) || { count: 0, skills: new Set() };
          entry.count++;
          entry.skills.add(m.requirementName);
          projectStats.set(ev.projectId, entry);
        }
      }
    }

    return projects
      .map((proj) => {
        const stats = projectStats.get(proj.id) || { count: 0, skills: new Set() };
        return {
          projectId: proj.id,
          projectName: proj.name,
          relevanceReason: stats.count > 0
            ? `Covers ${stats.count} requirement${stats.count > 1 ? 's' : ''}: ${Array.from(stats.skills).join(', ')}`
            : 'No direct requirement match',
          matchCount: stats.count,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  /**
   * Synthesizes resume bullets linked to evidence.
   * Each bullet references specific evidence IDs for traceability.
   */
  public static synthesizeGroundedBullets(
    matches: RequirementMatch[],
    evidence: EvidenceItem[]
  ): GroundedResumeBullet[] {
    const bullets: GroundedResumeBullet[] = [];
    const usedEvidence = new Set<string>();

    for (const match of matches) {
      if (match.primaryEvidenceId && !usedEvidence.has(match.primaryEvidenceId)) {
        const ev = evidence.find((e) => e.id === match.primaryEvidenceId);
        if (ev && ev.evidenceStatus !== 'not_found') {
          usedEvidence.add(ev.id);

          const fileRef = ev.sourceLocation?.filePath
            ? ` (${ev.sourceLocation.filePath})`
            : '';

          bullets.push({
            id: `bullet_${match.requirementId}`,
            projectId: ev.projectId,
            projectName: ev.projectName,
            text: `${ev.claim}${fileRef}`,
            evidenceIds: [ev.id],
            isAudited: true,
            userVerified: false,
          });
        }
      }
    }

    // Fallback: if no matches produced bullets, pull from top evidence
    if (bullets.length === 0 && evidence.length > 0) {
      for (const ev of evidence) {
        if (ev.evidenceStatus !== 'not_found' && !usedEvidence.has(ev.id)) {
          usedEvidence.add(ev.id);
          bullets.push({
            id: `bullet_ev_${ev.id}`,
            projectId: ev.projectId,
            projectName: ev.projectName,
            text: `${ev.claim} (${ev.sourceLocation?.filePath || ev.sourceLocation?.url || 'source'})`,
            evidenceIds: [ev.id],
            isAudited: true,
            userVerified: false,
          });
          if (bullets.length >= 6) break;
        }
      }
    }

    return bullets;
  }
}
