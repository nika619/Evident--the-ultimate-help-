/**
 * Evident Header Component
 * Studio minimalist mobile top bar with back navigation, screen titles,
 * quiet luxury telemetry, and Pro status.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useEvidenceStore } from '../store/useEvidenceStore';

interface HeaderProps {
  canGoBack?: boolean;
  onGoBack?: () => void;
  title?: string;
  onPressPro?: () => void;
  onPressSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  canGoBack = false,
  onGoBack,
  title,
  onPressPro,
  onPressSync,
}) => {
  const isPro = useSubscriptionStore((s) => s.subscription.isPro);
  const isSyncing = useEvidenceStore((s) => s.isSyncing);

  return (
    <View style={styles.container}>
      {canGoBack ? (
        <View style={styles.backRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
            <Text style={styles.screenTitleText} numberOfLines={1}>
              {title || 'Back'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.brandRow}>
          <View style={styles.logoPill}>
            <View style={styles.solidDot} />
            <Text style={styles.brandName}>EVIDENT</Text>
          </View>
          <Text style={styles.tagline}>CODE-GROUNDED CAREER INTELLIGENCE</Text>
        </View>
      )}

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
    backgroundColor: 'transparent',
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  screenTitleText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  syncText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9.5,
    fontWeight: '600',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: BorderRadius.md,
  },
  proActive: {
    backgroundColor: Colors.primary,
  },
  proFree: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  proText: {
    ...Typography.label,
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  proTextActive: {
    color: Colors.primaryText,
  },
});
