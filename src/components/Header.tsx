/**
 * Evident Header Component
 * Studio minimalist mobile top bar with back navigation, screen titles,
 * quiet luxury telemetry, and Pro status.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 44 : 14);

  return (
    <View style={[styles.container, { paddingTop: topPadding + 6 }]}>
      {/* Specular Top Edge */}
      <View style={styles.specularTopEdge} pointerEvents="none" />

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
            <View style={styles.liveGreenDot} />
            <Text style={styles.brandName}>EVIDENT</Text>
            <View style={styles.astTag}>
              <Text style={styles.astTagText}>AST v2.4</Text>
            </View>
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
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.proBadge, isPro ? styles.proActive : styles.proFree]}
          onPress={onPressPro}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPro ? 'shield-checkmark' : 'sparkles'}
            size={12}
            color={isPro ? Colors.primaryText : Colors.primary}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.06)',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        } as any)
      : {}),
  },
  specularTopEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  brandRow: {
    flexDirection: 'column',
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.terminalGreen,
    shadowColor: Colors.terminalGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  brandName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    letterSpacing: 2.2,
    fontWeight: '900',
    fontSize: 17,
  },
  astTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    borderRadius: BorderRadius.xs,
  },
  astTagText: {
    ...Typography.code,
    fontSize: 8.5,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  tagline: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8,
    letterSpacing: 0.9,
    marginTop: 2,
    fontWeight: '700',
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
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  syncText: {
    ...Typography.code,
    color: Colors.textSecondary,
    fontSize: 10,
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
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  proText: {
    ...Typography.label,
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  proTextActive: {
    color: Colors.primaryText,
  },
});

