/**
 * Tests for Evident InterviewService
 */

import { InterviewService } from '../services/interviewService';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';

describe('InterviewService', () => {
  it('generates targeted defense questions anchored to real candidate files', () => {
    const questions = InterviewService.generateQuestions(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);

    expect(questions.length).toBeGreaterThanOrEqual(3);

    // Question for RIFT should cite middleware or tokenRotation
    const riftQ = questions.find((q) => q.projectId === 'proj_rift');
    expect(riftQ).toBeDefined();
    expect(riftQ!.relevantFile).toMatch(/src\/auth/);
    expect(riftQ!.keyTradeoffHint).toBeDefined();

    // Question for KALMAN should cite kalman1d.ts
    const kalmanQ = questions.find((q) => q.projectId === 'proj_kalman');
    expect(kalmanQ).toBeDefined();
    expect(kalmanQ!.relevantFile).toBe('src/filters/kalman1d.ts');
  });

  it('evaluates candidate defense with trade-off detection and code citation tips', () => {
    const questions = InterviewService.generateQuestions(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);
    const firstQ = questions[0];

    // Strong response with architectural trade-off explanation
    const strongAnswer =
      'In my implementation of the bearer token check in src/auth/middleware.ts, I separated the cryptographic jwt verification from header schema parsing. The primary tradeoff was latency overhead versus security: checking the database on every request would create a bottleneck, so we used HMAC verification instead of session lookups.';

    const evaluation = InterviewService.evaluateAnswer(firstQ, strongAnswer);

    expect(evaluation.technicalUnderstanding).toBe('Strong');
    expect(evaluation.contributionClarity).toBe('Clear');
    expect(evaluation.tradeoffAwareness).toBe('Comprehensive');
    expect(evaluation.codeCitationSuggestion).toContain(firstQ.relevantFile);
  });

  it('flags vague or overly brief candidate answers', () => {
    const questions = InterviewService.generateQuestions(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);
    const firstQ = questions[0];

    const weakAnswer = 'I used jwt library.';
    const evaluation = InterviewService.evaluateAnswer(firstQ, weakAnswer);

    expect(evaluation.technicalUnderstanding).toBe('Needs Clarification');
    expect(evaluation.tradeoffAwareness).toBe('Omitted');
    expect(evaluation.feedbackNotes).toContain('too concise');
  });
});
