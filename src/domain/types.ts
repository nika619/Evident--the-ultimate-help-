/**
 * Evident Domain Types
 * Clean, framework-agnostic domain models for code-grounded career intelligence.
 *
 * Implements:
 * - 5-Dimensional Evidence Classification
 * - Provenance Traversal & Auditability
 * - Living Career Memory
 */

// ─── 1. Evidence Status (Relationship degree to requirement) ─────────
export type EvidenceStatus =
  | 'direct'       // Explicit first-party implementation artifact (code, routes, logic)
  | 'supported'    // Mentioned in docs, configs, or manifests
  | 'partial'      // Tangential or related framework/paradigm
  | 'not_found'    // No verifiable signal detected
  | 'user_declared'; // Self-reported claim, unverified by repo

// ─── 2. Source Type (Origin of the signal) ───────────────────────────
export type SourceType =
  | 'source_file'
  | 'commit_history'
  | 'dependency_manifest'
  | 'api_route'
  | 'manual_project';

// ─── 3. Authorship Support (Degree of personal contribution) ─────────
export type AuthorshipSupport =
  | 'primary_author'      // Directly authored in candidate commits
  | 'collaborator'        // Contributed alongside team commits
  | 'inherited_template'  // Present in starter boilerplate or upstream fork
  | 'unverified';         // Contribution provenance pending confirmation

// ─── 4. Confidence Level ─────────────────────────────────────────────
export type ConfidenceLevel = 'high' | 'medium' | 'low';

// ─── 5. Core Entities ────────────────────────────────────────────────
export interface SourceLocation {
  filePath?: string;
  lineRange?: [number, number];
  commitHash?: string;
  commitMessage?: string;
  url?: string;
}

export interface EvidenceItem {
  id: string;
  projectId: string;
  projectName: string;
  skillId: string;
  skillName: string;
  claim: string;
  sourceType: SourceType;
  sourceLocation: SourceLocation;
  evidenceStatus: EvidenceStatus;
  authorshipSupport: AuthorshipSupport;
  confidence: ConfidenceLevel;
  firstObservedDate: string; // YYYY-MM-DD
  lastObservedDate: string;  // Freshness tracking (e.g. 2026-09-24)
  codeSnippet?: string;      // Snippet for internal audit drawer
}

export interface CommitRecord {
  hash: string;
  message: string;
  date: string;
  author: string;
  filesChanged: string[];
}

export interface ProjectSource {
  id: string;
  name: string;
  description: string;
  repoUrl?: string;
  primaryLanguage: string;
  languages: string[];
  frameworks: string[];
  totalCommits: number;
  candidateCommits: number;
  isForkOrTemplate: boolean;
  lastUpdated: string;
  files: string[];
  evidenceIds: string[];
}

// ─── 6. Opportunity & Matching Models ────────────────────────────────
export type RequirementCategory =
  | 'technical_core'
  | 'infrastructure'
  | 'architecture'
  | 'tooling';

export interface OpportunityRequirement {
  id: string;
  category: RequirementCategory;
  name: string;
  description: string;
  isMustHave: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  companyOrContext: string;
  domain: string;
  descriptionRaw: string;
  requirements: OpportunityRequirement[];
  createdAt: string;
}

export interface RequirementMatch {
  requirementId: string;
  requirementName: string;
  category: RequirementCategory;
  isMustHave: boolean;
  status: EvidenceStatus;
  primaryEvidenceId?: string;
  supportingEvidenceIds: string[];
  rationale: string;
  topProjectName?: string;
}

export interface EvidenceCoverage {
  directCount: number;
  supportedCount: number;
  partialCount: number;
  notFoundCount: number;
  totalMustHaves: number;
  coveredMustHaves: number;
  summarySentence: string;
}

// ─── 7. Application & Grounded Bullets ───────────────────────────────
export interface GroundedResumeBullet {
  id: string;
  projectId: string;
  projectName: string;
  text: string;
  evidenceIds: string[];
  isAudited: boolean;
  userVerified: boolean; // User marked [✓ Accurate] or [× Not mine]
}

export interface TailoredApplication {
  id: string;
  opportunityId: string;
  targetRole: string;
  companyContext: string;
  rankedProjects: {
    projectId: string;
    projectName: string;
    relevanceReason: string;
    matchCount: number;
  }[];
  bullets: GroundedResumeBullet[];
  coverage: EvidenceCoverage;
  proofPackDossierMarkdown: string;
  createdAt: string;
}

// ─── 8. Interview Defense Arena ──────────────────────────────────────
export interface DefenseQuestion {
  id: string;
  projectId: string;
  projectName: string;
  question: string;
  intent: 'explain_implementation' | 'clarify_contribution' | 'explore_tradeoff';
  relevantFile: string;
  relevantCommit?: string;
  targetedSkill: string;
  keyTradeoffHint: string;
}

export interface DefenseEvaluation {
  questionId: string;
  technicalUnderstanding: 'Strong' | 'Adequate' | 'Needs Clarification';
  contributionClarity: 'Clear' | 'Vague';
  tradeoffAwareness: 'Comprehensive' | 'Partial' | 'Omitted';
  feedbackNotes: string;
  codeCitationSuggestion: string;
}

// ─── 9. Subscription & Entitlements (RevenueCat) ────────────────────
export type SubscriptionTier = 'free' | 'evident_pro_monthly' | 'evident_pro_annual';

export interface SubscriptionState {
  isPro: boolean;
  activeTier: SubscriptionTier;
  expirationDate: string | null;
  customerUserId: string;
  isTestStore: boolean;
}

export const FREE_TIER_LIMITS = {
  maxProjects: 3,
  maxOpportunityScans: 1,
  interviewQuestionsPerSession: 1,
  continuousSync: false,
} as const;

export const PRO_TIER_BENEFITS = {
  unlimitedProjects: true,
  unlimitedOpportunityScans: true,
  continuousSync: true,           // Living Career Memory
  deepInterviewDefense: true,     // Full architectural probing
  exportProofPack: true,          // Export recruiter dossier
} as const;
