/**
 * Evident GlassCard Component
 * Studio minimalist surface card with crisp 1px borders and matte background.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  active?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, active = false }) => {
  return (
    <View style={[styles.card, active && styles.cardActive, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cardActive: {
    borderColor: Colors.bgGlassBorderActive,
    backgroundColor: Colors.bgElevated,
  },
});
