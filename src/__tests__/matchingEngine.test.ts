/**
 * Tests for Evident MatchingEngine
 */

import { MatchingEngine } from '../domain/matchingEngine';
import { SAMPLE_OPPORTUNITY, GOLDEN_EVIDENCE, GOLDEN_PROJECTS } from '../domain/fixtures';

describe('MatchingEngine', () => {
  it('matches opportunity requirements against candidate evidence', () => {
    const result = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    expect(result.matches.length).toBe(SAMPLE_OPPORTUNITY.requirements.length);
    expect(result.coverage).toBeDefined();
    expect(result.rankedProjects.length).toBe(GOLDEN_PROJECTS.length);
    expect(result.groundedBullets.length).toBeGreaterThan(0);
  });

  it('accurately classifies direct vs gap requirements without fake percentages', () => {
    const result = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    // TypeScript requirement should be directly supported
    const tsMatch = result.matches.find((m) => m.requirementId === 'req_ts');
    expect(tsMatch).toBeDefined();
    expect(tsMatch!.status).toBe('direct');

    // Kubernetes requirement should be classified as a gap (not found)
    const k8sMatch = result.matches.find((m) => m.requirementId === 'req_k8s');
    expect(k8sMatch).toBeDefined();
    expect(k8sMatch!.status).toBe('not_found');

    // Coverage must reflect authentic must-haves
    expect(result.coverage.totalMustHaves).toBe(5);
    expect(result.coverage.coveredMustHaves).toBeGreaterThanOrEqual(4);
    expect(result.coverage.summarySentence).toContain('directly supported');
  });

  it('ranks RIFT as the #1 project for the Core Systems role', () => {
    const result = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    expect(result.rankedProjects[0].projectName).toBe('RIFT');
    expect(result.rankedProjects[0].matchCount).toBeGreaterThan(0);
  });

  it('synthesizes resume bullets strictly linked to retrieved evidence IDs', () => {
    const result = MatchingEngine.matchOpportunity(
      SAMPLE_OPPORTUNITY,
      GOLDEN_EVIDENCE,
      GOLDEN_PROJECTS
    );

    expect(result.groundedBullets.length).toBeGreaterThan(0);
    result.groundedBullets.forEach((bullet) => {
      expect(bullet.evidenceIds.length).toBeGreaterThan(0);
      expect(bullet.isAudited).toBe(true);
      expect(bullet.text.length).toBeGreaterThan(15);
    });
  });
});
