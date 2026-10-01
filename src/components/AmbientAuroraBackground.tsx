/**
 * Evident AmbientAuroraBackground
 * Autonomous 3D floating kinetic ambient light system for mobile and web.
 * Completely eliminates mouse pointer tracking for pure native mobile readiness,
 * while creating an ethereal 3D optical depth atmosphere.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AmbientAuroraProps {
  intensity?: number;
}

export const AmbientAuroraBackground: React.FC<AmbientAuroraProps> = ({ intensity = 1.0 }) => {
  const orb1Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb2Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb3Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const breathAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const depthZAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Organic Breathing & Pulsing (Harmonic 7-second loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Continuous 3D Gyroscope Slow Spin (30 seconds)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 32000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. 3D Depth Shift (Z-axis scale emulation)
    Animated.loop(
      Animated.sequence([
        Animated.timing(depthZAnim, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(depthZAnim, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Autonomous 3D Kinetic Floating Orbits (Lissajous pathing)
    const runOrb1 = () => {
      Animated.sequence([
        Animated.timing(orb1Anim, {
          toValue: { x: 35, y: -25 },
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: -30, y: 30 },
          duration: 7200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: 20, y: 15 },
          duration: 5800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: { x: 0, y: 0 },
          duration: 6500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => runOrb1());
    };

    const runOrb2 = () => {
      Animated.sequence([
        Animated.timing(orb2Anim, {
          toValue: { x: -45, y: 35 },
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: 30, y: -40 },
          duration: 8500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: -15, y: -20 },
          duration: 6200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: { x: 0, y: 0 },
          duration: 7500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => runOrb2());
    };

    const runOrb3 = () => {
      Animated.sequence([
        Animated.timing(orb3Anim, {
          toValue: { x: 25, y: 40 },
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb3Anim, {
          toValue: { x: -40, y: -30 },
          duration: 9500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb3Anim, {
          toValue: { x: 0, y: 0 },
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => runOrb3());
    };

    runOrb1();
    runOrb2();
    runOrb3();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const reverseSpin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const scaleOrb1 = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });

  const scaleOrb2 = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.14, 0.94],
  });

  const depthScale = depthZAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.08],
  });

  const centerOffsetX = ((SCREEN_WIDTH || 390) - 420) / 2;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Pristine Minimalist Apple Canvas Mesh */}
      <LinearGradient
        colors={['#F0F4FF', '#EDFBF7', '#FAF5FF', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      {/* Ambient Top Specular Atmosphere */}
      <LinearGradient
        colors={['rgba(219, 234, 254, 0.75)', 'rgba(237, 233, 254, 0.35)', 'rgba(248, 250, 252, 0)']}
        style={styles.ambientTopGaze}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Orb 1: Luminous Electric Cyan (Top Center / Depth Anchor) */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            left: centerOffsetX - 30,
            top: 40,
            width: 440,
            height: 440,
            borderRadius: 220,
            opacity: 0.78 * intensity,
            transform: [
              { translateX: orb1Anim.x },
              { translateY: orb1Anim.y },
              { scale: Animated.multiply(scaleOrb1, depthScale) },
              { rotate: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(14, 165, 233, 0.42)', 'rgba(56, 189, 248, 0.16)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.15, y: 0.15 }}
          end={{ x: 0.85, y: 0.85 }}
        />
      </Animated.View>

      {/* Orb 2: Deep Violet / Iris Horizon (Mid Screen) */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            left: centerOffsetX + 60,
            top: 220,
            width: 390,
            height: 390,
            borderRadius: 195,
            opacity: 0.65 * intensity,
            transform: [
              { translateX: orb2Anim.x },
              { translateY: orb2Anim.y },
              { scale: scaleOrb2 },
              { rotate: reverseSpin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.34)', 'rgba(168, 85, 247, 0.14)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.85, y: 0.15 }}
          end={{ x: 0.15, y: 0.85 }}
        />
      </Animated.View>

      {/* Orb 3: Emerald Provenance Shimmer (Lower Perspective Layer) */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            left: centerOffsetX - 50,
            top: 420,
            width: 480,
            height: 480,
            borderRadius: 240,
            opacity: 0.55 * intensity,
            transform: [
              { translateX: orb3Anim.x },
              { translateY: orb3Anim.y },
              { scale: scaleOrb1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.22)', 'rgba(14, 165, 233, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  ambientTopGaze: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 340,
  },
  cloudOrb: {
    position: 'absolute',
    filter: 'blur(75px)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 80,
  } as any,
});
