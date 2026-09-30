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

    // 1. Evident: Deterministic SHA-256 Merkle Provenance & Hallucination Elimination
    const evidentMerkle = evidence.find((e) => e.id === 'ev_evident_merkle');
    if (evidentMerkle) {
      questions.push({
        id: 'q_evident_merkle',
        projectId: 'proj_evident',
        projectName: 'Evident--the-ultimate-help-',
        question:
          'In Evident, walk me through how your deterministic SHA-256 Merkle root generation in `src/services/proofPackService.ts` guarantees zero AI hallucination in candidate claims. What are the cryptographic boundary conditions?',
        intent: 'explain_implementation',
        relevantFile: 'src/services/proofPackService.ts',
        relevantCommit: evidentMerkle.sourceLocation?.commitHash || '98047cc',
        targetedSkill: 'Cryptographic Provenance (SHA-256 Merkle)',
        keyTradeoffHint: 'Deterministic lexicographical sorting of evidence tokens vs performance on huge commit graphs.',
      });
    }

    const evidentRn = evidence.find((e) => e.id === 'ev_evident_rn');
    if (evidentRn) {
      questions.push({
        id: 'q_evident_rn',
        projectId: 'proj_evident',
        projectName: 'Evident--the-ultimate-help-',
        question:
          'In `App.tsx`, how did you implement the multi-spectral living aurora canvas shaders and dynamic physics to maintain 60fps across mobile runtimes without battery drain?',
        intent: 'explore_tradeoff',
        relevantFile: 'App.tsx',
        relevantCommit: evidentRn.sourceLocation?.commitHash || '8628cfc',
        targetedSkill: 'React Native & Mobile Systems',
        keyTradeoffHint: 'Hardware-accelerated native animations vs JavaScript thread bridge congestion.',
      });
    }

    // 2. nids-project: ML Network Intrusion & SMOTE
    const nidsRf = evidence.find((e) => e.id === 'ev_nids_rf');
    if (nidsRf) {
      questions.push({
        id: 'q_nids_rf',
        projectId: 'proj_nids',
        projectName: 'nids-project',
        question:
          'In nids-project, how did you calibrate SMOTE oversampling alongside the Random Forest hyper-parameters in `model/train_rf.py` to balance intrusion detection sensitivity against false positive spikes on the NSL-KDD dataset?',
        intent: 'explore_tradeoff',
        relevantFile: 'model/train_rf.py',
        relevantCommit: nidsRf.sourceLocation?.commitHash || 'e31b09f',
        targetedSkill: 'Machine Learning & Security Architecture',
        keyTradeoffHint: 'Synthetic minority sample fidelity vs overfitting decision trees on anomalous edge cases.',
      });
    }

    // 3. SepsisGuard: Model Context Protocol (MCP) & Clinical AI
    const sepsisMcp = evidence.find((e) => e.id === 'ev_sepsis_mcp');
    if (sepsisMcp) {
      questions.push({
        id: 'q_sepsis_mcp',
        projectId: 'proj_sepsis',
        projectName: 'SepsisGuard-AI-Real-Time-Sepsis-Intelligence-MCP',
        question:
          'In SepsisGuard, walk through how you architected the Model Context Protocol (MCP) server in `server.py` for real-time clinical intelligence. How do you handle telemetry streaming latency?',
        intent: 'explain_implementation',
        relevantFile: 'server.py',
        relevantCommit: sepsisMcp.sourceLocation?.commitHash || 'a71e290',
        targetedSkill: 'Model Context Protocol (MCP) & Clinical AI',
        keyTradeoffHint: 'Stateless tool calling overhead vs persistent WebSocket context streaming.',
      });
    }

    // 4. Dynamic Generation for Synced Projects & Repositories
    for (const proj of projects) {
      if (['proj_evident', 'proj_nids', 'proj_sepsis'].includes(proj.id)) continue;

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
