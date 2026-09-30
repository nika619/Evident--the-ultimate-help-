/**
 * Evident Evidence Screen (Home)
 * Displays the candidate's body of work, evidence metrics, connected repositories,
 * filterable evidence list, and entry points into Graph Explorer and Opportunity Matching.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { GlassCard } from '../components/GlassCard';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { EvidenceInspectorModal } from '../components/EvidenceInspectorModal';
import { InteractiveGraphExplorer } from '../components/InteractiveGraphExplorer';
import { AnimatedListItem } from '../components/AnimatedListItem';
import { EvidenceItem, EvidenceStatus } from '../domain/types';

interface EvidenceScreenProps {
  onNavigateToOpportunity: () => void;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({
  onNavigateToOpportunity,
}) => {
  const projects = useEvidenceStore((s) => s.projects);
  const evidence = useEvidenceStore((s) => s.evidence);
  const candidateName = useEvidenceStore((s) => s.candidateName);
  const activeFilter = useEvidenceStore((s) => s.activeFilter);
  const setFilter = useEvidenceStore((s) => s.setFilter);
  const triggerSync = useEvidenceStore((s) => s.triggerContinuousSync);
  const isSyncing = useEvidenceStore((s) => s.isSyncing);

  const [inspectItem, setInspectItem] = useState<EvidenceItem | null>(null);
  const [graphModalVisible, setGraphModalVisible] = useState<boolean>(false);
  const [githubUser, setGithubUser] = useState<string>('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    Animated.stagger(150, [
      Animated.timing(fadeAnim1, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeAnim2, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeAnim3, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const distinctSkills = Array.from(new Set(evidence.map((e) => e.skillName)));

  const filteredEvidence =
    activeFilter === 'all'
      ? evidence
      : evidence.filter((e) => e.evidenceStatus === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Telemetry Card */}
        <Animated.View style={{ opacity: fadeAnim1, transform: [{ translateY: fadeAnim1.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <LinearGradient
            colors={['#E0F2FE', '#F0FDF4', Colors.bgSurface]}
            locations={[0, 0.5, 1]}
            style={styles.heroSection}
          >
            <Animated.View style={[styles.glowOrbCyan, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.glowOrbViolet, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.candidateBadge}>
            <Text style={styles.candidateGreeting}>
              {candidateName ? `CANDIDATE: ${candidateName.toUpperCase()}` : 'CONNECT A CANDIDATE'}
            </Text>
          </View>
          <Text style={styles.heroTitle}>Living Career</Text>
          <Text style={styles.heroTitleHighlight}>Intelligence.</Text>
          <Text style={styles.heroSubtitle}>
            Your repositories, commits, and source files mapped into verifiable technical provenance.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{evidence.length}</Text>
              <Text style={styles.metricLabel}>EVIDENCE ITEMS</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{distinctSkills.length}</Text>
              <Text style={styles.metricLabel}>SKILLS PROVEN</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{projects.length}</Text>
              <Text style={styles.metricLabel}>REPOSITORIES</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.heroActionRow}>
            <View style={styles.githubInputContainer}>
              <Ionicons name="logo-github" size={14} color={Colors.textSecondary} />
              <TextInput
                style={styles.githubInput}
                value={githubUser}
                onChangeText={setGithubUser}
                placeholder="GitHub Username or URL"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.syncBtn}
              onPress={() => {
                if (githubUser.trim()) {
                  triggerSync(githubUser);
                }
              }}
              disabled={isSyncing}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSyncing ? 'refresh' : 'sync-outline'}
                size={15}
                color={Colors.textSecondary}
              />
              <Text style={styles.syncBtnText}>
                {isSyncing ? 'Scanning...' : 'Sync Git'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.graphExplorerBtn}
            onPress={() => setGraphModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="git-network-outline" size={16} color={Colors.textPrimary} />
            <Text style={styles.graphExplorerText}>Explore Evidence Graph</Text>
          </TouchableOpacity>
        </LinearGradient>
        </Animated.View>

        {/* What are you applying for? CTA Card */}
        <Animated.View style={{ opacity: fadeAnim2, transform: [{ translateY: fadeAnim2.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <TouchableOpacity
            onPress={onNavigateToOpportunity}
            activeOpacity={0.85}
            style={{ marginTop: Spacing.md }}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F1F5F9']}
              style={styles.applyPromptCard}
            >
            <View style={styles.applyPromptContent}>
              <View style={styles.promptBadge}>
                <Text style={styles.promptBadgeText}>TARGET MATCHING</Text>
              </View>
              <Text style={styles.applyPromptTitle}>What are you applying for?</Text>
              <Text style={styles.applyPromptSubtext}>
                Paste any internship or job description to match against your actual code.
              </Text>
            </View>
            <View style={styles.applyArrow}>
              <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        </Animated.View>

        {/* Connected Repositories Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim3, transform: [{ translateY: fadeAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.sectionTitle}>CONNECTED REPOSITORIES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.repoScroll}
          >
            {projects.map((proj) => (
              <GlassCard key={proj.id} style={styles.repoCard}>
                <View style={styles.repoCardHeader}>
                  <Text style={styles.repoName}>{proj.name}</Text>
                  <Text style={styles.repoLang}>{proj.primaryLanguage}</Text>
                </View>
                <Text style={styles.repoDesc} numberOfLines={2}>
                  {proj.description}
                </Text>
                <View style={styles.repoStats}>
                  <Text style={styles.repoStatItem}>
                    <Ionicons name="git-commit-outline" size={12} color={Colors.textSecondary} />{' '}
                    {proj.candidateCommits}/{proj.totalCommits} commits
                  </Text>
                  <Text style={styles.repoStatItem}>
                    {proj.evidenceIds.length} claims
                  </Text>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Evidence Items Section */}
        <View style={styles.section}>
          <View style={styles.evidenceSectionHeader}>
            <Text style={styles.sectionTitle}>EXTRACTED SOURCE EVIDENCE</Text>
            <Text style={styles.itemCountText}>{filteredEvidence.length} items</Text>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {(['all', 'direct', 'supported', 'partial'] as const).map((filter) => {
              const isSelected = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextActive,
                    ]}
                  >
                    {filter === 'all' ? 'All Signals' : filter.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Evidence Cards List */}
          <View style={styles.evidenceList}>
            {filteredEvidence.map((ev, index) => (
              <AnimatedListItem key={ev.id} delayIndex={index}>
                <TouchableOpacity
                  style={styles.evidenceCard}
                  onPress={() => setInspectItem(ev)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                  <Text style={styles.evidenceSkill}>{ev.skillName}</Text>
                  <EvidenceBadge status={ev.evidenceStatus} />
                </View>

                <Text style={styles.evidenceClaim}>{ev.claim}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.sourcePill}>
                    <Ionicons name="folder-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.sourceText}>{ev.projectName}</Text>
                  </View>

                  {ev.sourceLocation.filePath && (
                    <View style={styles.filePill}>
                      <Ionicons name="code-slash" size={11} color={Colors.textSecondary} />
                      <Text style={styles.fileText}>
                        {ev.sourceLocation.filePath.split('/').pop()}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.whyLink}>Inspect Provenance →</Text>
                </View>
                </TouchableOpacity>
              </AnimatedListItem>
            ))}
          </View>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Hero Evidence Inspector Drawer */}
      <EvidenceInspectorModal
        visible={inspectItem !== null}
        item={inspectItem}
        onClose={() => setInspectItem(null)}
      />

      {/* Interactive Evidence Graph Explorer */}
      <InteractiveGraphExplorer
        visible={graphModalVisible}
        onClose={() => setGraphModalVisible(false)}
        onSelectEvidence={(item) => setInspectItem(item)}
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
  heroSection: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  glowOrbCyan: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#38BDF8',
    opacity: 0.2,
  },
  glowOrbViolet: {
    position: 'absolute',
    bottom: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#818CF8',
    opacity: 0.15,
  },

  candidateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  candidateGreeting: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontSize: 28,
  },
  heroTitleHighlight: {
    ...Typography.h1,
    color: Colors.primary,
    fontSize: 32,
    lineHeight: 38,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: Spacing.lg,
    fontSize: 13,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 22,
  },
  metricLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 4,
    letterSpacing: 1.0,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderSubtle,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  githubInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  githubInput: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
    paddingVertical: 8,
  },
  graphExplorerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 10,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  graphExplorerText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 11,
  },
  syncBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  syncBtnText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  applyPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  applyPromptContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  promptBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  promptBadgeText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 9,
    letterSpacing: 1.0,
  },
  applyPromptTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  applyPromptSubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  applyArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#818CF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
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
  repoScroll: {
    flexDirection: 'row',
  },
  repoCard: {
    width: 220,
    marginRight: Spacing.md,
  },
  repoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  repoName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  repoLang: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  repoDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: Spacing.sm,
  },
  repoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: 6,
  },
  repoStatItem: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 10,
  },
  evidenceSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCountText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  filterScroll: {
    flexDirection: 'row',
    marginVertical: Spacing.sm,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgSurface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: Colors.bgElevated,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterPillText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  filterPillTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  evidenceList: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  evidenceCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  evidenceSkill: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 13.5,
  },
  evidenceClaim: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: 6,
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  filePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.codeBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  fileText: {
    ...Typography.code,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  whyLink: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9.5,
  },
});
