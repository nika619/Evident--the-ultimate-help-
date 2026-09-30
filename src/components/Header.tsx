/**
 * Evident Header Component
 * Studio minimalist top bar with quiet luxury telemetry and Pro status.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useEvidenceStore } from '../store/useEvidenceStore';

interface HeaderProps {
  onPressPro?: () => void;
  onPressSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPressPro, onPressSync }) => {
  const isPro = useSubscriptionStore((s) => s.subscription.isPro);
  const isSyncing = useEvidenceStore((s) => s.isSyncing);

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoPill}>
          <View style={styles.solidDot} />
          <Text style={styles.brandName}>EVIDENT</Text>
        </View>
        <Text style={styles.tagline}>CODE-GROUNDED CAREER INTELLIGENCE</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={onPressSync}
          disabled={isSyncing}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSyncing ? 'sync' : 'git-commit-outline'}
            size={13}
            color={isSyncing ? Colors.accent : Colors.textSecondary}
          />
          <Text style={[styles.syncText, isSyncing && { color: Colors.accent }]}>
            {isSyncing ? 'Syncing...' : 'Living Memory'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.proBadge, isPro ? styles.proActive : styles.proFree]}
          onPress={onPressPro}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPro ? 'shield-checkmark' : 'sparkles-outline'}
            size={12}
            color={isPro ? Colors.primaryText : Colors.textPrimary}
          />
          <Text style={[styles.proText, isPro && styles.proTextActive]}>
            {isPro ? 'PRO ACTIVE' : 'PRO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  brandRow: {
    flexDirection: 'column',
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  solidDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.textPrimary,
  },
  brandName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    letterSpacing: 2,
    fontWeight: '800',
  },
  tagline: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8.5,
    letterSpacing: 1,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgSurface,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  syncText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
  },
  proFree: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  proActive: {
    backgroundColor: Colors.primary,
  },
  proText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  proTextActive: {
    color: Colors.primaryText,
  },
});
