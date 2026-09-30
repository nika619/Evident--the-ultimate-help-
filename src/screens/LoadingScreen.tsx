/**
 * Evident Mobile Splash / Loading Screen
 * High-impact cinematic launch surface displaying the custom generated 3D app icon,
 * cryptographic initialization telemetry, and smooth entry into the mobile cockpit.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface LoadingScreenProps {
  onFinish: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOADING_STEPS = [
  'Initializing cryptographic proof engine...',
  'Connecting to @nika619 verified repositories...',
  'Calculating SHA-256 Merkle root...',
  'Validating zero-hallucination code claims...',
  'Living career intelligence ready.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Pulse loop for glowing app icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // 3. Step messages
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    // 4. Finish after loading
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2400);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background Ambient Glow */}
      <View style={styles.ambientGlow} />

      <Animated.View
        style={[
          styles.contentBox,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glowing 3D App Icon Container */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.iconGlowHalo} />
          <Image
            source={require('../../assets/icon.png')}
            style={styles.appIcon}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Brand Typography */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>EVIDENT</Text>
          <Text style={styles.brandTagline}>CODE-GROUNDED CAREER INTELLIGENCE</Text>
        </View>

        {/* Progress Bar & Telemetry */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>

          <Text style={styles.stepText}>{LOADING_STEPS[stepIndex]}</Text>
          <Text style={styles.versionPill}>v1.1.0 • PRODUCTION</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ambientGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 80,
  },
  contentBox: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  iconGlowHalo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(14, 165, 233, 0.25)',
  },
  appIcon: {
    width: 104,
    height: 104,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  brandTitle: {
    ...Typography.h1,
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  brandTagline: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 6,
    fontWeight: '700',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepText: {
    ...Typography.label,
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  versionPill: {
    ...Typography.label,
    fontSize: 8.5,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 8,
  },
});
