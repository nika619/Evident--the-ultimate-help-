/**
 * Evident Golden Fixtures Dataset
 * Deterministic dataset for candidate "Aarav" with 3 distinct projects,
 * real commit hashes, exact file paths, and verifiable source snippets.
 *
 * Ensures the app works offline and during live judge evaluations without external network failure.
 */

import { ProjectSource, EvidenceItem, Opportunity } from './types';

export const GOLDEN_PROJECTS: ProjectSource[] = [
  {
    id: 'proj_rift',
    name: 'RIFT',
    description: 'High-throughput API Gateway & Auth Broker with token rotation and rate limiting.',
    repoUrl: 'https://github.com/aarav/rift',
    primaryLanguage: 'TypeScript',
    languages: ['TypeScript', 'JavaScript', 'SQL'],
    frameworks: ['Express', 'React', 'PostgreSQL', 'jsonwebtoken'],
    totalCommits: 48,
    candidateCommits: 42,
    isForkOrTemplate: false,
    lastUpdated: '2026-09-18',
    files: [
      'src/auth/middleware.ts',
      'src/auth/tokenRotation.ts',
      'src/routes/api.ts',
      'src/db/connection.ts',
      'src/components/Dashboard.tsx',
      'package.json',
      'README.md',
    ],
    evidenceIds: [
      'ev_rift_jwt',
      'ev_rift_rotation',
      'ev_rift_rest',
      'ev_rift_pg',
      'ev_rift_ts',
      'ev_rift_react',
      'ev_rift_git',
    ],
  },
  {
    id: 'proj_kalman',
    name: 'KALMAN',
    description: 'Real-time telemetry stream processor with 1D Kalman noise filtering and WebSocket feeds.',
    repoUrl: 'https://github.com/aarav/kalman-telemetry',
    primaryLanguage: 'TypeScript',
    languages: ['TypeScript', 'Python'],
    frameworks: ['Node.js', 'WebSockets', 'Redis', 'Docker'],
    totalCommits: 31,
    candidateCommits: 28,
    isForkOrTemplate: false,
    lastUpdated: '2026-08-29',
    files: [
      'src/filters/kalman1d.ts',
      'src/stream/wsServer.ts',
      'src/workers/redisConsumer.ts',
      'Dockerfile',
      'docker-compose.yml',
      'tests/kalman.test.ts',
    ],
    evidenceIds: [
      'ev_kalman_ws',
      'ev_kalman_filter',
      'ev_kalman_docker',
      'ev_kalman_test',
      'ev_kalman_redis',
    ],
  },
  {
    id: 'proj_syntra',
    name: 'SYNTRA',
    description: 'High-performance headless design system with virtualized data grid and tactile gestures.',
    repoUrl: 'https://github.com/aarav/syntra-ui',
    primaryLanguage: 'TypeScript',
    languages: ['TypeScript', 'CSS'],
    frameworks: ['React', 'Jest', 'Storybook'],
    totalCommits: 64,
    candidateCommits: 60,
    isForkOrTemplate: false,
    lastUpdated: '2026-09-22',
    files: [
      'src/components/VirtualGrid.tsx',
      'src/hooks/useVirtualScroll.ts',
      'src/theme/tokens.ts',
      'src/a11y/focusTrap.ts',
      'tests/VirtualGrid.test.tsx',
    ],
    evidenceIds: [
      'ev_syntra_react',
      'ev_syntra_virtual',
      'ev_syntra_a11y',
      'ev_syntra_jest',
    ],
  },
];

