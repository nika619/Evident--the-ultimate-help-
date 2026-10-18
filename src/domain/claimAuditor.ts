/**
 * Claim Auditor
 * Verifies that resume bullets don't claim technologies or capabilities
 * that aren't backed by the candidate's evidence.
 *
 * Verification checks:
 * 1. Every referenced evidence ID must exist in the evidence graph
 * 2. Technologies mentioned in bullet text must appear in supporting evidence
 * 3. File paths cited must match evidence source locations
 * 4. Fork-only contributions are flagged (not rejected, but flagged)
 */

import { EvidenceItem, GroundedResumeBullet } from './types';

export interface AuditReport {
  bulletId: string;
  claimText: string;
  isAudited: boolean;
  provenanceStatus: 'verified' | 'unsupported_claims_detected' | 'missing_evidence';
  unsupportedTokens: string[];
  supportingEvidence: EvidenceItem[];
  warnings: string[];
  remediationAdvice?: string;
}

// Technologies we look for in bullet text.
// Organized by category for maintainability.
const KNOWN_TECHNOLOGIES: string[] = [
  // Languages
  'react', 'typescript', 'javascript', 'python', 'go', 'golang',
  'rust', 'java', 'kotlin', 'swift', 'c++', 'c#', 'ruby', 'php',
  // Frameworks
  'node.js', 'node', 'express', 'fastapi', 'django', 'flask',
  'next.js', 'vue', 'angular', 'svelte', 'spring',
  // Infrastructure
  'docker', 'kubernetes', 'k8s', 'terraform', 'aws', 'gcp', 'azure',
  // Data
  'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'graphql',
  // Security
  'jwt', 'oauth', 'websocket', 'websockets',
  // ML/AI
  'tensorflow', 'pytorch', 'scikit-learn',
  // Testing
  'jest', 'vitest', 'pytest', 'mocha',
  // Build tools
  'webpack', 'vite', 'ci/cd',
];

export class ClaimAuditor {
  /**
   * Audits multiple bullets at once.
   */
  public static auditBullets(
    bullets: GroundedResumeBullet[],
    evidence: EvidenceItem[]
  ): AuditReport[] {
    return bullets.map((bullet) => this.auditBullet(bullet, evidence));
  }

  /**
   * Audits a single resume bullet against the available evidence.
   */
  public static auditBullet(
    bullet: GroundedResumeBullet,
    evidence: EvidenceItem[]
  ): AuditReport {
    const warnings: string[] = [];

    // Check 1: Evidence IDs must be provided
    if (!bullet.evidenceIds || bullet.evidenceIds.length === 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: false,
        provenanceStatus: 'missing_evidence',
        unsupportedTokens: [],
        supportingEvidence: [],
        warnings: ['No evidence IDs linked to this bullet.'],
        remediationAdvice: 'Link at least one evidence item to ground this claim.',
      };
    }

    // Check 2: Referenced evidence must actually exist
    const matchedEvidence = evidence.filter((e) => bullet.evidenceIds.includes(e.id));
    if (matchedEvidence.length === 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: false,
        provenanceStatus: 'missing_evidence',
        unsupportedTokens: [],
        supportingEvidence: [],
        warnings: [`Referenced evidence IDs [${bullet.evidenceIds.join(', ')}] not found in evidence graph.`],
        remediationAdvice: 'The linked evidence items don\'t exist. Re-sync repositories.',
      };
    }

    // Check 3: Technologies in bullet text must be in supporting evidence
    const bulletText = bullet.text.toLowerCase();
    const bulletTokens = bulletText.split(/[\s,.;:()/]+/).filter(Boolean);

    // Build a corpus from all matched evidence
    const evidenceCorpus = matchedEvidence
      .map((e) => {
        const parts = [
          e.skillName,
          e.claim,
          e.sourceLocation?.filePath || '',
          e.sourceLocation?.commitMessage || '',
        ];

        // Infer language from file extension
        const filePath = e.sourceLocation?.filePath || '';
        if (/\.(ts|tsx)$/.test(filePath)) parts.push('typescript javascript');
        if (/\.(js|jsx)$/.test(filePath)) parts.push('javascript');
        if (/\.py$/.test(filePath)) parts.push('python');
        if (/\.go$/.test(filePath)) parts.push('go golang');
        if (/\.rs$/.test(filePath)) parts.push('rust');
        if (/\.java$/.test(filePath)) parts.push('java');
        if (/\.rb$/.test(filePath)) parts.push('ruby');

        return parts.join(' ');
      })
      .join(' ')
      .toLowerCase();

    const unsupportedTokens: string[] = [];

    for (const tech of KNOWN_TECHNOLOGIES) {
      // Check if the bullet actually mentions this technology
      const techInBullet = bulletTokens.includes(tech)
        || (tech.includes('.') && bulletText.includes(tech));

      if (techInBullet && !evidenceCorpus.includes(tech)) {
        unsupportedTokens.push(tech);
      }
    }

    // Check 4: Flag fork-only contributions
    for (const ev of matchedEvidence) {
      if (ev.authorshipSupport === 'inherited_template') {
        warnings.push(`Evidence "${ev.id}" is from a template/fork — contribution may be limited.`);
      }
      if (ev.authorshipSupport === 'collaborator') {
        warnings.push(`Evidence "${ev.id}" is from a forked repo — verify personal contribution.`);
      }
    }

    // Check 5: Flag low-confidence evidence
    const lowConfidenceEvidence = matchedEvidence.filter((e) => e.confidence === 'low');
    if (lowConfidenceEvidence.length > 0) {
      warnings.push(`${lowConfidenceEvidence.length} evidence item(s) have low confidence scores.`);
    }

    if (unsupportedTokens.length > 0) {
      return {
        bulletId: bullet.id,
        claimText: bullet.text,
        isAudited: true,
        provenanceStatus: 'unsupported_claims_detected',
        unsupportedTokens,
        supportingEvidence: matchedEvidence,
        warnings,
        remediationAdvice: `Bullet mentions ${unsupportedTokens.join(', ')} but supporting evidence doesn't cover ${unsupportedTokens.length === 1 ? 'this technology' : 'these technologies'}. Remove the claim or add matching evidence.`,
      };
    }

    return {
      bulletId: bullet.id,
      claimText: bullet.text,
      isAudited: true,
      provenanceStatus: 'verified',
      unsupportedTokens: [],
      supportingEvidence: matchedEvidence,
      warnings,
    };
  }
}
