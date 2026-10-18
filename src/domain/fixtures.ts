/**
 * Demo Fixtures
 * A small sample dataset for testing and demonstration.
 *
 * This data is ONLY used for:
 * - Unit tests
 * - First-run demo before the user connects their GitHub
 *
 * In production, all data comes from githubService.fetchCandidateData().
 * These fixtures exist so the app has something to show on first launch
 * and so tests have deterministic data to run against.
 */

import { ProjectSource, EvidenceItem, Opportunity } from './types';

export const DEMO_PROJECTS: ProjectSource[] = [
  {
    id: 'proj_evident',
    name: 'evident',
    description: 'Evidence-based skill matching engine for developer portfolios.',
    repoUrl: 'https://github.com/nika619/Evident.',
    primaryLanguage: 'TypeScript',
    languages: ['TypeScript', 'JavaScript'],
    frameworks: ['React Native', 'Expo', 'Zustand', 'Jest'],
    totalCommits: 32,
    candidateCommits: 28,
    isForkOrTemplate: false,
    lastUpdated: '2026-09-30',
    files: [
      'App.tsx',
      'src/domain/matchingEngine.ts',
      'src/services/githubService.ts',
      'src/services/proofPackService.ts',
      'package.json',
    ],
    evidenceIds: ['demo_ev_ts', 'demo_ev_proofpack', 'demo_ev_rn', 'demo_ev_testing'],
  },
  {
    id: 'proj_nids',
    name: 'nids-project',
    description: 'Network intrusion detection using Random Forest on NSL-KDD dataset.',
    repoUrl: 'https://github.com/nika619/nids-project',
    primaryLanguage: 'Python',
    languages: ['Python', 'HTML'],
    frameworks: ['Flask', 'scikit-learn', 'Pandas'],
    totalCommits: 24,
    candidateCommits: 22,
    isForkOrTemplate: false,
    lastUpdated: '2026-03-03',
    files: [
      'app.py',
      'model/train_rf.py',
      'templates/dashboard.html',
      'requirements.txt',
    ],
    evidenceIds: ['demo_ev_python', 'demo_ev_ml', 'demo_ev_flask'],
  },
  {
    id: 'proj_sepsis',
    name: 'sepsis-mcp',
    description: 'MCP server for clinical sepsis risk scoring.',
    repoUrl: 'https://github.com/nika619/SepsisGuard-AI-Real-Time-Sepsis-Intelligence-MCP',
    primaryLanguage: 'Python',
    languages: ['Python'],
    frameworks: ['FastAPI', 'MCP Protocol'],
    totalCommits: 19,
    candidateCommits: 18,
    isForkOrTemplate: false,
    lastUpdated: '2026-05-12',
    files: ['server.py', 'mcp_tools.py', 'predictor.py'],
    evidenceIds: ['demo_ev_mcp', 'demo_ev_fastapi'],
  },
];

