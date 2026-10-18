/**
 * Tests for MatchingEngine
 */

import { MatchingEngine } from '../domain/matchingEngine';
import { DEMO_OPPORTUNITY, DEMO_EVIDENCE, DEMO_PROJECTS } from '../domain/fixtures';

describe('MatchingEngine', () => {
  it('matches opportunity requirements against candidate evidence', () => {
    const result = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    expect(result.matches.length).toBe(DEMO_OPPORTUNITY.requirements.length);
    expect(result.coverage).toBeDefined();
    expect(result.rankedProjects.length).toBe(DEMO_PROJECTS.length);
    expect(result.groundedBullets.length).toBeGreaterThan(0);
  });

  it('classifies direct matches vs gaps based on similarity scoring', () => {
    const result = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    // Systems requirement (Python & TypeScript) should match demo evidence
    const sysMatch = result.matches.find((m) => m.requirementId === 'req_systems');
    expect(sysMatch).toBeDefined();
    expect(['direct', 'supported']).toContain(sysMatch!.status);

    // Kubernetes requirement should be a gap (no k8s in demo data)
    const k8sMatch = result.matches.find((m) => m.requirementId === 'req_k8s');
    expect(k8sMatch).toBeDefined();
    expect(k8sMatch!.status).toBe('not_found');

    // Coverage must reflect must-have counts
    expect(result.coverage.totalMustHaves).toBe(3);
    expect(result.coverage.summarySentence).toContain('directly supported');
  });

  it('ranks projects by relevance to matched requirements', () => {
    const result = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    // Top ranked project should have at least one match
    expect(result.rankedProjects[0].matchCount).toBeGreaterThan(0);
  });

  it('generates resume bullets linked to evidence IDs', () => {
    const result = MatchingEngine.matchOpportunity(
      DEMO_OPPORTUNITY,
      DEMO_EVIDENCE,
      DEMO_PROJECTS
    );

    expect(result.groundedBullets.length).toBeGreaterThan(0);
    result.groundedBullets.forEach((bullet) => {
      expect(bullet.evidenceIds.length).toBeGreaterThan(0);
      expect(bullet.isAudited).toBe(true);
      expect(bullet.text.length).toBeGreaterThan(10);
    });
  });
});