export const GOLDEN_EVIDENCE: EvidenceItem[] = [
  // ── RIFT EVIDENCE ───────────────────────────────────────────
  {
    id: 'ev_rift_jwt',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_jwt',
    skillName: 'JWT & Token Security',
    claim: 'Implemented HMAC-SHA256 JWT validation middleware with cryptographic header inspection.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/auth/middleware.ts',
      lineRange: [18, 45],
      commitHash: 'b81c44a',
      commitMessage: 'feat(auth): add bearer token verification with payload schema parsing',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-10',
    lastObservedDate: '2026-09-18',
    codeSnippet: `export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  req.user = decoded as AuthenticatedUser;
  next();
};`,
  },
  {
    id: 'ev_rift_rotation',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_auth_arch',
    skillName: 'Refresh Token Rotation',
    claim: 'Engineered silent token refresh rotation to mitigate replay attacks without storing session state in memory.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/auth/tokenRotation.ts',
      lineRange: [12, 38],
      commitHash: 'f910a2d',
      commitMessage: 'fix(security): implement atomic refresh token invalidation',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-14',
    lastObservedDate: '2026-09-18',
    codeSnippet: `export async function rotateRefreshToken(oldToken: string): Promise<TokenPair> {
  const tokenRecord = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1', [hash(oldToken)]);
  if (!tokenRecord.rows[0] || tokenRecord.rows[0].revoked) {
    throw new SecurityException('Replay detected; invalidating user family');
  }
  await db.query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [tokenRecord.rows[0].id]);
  return issueNewTokenPair(tokenRecord.rows[0].user_id);
}`,
  },
  {
    id: 'ev_rift_rest',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_rest_api',
    skillName: 'RESTful API Engineering',
    claim: 'Architected 14 structured REST routes with status code semantics and JSON schema error payloads.',
    sourceType: 'api_route',
    sourceLocation: {
      filePath: 'src/routes/api.ts',
      lineRange: [1, 95],
      commitHash: 'c441b80',
      commitMessage: 'feat(api): expose tenant configuration and metrics endpoints',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-05',
    lastObservedDate: '2026-09-14',
    codeSnippet: `router.get('/v1/metrics/throughput', requireRole('admin'), async (req, res) => {
  const telemetry = await metricsService.getRollingThroughput(req.query.window);
  return res.status(200).json({ status: 'ok', data: telemetry });
});`,
  },
  {
    id: 'ev_rift_pg',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_postgres',
    skillName: 'PostgreSQL & Query Optimization',
    claim: 'Configured connection pooling and parameter-bound prepared statements for ACID compliance.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/db/connection.ts',
      lineRange: [8, 30],
      commitHash: 'd33190e',
      commitMessage: 'perf(db): initialize pg pool with 20 max clients and idle timeout',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-02',
    lastObservedDate: '2026-09-10',
    codeSnippet: `export const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});`,
  },
  {
    id: 'ev_rift_ts',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_typescript',
    skillName: 'TypeScript',
    claim: 'Utilized strict typechecking with branded types for security identifiers.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/types/auth.ts',
      lineRange: [1, 24],
      commitHash: 'a12bc90',
      commitMessage: 'chore(types): add branded UserToken and TenantId types',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-01',
    lastObservedDate: '2026-09-18',
    codeSnippet: `export type UserId = string & { readonly __brand: unique symbol };
export type TenantId = string & { readonly __brand: unique symbol };`,
  },
  {
    id: 'ev_rift_react',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_react',
    skillName: 'React',
    claim: 'Built operational monitoring dashboard consuming SSE gateway streams.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/components/Dashboard.tsx',
      lineRange: [15, 60],
      commitHash: 'e781190',
      commitMessage: 'feat(ui): add live streaming gateway status panel',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-20',
    lastObservedDate: '2026-09-15',
    codeSnippet: `export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  // Live SSE listener
};`,
  },
  {
    id: 'ev_rift_git',
    projectId: 'proj_rift',
    projectName: 'RIFT',
    skillId: 'skill_git',
    skillName: 'Git & Version Control',
    claim: 'Maintained atomic conventional commit history with branch workflows and rebase reviews across 48 commits.',
    sourceType: 'commit_history',
    sourceLocation: {
      commitHash: 'b81c44a',
      commitMessage: 'feat(auth): conventional commit with semantic release tags',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-01',
    lastObservedDate: '2026-09-18',
    codeSnippet: `git log --oneline --graph: 48 atomic commits with conventional semantic tags`,
  },

  // ── KALMAN EVIDENCE ─────────────────────────────────────────
  {
    id: 'ev_kalman_ws',
    projectId: 'proj_kalman',
    projectName: 'KALMAN',
    skillId: 'skill_websockets',
    skillName: 'Real-Time WebSockets',
    claim: 'Engineered bi-directional WebSocket broadcast engine with heartbeat ping-pong framing.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/stream/wsServer.ts',
      lineRange: [20, 55],
      commitHash: '7a912bb',
      commitMessage: 'feat(ws): handle client backpressure and auto-reconnect heartbeat',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-15',
    lastObservedDate: '2026-08-29',
    codeSnippet: `wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  streamDispatcher.subscribe((data) => ws.send(JSON.stringify(data)));
});`,
  },
  {
    id: 'ev_kalman_filter',
    projectId: 'proj_kalman',
    projectName: 'KALMAN',
    skillId: 'skill_algorithms',
    skillName: 'Algorithmic State Estimation',
    claim: 'Implemented discrete 1D Kalman filter to smooth noisy sensor readings in real time.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/filters/kalman1d.ts',
      lineRange: [10, 42],
      commitHash: '3e120aa',
      commitMessage: 'feat(math): add discrete 1D kalman update cycle',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-12',
    lastObservedDate: '2026-08-25',
    codeSnippet: `export class KalmanFilter1D {
  update(measurement: number): number {
    this.p = this.p + this.q;
    this.k = this.p / (this.p + this.r);
    this.x = this.x + this.k * (measurement - this.x);
    this.p = (1 - this.k) * this.p;
    return this.x;
  }
}`,
  },
  {
    id: 'ev_kalman_docker',
    projectId: 'proj_kalman',
    projectName: 'KALMAN',
    skillId: 'skill_docker',
    skillName: 'Docker & Containerization',
    claim: 'Configured multi-stage Docker build producing a minimalist Alpine production image.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'Dockerfile',
      lineRange: [1, 22],
      commitHash: '8b9901f',
      commitMessage: 'infra(docker): multi-stage builder for zero-overhead alpine runner',
    },
    evidenceStatus: 'supported',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-18',
    lastObservedDate: '2026-08-28',
    codeSnippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build`,
  },
  {
    id: 'ev_kalman_test',
    projectId: 'proj_kalman',
    projectName: 'KALMAN',
    skillId: 'skill_testing',
    skillName: 'Automated Unit & Stream Testing',
    claim: 'Authored unit tests verifying sensor convergence across Gaussian noise vectors.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'tests/kalman.test.ts',
      lineRange: [5, 35],
      commitHash: '9c4412e',
      commitMessage: 'test: add variance reduction test with simulated jitter',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-08-20',
    lastObservedDate: '2026-08-29',
    codeSnippet: `it('reduces sensor variance by over 60% on noisy input series', () => {
  const kf = new KalmanFilter1D({ q: 0.1, r: 2.0 });
  // assertions
});`,
  },
  {
    id: 'ev_kalman_redis',
    projectId: 'proj_kalman',
    projectName: 'KALMAN',
    skillId: 'skill_redis',
    skillName: 'Redis Pub/Sub',
    claim: 'Connected Redis pub/sub streams to decouple sensor ingestion from client socket fan-out.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/workers/redisConsumer.ts',
      lineRange: [8, 30],
      commitHash: '2f1143c',
      commitMessage: 'feat(redis): add consumer group acknowledging telemetry packets',
    },
    evidenceStatus: 'supported',
    authorshipSupport: 'primary_author',
    confidence: 'medium',
    firstObservedDate: '2026-08-22',
    lastObservedDate: '2026-08-27',
    codeSnippet: `redisClient.xreadgroup('GROUP', 'telemetry_workers', 'worker_1', 'BLOCK', 2000, 'STREAMS', 'raw_sensors', '>');`,
  },

  // ── SYNTRA EVIDENCE ─────────────────────────────────────────
  {
    id: 'ev_syntra_react',
    projectId: 'proj_syntra',
    projectName: 'SYNTRA',
    skillId: 'skill_react',
    skillName: 'Advanced React & Architecture',
    claim: 'Created custom virtualized scroll rendering pipeline capable of 60fps with 50,000 tabular records.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/components/VirtualGrid.tsx',
      lineRange: [25, 80],
      commitHash: '5e0031a',
      commitMessage: 'perf(grid): implement windowing slice with overscan buffers',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-02',
    lastObservedDate: '2026-09-22',
    codeSnippet: `const visibleRows = useMemo(() => {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(items.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
  return items.slice(start, end);
}, [scrollTop, viewportHeight, items, rowHeight]);`,
  },
  {
    id: 'ev_syntra_a11y',
    projectId: 'proj_syntra',
    projectName: 'SYNTRA',
    skillId: 'skill_a11y',
    skillName: 'Accessibility (WCAG 2.1 AA)',
    claim: 'Engineered keyboard focus management trap and ARIA live regions for screen reader compliance.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'src/a11y/focusTrap.ts',
      lineRange: [12, 45],
      commitHash: '6d1189c',
      commitMessage: 'feat(a11y): add loopback focus containment for modal dialogs',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-08',
    lastObservedDate: '2026-09-20',
    codeSnippet: `export function trapFocus(element: HTMLElement) {
  const focusables = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  // Loop Tab and Shift+Tab key events
}`,
  },
  {
    id: 'ev_syntra_jest',
    projectId: 'proj_syntra',
    projectName: 'SYNTRA',
    skillId: 'skill_testing',
    skillName: 'Automated Component Testing',
    claim: 'Configured automated test suite verifying DOM mutations and keyboard arrow navigation.',
    sourceType: 'source_file',
    sourceLocation: {
      filePath: 'tests/VirtualGrid.test.tsx',
      lineRange: [10, 48],
      commitHash: '1c4902b',
      commitMessage: 'test: assert proper aria-rowindex attributes during rapid scroll',
    },
    evidenceStatus: 'direct',
    authorshipSupport: 'primary_author',
    confidence: 'high',
    firstObservedDate: '2026-09-10',
    lastObservedDate: '2026-09-22',
    codeSnippet: `expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '50000');`,
  },
];

export const SAMPLE_OPPORTUNITY: Opportunity = {
  id: 'opp_core_systems_intern',
  title: 'Software Engineering Intern — Core Systems',
  companyOrContext: 'Modern Distributed Cloud & Edge Platform',
  domain: 'High-Concurrency Distributed Systems & Web Engineering',
  descriptionRaw: `About the Role:
We are seeking an inquisitive, hands-on Software Engineering Intern to join our Core Infrastructure & Platform team. You will build and scale reliable API services, real-time telemetry streaming, and performant developer interfaces.

Must-Have Technical Experience:
- Proficiency in TypeScript and modern JavaScript.
- Strong fundamentals in building RESTful APIs or real-time event streaming (WebSockets).
- Experience implementing authentication flows (e.g. JWT, OAuth, or session management).
- Working knowledge of relational databases (PostgreSQL preferred).
- Hands-on familiarity with Git workflows and version control.

Nice-to-Have / Preferred:
- Experience with Docker containerization and local orchestration.
- Familiarity with automated unit testing (Jest or equivalent).
- Exposure to front-end performance tuning (React or virtualized DOM).
- Kubernetes or Cloud Infrastructure (Terraform / AWS).`,
  requirements: [
    {
      id: 'req_ts',
      category: 'technical_core',
      name: 'TypeScript & Modern JS',
      description: 'Production proficiency with static typing, async execution, and modern tooling.',
      isMustHave: true,
    },
    {
      id: 'req_api_ws',
      category: 'technical_core',
      name: 'REST APIs & Real-Time Streams',
      description: 'Experience designing clean HTTP endpoints or low-latency WebSockets.',
      isMustHave: true,
    },
    {
      id: 'req_auth',
      category: 'technical_core',
      name: 'Authentication & Security',
      description: 'Hands-on implementation of JWTs, token lifecycle, or protected routing.',
      isMustHave: true,
    },
    {
      id: 'req_db',
      category: 'technical_core',
      name: 'Relational Database (PostgreSQL)',
      description: 'Understanding of schemas, connection pooling, and ACID queries.',
      isMustHave: true,
    },
    {
      id: 'req_git',
      category: 'tooling',
      name: 'Git & Version Control',
      description: 'Structured atomic commits, branching, and repository management.',
      isMustHave: true,
    },
    {
      id: 'req_docker',
      category: 'infrastructure',
      name: 'Docker & Containerization',
      description: 'Writing Dockerfiles and multi-stage container builds.',
      isMustHave: false,
    },
    {
      id: 'req_testing',
      category: 'tooling',
      name: 'Automated Testing (Jest)',
      description: 'Writing unit and integration tests with deterministic assertions.',
      isMustHave: false,
    },
    {
      id: 'req_k8s',
      category: 'infrastructure',
      name: 'Kubernetes & Cloud Infrastructure',
      description: 'Cluster orchestration, Helm charts, or Terraform automation.',
      isMustHave: false,
    },
  ],
  createdAt: '2026-09-24',
};
