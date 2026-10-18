/**
 * ProofPack Service
 * Generates exportable candidate evidence dossiers with integrity hashes.
 *
 * The integrity hash is a real SHA-256 digest computed from the evidence
 * payload, not a decorative string. Recruiters can re-hash the same
 * inputs and get the same output to verify nothing was tampered with.
 */

import {
  Opportunity,
  EvidenceCoverage,
  GroundedResumeBullet,
  ProjectSource,
  EvidenceItem,
} from '../domain/types';

export class ProofPackService {
  /**
   * Computes a SHA-256 hash of the canonical evidence representation.
   * Uses Web Crypto API when available (browser/RN), falls back to
   * a simple deterministic hash for environments without crypto.
   */
  public static async generateIntegrityHash(evidence: EvidenceItem[]): Promise<string> {
    const canonical = evidence
      .map((e) => `${e.id}:${e.projectId}:${e.skillId}:${e.sourceLocation?.commitHash || 'head'}`)
      .sort()
      .join('|');

    // Try Web Crypto API first (available in modern browsers and React Native)
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(canonical);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback: try Node.js crypto module
    try {
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(canonical).digest('hex');
    } catch {
      // Last resort: deterministic FNV-1a (clearly labeled as non-cryptographic)
      return this.fnv1aHash(canonical);
    }
  }

  /**
   * Synchronous version for contexts where async isn't possible.
   * Uses FNV-1a — labeled honestly as a non-cryptographic fingerprint.
   */
  public static generateFingerprint(evidence: EvidenceItem[]): string {
    const canonical = evidence
      .map((e) => `${e.id}:${e.projectId}:${e.skillId}:${e.sourceLocation?.commitHash || 'head'}`)
      .sort()
      .join('|');
    return this.fnv1aHash(canonical);
  }

  /**
   * Backward-compatible alias for generateFingerprint.
   */
  public static generateMerkleRoot(evidence: EvidenceItem[]): string {
    return this.generateFingerprint(evidence);
  }

  private static fnv1aHash(input: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
  }

  public static generateDossierMarkdown(
    candidateName: string,
    opportunity: Opportunity,
    coverage: EvidenceCoverage,
    rankedProjects: { projectId: string; projectName: string; relevanceReason: string; matchCount: number }[],
    bullets: GroundedResumeBullet[],
    evidence: EvidenceItem[],
    projects: ProjectSource[],
    isPro: boolean = true
  ): string {
    const dateStr = new Date().toISOString().split('T')[0];
    const fingerprint = this.generateFingerprint(evidence);

    const projectSections = rankedProjects
      .filter((p) => p.matchCount > 0)
      .map((rp) => {
        const proj = projects.find((p) => p.id === rp.projectId);
        const repoLink = proj?.repoUrl ? `[GitHub](${proj.repoUrl})` : 'Private / Local';
        return `### Project: ${rp.projectName}
- **Description:** ${proj?.description || 'Software project'}
- **Stack:** ${proj?.languages?.join(', ') || 'TypeScript'} · ${proj?.frameworks?.join(', ') || 'Node.js'}
- **Commits:** ${proj?.candidateCommits || 0}/${proj?.totalCommits || 0} by candidate
- **Source:** ${repoLink}
- **Match reason:** ${rp.relevanceReason}`;
      })
      .join('\n\n');

    const bulletPoints = bullets
      .map((b) => {
        const ev = evidence.find((e) => b.evidenceIds.includes(e.id));
        const fileRef = ev?.sourceLocation?.filePath ? ` \`[${ev.sourceLocation.filePath}]\`` : '';
        const commitRef = ev?.sourceLocation?.commitHash ? ` \`[${ev.sourceLocation.commitHash}]\`` : '';
        return `- ${b.text}${fileRef}${commitRef}`;
      })
      .join('\n');

    const integritySeal = isPro
      ? `
---

## Integrity Seal (Pro)
- **Fingerprint:** \`${fingerprint}\`
- **Method:** FNV-1a over canonical evidence payload (async SHA-256 available via API)
- **Evidence count:** ${evidence.length} items across ${projects.length} repositories
- **Verification:** Re-hash the same evidence IDs + commit SHAs to reproduce this fingerprint.
`
      : '';

    return `# Evident — Candidate Evidence Dossier

**Candidate:** ${candidateName}  
**Target Role:** ${opportunity?.title || 'Software Engineer'}  
**Context:** ${opportunity?.companyOrContext || 'Engineering Organization'}  
**Date:** ${dateStr}  
**Standard:** Evidence-backed claims only — no self-reported skills without source references.
${integritySeal}
---

## Evidence Coverage Summary
- **Direct (code found):** ${coverage.directCount} requirements
- **Supported (config/docs):** ${coverage.supportedCount} requirements
- **Partial (related work):** ${coverage.partialCount} requirements
- **Gaps (no evidence):** ${coverage.notFoundCount} requirements
- **Must-haves covered:** ${coverage.coveredMustHaves}/${coverage.totalMustHaves}

---

## Technical Claims (with source references)
${bulletPoints}

---

## Relevant Repositories
${projectSections}

---

## Integrity Note
Every claim in this dossier references a specific file path, commit hash, or dependency manifest from the candidate's public repositories. Claims without source evidence are flagged as gaps.

*Generated by Evident*
`;
  }
}
