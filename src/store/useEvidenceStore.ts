/**
 * Evidence Store
 * Manages connected projects, extracted evidence, sync state,
 * and evidence inspector selection.
 *
 * On first launch, loads demo data so the app isn't empty.
 * After the user connects their GitHub, replaces demo data with real data.
 */

import { create } from 'zustand';
import { ProjectSource, EvidenceItem, EvidenceStatus } from '../domain/types';
import { ProofGraph } from '../domain/proofGraph';
import { GithubService } from '../services/githubService';
import { DEMO_PROJECTS, DEMO_EVIDENCE } from '../domain/fixtures';

interface EvidenceState {
  hasCompletedOnboarding: boolean;
  hasSeenTutorial: boolean;
  isUsingDemoData: boolean;
  candidateName: string;
  projects: ProjectSource[];
  evidence: EvidenceItem[];
  selectedEvidence: EvidenceItem | null;
  activeFilter: EvidenceStatus | 'all';
  isSyncing: boolean;
  syncError: string | null;
  lastSyncedTimestamp: string;
  graph: ProofGraph;

  // Actions
  initialize: () => void;
  setOnboardingComplete: (status: boolean) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  selectEvidence: (item: EvidenceItem | null) => void;
  setFilter: (filter: EvidenceStatus | 'all') => void;
  markUserVerification: (evidenceId: string, isAccurate: boolean) => void;
  triggerContinuousSync: (username?: string) => Promise<{ success: boolean; error?: string }>;
  clearSyncError: () => void;
  addCustomProject: (project: ProjectSource, evidenceItems: EvidenceItem[]) => void;
}

export const useEvidenceStore = create<EvidenceState>((set, get) => ({
  hasCompletedOnboarding: false,
  hasSeenTutorial: false,
  isUsingDemoData: true,
  candidateName: 'Demo User',
  projects: DEMO_PROJECTS,
  evidence: DEMO_EVIDENCE,
  selectedEvidence: null,
  activeFilter: 'all',
  isSyncing: false,
  syncError: null,
  lastSyncedTimestamp: '',
  graph: new ProofGraph(DEMO_PROJECTS, DEMO_EVIDENCE),

  clearSyncError: () => set({ syncError: null }),

  initialize: () => {
    const currentProjects = get().projects.length > 0 ? get().projects : DEMO_PROJECTS;
    const currentEvidence = get().evidence.length > 0 ? get().evidence : DEMO_EVIDENCE;
    const graph = new ProofGraph(currentProjects, currentEvidence);
    set({
      projects: currentProjects,
      evidence: currentEvidence,
      graph,
    });
  },

  setOnboardingComplete: (status) => {
    set({ hasCompletedOnboarding: status });
  },

  setHasSeenTutorial: (seen) => {
    set({ hasSeenTutorial: seen });
  },

  selectEvidence: (item) => {
    set({ selectedEvidence: item });
  },

  setFilter: (filter) => {
    set({ activeFilter: filter });
  },

  markUserVerification: (evidenceId, isAccurate) => {
    set((state) => {
      const updated = state.evidence.map((ev) => {
        if (ev.id === evidenceId) {
          return {
            ...ev,
            evidenceStatus: isAccurate ? ev.evidenceStatus : ('user_declared' as EvidenceStatus),
          };
        }
        return ev;
      });
      return {
        evidence: updated,
        graph: new ProofGraph(state.projects, updated),
      };
    });
  },

  triggerContinuousSync: async (inputUrlOrUsername?: string) => {
    const targetUser = inputUrlOrUsername || get().candidateName;
    if (!targetUser || targetUser === 'Demo User') {
      return { success: false, error: 'Please enter a GitHub username or URL.' };
    }

    set({ isSyncing: true, syncError: null });

    try {
      const { projects, evidence, extractedUsername } = await GithubService.fetchCandidateData(targetUser);

      set({
        isUsingDemoData: false,
        candidateName: extractedUsername,
        projects,
        evidence,
        graph: new ProofGraph(projects, evidence),
        isSyncing: false,
        syncError: null,
        lastSyncedTimestamp: new Date().toISOString(),
      });

      // Propagate to downstream stores
      try {
        const { useOpportunityStore } = require('./useOpportunityStore');
        const { useInterviewStore } = require('./useInterviewStore');
        useOpportunityStore.getState().runAnalysis();
        useInterviewStore.getState().initialize();
      } catch (storeSyncErr) {
        console.warn('Post-sync store propagation warning:', storeSyncErr);
      }

      return { success: true };
    } catch (error: any) {
      const errorMsg = error?.message || 'Sync failed. Check the username and try again.';
      console.warn('Sync failed:', errorMsg);
      set({ isSyncing: false, syncError: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  addCustomProject: (project, evidenceItems) => {
    set((state) => {
      const newProjects = [project, ...state.projects];
      const newEvidence = [...evidenceItems, ...state.evidence];
      return {
        projects: newProjects,
        evidence: newEvidence,
        graph: new ProofGraph(newProjects, newEvidence),
        isUsingDemoData: false,
      };
    });
  },
}));
