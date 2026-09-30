/**
 * Evident Evidence Screen (Home)
 * Displays the candidate's body of work, evidence metrics, connected repositories,
 * filterable evidence list, and entry points into Graph Explorer and Opportunity Matching.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { GlassCard } from '../components/GlassCard';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { EvidenceInspectorModal } from '../components/EvidenceInspectorModal';
import { InteractiveGraphExplorer } from '../components/InteractiveGraphExplorer';
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

  const distinctSkills = Array.from(new Set(evidence.map((e) => e.skillName)));

  const filteredEvidence =
    activeFilter === 'all'
      ? evidence
      : evidence.filter((e) => e.evidenceStatus === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Telemetry Card */}
        <View style={styles.heroSection}>
          <Text style={styles.candidateGreeting}>CANDIDATE: {candidateName.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>Living Career Evidence</Text>
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
            <TouchableOpacity
              style={styles.graphExplorerBtn}
              onPress={() => setGraphModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="git-network-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.graphExplorerText}>Explore Evidence Graph</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.syncBtn}
              onPress={triggerSync}
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
        </View>

        {/* What are you applying for? CTA Card */}
        <TouchableOpacity
          style={styles.applyPromptCard}
          onPress={onNavigateToOpportunity}
          activeOpacity={0.85}
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
            <Ionicons name="arrow-forward" size={20} color={Colors.primaryText} />
          </View>
        </TouchableOpacity>

        {/* Connected Repositories Section */}
        <View style={styles.section}>
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
        </View>

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
            {filteredEvidence.map((ev) => (
              <TouchableOpacity
                key={ev.id}
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
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  heroSection: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  candidateGreeting: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
    marginBottom: 4,
    letterSpacing: 1.2,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.md,
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
  },
  metricLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8,
    marginTop: 2,
    letterSpacing: 0.8,
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
  graphExplorerBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
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
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  applyPromptContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  promptBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptBadgeText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 8.5,
    letterSpacing: 0.8,
  },
  applyPromptTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  applyPromptSubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  applyArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
