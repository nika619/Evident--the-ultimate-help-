/**
 * Evident GlassCard Component
 * Apple-grade frosted glassmorphism surface with specular light reflection,
 * smooth spring physics, and subtle 3D depth.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, Platform, View } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | any;
  active?: boolean;
  delayIndex?: number;
  variant?: 'default' | 'elevated' | 'terminal' | 'tinted';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  active = false,
  delayIndex = 0,
  variant = 'default',
}) => {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(mountAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 5,
      }).start();
    }, delayIndex * 70);
    return () => clearTimeout(timer);
  }, [delayIndex]);

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.cardElevated;
      case 'terminal':
        return styles.cardTerminal;
      case 'tinted':
        return styles.cardTinted;
      default:
        return styles.cardDefault;
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardBase,
        getVariantStyle(),
        active && styles.cardActive,
        style,
        {
          opacity: mountAnim,
          transform: [
            {
              scale: mountAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
            {
              translateY: mountAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Apple Specular Top Light Catch Line */}
      <View style={styles.specularEdge} pointerEvents="none" />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    // Mobile shadow defaults
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  specularEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 1,
  },
  cardDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          boxShadow:
            '0 12px 32px -4px rgba(15, 23, 42, 0.07), 0 2px 8px -1px rgba(15, 23, 42, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
        } as any)
      : {}),
  },
  cardElevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(34px) saturate(200%)',
          WebkitBackdropFilter: 'blur(34px) saturate(200%)',
          boxShadow:
            '0 20px 40px -8px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.05), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1)',
        } as any)
      : {}),
  },
  cardTerminal: {
    backgroundColor: 'rgba(11, 15, 23, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow:
            '0 16px 36px -6px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        } as any)
      : {}),
  },
  cardTinted: {
    backgroundColor: 'rgba(240, 249, 255, 0.82)',
    borderColor: 'rgba(186, 230, 253, 0.8)',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(26px) saturate(180%)',
          WebkitBackdropFilter: 'blur(26px) saturate(180%)',
          boxShadow:
            '0 12px 30px -4px rgba(14, 165, 233, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
        } as any)
      : {}),
  },
  cardActive: {
    borderColor: Colors.accentBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
});

