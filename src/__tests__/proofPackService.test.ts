/**
 * Tests for Evident ProofPackService
 */

import { ProofPackService } from '../services/proofPackService';
import { DEMO_OPPORTUNITY, DEMO_EVIDENCE, DEMO_PROJECTS } from '../domain/fixtures';
import { MatchingEngine } from '../domain/matchingEngine';

describe('ProofPackService', () => {
  it('synthesizes an evidence-backed candidate dossier', () => {
    const matchResult = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    const markdown = ProofPackService.generateDossierMarkdown(
      'Mayank Tiwari (@nika619)',
      DEMO_OPPORTUNITY,
      matchResult.coverage,
      matchResult.rankedProjects,
      matchResult.groundedBullets,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    expect(markdown).toContain('# Evident — Candidate Evidence Dossier');
    expect(markdown).toContain('Mayank Tiwari (@nika619)');
    expect(markdown).toContain(DEMO_OPPORTUNITY.title);
    expect(markdown).toContain('Evidence Coverage Summary');
    expect(markdown).toContain('Project: evident');
    expect(markdown).toContain('Integrity Seal (Pro)');
  });

  it('includes exact file citations and commit hashes in generated bullets', () => {
    const matchResult = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    const markdown = ProofPackService.generateDossierMarkdown(
      'Mayank Tiwari (@nika619)',
      DEMO_OPPORTUNITY,
      matchResult.coverage,
      matchResult.rankedProjects,
      matchResult.groundedBullets,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    // Citations are formatted like `[src/domain/matchingEngine.ts]` or `[e31b09f]`
    expect(markdown).toMatch(/`\[.+?\]`/);
  });

  it('computes real SHA-256 integrity hash asynchronously', async () => {
    const hash = await ProofPackService.generateIntegrityHash(DEMO_EVIDENCE);
    expect(typeof hash).toBe('string');
    // SHA-256 produces a 64-character hex string
    expect(hash).toMatch(/^[a-f0-9]{64}$/);

    // Deterministic: recomputing with same evidence gives identical hash
    const hash2 = await ProofPackService.generateIntegrityHash(DEMO_EVIDENCE);
    expect(hash2).toBe(hash);
  });

  it('computes sync fingerprint honestly labeled as non-cryptographic', () => {
    const fp = ProofPackService.generateFingerprint(DEMO_EVIDENCE);
    expect(typeof fp).toBe('string');
    expect(fp).toMatch(/^[a-f0-9]{8}$/);

    // Deterministic
    const fp2 = ProofPackService.generateFingerprint(DEMO_EVIDENCE);
    expect(fp2).toBe(fp);
  });
});
