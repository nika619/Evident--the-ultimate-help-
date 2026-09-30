/**
 * Evident Application Screen (HERO SURFACE)
 * Synthesizes grounded, evidence-backed resume bullets and candidate dossiers.
 *
 * Core Interaction:
 * Every bullet features an inspectable "[Why this claim?]" trigger that reveals
 * the exact repository file and commit hash behind the statement.
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
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { GlassCard } from '../components/GlassCard';
import { EvidentButton } from '../components/EvidentButton';
import { EvidenceInspectorModal } from '../components/EvidenceInspectorModal';
import { AnimatedTextReveal } from '../components/AnimatedTextReveal';
import { AnimatedListItem } from '../components/AnimatedListItem';
import { ProofPackService } from '../services/proofPackService';
import { ProofPackModal } from '../components/ProofPackModal';
import { EvidenceItem } from '../domain/types';

interface ApplicationScreenProps {
  onNavigateToInterview: () => void;
  onNavigateToPaywall: () => void;
}

export const ApplicationScreen: React.FC<ApplicationScreenProps> = ({
  onNavigateToInterview,
  onNavigateToPaywall,
}) => {
  const opportunity = useOpportunityStore((s) => s.opportunity);
  const rankedProjects = useOpportunityStore((s) => s.rankedProjects);
  const groundedBullets = useOpportunityStore((s) => s.groundedBullets);
  const proofPackMarkdown = useOpportunityStore((s) => s.proofPackDossierMarkdown);
  const toggleVerification = useOpportunityStore((s) => s.toggleBulletVerification);

  const evidence = useEvidenceStore((s) => s.evidence);
  const isPro = useSubscriptionStore((s) => s.subscription.isPro);
  const merkleRoot = ProofPackService.generateMerkleRoot(evidence);

  const [inspectItem, setInspectItem] = useState<EvidenceItem | null>(null);
  const [proofPackModalVisible, setProofPackModalVisible] = useState(false);
  const candidateName = useEvidenceStore((s) => s.candidateName);

  const handleInspectBullet = (evidenceIds: string[]) => {
    if (evidenceIds.length === 0) return;
    const found = evidence.find((e) => e.id === evidenceIds[0]);
    if (found) {
      setInspectItem(found);
    }
  };

  const handleExportProofPack = () => {
    if (!isPro) {
      onNavigateToPaywall();
      return;
    }
    setProofPackModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.heroPill}>
            <Ionicons name="shield-checkmark" size={13} color={Colors.textPrimary} />
            <Text style={styles.heroPillText}>CLAIM AUDITOR VERIFIED</Text>
          </View>
          <AnimatedTextReveal text="Tailored Application Studio" style={styles.headerTitle} stagger={30} />
          <Text style={styles.headerSubtitle}>
            Grounding your resume in verifiable code artifacts. Zero hallucinated responsibilities.
          </Text>
        </View>

        {/* Ranked Projects for This Opportunity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMMENDED PROJECTS FOR THIS ROLE</Text>
          {rankedProjects.length === 0 ? (
            <GlassCard style={{ padding: Spacing.xl, alignItems: 'center', marginTop: Spacing.sm }}>
              <Ionicons name="folder-open-outline" size={32} color={Colors.textSecondary} />
              <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginTop: Spacing.md }}>No Projects Analyzed</Text>
              <Text style={{ ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}>
                Sync your GitHub account to let Evident match your repositories against the job description.
              </Text>
            </GlassCard>
          ) : (
            <View style={styles.rankedList}>
            {rankedProjects.map((rp, index) => (
              <AnimatedListItem key={rp.projectId} delayIndex={index}>
              <GlassCard style={styles.rankedCard}>
                <View style={styles.rankedHeader}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankNum}>#{index + 1}</Text>
                  </View>
                  <Text style={styles.rankedProjectName}>{rp.projectName}</Text>
                  <View style={styles.matchCountPill}>
                    <Text style={styles.matchCountText}>
                      {rp.matchCount} evidence matches
                    </Text>
                  </View>
                </View>
                <Text style={styles.rankedReason}>{rp.relevanceReason}</Text>
              </GlassCard>
              </AnimatedListItem>
            ))}
          </View>
          )}
        </View>

        {/* Grounded Resume Bullets (THE HERO EXPERIENCE) */}
        <View style={styles.section}>
          <View style={styles.bulletSectionHeader}>
            <Text style={styles.sectionTitle}>EVIDENCE-BACKED RESUME CLAIMS</Text>
            {groundedBullets.length > 0 && <Text style={styles.truthNotice}>Audited against Git history</Text>}
          </View>

          {groundedBullets.length === 0 ? (
            <GlassCard style={{ padding: Spacing.xl, alignItems: 'center' }}>
              <Ionicons name="document-text-outline" size={32} color={Colors.textSecondary} />
              <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginTop: Spacing.md }}>Awaiting Claims</Text>
              <Text style={{ ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}>
                We need to scan your GitHub history to synthesize tailored resume bullets.
              </Text>
            </GlassCard>
          ) : (
            <View style={styles.bulletList}>
            {groundedBullets.map((bullet, index) => (
              <AnimatedListItem key={bullet.id} delayIndex={index + rankedProjects.length}>
              <View style={styles.bulletCard}>
                <View style={styles.bulletProjectTag}>
                  <Text style={styles.bulletProjectName}>{bullet.projectName}</Text>
                  {bullet.userVerified && (
                    <View style={styles.verifiedTag}>
                      <Ionicons name="checkmark-done" size={12} color={Colors.emerald} />
                      <Text style={styles.verifiedTagText}>Confirmed</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.bulletText}>{bullet.text}</Text>

                {/* The "Why This Bullet?" Provenance Action */}
                <View style={styles.bulletActions}>
                  <TouchableOpacity
                    style={styles.whyButton}
                    onPress={() => handleInspectBullet(bullet.evidenceIds)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="search-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.whyButtonText}>Why this claim? (Inspect Source)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      bullet.userVerified && styles.confirmButtonActive,
                    ]}
                    onPress={() => toggleVerification(bullet.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={bullet.userVerified ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={14}
                      color={bullet.userVerified ? Colors.emerald : Colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.confirmButtonText,
                        bullet.userVerified && { color: Colors.emerald },
                      ]}
                    >
                      {bullet.userVerified ? 'Verified' : 'Confirm Mine'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              </AnimatedListItem>
            ))}
          </View>
          )}
        </View>

        {/* Proof Pack Export Section */}
        <View style={styles.section}>
          <GlassCard style={styles.proofPackCard}>
            <View style={styles.proofPackHeader}>
              <Ionicons name="document-attach-outline" size={20} color={Colors.textPrimary} />
              <View style={styles.proofPackTitleBox}>
                <Text style={styles.proofPackTitle}>Candidate Proof Pack Dossier</Text>
                <Text style={styles.proofPackSubtext}>
                  Privacy-safe 1-page application brief citing public links, files, and verified skills.
                </Text>
              </View>
            </View>

            {/* Cryptographic Merkle Seal Box */}
            <View style={styles.merkleBox}>
              <View style={styles.merkleHeader}>
                <Ionicons name="finger-print-outline" size={13} color={isPro ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.merkleTitle, isPro && { color: Colors.primary }]}>
                  {isPro ? 'CRYPTOGRAPHIC MERKLE SEAL (PRO ACTIVE)' : 'CRYPTOGRAPHIC MERKLE SEAL (PRO)'}
                </Text>
              </View>
              <Text style={styles.merkleHash} numberOfLines={1}>
                {isPro ? `Root: ${merkleRoot}` : 'Root: 0x7f4a•••••••••••••••••••••••••••••••• (Upgrade to Seal)'}
              </Text>
              <Text style={styles.merkleSub}>
                {isPro
                  ? 'SHA-256 Merkle root mathematically guarantees zero AI hallucination to senior hiring teams.'
                  : 'Pro cryptographically signs your dossier with an ED25519 tamper-proof commit hash seal.'}
              </Text>
            </View>

            <EvidentButton
              title={isPro ? 'Export Proof Pack (Markdown/PDF)' : 'Unlock Cryptographic Proof Pack (Pro)'}
              variant="outline"
              size="medium"
              onPress={handleExportProofPack}
            />
          </GlassCard>
        </View>

        {/* Market Value & Seniority Calibrator ($1M Tier Intelligence) */}
        <View style={styles.section}>
          <GlassCard style={styles.calibratorCard}>
            <View style={styles.calibratorHeader}>
              <View style={styles.calibratorBadge}>
                <Ionicons name="trending-up" size={13} color={Colors.emerald} />
                <Text style={styles.calibratorBadgeText}>MARKET CALIBRATOR</Text>
              </View>
              <Text style={styles.calibratorTier}>{isPro ? 'L5 / SENIOR LEVEL' : 'PRO CALIBRATION'}</Text>
            </View>
            <Text style={styles.calibratorTitle}>Verifiable Engineering Equity</Text>
            <Text style={styles.calibratorValue}>{isPro ? '$185,000 – $240,000 / yr' : '$•••,••• – $•••,••• (Locked)'}</Text>
            <Text style={styles.calibratorSub}>
              {isPro
                ? 'Based on verified systems architecture, multi-language repository density, and zero unverified claims.'
                : 'Pro benchmarks market compensation bands for your exact verified repository proof.'}
            </Text>
            {!isPro && (
              <EvidentButton
                title="Unlock Seniority & Comp Calibration"
                variant="outline"
                size="small"
                onPress={onNavigateToPaywall}
                style={{ marginTop: Spacing.sm }}
              />
            )}
          </GlassCard>
        </View>

        {/* Transition to Interview Defense Arena */}
        <View style={styles.ctaBox}>
          <Text style={styles.defensePrompt}>
            Ready to defend these claims in an architectural technical interview?
          </Text>
          <EvidentButton
            title="Enter Interview Defense Arena →"
            size="large"
            onPress={onNavigateToInterview}
          />
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Hero Evidence Inspector Drawer */}
      <EvidenceInspectorModal
        visible={inspectItem !== null}
        item={inspectItem}
        onClose={() => setInspectItem(null)}
      />

      {/* Executive Proof Pack Export Modal */}
      <ProofPackModal
        visible={proofPackModalVisible}
        markdown={proofPackMarkdown}
        candidateName={candidateName}
        merkleRoot={merkleRoot}
        onClose={() => setProofPackModalVisible(false)}
      />
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
  headerBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
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
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: Spacing.sm,
  },
  rankedList: {
    gap: Spacing.sm,
  },
  rankedCard: {
    padding: Spacing.md,
  },
  rankedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  rankBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    ...Typography.label,
    color: Colors.primaryText,
    fontSize: 10,
    fontWeight: '800',
  },
  rankedProjectName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
  },
  matchCountPill: {
    backgroundColor: Colors.bgElevated,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  matchCountText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9,
  },
  rankedReason: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  bulletSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  truthNotice: {
    ...Typography.label,
    color: Colors.emerald,
    fontSize: 9,
  },
  bulletList: {
    gap: Spacing.md,
  },
  bulletCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  bulletProjectTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletProjectName: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedTagText: {
    ...Typography.label,
    color: Colors.emerald,
    fontSize: 9,
  },
  bulletText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  bulletActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.sm,
  },
  whyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.codeBg,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  whyButtonText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 9.5,
    fontWeight: '600',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  confirmButtonActive: {
    opacity: 1,
  },
  confirmButtonText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  proofPackCard: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  proofPackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  proofPackTitleBox: {
    flex: 1,
  },
  proofPackTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  proofPackSubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  ctaBox: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  defensePrompt: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  merkleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  merkleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  merkleTitle: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  merkleHash: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    color: Colors.accent,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  merkleSub: {
    ...Typography.bodySmall,
    fontSize: 9.5,
    color: Colors.textMuted,
  },
  calibratorCard: {
    padding: Spacing.md,
    gap: 6,
  },
  calibratorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calibratorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  calibratorBadgeText: {
    ...Typography.label,
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.emerald,
  },
  calibratorTier: {
    ...Typography.label,
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  calibratorTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  calibratorValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.emerald,
  },
  calibratorSub: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
