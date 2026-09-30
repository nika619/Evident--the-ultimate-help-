/**
 * Evident Opportunity Store
 * Manages active target opportunities, requirement matching matrix,
 * grounded resume bullets, and audit verification states.
 */

import { create } from 'zustand';
import {
  Opportunity,
  RequirementMatch,
  EvidenceCoverage,
  GroundedResumeBullet,
} from '../domain/types';
import { SAMPLE_OPPORTUNITY } from '../domain/fixtures';
import { MatchingEngine } from '../domain/matchingEngine';
import { ClaimAuditor, AuditReport } from '../domain/claimAuditor';
import { ProofPackService } from '../services/proofPackService';
import { useEvidenceStore } from './useEvidenceStore';

interface OpportunityState {
  opportunity: Opportunity;
  matches: RequirementMatch[];
  coverage: EvidenceCoverage | null;
  rankedProjects: {
    projectId: string;
    projectName: string;
    relevanceReason: string;
    matchCount: number;
  }[];
  groundedBullets: GroundedResumeBullet[];
  auditReports: AuditReport[];
  isAnalyzing: boolean;
  proofPackDossierMarkdown: string;

  // Actions
  initialize: () => void;
  setOpportunity: (opp: Opportunity) => void;
  runAnalysis: () => void;
  toggleBulletVerification: (bulletId: string) => void;
}

export const useOpportunityStore = create<OpportunityState>((set, get) => ({
  opportunity: SAMPLE_OPPORTUNITY,
  matches: [],
  coverage: null,
  rankedProjects: [],
  groundedBullets: [],
  auditReports: [],
  isAnalyzing: false,
  proofPackDossierMarkdown: '',

  initialize: () => {
    get().runAnalysis();
  },

  setOpportunity: (opp) => {
    set({ opportunity: opp });
    get().runAnalysis();
  },

  runAnalysis: () => {
    set({ isAnalyzing: true });
    const { projects, evidence, candidateName } = useEvidenceStore.getState();
    const currentOpp = get().opportunity;

    const result = MatchingEngine.matchOpportunity(currentOpp, evidence, projects);
    const audits = ClaimAuditor.auditBullets(result.groundedBullets, evidence);

    const markdown = ProofPackService.generateDossierMarkdown(
      candidateName,
      currentOpp,
      result.coverage,
      result.rankedProjects,
      result.groundedBullets,
      evidence,
      projects
    );

    set({
      matches: result.matches,
      coverage: result.coverage,
      rankedProjects: result.rankedProjects,
      groundedBullets: result.groundedBullets,
      auditReports: audits,
      isAnalyzing: false,
      proofPackDossierMarkdown: markdown,
    });
  },

  toggleBulletVerification: (bulletId) => {
    set((state) => {
      const updated = state.groundedBullets.map((b) =>
        b.id === bulletId ? { ...b, userVerified: !b.userVerified } : b
      );
      return { groundedBullets: updated };
    });
  },
}));
