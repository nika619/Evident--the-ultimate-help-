/**
 * Tests for Evident InterviewService
 */

import { InterviewService } from '../services/interviewService';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';

describe('InterviewService', () => {
  it('generates targeted defense questions anchored to real candidate files', () => {
    const questions = InterviewService.generateQuestions(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);

    expect(questions.length).toBeGreaterThanOrEqual(3);

    // Question for Evident should cite proofPackService or App.tsx
    const evidentQ = questions.find((q) => q.projectId === 'proj_evident');
    expect(evidentQ).toBeDefined();
    expect(evidentQ!.relevantFile).toMatch(/(proofPackService|App\.tsx)/);
    expect(evidentQ!.keyTradeoffHint).toBeDefined();

    // Question for nids-project should cite model/train_rf.py
    const nidsQ = questions.find((q) => q.projectId === 'proj_nids');
    expect(nidsQ).toBeDefined();
    expect(nidsQ!.relevantFile).toBe('model/train_rf.py');
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

  it('generates Staff/Principal AI System Design Live Defense Arena scenarios (Pro Tier)', () => {
    const sdQuestions = InterviewService.generateSystemDesignArenaQuestions(GOLDEN_PROJECTS, GOLDEN_EVIDENCE);

    expect(sdQuestions.length).toBeGreaterThanOrEqual(4);
    expect(sdQuestions.some((q) => q.id === 'sd_sepsis_telemetry')).toBe(true);
    expect(sdQuestions.some((q) => q.id === 'sd_evident_merkle')).toBe(true);
    expect(sdQuestions.some((q) => q.targetedSkill.includes('Distributed'))).toBe(true);

    // Verify system design scenario contains architectural challenge
    const sepsisQ = sdQuestions.find((q) => q.id === 'sd_sepsis_telemetry')!;
    expect(sepsisQ.question).toContain('System Design Arena:');
    expect(sepsisQ.keyTradeoffHint).toContain('event-time sliding windows');
  });
});
