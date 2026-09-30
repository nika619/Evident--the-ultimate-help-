/**
 * Evident Evidence Store
 * Manages connected projects, extracted evidence items, continuous sync,
 * and inspector modal selection.
 */

import { create } from 'zustand';
import { ProjectSource, EvidenceItem, EvidenceStatus } from '../domain/types';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';
import { ProofGraph } from '../domain/proofGraph';

interface EvidenceState {
  candidateName: string;
  projects: ProjectSource[];
  evidence: EvidenceItem[];
  selectedEvidence: EvidenceItem | null;
  activeFilter: EvidenceStatus | 'all';
  isSyncing: boolean;
  lastSyncedTimestamp: string;
  graph: ProofGraph;

  // Actions
  initialize: () => void;
  selectEvidence: (item: EvidenceItem | null) => void;
  setFilter: (filter: EvidenceStatus | 'all') => void;
  markUserVerification: (evidenceId: string, isAccurate: boolean) => void;
  triggerContinuousSync: () => Promise<void>;
  addCustomProject: (project: ProjectSource, evidenceItems: EvidenceItem[]) => void;
}

export const useEvidenceStore = create<EvidenceState>((set, get) => ({
  candidateName: 'Aarav',
  projects: GOLDEN_PROJECTS,
  evidence: GOLDEN_EVIDENCE,
  selectedEvidence: null,
  activeFilter: 'all',
  isSyncing: false,
  lastSyncedTimestamp: '2026-09-24T12:00:00Z',
  graph: new ProofGraph(GOLDEN_PROJECTS, GOLDEN_EVIDENCE),

  initialize: () => {
    const graph = new ProofGraph(get().projects, get().evidence);
    set({ graph });
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

  triggerContinuousSync: async () => {
    set({ isSyncing: true });
    // Simulate background worker indexing fresh commits
    await new Promise((resolve) => setTimeout(resolve, 1200));

    set((state) => ({
      isSyncing: false,
      lastSyncedTimestamp: new Date().toISOString(),
    }));
  },

  addCustomProject: (project, evidenceItems) => {
    set((state) => {
      const newProjects = [project, ...state.projects];
      const newEvidence = [...evidenceItems, ...state.evidence];
      return {
        projects: newProjects,
        evidence: newEvidence,
        graph: new ProofGraph(newProjects, newEvidence),
      };
    });
  },
}));
