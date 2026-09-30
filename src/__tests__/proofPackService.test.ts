/**
 * Tests for Evident ProofPackService
 */

import { ProofPackService } from '../services/proofPackService';
import { SAMPLE_OPPORTUNITY, GOLDEN_EVIDENCE, GOLDEN_PROJECTS } from '../domain/fixtures';
import { MatchingEngine } from '../domain/matchingEngine';

describe('ProofPackService', () => {
  it('synthesizes a privacy-safe candidate evidence dossier', () => {
    const matchResult = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    const markdown = ProofPackService.generateDossierMarkdown(
      'Aarav',
      SAMPLE_OPPORTUNITY,
      matchResult.coverage,
      matchResult.rankedProjects,
      matchResult.groundedBullets,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    expect(markdown).toContain('# EVIDENT — Candidate Application Proof Pack');
    expect(markdown).toContain('Aarav');
    expect(markdown).toContain(SAMPLE_OPPORTUNITY.title);
    expect(markdown).toContain('Verifiable Evidence Coverage');
    expect(markdown).toContain('RIFT');
    expect(markdown).toContain('Anti-Hallucination & Integrity Attestation');
  });

  it('includes exact file citations and commit hashes in generated bullets', () => {
    const matchResult = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    const markdown = ProofPackService.generateDossierMarkdown(
      'Aarav',
      SAMPLE_OPPORTUNITY,
      matchResult.coverage,
      matchResult.rankedProjects,
      matchResult.groundedBullets,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    // Assert that file references like `[File: ...]` exist
    expect(markdown).toMatch(/\[File: src\//);
    // Assert that commit references like `[Commit: ...]` exist
    expect(markdown).toMatch(/\[Commit: [a-f0-9]+\]/);
  });
});
