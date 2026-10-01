/**
 * Evident Subscription Store (RevenueCat Integration)
 * Manages Pro entitlement states, plan packages, Test Store purchases,
 * and restore flows.
 */

import { create } from 'zustand';
import { SubscriptionState } from '../domain/types';
import { PurchaseService, PlanPackage, EVIDENT_OFFERINGS } from '../services/purchaseService';

interface SubscriptionStoreState {
  subscription: SubscriptionState;
  offerings: PlanPackage[];
  isLoading: boolean;
  isPurchasing: boolean;

  // Actions
  initializeSubscription: () => Promise<void>;
  purchasePlan: (pkg: PlanPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  resetToFree: () => Promise<void>;
  setProTier: (isPro: boolean) => Promise<void>;
  toggleProTier: () => Promise<boolean>;
}

export const useSubscriptionStore = create<SubscriptionStoreState>((set, get) => ({
  subscription: {
    isPro: true,
    activeTier: 'evident_pro_annual',
    expirationDate: '2027-09-30T12:00:00Z',
    customerUserId: 'usr_candidate_nika619',
    isTestStore: true,
  },
  offerings: EVIDENT_OFFERINGS,
  isLoading: false,
  isPurchasing: false,

  initializeSubscription: async () => {
    set({ isLoading: true });
    await PurchaseService.initialize((isPro) => {
      set((s) => ({
        subscription: {
          ...s.subscription,
          isPro,
          activeTier: isPro ? 'evident_pro_annual' : 'free',
        },
      }));
    });
    const liveOfferings = await PurchaseService.fetchLiveOfferings();
    const state = await PurchaseService.getSubscriptionState();
    set({ subscription: state, offerings: liveOfferings, isLoading: false });
  },

  purchasePlan: async (pkg: PlanPackage) => {
    set({ isPurchasing: true });
    try {
      const updated = await PurchaseService.purchasePlan(pkg);
      set({ subscription: updated, isPurchasing: false });
      return true;
    } catch {
      set({ isPurchasing: false });
      return false;
    }
  },

  restorePurchases: async () => {
    set({ isLoading: true });
    try {
      const restored = await PurchaseService.restorePurchases();
      set({ subscription: restored, isLoading: false });
      return restored.isPro;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  resetToFree: async () => {
    const updated = await PurchaseService.resetToFreeTier();
    set({ subscription: updated });
  },

  setProTier: async (isPro: boolean) => {
    if (isPro) {
      const updated = await PurchaseService.purchasePlan(EVIDENT_OFFERINGS[0]);
      set({ subscription: updated });
    } else {
      const updated = await PurchaseService.resetToFreeTier();
      set({ subscription: updated });
    }
  },

  toggleProTier: async () => {
    const current = get().subscription.isPro;
    if (current) {
      const updated = await PurchaseService.resetToFreeTier();
      set({ subscription: updated });
      return false;
    } else {
      const updated = await PurchaseService.purchasePlan(EVIDENT_OFFERINGS[0]);
      set({ subscription: updated });
      return true;
    }
  },
}));

