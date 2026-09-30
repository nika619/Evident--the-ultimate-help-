/**
 * Evident Interactive Graph Explorer
 * Studio minimalist visualizer rendering the relational network between
 * Repositories ↔ Skills ↔ Files ↔ Claims.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { EvidenceItem } from '../domain/types';

interface InteractiveGraphExplorerProps {
  visible: boolean;
  onClose: () => void;
  onSelectEvidence: (item: EvidenceItem) => void;
}

export const InteractiveGraphExplorer: React.FC<InteractiveGraphExplorerProps> = ({
  visible,
  onClose,
  onSelectEvidence,
}) => {
  const projects = useEvidenceStore((s) => s.projects);
  const evidence = useEvidenceStore((s) => s.evidence);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectEvidence = evidence.filter((e) => e.projectId === activeProject?.id);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="git-network-outline" size={18} color={Colors.textPrimary} />
            <Text style={styles.title}>EVIDENCE GRAPH EXPLORER</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeader}>
          <Text style={styles.subtext}>
            Relational provenance map proving how claims trace directly to repository files and git commits.
          </Text>
        </View>

        {/* Project Selector Bar */}
        <View style={styles.projectSelector}>
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <TouchableOpacity
                key={proj.id}
                style={[styles.projTab, isSelected && styles.projTabActive]}
                onPress={() => setSelectedProjectId(proj.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="folder-outline"
                  size={13}
                  color={isSelected ? Colors.textPrimary : Colors.textMuted}
                />
                <Text style={[styles.projTabText, isSelected && styles.projTabTextActive]}>
                  {proj.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Graph Representation */}
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Central Root Project Node */}
          <View style={styles.rootProjectNode}>
            <View style={styles.nodeBadge}>
              <Text style={styles.nodeBadgeText}>REPOSITORY NODE</Text>
            </View>
            <Text style={styles.rootProjectTitle}>{activeProject?.name}</Text>
            <Text style={styles.rootProjectDesc}>{activeProject?.description}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statPill}>
                {activeProject?.primaryLanguage}
              </Text>
              <Text style={styles.statPill}>
                {activeProject?.candidateCommits} candidate commits
              </Text>
              <Text style={styles.statPill}>
                {projectEvidence.length} evidence connections
              </Text>
            </View>
          </View>

          {/* Connection Lines & Dependent Evidence Nodes */}
          <View style={styles.networkTree}>
            <View style={styles.treeHeader}>
              <Ionicons name="git-merge-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.treeHeaderText}>CONNECTED SKILLS & PROVENANCE NODES</Text>
            </View>

            {projectEvidence.map((ev) => (
              <TouchableOpacity
                key={ev.id}
                style={styles.nodeCard}
                onPress={() => {
                  onClose();
                  onSelectEvidence(ev);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.nodeConnector}>
                  <View style={styles.connectorDot} />
                  <View style={styles.connectorLine} />
                </View>

                <View style={styles.nodeCardContent}>
                  <View style={styles.nodeCardHeader}>
                    <Text style={styles.skillNodeTitle}>{ev.skillName}</Text>
                    <View style={styles.chipDirect}>
                      <Text style={styles.chipText}>{ev.evidenceStatus.toUpperCase()}</Text>
                    </View>
                  </View>

                  <Text style={styles.nodeClaim}>{ev.claim}</Text>

                  {ev.sourceLocation.filePath && (
                    <View style={styles.codePointer}>
                      <Ionicons name="document-text-outline" size={12} color={Colors.textSecondary} />
                      <Text style={styles.codePointerText}>
                        {ev.sourceLocation.filePath}
                      </Text>
                    </View>
                  )}

                  <View style={styles.inspectHint}>
                    <Text style={styles.inspectHintText}>Tap to inspect code snippet & commit SHA →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  subHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  subtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  projectSelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.bgSurface,
  },
  projTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  projTabActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  projTabText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10.5,
  },
  projTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  rootProjectNode: {
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  nodeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  nodeBadgeText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 8.5,
  },
  rootProjectTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  rootProjectDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statPill: {
    ...Typography.label,
    backgroundColor: Colors.bgSurface,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    color: Colors.textMuted,
    fontSize: 9.5,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  networkTree: {
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  treeHeaderText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
  },
  nodeCard: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  nodeConnector: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  connectorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
    marginTop: 15,
  },
  connectorLine: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.borderSubtle,
  },
  nodeCardContent: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  nodeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillNodeTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 13.5,
  },
  chipDirect: {
    backgroundColor: Colors.emeraldBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
  },
  chipText: {
    ...Typography.label,
    color: Colors.emerald,
    fontSize: 8.5,
    fontWeight: '700',
  },
  nodeClaim: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  codePointer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.codeBg,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  codePointerText: {
    ...Typography.code,
    color: Colors.textSecondary,
    fontSize: 10.5,
  },
  inspectHint: {
    marginTop: 2,
  },
  inspectHintText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8.5,
  },
});
