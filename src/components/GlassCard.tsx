/**
 * Evident GlassCard Component
 * Studio minimalist surface card with crisp 1px borders and matte background.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
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
