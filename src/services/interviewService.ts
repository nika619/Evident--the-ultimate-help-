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

    // 4. Dynamic Generation for Synced Projects & Repositories
    for (const proj of projects) {
      if (['proj_rift', 'proj_kalman', 'proj_syntra'].includes(proj.id)) continue;

      const projEvidence = evidence.filter((e) => e.projectId === proj.id);
      const topSkill = projEvidence[0]?.skillName || proj.primaryLanguage || 'Core Architecture';
      const topFile = proj.files?.[0] || 'src/index.ts';

      questions.push({
        id: `q_${proj.id}_arch`,
        projectId: proj.id,
        projectName: proj.name,
        question: `In ${proj.name}, walk me through your core architectural design decisions using ${topSkill}. What performance or maintainability trade-offs did you make in \`${topFile}\`?`,
        intent: 'explore_tradeoff',
        relevantFile: topFile,
        relevantCommit: projEvidence[0]?.sourceLocation?.commitHash || 'main@head',
        targetedSkill: `${topSkill} Architecture`,
        keyTradeoffHint: `Balancing modularity and abstraction overhead against raw execution throughput.`,
      });

      if (projEvidence.length > 1) {
        const secSkill = projEvidence[1]?.skillName || 'System Reliability';
        questions.push({
          id: `q_${proj.id}_impl`,
          projectId: proj.id,
          projectName: proj.name,
          question: `Regarding your work with ${secSkill} in ${proj.name}: how did you validate edge cases, prevent race conditions, and ensure high availability?`,
          intent: 'explain_implementation',
          relevantFile: proj.files?.[1] || 'README.md',
          relevantCommit: projEvidence[1]?.sourceLocation?.commitHash || 'main@head',
          targetedSkill: `${secSkill} Systems Engineering`,
          keyTradeoffHint: `Defensive programming, retry logic with exponential backoff, and idempotent mutations.`,
        });
      }
    }

    // 5. Absolute Safety Guarantee: If no questions matched yet, synthesize from evidence directly
    if (questions.length === 0 && evidence.length > 0) {
      for (let i = 0; i < Math.min(3, evidence.length); i++) {
        const ev = evidence[i];
        questions.push({
          id: `q_ev_${ev.id}`,
          projectId: ev.projectId,
          projectName: ev.projectName,
          question: `How did you implement "${ev.claim}" in ${ev.projectName}? Walk me through your design choices.`,
          intent: 'explain_implementation',
          relevantFile: ev.sourceLocation?.filePath || 'src/index.ts',
          targetedSkill: ev.skillName,
          keyTradeoffHint: 'Memory efficiency, latency budgets, and clean separation of concerns.',
        });
      }
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
          'Your answer is too concise and brief. In high-caliber technical interviews, specify the exact data structures, libraries, and edge cases you personally authored.',
        codeCitationSuggestion: question.relevantFile || 'src/index.ts',
      };
    }

    // Check for technical vocabulary
    const technicalKeywords = [
      'token', 'middleware', 'database', 'filter', 'variance', 'cache',
      'latency', 'throughput', 'memory', 'render', 're-render', 'buffer',
      'asynchronous', 'promise', 'query', 'scale', 'concurrency', 'state',
      'complexity', 'payload', 'schema', 'lock', 'mutex', 'stream',
    ];

    const matchedKeywords = technicalKeywords.filter((kw) => text.includes(kw));

    const isDeep = wordCount >= 30 && matchedKeywords.length >= 2;
    const isModerate = wordCount >= 15 || matchedKeywords.length >= 1;

    return {
      questionId: question.id,
      technicalUnderstanding: isDeep ? 'Strong' : isModerate ? 'Adequate' : 'Needs Clarification',
      contributionClarity: isDeep ? 'Clear' : isModerate ? 'Clear' : 'Vague',
      tradeoffAwareness: isDeep ? 'Comprehensive' : isModerate ? 'Partial' : 'Omitted',
      feedbackNotes: isDeep
        ? `Strong grounded defense. You articulated technical trade-offs well and cited concrete implementation details (${matchedKeywords.slice(0, 3).join(', ')}).`
        : `Acceptable answer, but lacks architectural depth. Connect your explanation to concrete code trade-offs and potential bottlenecks.`,
      codeCitationSuggestion: question.relevantFile || 'src/index.ts',
    };
  }
}
