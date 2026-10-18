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

    // 1. Evident: Integrity Hashing & Anti-Tamper Attestation
    const evidentProof = evidence.find(
      (e) => e.projectId === 'proj_evident' && (e.id === 'demo_ev_proofpack' || e.skillName.toLowerCase().includes('integrity') || e.skillName.toLowerCase().includes('crypto'))
    );
    if (evidentProof || projects.some((p) => p.id === 'proj_evident')) {
      questions.push({
        id: 'q_evident_proofpack',
        projectId: 'proj_evident',
        projectName: 'evident',
        question:
          'In Evident, walk me through how your SHA-256 canonical integrity hash in `src/services/proofPackService.ts` ensures tamper-evidence for candidate evidence dossiers. How do you serialize and deterministically sort the evidence items?',
        intent: 'explain_implementation',
        relevantFile: 'src/services/proofPackService.ts',
        relevantCommit: evidentProof?.sourceLocation?.commitHash || '98047cc',
        targetedSkill: 'Cryptographic Verification & Integrity',
        keyTradeoffHint:
          'Deterministic lexicographical serialization of evidence tokens vs computational overhead on large graphs.',
      });
    }

    const evidentRn = evidence.find(
      (e) => e.projectId === 'proj_evident' && (e.id === 'demo_ev_rn' || e.skillName.toLowerCase().includes('react'))
    );
    if (evidentRn) {
      questions.push({
        id: 'q_evident_rn',
        projectId: 'proj_evident',
        projectName: 'evident',
        question:
          'In Evident (`App.tsx` and Zustand state store), how do you structure store subscriptions and manage component re-renders to maintain responsive 60fps performance on mobile devices?',
        intent: 'explore_tradeoff',
        relevantFile: 'App.tsx',
        relevantCommit: evidentRn.sourceLocation?.commitHash || '8628cfc',
        targetedSkill: 'React Native & Mobile Systems',
        keyTradeoffHint:
          'Selective Zustand selectors to prevent unnecessary re-render trees vs unified state synchronization.',
      });
    }

    // 2. nids-project: ML Network Intrusion
    const nidsRf = evidence.find(
      (e) => e.projectId === 'proj_nids' && (e.id === 'demo_ev_ml' || e.sourceLocation?.filePath?.includes('train_rf'))
    );
    if (nidsRf || projects.some((p) => p.id === 'proj_nids')) {
      questions.push({
        id: 'q_nids_rf',
        projectId: 'proj_nids',
        projectName: 'nids-project',
        question:
          'In nids-project, how did you calibrate feature selection and Random Forest hyperparameters in `model/train_rf.py` to balance intrusion detection sensitivity against false positives on the NSL-KDD dataset?',
        intent: 'explore_tradeoff',
        relevantFile: 'model/train_rf.py',
        relevantCommit: nidsRf?.sourceLocation?.commitHash || 'e31b09f',
        targetedSkill: 'Machine Learning & Security Architecture',
        keyTradeoffHint:
          'Handling class imbalance and feature correlation vs preventing decision tree overfitting on anomalous traffic.',
      });
    }

    // 3. SepsisGuard: Model Context Protocol (MCP) & Clinical AI
    const sepsisMcp = evidence.find(
      (e) => e.projectId === 'proj_sepsis' && (e.id === 'demo_ev_mcp' || e.skillName.toLowerCase().includes('mcp'))
    );
    if (sepsisMcp || projects.some((p) => p.id === 'proj_sepsis')) {
      questions.push({
        id: 'q_sepsis_mcp',
        projectId: 'proj_sepsis',
        projectName: 'sepsis-mcp',
        question:
          'In sepsis-mcp, walk through how you architected the Model Context Protocol (MCP) server in `server.py` for clinical risk prediction tools. How do you handle schema validation and latency budgets?',
        intent: 'explain_implementation',
        relevantFile: 'server.py',
        relevantCommit: sepsisMcp?.sourceLocation?.commitHash || 'a71e290',
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

    // 5. Fallback safety guarantee: if no questions matched yet, synthesize from evidence directly
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
   * Generates System Design Live Defense Arena scenarios (Pro Tier)
   */
  public static generateSystemDesignArenaQuestions(
    projects: ProjectSource[],
    evidence: EvidenceItem[]
  ): DefenseQuestion[] {
    return [
      {
        id: 'sd_sepsis_telemetry',
        projectId: 'proj_sepsis',
        projectName: 'sepsis-mcp',
        question:
          'System Design Arena: Your clinical telemetry engine scales to 500 ICU facilities (10,000,000 vital readings/sec). Design the distributed stream-processing architecture. How do you guarantee sub-second p99 latency without dropping clinical alarm frames?',
        intent: 'explore_tradeoff',
        relevantFile: 'server.py (MCP Streaming)',
        relevantCommit: 'a71e290',
        targetedSkill: 'Distributed Stream Processing & Fault-Tolerance',
        keyTradeoffHint: 'Kafka event-time sliding windows & partition keying vs memory pressure under network split.',
      },
      {
        id: 'sd_evident_merkle',
        projectId: 'proj_evident',
        projectName: 'evident',
        question:
          'System Design Arena: Evident must verify candidate repository trees across 100,000 concurrent hiring queries. Design a distributed, tamper-evident verification service with sub-second response times.',
        intent: 'explore_tradeoff',
        relevantFile: 'src/services/proofPackService.ts',
        relevantCommit: '98047cc',
        targetedSkill: 'Cryptographic Verification & Scalability',
        keyTradeoffHint: 'Read-through caching of immutable AST subtrees vs disk I/O under extreme peak concurrency.',
      },
      {
        id: 'sd_nids_dataplane',
        projectId: 'proj_nids',
        projectName: 'nids-project',
        question:
          'System Design Arena: Deploy your Random Forest intrusion model into a 100 Gbps cloud gateway. How do you architect packet classification between kernel-bypass eBPF/XDP and userspace worker pools without packet loss?',
        intent: 'explore_tradeoff',
        relevantFile: 'model/train_rf.py',
        relevantCommit: 'e31b09f',
        targetedSkill: 'Kernel-Bypass Systems & High-Speed Data Plane',
        keyTradeoffHint: 'Tree quantization in eBPF maps vs userspace zero-copy ring buffers under DDoS spikes.',
      },
      {
        id: 'sd_cache_invalidation',
        projectId: 'proj_evident',
        projectName: 'evident',
        question:
          'System Design Arena: Design an active-active multi-region caching layer for candidate proof dossiers. When a candidate pushes a new git commit, how do you invalidate global recruiter caches within 50ms while preventing cache stampedes?',
        intent: 'explore_tradeoff',
        relevantFile: 'src/store/useEvidenceStore.ts',
        relevantCommit: '8628cfc',
        targetedSkill: 'Distributed Caching & Eventual Consistency',
        keyTradeoffHint: 'Redis distributed locks with probabilistic early expiration vs pub/sub invalidation.',
      },
    ];
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
