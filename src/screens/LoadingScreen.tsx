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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface LoadingScreenProps {
  onFinish: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EngineStep {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  tag: string;
  tagColor: string;
}

const ENGINE_STEPS: EngineStep[] = [
  {
    icon: 'hardware-chip-outline',
    title: 'Connecting verified repositories...',
    sub: 'Mining 15 production repositories for authorship',
    tag: 'GIT-CONNECT',
    tagColor: Colors.primary,
  },
  {
    icon: 'git-network-outline',
    title: 'Analyzing AST commit trees...',
    sub: 'Extracting cryptographic proof-graphs across commit trees',
    tag: 'AST-INDEX',
    tagColor: Colors.purple,
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Enforcing zero-hallucination boundaries...',
    sub: 'Auditing candidate claims against verifiable diffs',
    tag: 'ZERO-HALLUCINATION',
    tagColor: Colors.emerald,
  },
  {
    icon: 'lock-closed-outline',
    title: 'Sealing SHA-256 Merkle root...',
    sub: 'Baking tamper-proof cryptographic provenance receipts',
    tag: 'MERKLE-ROOT',
    tagColor: Colors.accent,
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Provenance cockpit live!',
    sub: 'All career intelligence mathematically grounded',
    tag: 'READY',
    tagColor: Colors.emerald,
  },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Playful bobbing animation for the 3D icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: -8,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Playful subtle rotation wiggle
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: -1, duration: 800, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // 4. Step messages
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < ENGINE_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    // 5. Finish after loading
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
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

  const tilt = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const currentStep = ENGINE_STEPS[stepIndex];

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
        {/* Sleek Floating 3D App Icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ translateY: bobAnim }, { rotate: tilt }],
            },
          ]}
        >
          <View style={styles.iconGlowHalo} />
          <Image
            source={require('../../assets/icon.png')}
            style={styles.appIcon}
            resizeMode="cover"
          />
          <View style={styles.playfulSparklePill}>
            <Text style={styles.playfulSparkleText}>PROOF OVER CLAIMS</Text>
          </View>
        </Animated.View>

        {/* Brand Typography */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>EVIDENT</Text>
          <Text style={styles.brandTagline}>CODE-GROUNDED CAREER INTELLIGENCE</Text>
        </View>

        {/* Engineered Step Card */}
        <View style={styles.stepCard}>
          <View
            style={[
              styles.stepIconBadge,
              {
                backgroundColor: `${currentStep.tagColor}15`,
                borderColor: `${currentStep.tagColor}35`,
              },
            ]}
          >
            <Ionicons name={currentStep.icon} size={20} color={currentStep.tagColor} />
          </View>
          <View style={styles.stepTextBox}>
            <View style={styles.stepHeaderRow}>
              <Text style={styles.stepTitle} numberOfLines={1}>
                {currentStep.title}
              </Text>
              <View
                style={[
                  styles.stepTagPill,
                  { backgroundColor: `${currentStep.tagColor}15` },
                ]}
              >
                <Text style={[styles.stepTagText, { color: currentStep.tagColor }]}>
                  {currentStep.tag}
                </Text>
              </View>
            </View>
            <Text style={styles.stepSub} numberOfLines={2}>
              {currentStep.sub}
            </Text>
          </View>
        </View>

        {/* Progress Bar & Telemetry */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>

          <View style={styles.progressFooterRow}>
            <View style={styles.liveIndicator}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.liveIndicatorText}>ZERO HALLUCINATION ENGINE</Text>
            </View>
            <Text style={styles.versionPill}>v1.1.0</Text>
          </View>
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
  playfulSparklePill: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  playfulSparkleText: {
    ...Typography.label,
    fontSize: 8.5,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    width: '100%',
    marginBottom: Spacing.xl,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  stepIconBadge: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  stepTextBox: {
    flex: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepTitle: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 12.5,
    color: '#0F172A',
    flex: 1,
  },
  stepTagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  stepTagText: {
    ...Typography.monoSmall,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepSub: {
    ...Typography.bodySmall,
    fontSize: 10.5,
    color: '#475569',
    marginTop: 2,
  },
  progressFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveIndicatorText: {
    ...Typography.label,
    fontSize: 8.5,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  versionPill: {
    ...Typography.label,
    fontSize: 8.5,
    color: '#94A3B8',
    letterSpacing: 1,
  },
});
