export const LOG_LEVEL = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

let activeEntitlements: Record<string, any> = {};

const Purchases = {
  configure: jest.fn(async () => {}),
  setLogLevel: jest.fn(async () => {}),
  getOfferings: jest.fn(async () => ({ current: null })),
  purchasePackage: jest.fn(async () => {
    activeEntitlements['proof_pro'] = {
      identifier: 'proof_pro',
      isActive: true,
      willRenew: true,
      expirationDate: '2027-01-01T00:00:00Z',
    };
    return {
      customerInfo: {
        entitlements: {
          active: activeEntitlements,
        },
        originalAppUserId: 'usr_candidate_aarav',
      },
    };
  }),
  restorePurchases: jest.fn(async () => ({
    entitlements: { active: activeEntitlements },
    originalAppUserId: 'usr_candidate_aarav',
  })),
  getCustomerInfo: jest.fn(async () => ({
    entitlements: { active: activeEntitlements },
    originalAppUserId: 'usr_candidate_aarav',
  })),
  addCustomerInfoUpdateListener: jest.fn(() => {}),
  _reset: () => {
    activeEntitlements = {};
  },
};

export default Purchases;
