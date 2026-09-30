/**
 * Tests for Evident Landing Screen & Interactive Trip Tutorial
 */

import { useEvidenceStore } from '../store/useEvidenceStore';
import { GOLDEN_PROJECTS, GOLDEN_EVIDENCE } from '../domain/fixtures';

describe('Landing & Interactive Tutorial Workflows', () => {
  beforeEach(() => {
    useEvidenceStore.getState().initialize();
  });

  it('initializes candidate store with 15 verified repositories and authentic evidence', () => {
    const state = useEvidenceStore.getState();
    expect(state.projects.length).toBe(15);
    expect(state.evidence.length).toBeGreaterThanOrEqual(15);
    expect(state.candidateName).toContain('nika619');
  });

  it('tracks tutorial completion state in evidence store', () => {
    const store = useEvidenceStore.getState();
    expect(store.hasSeenTutorial).toBe(false);

    store.setHasSeenTutorial(true);
    expect(useEvidenceStore.getState().hasSeenTutorial).toBe(true);

    store.setHasSeenTutorial(false);
    expect(useEvidenceStore.getState().hasSeenTutorial).toBe(false);
  });

  it('manages onboarding reset for custom GitHub connections', () => {
    const store = useEvidenceStore.getState();
    store.setOnboardingComplete(true);
    expect(useEvidenceStore.getState().hasCompletedOnboarding).toBe(true);

    store.setOnboardingComplete(false);
    expect(useEvidenceStore.getState().hasCompletedOnboarding).toBe(false);
  });

  it('re-initializes proof graph and fixtures cleanly without side effects', () => {
    const store = useEvidenceStore.getState();
    store.initialize();

    expect(store.projects[0].name).toBe('Evident--the-ultimate-help-');
    expect(store.projects[1].name).toBe('nids-project');
    expect(store.evidence.some((e) => e.id === 'ev_evident_merkle')).toBe(true);
    expect(store.evidence.some((e) => e.id === 'ev_nids_rf')).toBe(true);
  });
});
