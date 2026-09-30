/**
 * Evident Matching Engine
 * Performs honest, evidence-grounded matching between Opportunity Requirements
 * and the candidate's verifiable Proof Graph.
 *
 * Replaces fake "87% fit" percentages with an auditable Evidence Coverage Matrix.
 */

import {
  Opportunity,
  OpportunityRequirement,
  EvidenceItem,
  RequirementMatch,
  EvidenceCoverage,
  GroundedResumeBullet,
  ProjectSource,
} from './types';

export class MatchingEngine {
  /**
   * Matches an entire Opportunity against candidate Evidence Items
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
      : this.deriveRequirementsFromOpportunity(opportunity, evidenceItems);

    const matches: RequirementMatch[] = requirements.map((req) =>
      this.evaluateRequirement(req, evidenceItems)
    );

    const coverage = this.calculateCoverage(matches);
    const rankedProjects = this.rankProjects(matches, projects, evidenceItems);
    const groundedBullets = this.synthesizeGroundedBullets(matches, evidenceItems);

    return {
      matches,
      coverage,
      rankedProjects,
      groundedBullets,
    };
  }

  /**
   * Automatically generates baseline requirements if custom JD lacked structured fields
   */
  private static deriveRequirementsFromOpportunity(
    opportunity: Opportunity,
    evidence: EvidenceItem[]
  ): OpportunityRequirement[] {
    const title = (opportunity?.title || 'Software Engineering Role').toLowerCase();
    const desc = (opportunity?.descriptionRaw || '').toLowerCase();

    const derived: OpportunityRequirement[] = [
      {
        id: 'req_core_lang',
        category: 'technical_core',
        name: 'Core System Programming',
        description: 'Proficiency in primary backend, systems, or application languages.',
        isMustHave: true,
      },
      {
        id: 'req_arch',
        category: 'architecture',
        name: 'Modular Architecture & APIs',
        description: 'Experience authoring resilient services, endpoints, and data layers.',
        isMustHave: true,
      },
      {
        id: 'req_reliability',
        category: 'infrastructure',
        name: 'Deployment & System Reliability',
        description: 'Experience maintaining production repos, Docker, or CI/CD pipelines.',
        isMustHave: false,
      },
    ];

    if (desc.includes('react') || title.includes('frontend') || title.includes('fullstack')) {
      derived.push({
        id: 'req_ui',
        category: 'technical_core',
        name: 'Modern UI & State Management',
        description: 'Component architecture, responsive rendering, and frontend engineering.',
        isMustHave: true,
      });
    }

    if (desc.includes('python') || desc.includes('data') || desc.includes('ml')) {
      derived.push({
        id: 'req_python',
        category: 'technical_core',
        name: 'Data & Python Tooling',
        description: 'Numerical processing, data ingestion, and scripting.',
        isMustHave: false,
      });
    }

    return derived;
  }

