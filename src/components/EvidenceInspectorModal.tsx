/**
 * Evident Evidence Inspector Modal (THE HERO COMPONENT)
 * Studio minimalist drawer sliding up when tapping "[Why this claim?]".
 * Displays exact repository provenance with quiet authority and clarity.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EvidenceItem } from '../domain/types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { EvidenceBadge } from './EvidenceBadge';
import { useEvidenceStore } from '../store/useEvidenceStore';

interface EvidenceInspectorModalProps {
  visible: boolean;
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  const markUserVerification = useEvidenceStore((s) => s.markUserVerification);

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="git-branch-outline" size={17} color={Colors.textPrimary} />
              <Text style={styles.headerTitle}>PROVENANCE INSPECTOR</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Skill & Status */}
            <View style={styles.section}>
              <View style={styles.badgeRow}>
                <EvidenceBadge status={item.evidenceStatus} size="medium" />
                <View style={styles.authorBadge}>
                  <Text style={styles.authorBadgeText}>
                    {item.authorshipSupport === 'primary_author'
                      ? 'Primary Author'
                      : 'Collaborator / Template'}
                  </Text>
                </View>
              </View>

              <Text style={styles.skillTitle}>{item.skillName}</Text>
              <Text style={styles.claimText}>"{item.claim}"</Text>
            </View>

            {/* Provenance Metadata Table */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>REPOSITORY</Text>
                <Text style={styles.metaValue}>{item.projectName}</Text>
              </View>

              {item.sourceLocation.filePath && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>SOURCE FILE PATH</Text>
                  <Text style={[styles.metaValue, styles.codeFont]}>
                    {item.sourceLocation.filePath}
                  </Text>
                </View>
              )}

              {item.sourceLocation.commitHash && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>COMMIT HASH</Text>
                  <View style={styles.commitPill}>
                    <Ionicons name="git-commit-outline" size={13} color={Colors.textPrimary} />
                    <Text style={[styles.metaValue, styles.codeFont]}>
                      {item.sourceLocation.commitHash}
                    </Text>
                  </View>
                </View>
              )}

              {item.sourceLocation.commitMessage && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>COMMIT MESSAGE</Text>
                  <Text style={styles.metaSubValue}>{item.sourceLocation.commitMessage}</Text>
                </View>
              )}

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>PROVENANCE DATES</Text>
                <Text style={styles.metaValue}>
                  {item.firstObservedDate} → {item.lastObservedDate}
                </Text>
              </View>
            </View>

            {/* Source Code Snippet */}
            {item.codeSnippet && (
              <View style={styles.section}>
                <View style={styles.snippetHeader}>
                  <Ionicons name="code-slash-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.snippetTitle}>SOURCE CODE SNIPPET</Text>
                </View>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{item.codeSnippet}</Text>
                </View>
              </View>
            )}

            {/* Human-in-the-loop verification */}
            <View style={styles.correctionSection}>
              <Text style={styles.correctionHeader}>HUMAN-IN-THE-LOOP VERIFICATION</Text>
              <Text style={styles.correctionDescription}>
                Did you personally build this, or was it inherited from a boilerplate?
              </Text>

              <View style={styles.correctionActions}>
                <TouchableOpacity
                  style={[styles.correctionBtn, styles.btnAccurate]}
                  onPress={() => {
                    markUserVerification(item.id, true);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-circle-outline" size={15} color={Colors.emerald} />
                  <Text style={[styles.btnText, { color: Colors.emerald }]}>✓ Accurate (My Code)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.correctionBtn, styles.btnInaccurate]}
                  onPress={() => {
                    markUserVerification(item.id, false);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle-outline" size={15} color={Colors.amber} />
                  <Text style={[styles.btnText, { color: Colors.amber }]}>× Template / Not Mine</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgSurface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingBottom: Spacing.xl,
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  authorBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  authorBadgeText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9.5,
  },
  skillTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  claimText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 21,
  },
  metaCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8.5,
  },
  metaValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  metaSubValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  commitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  codeFont: {
    fontFamily: 'monospace',
    color: Colors.textPrimary,
  },
  snippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  snippetTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
  },
  codeBox: {
    backgroundColor: Colors.codeBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  codeText: {
    ...Typography.code,
    color: '#E2E8F0',
  },
  correctionSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    marginBottom: Spacing.xl,
  },
  correctionHeader: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
    marginBottom: 4,
  },
  correctionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  correctionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  correctionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  btnAccurate: {
    backgroundColor: Colors.emeraldBg,
    borderColor: Colors.emeraldBorder,
  },
  btnInaccurate: {
    backgroundColor: Colors.amberBg,
    borderColor: Colors.amberBorder,
  },
  btnText: {
    ...Typography.label,
    fontSize: 10.5,
    fontWeight: '700',
  },
});
