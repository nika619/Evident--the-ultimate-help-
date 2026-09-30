/**
 * Evident Claim Auditor
 * The anti-hallucination gatekeeper. Enforces the Truthfulness Contract:
 * "Never invent a technology, metric, or responsibility without source-backed provenance."
 */

import { EvidenceItem, GroundedResumeBullet } from './types';

export interface AuditReport {
  bulletId: string;
  claimText: string;
  isAudited: boolean;
  provenanceStatus: 'verified' | 'unsupported_claims_detected' | 'missing_evidence';
  unsupportedTokens: string[];
  supportingEvidence: EvidenceItem[];
  remediationAdvice?: string;
}

export class ClaimAuditor {
  private static KNOWN_TECH_REGISTRY = [
    'react', 'typescript', 'javascript', 'python', 'jwt', 'postgresql', 'postgres',
    'docker', 'kubernetes', 'k8s', 'redis', 'websockets', 'websocket', 'graphql',
    'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'jest', 'vitest', 'express',
    'node.js', 'node', 'fastapi', 'django', 'go', 'rust', 'c++', 'c#', 'swift'
  ];

  /**
   * Audits a list of candidate resume bullets against available evidence
   */
  public static auditBullets(
    bullets: GroundedResumeBullet[],
    evidence: EvidenceItem[]
  ): AuditReport[] {
    return bullets.map((bullet) => this.auditBullet(bullet, evidence));
  }

  /**
   * Audits a single bullet
   */
  public static auditBullet(
    bullet: GroundedResumeBullet,
    evidence: EvidenceItem[]
  ): AuditReport {
    if (!bullet.evidenceIds || bullet.evidenceIds.length === 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: false,
        provenanceStatus: 'missing_evidence',
        unsupportedTokens: [],
        supportingEvidence: [],
        remediationAdvice: 'Claim has no assigned evidence IDs. Grounding requires at least one source artifact.',
      };
    }

    const matchedEvidence = evidence.filter((e) => bullet.evidenceIds.includes(e.id));
    if (matchedEvidence.length === 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: false,
        provenanceStatus: 'missing_evidence',
        unsupportedTokens: [],
        supportingEvidence: [],
        remediationAdvice: 'Referenced evidence IDs do not exist in the candidate Proof Graph.',
      };
    }

    // Inspect if the bullet text claims technologies that are NOT in the supporting evidence
    const bulletWords = bullet.text.toLowerCase().split(/[\s,.;:()]+/);
    const evidenceCorpus = matchedEvidence
      .map((e) => {
        let inferred = '';
        if (e.sourceLocation.filePath?.match(/\.(ts|tsx)$/)) inferred += ' typescript javascript ts';
        if (e.sourceLocation.filePath?.match(/\.(js|jsx)$/)) inferred += ' javascript js';
        if (e.sourceLocation.filePath?.match(/\.py$/)) inferred += ' python py';
        return `${e.skillName} ${e.claim} ${e.sourceLocation.filePath || ''} ${e.sourceLocation.commitMessage || ''} ${inferred}`;
      })
      .join(' ')
      .toLowerCase();

    const unsupportedTokens: string[] = [];

    for (const tech of this.KNOWN_TECH_REGISTRY) {
      if (bulletWords.includes(tech) && !evidenceCorpus.includes(tech)) {
        unsupportedTokens.push(tech);
      }
    }

    if (unsupportedTokens.length > 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: true,
        provenanceStatus: 'unsupported_claims_detected',
        unsupportedTokens,
        supportingEvidence: matchedEvidence,
        remediationAdvice: `Claim mentions unsupported technologies (${unsupportedTokens.join(', ')}). Remove or supply matching repository evidence.`,
      };
    }

    return {
      bulletId: bullet.id,
      claimText: bullet.text,
      isAudited: true,
      provenanceStatus: 'verified',
      unsupportedTokens: [],
      supportingEvidence: matchedEvidence,
    };
  }
}
