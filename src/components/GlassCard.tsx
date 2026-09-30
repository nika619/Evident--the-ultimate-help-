/**
 * Evident GlassCard Component
 * Studio minimalist surface card with crisp 1px borders and matte background.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | any;
  active?: boolean;
  delayIndex?: number; // Used to stagger animations
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, active = false, delayIndex = 0 }) => {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(mountAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 15,
        bounciness: 8,
      }).start();
    }, delayIndex * 100);
    return () => clearTimeout(timer);
  }, [delayIndex]);

  return (
    <Animated.View 
      style={[
        styles.card, 
        active && styles.cardActive, 
        style,
        {
          opacity: mountAnim,
          transform: [{
            scale: mountAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            })
          }, {
            translateY: mountAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            })
          }]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.07), 0 2px 8px -1px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        } as any)
      : {}),
  },
  cardActive: {
    borderColor: Colors.accentBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});
