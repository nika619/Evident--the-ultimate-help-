/**
 * RevenueCat Configuration
 * 
 * Paste your real RevenueCat API keys and project settings here,
 * or configure them via environment variables in .env
 */

export const REVENUECAT_CONFIG = {
  // Your RevenueCat Project ID (from Project Settings -> General)
  projectId: process.env.EXPO_PUBLIC_REVENUECAT_PROJECT_ID || 'evident',

  // Your RevenueCat Public API Keys (from Project Settings -> API Keys)
  apiKeyApple: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || 'appl_evident_shipathon_test',
  apiKeyGoogle: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || 'goog_evident_shipathon_test',

  // Entitlement identifier configured in RevenueCat dashboard (Product Catalog -> Entitlements)
  entitlementId: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID || 'proof_pro',
  fallbackEntitlementId: 'evident_pro',
};
