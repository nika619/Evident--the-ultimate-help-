/**
 * Evident Button Component
 * Minimalist Studio Design (Linear-style solid chalk white primary, matte secondary).
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface EvidentButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const EvidentButton: React.FC<EvidentButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          btn: styles.btnSecondary,
          text: styles.textSecondary,
        };
      case 'outline':
        return {
          btn: styles.btnOutline,
          text: styles.textOutline,
        };
      case 'danger':
        return {
          btn: styles.btnDanger,
          text: styles.textDanger,
        };
      case 'primary':
      default:
        return {
          btn: styles.btnPrimary,
          text: styles.textPrimary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 7,
          paddingHorizontal: 12,
          fontSize: 12,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 22,
          fontSize: 14,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 13,
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.baseBtn,
        vStyles.btn,
        {
          paddingVertical: sStyles.paddingVertical,
          paddingHorizontal: sStyles.paddingHorizontal,
        },
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#0A0C10' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.baseText,
              vStyles.text,
              { fontSize: sStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.md,
  },
  baseText: {
    ...Typography.label,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  textPrimary: {
    color: Colors.primaryText,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  textSecondary: {
    color: Colors.textPrimary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textOutline: {
    color: Colors.textPrimary,
  },
  btnDanger: {
    backgroundColor: Colors.roseBg,
    borderWidth: 1,
    borderColor: Colors.roseBorder,
  },
  textDanger: {
    color: Colors.rose,
  },
  btnDisabled: {
    opacity: 0.35,
  },
});
