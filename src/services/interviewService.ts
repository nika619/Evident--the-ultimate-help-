/**
 * Evident Interview Defense Service
 * Formulates personalized architectural probing questions directly tied
 * to candidate's real files, commits, and source code.
 */

import { DefenseQuestion, DefenseEvaluation, EvidenceItem, ProjectSource } from '../domain/types';

export class InterviewService {
  /**
   * Generates targeted defense questions based on candidate projects and evidence
   */
  public static generateQuestions(
    projects: ProjectSource[],
    evidence: EvidenceItem[]
  ): DefenseQuestion[] {
    const questions: DefenseQuestion[] = [];

    // 1. RIFT: Auth & Token Rotation
    const riftJwt = evidence.find((e) => e.id === 'ev_rift_jwt');
    if (riftJwt) {
      questions.push({
        id: 'q_rift_jwt',
        projectId: 'proj_rift',
        projectName: 'RIFT',
        question:
          'In RIFT, walk me through how token verification is handled in `src/auth/middleware.ts`. What was your personal contribution versus third-party libraries?',
        intent: 'clarify_contribution',
        relevantFile: 'src/auth/middleware.ts',
        relevantCommit: riftJwt.sourceLocation.commitHash,
        targetedSkill: 'JWT & Token Security',
        keyTradeoffHint: 'Distinguishing jsonwebtoken library wrapper logic from custom bearer schema checks.',
      });
    }

    const riftRotation = evidence.find((e) => e.id === 'ev_rift_rotation');
    if (riftRotation) {
      questions.push({
        id: 'q_rift_rotation',
        projectId: 'proj_rift',
        projectName: 'RIFT',
        question:
          'In `src/auth/tokenRotation.ts`, you implemented refresh token invalidation. Why did you choose database-backed token family tracking over server-side session cookies?',
        intent: 'explore_tradeoff',
        relevantFile: 'src/auth/tokenRotation.ts',
        relevantCommit: riftRotation.sourceLocation.commitHash,
        targetedSkill: 'Refresh Token Rotation',
        keyTradeoffHint: 'Stateless API routing vs database query overhead during refresh bursts.',
      });
    }

    // 2. KALMAN: Noise Filtering & Stream
    const kalmanFilter = evidence.find((e) => e.id === 'ev_kalman_filter');
    if (kalmanFilter) {
      questions.push({
        id: 'q_kalman_filter',
        projectId: 'proj_kalman',
        projectName: 'KALMAN',
        question:
          'In KALMAN, explain the mathematical trade-off of the discrete 1D filter in `src/filters/kalman1d.ts`. How did you tune the process variance (q) and measurement variance (r)?',
        intent: 'explain_implementation',
        relevantFile: 'src/filters/kalman1d.ts',
        relevantCommit: kalmanFilter.sourceLocation.commitHash,
        targetedSkill: 'Algorithmic State Estimation',
        keyTradeoffHint: 'Responsiveness to sudden true spikes vs lag from over-smoothing.',
      });
    }

    // 3. SYNTRA: Virtualized Scrolling
    const syntraGrid = evidence.find((e) => e.id === 'ev_syntra_react');
    if (syntraGrid) {
      questions.push({
        id: 'q_syntra_grid',
        projectId: 'proj_syntra',
        projectName: 'SYNTRA',
        question:
          'In SYNTRA, how does your windowing slice calculation in `src/components/VirtualGrid.tsx` prevent layout thrashing and DOM node bloat when scrolling 50,000 items?',
        intent: 'explain_implementation',
        relevantFile: 'src/components/VirtualGrid.tsx',
        relevantCommit: syntraGrid.sourceLocation.commitHash,
        targetedSkill: 'React Windowing & Virtualization',
        keyTradeoffHint: 'Overscan buffer sizing: larger buffer prevents white flash, smaller buffer saves memory.',
      });
    }

    return questions;
  }

  /**
   * Evaluates a candidate's answer against known trade-offs and code artifacts
   */
  public static evaluateAnswer(question: DefenseQuestion, answerText: string): DefenseEvaluation {
    const text = answerText.toLowerCase().trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount < 10) {
      return {
        questionId: question.id,
        technicalUnderstanding: 'Needs Clarification',
        contributionClarity: 'Vague',
        tradeoffAwareness: 'Omitted',
        feedbackNotes:
          'Answer is too concise. In an interview, explain both your concrete implementation steps and the trade-offs you considered.',
        codeCitationSuggestion: `Reference line ranges or commit rationale in ${question.relevantFile}.`,
      };
    }

    // Check for technical signal words
    const hasTradeoffWords =
      text.includes('tradeoff') ||
      text.includes('instead') ||
      text.includes('because') ||
      text.includes('overhead') ||
      text.includes('latency') ||
      text.includes('security') ||
      text.includes('memory') ||
      text.includes('cache');

    const hasSpecificCodeMention =
      text.includes('file') ||
      text.includes('token') ||
      text.includes('database') ||
      text.includes('filter') ||
      text.includes('scroll') ||
      text.includes('buffer') ||
      text.includes('hash');

    return {
      questionId: question.id,
      technicalUnderstanding: hasSpecificCodeMention ? 'Strong' : 'Adequate',
      contributionClarity: text.includes('i ') || text.includes('my ') ? 'Clear' : 'Vague',
      tradeoffAwareness: hasTradeoffWords ? 'Comprehensive' : 'Partial',
      feedbackNotes: hasTradeoffWords
        ? 'Solid defense! You articulated the engineering rationale and acknowledged the architectural trade-offs.'
        : `Technically reasonable explanation, but consider explicitly mentioning why you didn't choose the alternative (Hint: ${question.keyTradeoffHint}).`,
      codeCitationSuggestion: `Cite your commit (${question.relevantCommit || 'HEAD'}) in ${question.relevantFile} to provide undeniable backing.`,
    };
  }
}
