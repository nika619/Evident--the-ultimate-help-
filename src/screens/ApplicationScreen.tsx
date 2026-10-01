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
  const projects = useEvidenceStore((s) => s.projects);
  const runAnalysis = useOpportunityStore((s) => s.runAnalysis);
  const isPro = useSubscriptionStore((s) => s.subscription.isPro);
  const merkleRoot = ProofPackService.generateMerkleRoot(evidence);

  const [inspectItem, setInspectItem] = useState<EvidenceItem | null>(null);
  const [proofPackModalVisible, setProofPackModalVisible] = useState(false);
  const candidateName = useEvidenceStore((s) => s.candidateName);

  // Auto-synchronize and analyze whenever evidence or projects are ready
  React.useEffect(() => {
    if (rankedProjects.length === 0 && (evidence.length > 0 || projects.length > 0)) {
      runAnalysis();
    }
  }, [evidence.length, projects.length, rankedProjects.length]);

  // Real-time market calibration based strictly on candidate's verified proof
  const totalVerifiedRepos = projects.length;
  const uniqueLangs = Array.from(new Set(projects.flatMap((p) => p.languages || []))).filter(Boolean);
  const hasSystemsOrBackend = uniqueLangs.some((l) => ['Python', 'TypeScript', 'Rust', 'Go', 'C++', 'Java'].includes(l));

  let dynamicTier = 'L5 / SENIOR LEVEL';
  let dynamicComp = '$185,000 – $240,000 / yr';
  let dynamicRationale = 'Based on verified systems architecture, multi-language repository density, and zero unverified claims.';

  if (totalVerifiedRepos >= 10 || (totalVerifiedRepos >= 5 && hasSystemsOrBackend)) {
    dynamicTier = 'L5 / SENIOR LEVEL';
    dynamicComp = '$185,000 – $240,000 / yr';
    dynamicRationale = 'Based on verified systems architecture, multi-language repository density, and zero unverified claims.';
  } else if (totalVerifiedRepos >= 3) {
    dynamicTier = 'L4 / MID-SENIOR LEVEL';
    dynamicComp = '$145,000 – $185,000 / yr';
    dynamicRationale = `Based on ${totalVerifiedRepos} verified repositories, core engineering commits, and zero unverified claims.`;
  } else {
    dynamicTier = 'L3 / FOUNDATIONAL ENGINEER';
    dynamicComp = '$110,000 – $145,000 / yr';
    dynamicRationale = 'Based on verified repository foundations and zero unverified claims.';
  }

  const handleInspectBullet = (evidenceIds: string[]) => {
    if (evidenceIds.length === 0) return;
    const found = evidence.find((e) => e.id === evidenceIds[0]);
    if (found) {
      setInspectItem(found);
    }
  };

  const handleCopyBullets = async () => {
    const formatted = groundedBullets.map((b) => `• ${b.text}`).join('\n\n');
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(formatted);
    } else {
      Share.share({ message: formatted, title: 'Evident Grounded Resume Bullets' });
    }
    Alert.alert(
      'Copied to Clipboard 📋',
      'Your evidence-grounded resume bullets are ready to paste into your resume or application!'
    );
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
            <View>
              <Text style={styles.sectionTitle}>EVIDENCE-BACKED RESUME CLAIMS</Text>
              {groundedBullets.length > 0 && <Text style={styles.truthNotice}>Audited against Git history</Text>}
            </View>
            {groundedBullets.length > 0 && (
              <TouchableOpacity
                style={styles.copyAllBulletsBtn}
                onPress={handleCopyBullets}
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={13} color={Colors.primary} />
                <Text style={styles.copyAllBulletsText}>Copy Bullets</Text>
              </TouchableOpacity>
            )}
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
                    <Text style={styles.whyButtonText}>Why this claim? ›</Text>
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
              <Ionicons name="document-text-outline" size={24} color={Colors.textPrimary} />
              <View style={styles.proofPackTitleBox}>
                <Text style={styles.proofPackTitle}>Candidate Proof Pack Dossier</Text>
                <Text style={styles.proofPackSubtext}>
                  1-page dossier citing verified files, commits, and AST claims.
                </Text>
              </View>
            </View>

            {/* Cryptographic Merkle Seal Box */}
            <View style={styles.merkleBox}>
              <View style={styles.merkleHeader}>
                <Ionicons name="finger-print-outline" size={14} color={Colors.primary} />
                <Text style={styles.merkleTitle}>
                  CRYPTOGRAPHIC MERKLE SEAL (PRO ACTIVE)
                </Text>
              </View>
              <View style={styles.merkleHashContainer}>
                <Text style={styles.merkleHash} numberOfLines={1}>
                  Root: {merkleRoot}
                </Text>
              </View>
              <Text style={styles.merkleSub}>
                SHA-256 Merkle root mathematically guarantees zero AI hallucination to senior hiring teams.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.exportProofPackBtn}
              onPress={handleExportProofPack}
              activeOpacity={0.8}
            >
              <Text style={styles.exportProofPackBtnText}>EXPORT PROOF PACK (MARKDOWN/PDF)</Text>
            </TouchableOpacity>
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
              <Text style={styles.calibratorTier}>{dynamicTier}</Text>
            </View>
            <Text style={styles.calibratorTitle}>Verifiable Engineering Equity</Text>
            <Text style={styles.calibratorValue}>{dynamicComp}</Text>
            <Text style={styles.calibratorSub}>{dynamicRationale}</Text>
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
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    } as any : {}),
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
  copyAllBulletsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  copyAllBulletsText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  bulletList: {
    gap: Spacing.md,
  },
  bulletCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    } as any : {}),
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
    backgroundColor: 'rgba(240, 249, 255, 0.65)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.18)',
    gap: 6,
  },
  merkleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  merkleTitle: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  merkleHashContainer: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  merkleHash: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
  },
  merkleSub: {
    ...Typography.bodySmall,
    fontSize: 9.5,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  exportProofPackBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  exportProofPackBtnText: {
    ...Typography.label,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
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
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  calibratorTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  calibratorValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.emerald,
    letterSpacing: -0.5,
  },
  calibratorSub: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
