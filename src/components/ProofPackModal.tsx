import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { EvidentButton } from './EvidentButton';
import { GlassCard } from './GlassCard';

interface ProofPackModalProps {
  visible: boolean;
  markdown: string;
  candidateName: string;
  merkleRoot: string;
  onClose: () => void;
}

export const ProofPackModal: React.FC<ProofPackModalProps> = ({
  visible,
  markdown,
  candidateName,
  merkleRoot,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(markdown);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleDownload = () => {
    try {
      if (typeof document !== 'undefined') {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = (candidateName || 'candidate').toLowerCase().replace(/[^a-z0-9]/g, '-');
        a.download = `evident-proof-pack-${cleanName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2500);
      } else {
        handleShare();
      }
    } catch (e) {
      console.warn('Download error:', e);
      handleShare();
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Share.share({
          message: markdown,
          title: `Evident Proof Pack — ${candidateName}`,
        });
      } else {
        handleCopy();
      }
    } catch (e) {
      // Graceful fallback without OS crash
      handleCopy();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={13} color={Colors.emerald} />
                <Text style={styles.badgeText}>SEALED DOSSIER</Text>
              </View>
              <Text style={styles.headerTitle}>Candidate Proof Pack</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Merkle Hash Badge */}
          <View style={styles.merkleRow}>
            <Ionicons name="finger-print-outline" size={13} color={Colors.primary} />
            <Text style={styles.merkleText} numberOfLines={1}>
              Root: {merkleRoot}
            </Text>
          </View>

          {/* Dossier Markdown Scroll View */}
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={true}>
            <Text style={styles.markdownText}>{markdown}</Text>
          </ScrollView>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={[styles.actionBtn, copied && styles.actionBtnActive]}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={16}
                color={copied ? Colors.emerald : Colors.textPrimary}
              />
              <Text style={[styles.actionBtnText, copied && { color: Colors.emerald }]}>
                {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.downloadBtn, downloaded && styles.actionBtnActive]}
              onPress={handleDownload}
              activeOpacity={0.7}
            >
              <Ionicons
                name={downloaded ? 'checkmark-done' : 'download-outline'}
                size={16}
                color={downloaded ? Colors.emerald : '#FFFFFF'}
              />
              <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>
                {downloaded ? 'Downloaded!' : 'Download .md File'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.label,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.emerald,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  merkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  merkleText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    color: Colors.primary,
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  markdownText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textPrimary,
  },
  actionBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  downloadBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnActive: {
    borderColor: Colors.emerald,
  },
  actionBtnText: {
    ...Typography.label,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
