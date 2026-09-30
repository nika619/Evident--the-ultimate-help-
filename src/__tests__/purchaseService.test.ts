/**
 * Tests for Evident PurchaseService (RevenueCat Integration)
 */

import { PurchaseService, EVIDENT_OFFERINGS } from '../services/purchaseService';

describe('PurchaseService (RevenueCat)', () => {
  beforeEach(async () => {
    await PurchaseService.resetToFreeTier();
  });

  it('initializes with default free tier state and Test Store flag', async () => {
    const state = await PurchaseService.getSubscriptionState();

    expect(state.isPro).toBe(false);
    expect(state.activeTier).toBe('free');
    expect(state.isTestStore).toBe(true);
    expect(state.customerUserId).toBeDefined();
  });

  it('exposes annual and monthly offerings with living career memory positioning', () => {
    expect(EVIDENT_OFFERINGS.length).toBe(2);

    const annual = EVIDENT_OFFERINGS.find((o) => o.tier === 'evident_pro_annual');
    expect(annual).toBeDefined();
    expect(annual!.isPopular).toBe(true);
    expect(annual!.priceString).toContain('49.99');

    const monthly = EVIDENT_OFFERINGS.find((o) => o.tier === 'evident_pro_monthly');
    expect(monthly).toBeDefined();
    expect(monthly!.priceString).toContain('7.99');
  });

  it('activates Pro entitlement upon Test Store package purchase', async () => {
    const annualPkg = EVIDENT_OFFERINGS[0];
    const updatedState = await PurchaseService.purchasePlan(annualPkg);

    expect(updatedState.isPro).toBe(true);
    expect(updatedState.activeTier).toBe('evident_pro_annual');
    expect(updatedState.expirationDate).toBeDefined();

    // Verify persistence
    const persisted = await PurchaseService.getSubscriptionState();
    expect(persisted.isPro).toBe(true);
  });

  it('restores active subscription correctly', async () => {
    // First purchase
    await PurchaseService.purchasePlan(EVIDENT_OFFERINGS[0]);

    // Restore
    const restored = await PurchaseService.restorePurchases();
    expect(restored.isPro).toBe(true);
  });

  it('resets cleanly back to free tier for judge testing convenience', async () => {
    await PurchaseService.purchasePlan(EVIDENT_OFFERINGS[0]);
    const reset = await PurchaseService.resetToFreeTier();

    expect(reset.isPro).toBe(false);
    expect(reset.activeTier).toBe('free');
  });
});
