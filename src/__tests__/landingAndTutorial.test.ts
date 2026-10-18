/**
 * Tests for Evident Landing Screen & Interactive Tutorial Workflows
 */

import { useEvidenceStore } from '../store/useEvidenceStore';

describe('Landing & Interactive Tutorial Workflows', () => {
  beforeEach(() => {
    useEvidenceStore.getState().initialize();
  });

  it('initializes candidate store with demo repositories and authentic evidence', () => {
    const state = useEvidenceStore.getState();
    expect(state.projects.length).toBe(3);
    expect(state.evidence.length).toBeGreaterThanOrEqual(8);
    expect(state.isUsingDemoData).toBe(true);
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

    expect(store.projects[0].name).toBe('evident');
    expect(store.projects[1].name).toBe('nids-project');
    expect(store.evidence.some((e) => e.id === 'demo_ev_proofpack')).toBe(true);
    expect(store.evidence.some((e) => e.id === 'demo_ev_ml')).toBe(true);
  });
});
