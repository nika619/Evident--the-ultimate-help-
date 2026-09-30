/**
 * Evident Mobile Landing Page & Welcome Showcase
 * The premier mobile welcome surface introducing candidates to the thesis,
 * live repository metrics, zero-hallucination standards, and launchpad into the cockpit.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../theme';
import { GlassCard } from '../components/GlassCard';

interface LandingScreenProps {
  onEnterCockpit: () => void;
  onOpenTutorial: () => void;
  onExploreNikaProfile: () => void;
  onConnectGitHub: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onEnterCockpit,
  onOpenTutorial,
  onExploreNikaProfile,
  onConnectGitHub,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLaunch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onEnterCockpit();
  };

  const handleTutorial = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenTutorial();
  };

  const handleExplore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onExploreNikaProfile();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Status Bar Pill */}
        <Animated.View style={[styles.topPillContainer, { opacity: fadeAnim }]}>
          <View style={styles.provenancePill}>
            <View style={styles.greenGlowDot} />
            <Text style={styles.provenancePillText}>CODE-GROUNDED CAREER INTELLIGENCE</Text>
          </View>
        </Animated.View>

        {/* Hero Section with Glowing 3D Shield */}
        <Animated.View style={[styles.heroBox, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.iconHalo} />
            <Image
              source={require('../../assets/icon.png')}
              style={styles.appIcon}
              resizeMode="cover"
            />
          </Animated.View>

          <Text style={styles.brandTitle}>EVIDENT</Text>
          <Text style={styles.brandThesis}>
            "Your resume should describe what you can prove. Evident remembers what you have done. Apply knows when it matters."
          </Text>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>15</Text>
              <Text style={styles.metricLabel}>VERIFIED REPOS</Text>
            </View>
            <View style={styles.metricSep} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>0%</Text>
              <Text style={styles.metricLabel}>HALLUCINATION</Text>
            </View>
            <View style={styles.metricSep} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>SHA-256</Text>
              <Text style={styles.metricLabel}>MERKLE SEALED</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Launchpad (Primary CTA Deck) */}
        <View style={styles.ctaDeck}>
          <TouchableOpacity
            style={styles.primaryLaunchBtn}
            onPress={handleLaunch}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryLaunchText}>ENTER MOBILE COCKPIT</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tutorialBtn}
            onPress={handleTutorial}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FAF5FF', '#F3E8FF']}
              style={styles.tutorialGradient}
            >
              <Ionicons name="compass-outline" size={18} color={Colors.purple} />
              <View style={styles.tutorialTextGroup}>
                <Text style={styles.tutorialTitle}>Take the 5-Stop Interactive Tour</Text>
                <Text style={styles.tutorialSub}>See how Evident eliminates fake AI resume claims</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.purple} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleExplore}
              activeOpacity={0.75}
            >
              <Ionicons name="sparkles-outline" size={15} color={Colors.primary} />
              <Text style={styles.secondaryBtnText}>Explore @nika619 Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onConnectGitHub}
              activeOpacity={0.75}
            >
              <Ionicons name="logo-github" size={15} color={Colors.textPrimary} />
              <Text style={styles.secondaryBtnText}>Connect Your GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Core Pillars of Evident */}
        <View style={styles.pillarsSection}>
          <Text style={styles.sectionHeaderTitle}>ARCHITECTURAL PILLARS</Text>

          {/* Pillar 1 */}
          <GlassCard style={styles.pillarCard}>
            <View style={styles.pillarRow}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="git-network-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>Deterministic Proof Graph</Text>
                <Text style={styles.pillarDesc}>
                  AST syntax parsing inspects real functions, algorithms, and models across your GitHub commit trees.
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Pillar 2 */}
          <GlassCard style={styles.pillarCard}>
            <View style={styles.pillarRow}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={Colors.emerald} />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>Zero-Hallucination Guard</Text>
                <Text style={styles.pillarDesc}>
                  Every resume claim requires a verifiable source receipt: commit SHA, file path, and lines of code.
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Pillar 3 */}
          <GlassCard style={styles.pillarCard}>
            <View style={styles.pillarRow}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="briefcase-outline" size={22} color={Colors.purple} />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>Evidence Coverage Matrix</Text>
                <Text style={styles.pillarDesc}>
                  Replaces dishonest "89% fit" badges with an auditable Must-Have checklist and transparent skill gap ledger.
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Pillar 4 */}
          <GlassCard style={styles.pillarCard}>
            <View style={styles.pillarRow}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="chatbubbles-outline" size={22} color={Colors.gold} />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarTitle}>FAANG Bar-Raiser Defense Arena</Text>
                <Text style={styles.pillarDesc}>
                  Architectural questions grounded in your authentic code trade-offs. Practice answering before talking to recruiters.
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Hackathon Footer Seal */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Built for Devpost RevenueCat Shipathon 2026 • Executive Mobile Edition
          </Text>
          <Text style={styles.footerSubText}>
            SHA-256 Merkle Provenance Engine • TypeScript & React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  topPillContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  provenancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  greenGlowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  provenancePillText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.accent,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  heroBox: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  iconHalo: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  appIcon: {
    width: 90,
    height: 90,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  brandTitle: {
    ...Typography.h1,
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
    marginBottom: Spacing.xs,
  },
  brandThesis: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: Spacing.md,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    width: '100%',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  metricLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
    fontWeight: '700',
  },
  metricSep: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  ctaDeck: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  primaryLaunchBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
  },
  primaryLaunchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  tutorialBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  tutorialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  tutorialTextGroup: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tutorialSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pillarsSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sectionHeaderTitle: {
    ...Typography.label,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  pillarCard: {
    padding: Spacing.md,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pillarIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarContent: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pillarDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerNoteText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerSubText: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