  /**
   * Evaluates a single requirement against the evidence repository
   */
  public static evaluateRequirement(
    req: OpportunityRequirement,
    evidence: EvidenceItem[]
  ): RequirementMatch {
    const reqText = `${req.name} ${req.description}`.toLowerCase();

    // Search for direct and supporting evidence
    const matchingEvidence: { item: EvidenceItem; score: number }[] = [];

    for (const ev of evidence) {
      let score = 0;
      const skillName = ev.skillName.toLowerCase();
      const claim = ev.claim.toLowerCase();

      // Check skill name matches
      if (reqText.includes(skillName) || skillName.includes(req.name.toLowerCase())) {
        score += 10;
      }

      // Check token overlap with stop words and word boundaries
      const stopWords = new Set(['and', 'the', 'for', 'with', 'experience', 'using', 'in', 'of', 'to', 'is', 'on', 'as']);
      const keywords = reqText.split(/[\s,&/()]+/).filter((w) => w.length >= 2 && !stopWords.has(w));
      for (const kw of keywords) {
        try {
          const regex = new RegExp(`\\b${kw}\\b`, 'i');
          if (regex.test(claim) || regex.test(skillName)) {
            score += 3;
          }
        } catch {
          // ignore invalid regex from weird symbols
        }
      }

      if (score > 0) {
        matchingEvidence.push({ item: ev, score });
      }
    }

    matchingEvidence.sort((a, b) => b.score - a.score);

    if (matchingEvidence.length === 0) {
      return {
        requirementId: req.id,
        requirementName: req.name,
        category: req.category,
        isMustHave: req.isMustHave,
        status: 'not_found',
        supportingEvidenceIds: [],
        rationale: `No verifiable repository evidence detected matching ${req.name}.`,
      };
    }

    const primary = matchingEvidence[0].item;
    const supportingIds = matchingEvidence.slice(1).map((m) => m.item.id);

    return {
      requirementId: req.id,
      requirementName: req.name,
      category: req.category,
      isMustHave: req.isMustHave,
      status: primary.evidenceStatus,
      primaryEvidenceId: primary.id,
      supportingEvidenceIds: supportingIds,
      rationale: `${primary.claim} Observed in ${primary.projectName}.`,
      topProjectName: primary.projectName,
    };
  }

  /**
   * Calculates honest coverage metrics
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
        totalMustHaves += 1;
        if (match.status === 'direct' || match.status === 'supported') {
          coveredMustHaves += 1;
        }
      }

      switch (match.status) {
        case 'direct':
          directCount += 1;
          break;
        case 'supported':
          supportedCount += 1;
          break;
        case 'partial':
          partialCount += 1;
          break;
        case 'not_found':
        default:
          notFoundCount += 1;
          break;
      }
    }

    const summarySentence = `${directCount} directly supported, ${supportedCount} supported, ${partialCount} partial, and ${notFoundCount} growth vector${notFoundCount === 1 ? '' : 's'}. Covers ${coveredMustHaves}/${totalMustHaves} core must-haves.`;

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
   * Ranks projects by relevance to the matched requirements
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
    const projectMatchCounts = new Map<string, { count: number; skills: Set<string> }>();

    matches.forEach((m) => {
      if (m.primaryEvidenceId) {
        const ev = evidence.find((e) => e.id === m.primaryEvidenceId);
        if (ev) {
          const entry = projectMatchCounts.get(ev.projectId) || { count: 0, skills: new Set() };
          entry.count += 1;
          entry.skills.add(m.requirementName);
          projectMatchCounts.set(ev.projectId, entry);
        }
      }
    });

    return projects
      .map((proj) => {
        const stats = projectMatchCounts.get(proj.id) || { count: 0, skills: new Set() };
        const skillsList = Array.from(stats.skills).join(', ');
        return {
          projectId: proj.id,
          projectName: proj.name,
          relevanceReason: stats.count > 0
            ? `Directly covers ${stats.count} requirements: ${skillsList}`
            : 'Supplementary repository demonstrating engineering breadth',
          matchCount: stats.count,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  /**
   * Synthesizes grounded resume bullets strictly linked to retrieved evidence IDs
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

          bullets.push({
            id: `bullet_${match.requirementId}`,
            projectId: ev.projectId,
            projectName: ev.projectName,
            text: `${ev.claim} (${ev.sourceLocation.filePath || 'verified source artifact'}).`,
            evidenceIds: [ev.id],
            isAudited: true,
            userVerified: false,
          });
        }
      }
    }

    // Safety fallback: if requirements produced 0 bullets but evidence exists, synthesize from top evidence
    if (bullets.length === 0 && evidence.length > 0) {
      for (const ev of evidence) {
        if (ev.evidenceStatus !== 'not_found' && !usedEvidence.has(ev.id)) {
          usedEvidence.add(ev.id);
          bullets.push({
            id: `bullet_ev_${ev.id}`,
            projectId: ev.projectId,
            projectName: ev.projectName,
            text: `${ev.claim} (${ev.sourceLocation?.filePath || 'verified commit history'}).`,
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
