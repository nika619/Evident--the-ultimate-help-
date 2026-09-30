/**
 * Evident Button Component
 * Minimalist Studio Design (Linear-style solid chalk white primary, matte secondary).
 */

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (variant === 'primary' && !disabled && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [variant, disabled, loading]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

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
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.baseBtn,
          vStyles.btn,
          {
            paddingVertical: sStyles.paddingVertical,
            paddingHorizontal: sStyles.paddingHorizontal,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
          disabled && styles.btnDisabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : Colors.primary}
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
      </Animated.View>
    </Pressable>
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
