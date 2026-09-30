/**
 * Evident Paywall Screen (RevenueCat Pro)
 * Value Proposition: Living Career Memory & Continuous Sync.
 * Integrates react-native-purchases with Test Store support.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { GlassCard } from '../components/GlassCard';
import { EvidentButton } from '../components/EvidentButton';
import { PlanPackage } from '../services/purchaseService';

interface PaywallScreenProps {
  onClose: () => void;
}

const PRO_BENEFITS = [
  {
    icon: 'sync-circle-outline',
    title: 'Living Career Memory & Continuous Sync',
    desc: 'Continuously indexes your new commits, branches, and repositories as you write code.',
  },
  {
    icon: 'shield-half-outline',
    title: 'FAANG Bar-Raiser Blindspot Radar',
    desc: 'Exposes concurrency traps, race-condition vectors, and scaling bottlenecks before your interviewers find them.',
  },
  {
    icon: 'finger-print-outline',
    title: 'Cryptographic Merkle Provenance Seals',
    desc: 'Generate SHA-256 tamper-proof hash chains that prove zero AI hallucination to senior hiring committees.',
  },
  {
    icon: 'trending-up-outline',
    title: 'L5/L6 Seniority & Salary Calibrator',
    desc: 'Benchmarks your verified repository proof against top-tier tech compensation bands ($180k–$275k).',
  },
  {
    icon: 'document-attach-outline',
    title: 'Executive Proof Pack Dossier Exports',
    desc: 'Export privacy-safe 1-page candidate dossiers for recruiters and engineering directors.',
  },
];

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ onClose }) => {
  const subscription = useSubscriptionStore((s) => s.subscription);
  const offerings = useSubscriptionStore((s) => s.offerings);
  const isPurchasing = useSubscriptionStore((s) => s.isPurchasing);
  const purchasePlan = useSubscriptionStore((s) => s.purchasePlan);
  const restorePurchases = useSubscriptionStore((s) => s.restorePurchases);
  const resetToFree = useSubscriptionStore((s) => s.resetToFree);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('evident_pro_annual');

  const selectedPlan =
    offerings.find((o) => o.identifier === selectedPlanId) || offerings[0];

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    const success = await purchasePlan(selectedPlan);
    if (success) {
      Alert.alert(
        'Welcome to Evident Pro ✨',
        'Living Career Memory and deep architectural defense are now active.',
        [{ text: 'Continue', onPress: onClose }]
      );
    }
  };

  const handleRestore = async () => {
    const isPro = await restorePurchases();
    if (isPro) {
      Alert.alert('Purchases Restored', 'Your Evident Pro entitlements are active.', [
        { text: 'Done', onPress: onClose },
      ]);
    } else {
      Alert.alert('No Subscription Found', 'No active subscription was found to restore.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBox}>
          <View style={styles.heroPill}>
            <Ionicons name="sparkles" size={13} color={Colors.textPrimary} />
            <Text style={styles.heroPillText}>REVENUECAT PRO TIER</Text>
          </View>
          <Text style={styles.heroTitle}>Never Build An Application From Scratch Again</Text>
          <Text style={styles.heroSubtitle}>
            Evident Pro turns your ongoing GitHub activity into living career memory with automated provenance updates.
          </Text>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsSection}>
          {PRO_BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitIconBox}>
                <Ionicons name={b.icon as any} size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.benefitTextBox}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Offerings */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingHeaderTitle}>SELECT SUBSCRIPTION PASS</Text>

          <View style={styles.planCardsRow}>
            {offerings.map((pkg) => {
              const isSelected = pkg.identifier === selectedPlanId;
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.planCard, isSelected && styles.planCardActive]}
                  onPress={() => setSelectedPlanId(pkg.identifier)}
                  activeOpacity={0.8}
                >
                  {pkg.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>SAVE 48%</Text>
                    </View>
                  )}
                  <Text style={styles.planTitle}>{pkg.title}</Text>
                  <Text style={styles.planPrice}>{pkg.priceString}</Text>
                  <Text style={styles.planDesc}>{pkg.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Purchase Action Button */}
        <View style={styles.actionBox}>
          <EvidentButton
            title={
              subscription.isPro
                ? 'Evident Pro Active (Manage)'
                : `Activate Pro Pass — ${selectedPlan?.priceString || '$49.99/yr'}`
            }
            loading={isPurchasing}
            size="large"
            onPress={handlePurchase}
          />

          <View style={styles.subActionRow}>
            <TouchableOpacity onPress={handleRestore} activeOpacity={0.7}>
              <Text style={styles.subActionText}>Restore Purchases</Text>
            </TouchableOpacity>

            <Text style={styles.dot}>•</Text>

            <TouchableOpacity onPress={resetToFree} activeOpacity={0.7}>
              <Text style={[styles.subActionText, { color: Colors.amber }]}>
                Reset Demo to Free Tier
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.testStoreNotice}>
            <Ionicons name="flask-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.testStoreNoticeText}>
              Powered natively by RevenueCat Test Store (`react-native-purchases`). Zero App Store credentials required.
            </Text>
          </View>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingTop: Spacing.md,
  },
  closeBtn: {
    padding: 6,
  },
  heroBox: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroPillText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: Spacing.md,
  },
  benefitsSection: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  benefitIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  benefitTextBox: {
    flex: 1,
  },
  benefitTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  benefitDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  pricingSection: {
    marginTop: Spacing.xl,
  },
  pricingHeaderTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: Spacing.sm,
  },
  planCardsRow: {
    gap: Spacing.sm,
  },
  planCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    position: 'relative',
  },
  planCardActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: Colors.bgElevated,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
  },
  popularBadgeText: {
    ...Typography.label,
    color: Colors.primaryText,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  planPrice: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  planDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  actionBox: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  subActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  subActionText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  dot: {
    color: Colors.textMuted,
  },
  testStoreNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
  },
  testStoreNoticeText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 13,
  },
});
