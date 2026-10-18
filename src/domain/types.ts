/**
 * Domain Types
 * Core data models for evidence-based skill matching.
 */

// Evidence status: how strongly the evidence supports a claim
export type EvidenceStatus =
  | 'direct'        // Code implementing this skill found in source files
  | 'supported'     // Referenced in configs, docs, or dependency manifests
  | 'partial'       // Related work in a similar domain
  | 'not_found'     // No evidence detected
  | 'user_declared'; // Self-reported, not verified by code

// Where the evidence signal came from
export type SourceType =
  | 'source_file'
  | 'commit_history'
  | 'dependency_manifest'
  | 'api_route'
  | 'manual_project';

// Contribution level
export type AuthorshipSupport =
  | 'primary_author'
  | 'collaborator'
  | 'inherited_template'
  | 'unverified';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

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
  firstObservedDate: string;
  lastObservedDate: string;
  codeSnippet?: string;
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

// Opportunity & Matching

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

// Application & Bullets

export interface GroundedResumeBullet {
  id: string;
  projectId: string;
  projectName: string;
  text: string;
  evidenceIds: string[];
  isAudited: boolean;
  userVerified: boolean;
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

// Interview Defense

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

// Subscription (RevenueCat)

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
  continuousSync: true,
  deepInterviewDefense: true,
  exportProofPack: true,
} as const;
