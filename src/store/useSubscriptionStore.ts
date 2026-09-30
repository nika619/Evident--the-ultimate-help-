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
}

export const useSubscriptionStore = create<SubscriptionStoreState>((set) => ({
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
    await PurchaseService.initialize();
    const state = await PurchaseService.getSubscriptionState();
    set({ subscription: state, isLoading: false });
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
}));
