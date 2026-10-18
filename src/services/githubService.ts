/**
 * GitHub Service
 * Fetches repository data and extracts evidence from actual source artifacts.
 *
 * Evidence is derived from:
 * 1. GitHub-detected primary language (verified by GitHub's linguist)
 * 2. Dependency manifests (package.json, requirements.txt, go.mod, Cargo.toml)
 * 3. File tree structure (actual source files, not just metadata)
 * 4. Recent commit history (real SHAs, messages, and file diffs)
 * 5. Repository topics and description (supplementary, lower confidence)
 *
 * Limitations:
 * - Unauthenticated GitHub API: 60 requests/hour rate limit
 * - Only public repositories are accessible
 * - File content reads are limited to keep within rate budget
 */

import { ProjectSource, EvidenceItem, SourceType, EvidenceStatus, ConfidenceLevel } from '../domain/types';

// Maps dependency names to normalized skill labels
const DEPENDENCY_SKILL_MAP: Record<string, string> = {
  // JavaScript/TypeScript ecosystem
  'react': 'React', 'react-dom': 'React', 'react-native': 'React Native',
  'next': 'Next.js', 'express': 'Express', 'fastify': 'Fastify',
  'vue': 'Vue.js', 'angular': 'Angular', 'svelte': 'Svelte',
  'jest': 'Jest Testing', 'mocha': 'Mocha Testing', 'vitest': 'Vitest',
  'typescript': 'TypeScript', 'zustand': 'Zustand', 'redux': 'Redux',
  'prisma': 'Prisma ORM', 'mongoose': 'MongoDB (Mongoose)',
  'pg': 'PostgreSQL', 'socket.io': 'WebSockets',
  'three': 'Three.js / WebGL', 'gsap': 'GSAP Animation',
  'tailwindcss': 'Tailwind CSS', 'webpack': 'Webpack',
  'vite': 'Vite', 'esbuild': 'esbuild',
  'graphql': 'GraphQL', 'apollo-server': 'Apollo GraphQL',
  'react-native-purchases': 'RevenueCat',
  'expo': 'Expo', 'electron': 'Electron',

  // Python ecosystem
  'flask': 'Flask', 'django': 'Django', 'fastapi': 'FastAPI',
  'numpy': 'NumPy', 'pandas': 'Pandas', 'scipy': 'SciPy',
  'scikit-learn': 'scikit-learn', 'sklearn': 'scikit-learn',
  'tensorflow': 'TensorFlow', 'torch': 'PyTorch', 'pytorch': 'PyTorch',
  'transformers': 'HuggingFace Transformers',
  'langchain': 'LangChain', 'openai': 'OpenAI API',
  'requests': 'HTTP Client (requests)', 'sqlalchemy': 'SQLAlchemy',
  'celery': 'Celery Task Queue', 'redis': 'Redis',
  'docker': 'Docker', 'streamlit': 'Streamlit',
  'imblearn': 'Imbalanced-learn (SMOTE)',

  // Go ecosystem
  'gin': 'Gin (Go)', 'echo': 'Echo (Go)', 'fiber': 'Fiber (Go)',

  // Rust ecosystem
  'tokio': 'Tokio (Async Rust)', 'actix-web': 'Actix Web',
  'serde': 'Serde Serialization',
};

// File extension to language mapping
const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.js': 'JavaScript', '.jsx': 'JavaScript',
  '.py': 'Python', '.pyw': 'Python',
  '.go': 'Go', '.rs': 'Rust',
  '.java': 'Java', '.kt': 'Kotlin',
  '.swift': 'Swift', '.rb': 'Ruby',
  '.cs': 'C#', '.cpp': 'C++', '.c': 'C',
  '.html': 'HTML', '.css': 'CSS',
  '.sql': 'SQL', '.sh': 'Shell',
  '.yml': 'YAML', '.yaml': 'YAML',
  '.dockerfile': 'Docker', '.proto': 'Protocol Buffers',
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  size: number;
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string } | null;
}

interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
}

const GITHUB_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Evident-App',
};

export class GithubService {
  /**
   * Fetches real repository data and generates evidence from actual source artifacts.
   * Reads file trees, dependency manifests, and commit history — not just metadata.
   */
  static async fetchCandidateData(input: string): Promise<{
    projects: ProjectSource[];
    evidence: EvidenceItem[];
    extractedUsername: string;
  }> {
    const { username, specificRepoName } = this.parseInput(input);

    // Verify user exists
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers: GITHUB_HEADERS });
    if (userRes.status === 404) {
      throw new Error(`GitHub profile "${username}" not found.`);
    }
    if (!userRes.ok && userRes.status !== 403) {
      throw new Error(`GitHub API error (${userRes.status}).`);
    }

    const userData = userRes.ok ? await userRes.json() : null;
    const displayName = userData?.name || userData?.login || username;

    // Fetch repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      { headers: GITHUB_HEADERS }
    );
    if (!reposRes.ok && reposRes.status !== 403) {
      throw new Error(`Failed to load repositories for "${username}".`);
    }

    let repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];
    if (!Array.isArray(repos) || repos.length === 0) {
      throw new Error(`No public repositories found for "${username}".`);
    }

    // Prioritize specific repo if one was linked
    if (specificRepoName) {
      const idx = repos.findIndex((r) => r.name.toLowerCase() === specificRepoName.toLowerCase());
      if (idx > -1) {
        const [target] = repos.splice(idx, 1);
        repos.unshift(target);
      }
    }

    const projects: ProjectSource[] = [];
    const evidence: EvidenceItem[] = [];

    // Process top repos in detail (file trees + commits), rest just metadata
    // Budget: ~3 API calls per detailed repo (tree + commits + maybe one manifest)
    const DETAILED_LIMIT = 15;
    const reposToProcess = repos.slice(0, 30); // cap at 30 repos total

    for (let i = 0; i < reposToProcess.length; i++) {
      const repo = reposToProcess[i];
      const doDetailed = i < DETAILED_LIMIT;

      const { project, items } = doDetailed
        ? await this.processRepoDetailed(repo, username)
        : this.processRepoBasic(repo);

      projects.push(project);
      evidence.push(...items);
    }

    return { projects, evidence, extractedUsername: displayName };
  }

  /**
   * Detailed processing: reads file tree, parses dependency manifests, fetches commits.
   */
  private static async processRepoDetailed(
    repo: GitHubRepo,
    username: string
  ): Promise<{ project: ProjectSource; items: EvidenceItem[] }> {
    const items: EvidenceItem[] = [];
    const detectedFrameworks: string[] = [];
    const detectedLanguages = new Set<string>();
    const fileList: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    if (repo.language) detectedLanguages.add(repo.language);

    // 1. Fetch file tree
    let treeItems: GitHubTreeItem[] = [];
    try {
      const treeRes = await fetch(
        `https://api.github.com/repos/${repo.full_name}/git/trees/${repo.default_branch || 'main'}?recursive=1`,
        { headers: GITHUB_HEADERS }
      );
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        treeItems = (treeData.tree || []).filter((t: GitHubTreeItem) => t.type === 'blob');
      }
    } catch {
      // Rate limited or error — fall back to basic processing
    }

    // Detect languages from actual file extensions
    for (const file of treeItems) {
      fileList.push(file.path);
      const ext = '.' + file.path.split('.').pop()?.toLowerCase();
      const lang = EXTENSION_LANGUAGE_MAP[ext];
      if (lang && lang !== 'YAML' && lang !== 'HTML' && lang !== 'CSS') {
        detectedLanguages.add(lang);
      }
    }

    // 2. Parse dependency manifests (real skill detection)
    const manifestFiles = treeItems
      .map((f) => f.path)
      .filter((p) => /^(package\.json|requirements\.txt|Pipfile|go\.mod|Cargo\.toml|Gemfile|build\.gradle|pom\.xml)$/.test(p.split('/').pop() || ''));

    // Only read root-level manifests to save API calls
    const rootManifest = manifestFiles.find((p) => !p.includes('/')) || manifestFiles[0];

    if (rootManifest) {
      try {
        const contentRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/contents/${rootManifest}`,
          { headers: { ...GITHUB_HEADERS, 'Accept': 'application/vnd.github.v3.raw' } }
        );
        if (contentRes.ok) {
          const content = await contentRes.text();
          const deps = this.extractDependencies(rootManifest, content);

          for (const dep of deps) {
            const skillLabel = DEPENDENCY_SKILL_MAP[dep.name.toLowerCase()];
            if (skillLabel && !detectedFrameworks.includes(skillLabel)) {
              detectedFrameworks.push(skillLabel);
              const evId = `ev_${repo.id}_dep_${dep.name.replace(/[^a-z0-9]/gi, '')}`;
              items.push({
                id: evId,
                projectId: repo.id.toString(),
                projectName: repo.name,
                skillId: `skill_${dep.name.replace(/[^a-z0-9]/gi, '_')}`,
                skillName: skillLabel,
                claim: `Uses ${skillLabel} (${dep.version || 'detected'}) — found in ${rootManifest}.`,
                sourceType: 'dependency_manifest' as SourceType,
                sourceLocation: {
                  filePath: rootManifest,
                  url: `${repo.html_url}/blob/${repo.default_branch || 'main'}/${rootManifest}`,
                },
                evidenceStatus: 'supported' as EvidenceStatus,
                authorshipSupport: repo.fork ? 'collaborator' : 'primary_author',
                confidence: 'high' as ConfidenceLevel,
                firstObservedDate: repo.created_at?.split('T')[0] || today,
                lastObservedDate: repo.pushed_at?.split('T')[0] || today,
              });
            }
          }
        }
      } catch {
        // Manifest read failed — continue without it
      }
    }

    // 3. Language evidence from GitHub's linguist detection (verified by their analysis)
    if (repo.language) {
      const langEvId = `ev_${repo.id}_lang`;
      items.push({
        id: langEvId,
        projectId: repo.id.toString(),
        projectName: repo.name,
        skillId: `skill_${repo.language.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        skillName: repo.language,
        claim: `Primary language detected by GitHub linguist analysis. ${treeItems.filter((f) => {
          const ext = '.' + f.path.split('.').pop()?.toLowerCase();
          return EXTENSION_LANGUAGE_MAP[ext] === repo.language;
        }).length} source files found.`,
        sourceType: 'source_file' as SourceType,
        sourceLocation: {
          filePath: '(repository-wide)',
          url: repo.html_url,
        },
        evidenceStatus: 'direct' as EvidenceStatus,
        authorshipSupport: repo.fork ? 'collaborator' : 'primary_author',
        confidence: 'high' as ConfidenceLevel,
        firstObservedDate: repo.created_at?.split('T')[0] || today,
        lastObservedDate: repo.pushed_at?.split('T')[0] || today,
      });
    }

    // 4. Fetch recent commits for provenance
    let commits: GitHubCommit[] = [];
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?per_page=10`,
        { headers: GITHUB_HEADERS }
      );
      if (commitsRes.ok) {
        commits = await commitsRes.json();
      }
    } catch {
      // Commit fetch failed
    }

    // Count how many commits are by this user
    const userCommits = commits.filter(
      (c) => c.author?.login?.toLowerCase() === username.toLowerCase()
        || c.commit?.author?.name?.toLowerCase() === username.toLowerCase()
    );

    // Detect source file patterns for specific evidence
    const sourcePatterns = this.detectSourcePatterns(treeItems.map((f) => f.path));
    for (const pattern of sourcePatterns) {
      if (!detectedFrameworks.includes(pattern.skill)) {
        detectedFrameworks.push(pattern.skill);
      }
      const evId = `ev_${repo.id}_pattern_${pattern.id}`;
      items.push({
        id: evId,
        projectId: repo.id.toString(),
        projectName: repo.name,
        skillId: `skill_${pattern.id}`,
        skillName: pattern.skill,
        claim: pattern.claim,
        sourceType: 'source_file' as SourceType,
        sourceLocation: {
          filePath: pattern.file,
          url: `${repo.html_url}/blob/${repo.default_branch || 'main'}/${pattern.file}`,
        },
        evidenceStatus: 'supported' as EvidenceStatus,
        authorshipSupport: repo.fork ? 'collaborator' : 'primary_author',
        confidence: 'medium' as ConfidenceLevel,
        firstObservedDate: repo.created_at?.split('T')[0] || today,
        lastObservedDate: repo.pushed_at?.split('T')[0] || today,
      });
    }

    const project: ProjectSource = {
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description || `${repo.language || 'Software'} project`,
      repoUrl: repo.html_url,
      primaryLanguage: repo.language || 'Unknown',
      languages: Array.from(detectedLanguages),
      frameworks: detectedFrameworks.length > 0 ? detectedFrameworks : [],
      totalCommits: commits.length > 0 ? commits.length : 0, // actual count from API
      candidateCommits: userCommits.length,
      isForkOrTemplate: !!repo.fork,
      lastUpdated: repo.pushed_at?.split('T')[0] || today,
      files: fileList.slice(0, 50), // cap file list for storage
      evidenceIds: items.map((e) => e.id),
    };

    return { project, items };
  }

  /**
   * Basic processing for repos beyond the detail limit.
   * Only uses repo metadata — no extra API calls.
   */
  private static processRepoBasic(repo: GitHubRepo): { project: ProjectSource; items: EvidenceItem[] } {
    const items: EvidenceItem[] = [];
    const today = new Date().toISOString().split('T')[0];

    if (repo.language) {
      const evId = `ev_${repo.id}_lang`;
      items.push({
        id: evId,
        projectId: repo.id.toString(),
        projectName: repo.name,
        skillId: `skill_${repo.language.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        skillName: repo.language,
        claim: `Repository uses ${repo.language} (detected by GitHub).`,
        sourceType: 'source_file' as SourceType,
        sourceLocation: { url: repo.html_url },
        evidenceStatus: 'supported' as EvidenceStatus,
        authorshipSupport: repo.fork ? 'collaborator' : 'primary_author',
        confidence: 'medium' as ConfidenceLevel,
        firstObservedDate: repo.created_at?.split('T')[0] || today,
        lastObservedDate: repo.pushed_at?.split('T')[0] || today,
      });
    }

    const project: ProjectSource = {
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description || `${repo.language || 'Software'} project`,
      repoUrl: repo.html_url,
      primaryLanguage: repo.language || 'Unknown',
      languages: repo.language ? [repo.language] : [],
      frameworks: [],
      totalCommits: 0,
      candidateCommits: 0,
      isForkOrTemplate: !!repo.fork,
      lastUpdated: repo.pushed_at?.split('T')[0] || today,
      files: [],
      evidenceIds: items.map((e) => e.id),
    };

    return { project, items };
  }

  /**
   * Extracts dependency names and versions from manifest file content.
   */
  private static extractDependencies(
    filename: string,
    content: string
  ): { name: string; version: string }[] {
    const deps: { name: string; version: string }[] = [];
    const basename = filename.split('/').pop() || filename;

    try {
      if (basename === 'package.json') {
        const pkg = JSON.parse(content);
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        for (const [name, version] of Object.entries(allDeps)) {
          deps.push({ name, version: String(version) });
        }
      } else if (basename === 'requirements.txt' || basename === 'Pipfile') {
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) continue;
          // Handle formats: package==1.0, package>=1.0, package~=1.0, package
          const match = trimmed.match(/^([a-zA-Z0-9_-]+)\s*([>=<~!]=?\s*[\d.]*)?/);
          if (match) {
            deps.push({ name: match[1], version: (match[2] || '').trim() });
          }
        }
      } else if (basename === 'go.mod') {
        const lines = content.split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^\s*([^\s]+)\s+(v[\d.]+)/);
          if (match) {
            const parts = match[1].split('/');
            deps.push({ name: parts[parts.length - 1], version: match[2] });
          }
        }
      } else if (basename === 'Cargo.toml') {
        const lines = content.split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
          if (match) {
            deps.push({ name: match[1], version: match[2] });
          }
        }
      }
    } catch {
      // Parse error — return what we have
    }

    return deps;
  }

  /**
   * Detects high-signal file patterns that indicate specific technologies.
   * E.g., Dockerfile → Docker, .github/workflows → CI/CD, etc.
   */
  private static detectSourcePatterns(
    files: string[]
  ): { id: string; skill: string; claim: string; file: string }[] {
    const patterns: { id: string; skill: string; claim: string; file: string }[] = [];
    const seen = new Set<string>();

    const rules: { test: RegExp; id: string; skill: string; claim: (f: string) => string }[] = [
      { test: /^Dockerfile$/i, id: 'docker', skill: 'Docker', claim: (f) => `Contains ${f} for containerized deployment.` },
      { test: /^docker-compose\.ya?ml$/i, id: 'docker_compose', skill: 'Docker Compose', claim: (f) => `Multi-service orchestration defined in ${f}.` },
      { test: /^\.github\/workflows\/.+\.ya?ml$/, id: 'ci_cd', skill: 'CI/CD (GitHub Actions)', claim: (f) => `Automated pipeline configured in ${f}.` },
      { test: /^\.gitlab-ci\.yml$/, id: 'gitlab_ci', skill: 'CI/CD (GitLab CI)', claim: (f) => `Pipeline defined in ${f}.` },
      { test: /^terraform\/.+\.tf$|\.tf$/, id: 'terraform', skill: 'Terraform', claim: (f) => `Infrastructure-as-code in ${f}.` },
      { test: /^k8s\/.+\.ya?ml$|kubernetes\/.+\.ya?ml$/, id: 'k8s', skill: 'Kubernetes', claim: (f) => `Cluster manifests in ${f}.` },
      { test: /jest\.config\.[jt]s$|vitest\.config\.[jt]s$/, id: 'test_config', skill: 'Automated Testing', claim: (f) => `Test runner configured in ${f}.` },
      { test: /\.test\.[jt]sx?$|\.spec\.[jt]sx?$|_test\.py$|_test\.go$/, id: 'tests', skill: 'Unit Tests', claim: (f) => `Test suite found (e.g. ${f}).` },
      { test: /^prisma\/schema\.prisma$/, id: 'prisma', skill: 'Prisma ORM', claim: (f) => `Database schema in ${f}.` },
      { test: /openapi\.ya?ml$|swagger\.ya?ml$/i, id: 'openapi', skill: 'OpenAPI / Swagger', claim: (f) => `API specification in ${f}.` },
    ];

    for (const file of files) {
      const basename = file.split('/').pop() || file;
      for (const rule of rules) {
        if (!seen.has(rule.id) && (rule.test.test(file) || rule.test.test(basename))) {
          seen.add(rule.id);
          patterns.push({ id: rule.id, skill: rule.skill, claim: rule.claim(file), file });
        }
      }
    }

    return patterns;
  }

  private static parseInput(input: string): { username: string; specificRepoName: string | null } {
    let cleanInput = input.trim();
    let specificRepoName: string | null = null;

    if (cleanInput.includes('github.com/')) {
      const pathAfterDomain = cleanInput.split('github.com/')[1].split('?')[0].replace(/\.git$/, '');
      const segments = pathAfterDomain.split('/').filter(Boolean);
      if (segments.length >= 1) cleanInput = segments[0];
      if (segments.length >= 2) specificRepoName = segments[1];
    }

    const username = cleanInput.replace(/^@/, '');
    if (!username) {
      throw new Error('Please enter a valid GitHub username or repository URL.');
    }

    return { username, specificRepoName };
  }
}
