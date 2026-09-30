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
    const matches: RequirementMatch[] = opportunity.requirements.map((req) =>
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

      // Check token overlap (allowing 3-letter acronyms like jwt, git, api, sql, k8s)
      const keywords = reqText.split(/[\s,&/()]+/).filter((w) => w.length >= 3);
      for (const kw of keywords) {
        if (claim.includes(kw) || skillName.includes(kw)) {
          score += 3;
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
        rationale: 'No direct or derived implementation evidence detected in repository history.',
      };
    }

    const topMatch = matchingEvidence[0].item;
    const isDirect = topMatch.evidenceStatus === 'direct' && matchingEvidence[0].score >= 8;
    const isSupported = topMatch.evidenceStatus === 'supported' || matchingEvidence[0].score >= 4;

    return {
      requirementId: req.id,
      requirementName: req.name,
      category: req.category,
      isMustHave: req.isMustHave,
      status: isDirect ? 'direct' : isSupported ? 'supported' : 'partial',
      primaryEvidenceId: topMatch.id,
      supportingEvidenceIds: matchingEvidence.map((m) => m.item.id),
      rationale: `Supported by ${topMatch.projectName} via ${topMatch.sourceLocation.filePath || topMatch.sourceType}: "${topMatch.claim}"`,
      topProjectName: topMatch.projectName,
    };
  }

  /**
   * Summarizes coverage without false precision percentages
   */
  public static calculateCoverage(matches: RequirementMatch[]): EvidenceCoverage {
    let directCount = 0;
    let supportedCount = 0;
    let partialCount = 0;
    let notFoundCount = 0;
    let totalMustHaves = 0;
    let coveredMustHaves = 0;

    for (const m of matches) {
      if (m.isMustHave) {
        totalMustHaves += 1;
        if (m.status === 'direct' || m.status === 'supported') {
          coveredMustHaves += 1;
        }
      }

      if (m.status === 'direct') directCount += 1;
      else if (m.status === 'supported') supportedCount += 1;
      else if (m.status === 'partial') partialCount += 1;
      else notFoundCount += 1;
    }

    const summarySentence = `${directCount} directly supported, ${supportedCount} supported, ${partialCount} partial, and ${notFoundCount} evidence gap${notFoundCount === 1 ? '' : 's'}. Covers ${coveredMustHaves}/${totalMustHaves} core must-haves.`;

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

    return bullets;
  }
}
