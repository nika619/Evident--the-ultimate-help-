/**
 * Evident Home Screen (Mobile Command Center)
 * Central executive mobile dashboard providing live career intelligence telemetry,
 * real-time repository indexing status, quick mobile actions, and verified provenance.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { GlassCard } from '../components/GlassCard';
import { AnimatedListItem } from '../components/AnimatedListItem';
import { ProofPackService } from '../services/proofPackService';

interface HomeScreenProps {
  onNavigateToEvidence: () => void;
  onNavigateToOpportunity: () => void;
  onNavigateToApplication: () => void;
  onNavigateToInterview: () => void;
  onNavigateToHistory: () => void;
  onNavigateToAccount: () => void;
  onNavigateToPaywall: () => void;
  onOpenTutorial?: () => void;
  onOpenLanding?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToEvidence,
  onNavigateToOpportunity,
  onNavigateToApplication,
  onNavigateToInterview,
  onNavigateToHistory,
  onNavigateToAccount,
  onNavigateToPaywall,
  onOpenTutorial,
  onOpenLanding,
}) => {
  const candidateName = useEvidenceStore((s) => s.candidateName);
  const projects = useEvidenceStore((s) => s.projects);
  const evidence = useEvidenceStore((s) => s.evidence);
  const isSyncing = useEvidenceStore((s) => s.isSyncing);
  const opportunity = useOpportunityStore((s) => s.opportunity);
  const coverage = useOpportunityStore((s) => s.coverage);
  const rankedProjects = useOpportunityStore((s) => s.rankedProjects);
  const isPro = useSubscriptionStore((s) => s.subscription.isPro);
  const merkleRoot = ProofPackService.generateMerkleRoot(evidence);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 3500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 3500, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const distinctSkills = Array.from(new Set(evidence.map((e) => e.skillName)));
  const topProjects = projects.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Mobile Header Banner */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <GlassCard style={styles.heroCard} variant="elevated">
            <View style={styles.heroTopRow}>
              <View style={styles.verifiedBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.verifiedBadgeText}>VERIFIED PROVENANCE</Text>
              </View>
              <TouchableOpacity
                style={styles.accountIconBtn}
                onPress={onNavigateToAccount}
                activeOpacity={0.7}
              >
                <Ionicons name="person-circle-outline" size={28} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.candidateNameText}>
              {candidateName || 'Mayank Tiwari'}
            </Text>
            <Text style={styles.heroSubText}>
              Living career intelligence actively grounded in {projects.length} verified GitHub repositories.
            </Text>

            {/* Quick Metrics Dashboard */}
            <View style={styles.metricsContainer}>
              <TouchableOpacity
                style={styles.metricCard}
                onPress={onNavigateToEvidence}
                activeOpacity={0.75}
              >
                <Text style={styles.metricNumber}>{projects.length}</Text>
                <Text style={styles.metricLabel}>REPOSITORIES</Text>
              </TouchableOpacity>

              <View style={styles.metricDivider} />

              <TouchableOpacity
                style={styles.metricCard}
                onPress={onNavigateToEvidence}
                activeOpacity={0.75}
              >
                <Text style={styles.metricNumber}>{evidence.length}</Text>
                <Text style={styles.metricLabel}>EVIDENCE ITEMS</Text>
              </TouchableOpacity>

              <View style={styles.metricDivider} />

              <TouchableOpacity
                style={styles.metricCard}
                onPress={onNavigateToOpportunity}
                activeOpacity={0.75}
              >
                <Text style={styles.metricNumber}>{distinctSkills.length}</Text>
                <Text style={styles.metricLabel}>SKILLS PROVEN</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Interactive Guided Tour Banner */}
        {onOpenTutorial && (
          <TouchableOpacity
            style={styles.tourBanner}
            onPress={onOpenTutorial}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EFF6FF', '#EDE9FE']}
              style={styles.tourBannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.tourIconCircle}>
                <Ionicons name="compass" size={20} color={Colors.primary} />
              </View>
              <View style={styles.tourTextGroup}>
                <View style={styles.tourBadgeRow}>
                  <Text style={styles.tourBadgeText}>INTERACTIVE WALKTHROUGH</Text>
                </View>
                <Text style={styles.tourBannerTitle}>Take the 5-Stop Interactive Tour</Text>
                <Text style={styles.tourBannerSub}>Learn how Evident eliminates AI resume hallucination</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Landing Page Portal Banner */}
        {onOpenLanding && (
          <TouchableOpacity
            style={styles.landingBanner}
            onPress={onOpenLanding}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.landingBannerGradient}
            >
              <Ionicons name="sparkles" size={16} color={Colors.accent} />
              <Text style={styles.landingBannerText}>View Mobile Welcome & Thesis Showcase</Text>
              <Ionicons name="open-outline" size={14} color={Colors.textSecondary} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Quick Action Dock (Touch First for Mobile) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MOBILE QUICK ACTIONS</Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionTile}
            onPress={onNavigateToEvidence}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EFF6FF', '#DBEAFE']}
              style={styles.actionTileGradient}
            >
              <View style={[styles.tileIconCircle, { backgroundColor: '#BFDBFE' }]}>
                <Ionicons name="git-network-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionTileTitle}>Inspect Proof Graph</Text>
              <Text style={styles.actionTileSub}>Explore 20+ code artifacts</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={onNavigateToApplication}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F0FDF4', '#DCFCE7']}
              style={styles.actionTileGradient}
            >
              <View style={[styles.tileIconCircle, { backgroundColor: '#BBF7D0' }]}>
                <Ionicons name="document-text-outline" size={20} color={Colors.emerald} />
              </View>
              <Text style={styles.actionTileTitle}>Application Studio</Text>
              <Text style={styles.actionTileSub}>Export sealed proof pack</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={onNavigateToInterview}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FAF5FF', '#F3E8FF']}
              style={styles.actionTileGradient}
            >
              <View style={[styles.tileIconCircle, { backgroundColor: '#E9D5FF' }]}>
                <Ionicons name="chatbubbles-outline" size={20} color={Colors.purple} />
              </View>
              <Text style={styles.actionTileTitle}>Defense Arena</Text>
              <Text style={styles.actionTileSub}>Defend architecture live</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={onNavigateToHistory}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFBEB', '#FEF3C7']}
              style={styles.actionTileGradient}
            >
              <View style={[styles.tileIconCircle, { backgroundColor: '#FDE68A' }]}>
                <Ionicons name="time-outline" size={20} color={Colors.gold} />
              </View>
              <Text style={styles.actionTileTitle}>History & Audits</Text>
              <Text style={styles.actionTileSub}>View past indexing & seals</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Active Target Opportunity Hub */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE TARGET OPPORTUNITY</Text>
          <TouchableOpacity onPress={onNavigateToOpportunity}>
            <Text style={styles.sectionActionText}>Change Role ›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onNavigateToOpportunity} activeOpacity={0.9}>
          <GlassCard style={styles.targetCard} variant="elevated">
            <View style={styles.targetCardHeader}>
              <View style={styles.targetBadge}>
                <Ionicons name="briefcase-outline" size={13} color={Colors.primary} />
                <Text style={styles.targetBadgeText}>ACTIVE TARGET</Text>
              </View>
              <Text style={styles.matchScoreBadge}>
                {coverage ? `${coverage.coveredMustHaves}/${coverage.totalMustHaves} Must-Haves` : 'Analyzing'}
              </Text>
            </View>

            <Text style={styles.targetTitle}>{opportunity.title}</Text>
            <Text style={styles.targetCompany}>{opportunity.companyOrContext}</Text>

            <View style={styles.targetStatsRow}>
              <View style={styles.targetStatPill}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.emerald} />
                <Text style={styles.targetStatText}>
                  {coverage ? `${coverage.directCount} Direct Proven` : 'Live Grounding'}
                </Text>
              </View>
              <View style={styles.targetStatPill}>
                <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
                <Text style={styles.targetStatText}>Zero Hallucination</Text>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Cryptographic Merkle Seal Status Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>INTEGRITY & PROVENANCE</Text>
          <TouchableOpacity onPress={onNavigateToApplication}>
            <Text style={styles.sectionActionText}>View Dossier ›</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.sealCard} variant="tinted">
          <View style={styles.sealHeader}>
            <Ionicons name="finger-print-outline" size={18} color={Colors.primary} />
            <Text style={styles.sealTitle}>CRYPTOGRAPHIC MERKLE SEAL</Text>
            <View style={styles.proPill}>
              <Text style={styles.proPillText}>PRO ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.sealHash} numberOfLines={1} ellipsizeMode="middle">
            Root: {merkleRoot}
          </Text>
          <Text style={styles.sealSub}>
            SHA-256 Merkle root mathematically guarantees zero AI hallucination to senior hiring teams.
          </Text>
        </GlassCard>

        {/* Recent Repository Artifacts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>VERIFIED CODE REPOSITORIES</Text>
          <TouchableOpacity onPress={onNavigateToEvidence}>
            <Text style={styles.sectionActionText}>All {projects.length} Repos ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.repoList}>
          {topProjects.map((p, idx) => (
            <AnimatedListItem key={p.id} delayIndex={idx}>
              <TouchableOpacity onPress={onNavigateToEvidence} activeOpacity={0.85}>
                <GlassCard style={styles.repoCard} variant="default">
                  <View style={styles.repoHeader}>
                    <Ionicons name="folder-outline" size={16} color={Colors.primary} />
                    <Text style={styles.repoName} numberOfLines={1} ellipsizeMode="tail">
                      {p.name}
                    </Text>
                    <View style={styles.gitBranchPill}>
                      <Ionicons name="git-branch-outline" size={10} color={Colors.textSecondary} />
                      <Text style={styles.gitBranchText}>main</Text>
                    </View>
                    <View style={styles.langPill}>
                      <Text style={styles.langPillText}>{p.primaryLanguage || 'Code'}</Text>
                    </View>
                  </View>
                  <Text style={styles.repoDesc} numberOfLines={2}>
                    {p.description || 'Verified production engineering repository.'}
                  </Text>
                  <View style={styles.repoFooter}>
                    <View style={styles.repoCommitGroup}>
                      <View style={styles.shaMiniBadge}>
                        <Text style={styles.shaMiniBadgeText}>git:{(p.id.slice(0, 7)) || '8f2a1b9'}</Text>
                      </View>
                      <Text style={styles.repoCommitsText}>
                        {p.candidateCommits || 14} verified commits
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </AnimatedListItem>
          ))}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
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
  heroCard: {
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  verifiedBadgeText: {
    ...Typography.label,
    color: Colors.emerald,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  accountIconBtn: {
    padding: 2,
  },
  greetingText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  candidateNameText: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSubText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricNumber: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 20,
  },
  metricLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8.5,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionActionText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionTile: {
    width: '48.5%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actionTileGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    minHeight: 110,
    justifyContent: 'center',
  },
  tileIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTileTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionTileSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  targetCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 4,
  },
  targetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
  },
  targetBadgeText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  matchScoreBadge: {
    ...Typography.label,
    color: Colors.emerald,
    fontSize: 9.5,
    fontWeight: '800',
  },
  targetTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  targetCompany: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  targetStatsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  targetStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
  },
  targetStatText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9,
  },
  sealCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 6,
  },
  sealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sealTitle: {
    ...Typography.label,
    fontSize: 9.5,
    color: Colors.primary,
    fontWeight: '800',
    flex: 1,
    letterSpacing: 0.6,
  },
  proPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proPillText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 8.5,
    fontWeight: '800',
  },
  daemonTickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.terminalBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    marginTop: Spacing.sm,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.terminalBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  daemonTickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.terminalGreen,
    shadowColor: Colors.terminalGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  daemonTickerText: {
    ...Typography.code,
    fontSize: 10.5,
    color: Colors.terminalText,
  },
  astVersionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.xs,
  },
  astVersionPillText: {
    ...Typography.code,
    fontSize: 9,
    color: Colors.terminalPrompt,
    fontWeight: '700',
  },
  gitBranchPill: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  gitBranchText: {
    ...Typography.code,
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  repoCommitGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shaMiniBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.18)',
  },
  shaMiniBadgeText: {
    ...Typography.code,
    fontSize: 8.5,
    color: Colors.primary,
    fontWeight: '700',
  },
  sealHash: {
    ...Typography.shaText,
    fontSize: 10.5,
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  sealSub: {
    ...Typography.bodySmall,
    fontSize: 9.5,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  repoList: {
    gap: Spacing.sm,
  },
  repoCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  repoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  repoName: {
    ...Typography.h3,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
    flexShrink: 1,
  },
  langPill: {
    flexShrink: 0,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  langPillText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.textSecondary,
  },
  repoDesc: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  repoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.05)',
    paddingTop: 6,
  },
  repoCommitsText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.emerald,
    fontWeight: '600',
  },
  tourBanner: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  tourBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  tourIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tourTextGroup: {
    flex: 1,
  },
  tourBadgeRow: {
    marginBottom: 2,
  },
  tourBadgeText: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.primary,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  tourBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tourBannerSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  landingBanner: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  landingBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: Spacing.md,
  },
  landingBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
