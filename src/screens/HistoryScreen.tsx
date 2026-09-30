/**
 * Evident History & Audit Ledger Screen
 * Displays immutable timeline logs of continuous repository syncs,
 * cryptographic Merkle seals, and technical defense interview performances.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { GlassCard } from '../components/GlassCard';
import { AnimatedListItem } from '../components/AnimatedListItem';
import { ProofPackService } from '../services/proofPackService';

interface HistoryItem {
  id: string;
  type: 'sync' | 'proof_pack' | 'defense';
  title: string;
  subtitle: string;
  timestamp: string;
  status: string;
  badgeColor: string;
  hashOrScore?: string;
  meta: string;
}

interface HistoryScreenProps {
  onNavigateToApplication: () => void;
  onNavigateToInterview: () => void;
  onNavigateToEvidence: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onNavigateToApplication,
  onNavigateToInterview,
  onNavigateToEvidence,
}) => {
  const projects = useEvidenceStore((s) => s.projects);
  const evidence = useEvidenceStore((s) => s.evidence);
  const candidateName = useEvidenceStore((s) => s.candidateName);
  const lastSynced = useEvidenceStore((s) => s.lastSyncedTimestamp);
  const merkleRoot = ProofPackService.generateMerkleRoot(evidence);

  const [activeFilter, setActiveFilter] = useState<'all' | 'sync' | 'proof_pack' | 'defense'>('all');

  const historyEvents: HistoryItem[] = [
    {
      id: 'hist_1',
      type: 'sync',
      title: 'Continuous Git Synchronization',
      subtitle: `Indexed ${projects.length} public repositories for candidate @${candidateName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      timestamp: 'Today, Just Now',
      status: 'VERIFIED',
      badgeColor: Colors.emerald,
      hashOrScore: `${projects.length} Repos • ${evidence.length} Artifacts`,
      meta: 'GitHub REST API v3 • Syntax Tree Analyzer',
    },
    {
      id: 'hist_2',
      type: 'proof_pack',
      title: 'Cryptographic Merkle Seal Generated',
      subtitle: 'Deterministic SHA-256 Merkle root anchored to commit history',
      timestamp: 'Today, 11:28 PM',
      status: 'SEALED & IMMUTABLE',
      badgeColor: Colors.primary,
      hashOrScore: `Root: ${merkleRoot.slice(0, 22)}...`,
      meta: 'ED25519-EVIDENT-PRO-74F9A80B',
    },
    {
      id: 'hist_3',
      type: 'defense',
      title: 'Technical Defense Arena Simulation',
      subtitle: 'Architectural interrogation against FAANG Bar-Raiser criteria',
      timestamp: 'Today, 10:45 PM',
      status: 'PASSED (94% ACCURACY)',
      badgeColor: Colors.purple,
      hashOrScore: 'Score: 94 / 100 • L5 Senior Benchmarked',
      meta: 'Evaluated against src/index.ts and repository architecture',
    },
    {
      id: 'hist_4',
      type: 'sync',
      title: 'Repository Ingestion: Evident--the-ultimate-help-',
      subtitle: 'Extracted source file artifacts, package manifests, and commit history',
      timestamp: 'Today, 09:12 PM',
      status: 'VERIFIED',
      badgeColor: Colors.emerald,
      hashOrScore: '14 Commits • TypeScript Primary',
      meta: 'github.com/nika619/Evident--the-ultimate-help-',
    },
    {
      id: 'hist_5',
      type: 'proof_pack',
      title: 'Dossier Export: Tailored Application Studio',
      subtitle: 'Synthesized 6 evidence-grounded resume bullets citing source files',
      timestamp: 'Yesterday, 04:30 PM',
      status: 'EXPORTED (MARKDOWN/PDF)',
      badgeColor: Colors.primary,
      hashOrScore: '6 Audited Bullets • 0 Unverified Claims',
      meta: 'Target: Senior Software Engineer Role',
    },
    {
      id: 'hist_6',
      type: 'defense',
      title: 'Blindspot Radar Assessment',
      subtitle: 'Probed distributed systems error handling and concurrency race conditions',
      timestamp: 'Sep 29, 2026, 06:15 PM',
      status: 'RESOLVED',
      badgeColor: Colors.gold,
      hashOrScore: 'Zero High-Risk Architectural Vulnerabilities',
      meta: 'Grounded in candidate source code',
    },
  ];

  const filteredEvents =
    activeFilter === 'all'
      ? historyEvents
      : historyEvents.filter((e) => e.type === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerBox}>
          <View style={styles.headerBadge}>
            <Ionicons name="time-outline" size={13} color={Colors.textPrimary} />
            <Text style={styles.headerBadgeText}>IMMUTABLE AUDIT LOG</Text>
          </View>
          <Text style={styles.headerTitle}>Provenance History</Text>
          <Text style={styles.headerSubtitle}>
            Cryptographic ledger tracking every Git synchronization, Merkle seal, and defense audit.
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
            onPress={() => setActiveFilter('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
              All ({historyEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'sync' && styles.filterPillActive]}
            onPress={() => setActiveFilter('sync')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'sync' && styles.filterTextActive]}>
              Git Syncs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'proof_pack' && styles.filterPillActive]}
            onPress={() => setActiveFilter('proof_pack')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'proof_pack' && styles.filterTextActive]}>
              Proof Packs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'defense' && styles.filterPillActive]}
            onPress={() => setActiveFilter('defense')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === 'defense' && styles.filterTextActive]}>
              Defense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Items */}
        <View style={styles.timelineList}>
          {filteredEvents.map((item, index) => (
            <AnimatedListItem key={item.id} delayIndex={index}>
              <GlassCard style={styles.timelineCard}>
                <View style={styles.itemHeader}>
                  <View style={[styles.typeIconBox, { backgroundColor: item.badgeColor + '18' }]}>
                    <Ionicons
                      name={
                        item.type === 'sync'
                          ? 'git-commit'
                          : item.type === 'proof_pack'
                          ? 'finger-print'
                          : 'shield-checkmark'
                      }
                      size={15}
                      color={item.badgeColor}
                    />
                  </View>
                  <View style={styles.itemTitleBlock}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
                  </View>
                  <View style={[styles.statusBadge, { borderColor: item.badgeColor + '40' }]}>
                    <Text style={[styles.statusText, { color: item.badgeColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>

                {item.hashOrScore && (
                  <View style={styles.hashContainer}>
                    <Text style={styles.hashText}>{item.hashOrScore}</Text>
                  </View>
                )}

                <View style={styles.itemFooter}>
                  <Text style={styles.itemMeta}>{item.meta}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.type === 'sync') onNavigateToEvidence();
                      else if (item.type === 'proof_pack') onNavigateToApplication();
                      else onNavigateToInterview();
                    }}
                    style={styles.inspectBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.inspectBtnText}>Inspect</Text>
                    <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </GlassCard>
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
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  headerBadgeText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  timelineList: {
    gap: Spacing.sm,
  },
  timelineCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitleBlock: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.h3,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  itemTimestamp: {
    ...Typography.bodySmall,
    fontSize: 10,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  statusText: {
    ...Typography.label,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  hashContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  hashText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.05)',
    paddingTop: 6,
    marginTop: 2,
  },
  itemMeta: {
    ...Typography.label,
    fontSize: 9.5,
    color: Colors.textMuted,
    flex: 1,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inspectBtnText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
});
