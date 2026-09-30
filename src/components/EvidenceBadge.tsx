/**
 * Evident Evidence Badge Component
 * Clean matte status indicator with high legibility and quiet authority.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EvidenceStatus } from '../domain/types';
import { Colors, Typography, BorderRadius } from '../theme';

interface EvidenceBadgeProps {
  status: EvidenceStatus;
  size?: 'small' | 'medium';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ status, size = 'small' }) => {
  const getConfig = () => {
    switch (status) {
      case 'direct':
        return {
          label: 'Direct Source',
          textColor: Colors.emerald,
          bgColor: Colors.emeraldBg,
          borderColor: Colors.emeraldBorder,
        };
      case 'supported':
        return {
          label: 'Supported',
          textColor: Colors.amber,
          bgColor: Colors.amberBg,
          borderColor: Colors.amberBorder,
        };
      case 'partial':
        return {
          label: 'Partial',
          textColor: Colors.purple,
          bgColor: Colors.purpleBg,
          borderColor: Colors.purpleBorder,
        };
      case 'user_declared':
        return {
          label: 'User Declared',
          textColor: Colors.blue,
          bgColor: Colors.blueBg,
          borderColor: Colors.blueBorder,
        };
      case 'not_found':
      default:
        return {
          label: 'Evidence Gap',
          textColor: Colors.rose,
          bgColor: Colors.roseBg,
          borderColor: Colors.roseBorder,
        };
    }
  };

  const config = getConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 7 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.textColor }]} />
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    ...Typography.label,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