export const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'demo_ev_ts',
    projectId: 'proj_evident',
    projectName: 'evident',
    skillId: 'skill_typescript',
    skillName: 'TypeScript',
    claim: 'Primary language for matching engine and domain logic.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/domain/matchingEngine.ts',
      url: 'https://github.com/nika619/Evident./blob/main/src/domain/matchingEngine.ts',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-30',
    lastObservedDate: '2026-09-30',
  },
  {
    id: 'demo_ev_proofpack',
    projectId: 'proj_evident',
    projectName: 'evident',
    skillId: 'skill_crypto',
    skillName: 'Integrity Hashing (SHA-256)',
    claim: 'Cryptographic SHA-256 integrity hash generation over canonical evidence payload.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/services/proofPackService.ts',
      url: 'https://github.com/nika619/Evident./blob/main/src/services/proofPackService.ts',
      commitHash: '98047cc',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-30',
    lastObservedDate: '2026-09-30',
  },
  {
    id: 'demo_ev_rn',
    projectId: 'proj_evident',
    projectName: 'evident',
    skillId: 'skill_react_native',
    skillName: 'React Native',
    claim: 'Mobile app built with React Native and Expo SDK.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'App.tsx',
      url: 'https://github.com/nika619/Evident./blob/main/App.tsx',
      commitHash: '8628cfc',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-30',
    lastObservedDate: '2026-09-30',
  },
  {
    id: 'demo_ev_testing',
    projectId: 'proj_evident',
    projectName: 'evident',
    skillId: 'skill_jest',
    skillName: 'Testing & Code Quality',
    claim: 'Automated test suite with Jest verifying domain logic and matching.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/__tests__/matchingEngine.test.ts',
      url: 'https://github.com/nika619/Evident./blob/main/src/__tests__/matchingEngine.test.ts',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-30',
    lastObservedDate: '2026-09-30',
  },
  {
    id: 'demo_ev_python',
    projectId: 'proj_nids',
    projectName: 'nids-project',
    skillId: 'skill_python',
    skillName: 'Python',
    claim: 'Primary language for ML training pipeline and Flask server.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'model/train_rf.py',
      url: 'https://github.com/nika619/nids-project/blob/main/model/train_rf.py',
      commitHash: 'e31b09f',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-03-03',
    lastObservedDate: '2026-03-03',
  },
  {
    id: 'demo_ev_ml',
    projectId: 'proj_nids',
    projectName: 'nids-project',
    skillId: 'skill_scikit_learn',
    skillName: 'Machine Learning',
    claim: 'Random Forest classifier trained on NSL-KDD dataset for intrusion detection.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'model/train_rf.py',
      url: 'https://github.com/nika619/nids-project/blob/main/model/train_rf.py',
      commitHash: 'e31b09f',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-03-03',
    lastObservedDate: '2026-03-03',
  },
  {
    id: 'demo_ev_flask',
    projectId: 'proj_nids',
    projectName: 'nids-project',
    skillId: 'skill_flask',
    skillName: 'Flask',
    claim: 'REST API serving ML predictions, documented in requirements.txt.',
    sourceType: 'dependency_manifest',
    sourceLocation: {
      filePath: 'requirements.txt',
      url: 'https://github.com/nika619/nids-project/blob/main/requirements.txt',
    },
    evidenceStatus: 'supported',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-03-03',
    lastObservedDate: '2026-03-03',
  },
  {
    id: 'demo_ev_mcp',
    projectId: 'proj_sepsis',
    projectName: 'sepsis-mcp',
    skillId: 'skill_mcp',
    skillName: 'Model Context Protocol (MCP)',
    claim: 'MCP server exposing clinical risk prediction tools.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'server.py',
      url: 'https://github.com/nika619/SepsisGuard-AI-Real-Time-Sepsis-Intelligence-MCP/blob/main/server.py',
      commitHash: 'a71e290',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-05-12',
    lastObservedDate: '2026-05-12',
  },
  {
    id: 'demo_ev_fastapi',
    projectId: 'proj_sepsis',
    projectName: 'sepsis-mcp',
    skillId: 'skill_fastapi',
    skillName: 'FastAPI',
    claim: 'HTTP server built with FastAPI for the MCP transport layer.',
    sourceType: 'dependency_manifest',
    sourceLocation: {
      filePath: 'requirements.txt',
      url: 'https://github.com/nika619/SepsisGuard-AI-Real-Time-Sepsis-Intelligence-MCP/blob/main/requirements.txt',
    },
    evidenceStatus: 'supported',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-05-12',
    lastObservedDate: '2026-05-12',
  },
];

export const DEMO_OPPORTUNITY: Opportunity = {
  id: 'demo_opp_1',
  title: 'Software Engineer — Systems & AI',
  companyOrContext: 'Engineering Team',
  domain: 'Backend Systems, AI Platforms',
  descriptionRaw: `Looking for an engineer with experience in Python and TypeScript.
Requirements:
1. Backend systems architecture and API design.
2. AI/ML systems or model deployment experience.
3. Security architecture or intrusion detection knowledge.
4. Verifiable commit history and test coverage.`,
  requirements: [
    {
      id: 'req_systems',
      category: 'technical_core',
      name: 'Python & TypeScript Systems',
      description: 'Backend services and modular application code.',
      isMustHave: true,
    },
    {
      id: 'req_ai',
      category: 'technical_core',
      name: 'Applied AI & ML',
      description: 'ML classifiers, inference pipelines, or MCP tooling.',
      isMustHave: true,
    },
    {
      id: 'req_security',
      category: 'architecture',
      name: 'Security Architecture',
      description: 'Cryptographic principles, intrusion detection, or secure protocols.',
      isMustHave: true,
    },
    {
      id: 'req_k8s',
      category: 'infrastructure',
      name: 'Kubernetes & Infrastructure',
      description: 'Container orchestration and cloud deployment.',
      isMustHave: false,
    },
    {
      id: 'req_testing',
      category: 'tooling',
      name: 'Testing & Code Quality',
      description: 'Automated testing, commit hygiene, and documentation.',
      isMustHave: false,
    },
  ],
  createdAt: '2026-09-30',
};

// Backwards-compatible exports for existing code that imports old names
export const GOLDEN_PROJECTS = DEMO_PROJECTS;
export const GOLDEN_EVIDENCE = DEMO_EVIDENCE;
export const SAMPLE_OPPORTUNITY = DEMO_OPPORTUNITY;
