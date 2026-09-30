/**
 * Evident Interactive Trip Tutorial
 * A guided 5-stop mobile journey that explains the thesis, architecture,
 * and workflows of the Code-Grounded Career Intelligence Engine.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface InteractiveTutorialProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface TutorialStop {
  stopNumber: number;
  totalStops: number;
  badge: string;
  badgeColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  tagline: string;
  body: string;
  demoType: 'repos' | 'receipt' | 'matcher' | 'defense' | 'merkle';
  takeaway: string;
  accentColors: [string, string];
}

const TUTORIAL_STOPS: TutorialStop[] = [
  {
    stopNumber: 1,
    totalStops: 5,
    badge: 'STOP 1 OF 5 • CODE PROVENANCE',
    badgeColor: Colors.primary,
    icon: 'logo-github',
    title: 'Your Code Is Your Real Resume',
    tagline: 'Connect directly to authentic GitHub commit history.',
    body:
      'Traditional resume builders encourage candidates to type bullet points that AI can exaggerate or hallucinate. Evident flips the script: it inspects your real GitHub repositories to discover verifiable code artifacts, AST syntax trees, and commit SHAs.',
    demoType: 'repos',
    takeaway: 'Never get caught in an interview claiming a library or system you never authored.',
    accentColors: ['#EFF6FF', '#DBEAFE'],
  },
  {
    stopNumber: 2,
    totalStops: 5,
    badge: 'STOP 2 OF 5 • THE PROOF GRAPH',
    badgeColor: Colors.emerald,
    icon: 'git-commit-outline',
    title: 'Receipts for Every Single Skill',
    tagline: 'Zero-hallucination guarantee anchored to lines of code.',
    body:
      'Every claimed capability in Evident must map to an immutable source receipt: commit SHA, file path, line numbers, and author identity. If code evidence does not exist in your repositories, Evident strictly marks it as unverified.',
    demoType: 'receipt',
    takeaway: 'Mathematical certainty of authorship that senior hiring managers trust.',
    accentColors: ['#F0FDF4', '#DCFCE7'],
  },
  {
    stopNumber: 3,
    totalStops: 5,
    badge: 'STOP 3 OF 5 • ROLE MATCHING',
    badgeColor: Colors.purple,
    icon: 'briefcase-outline',
    title: 'Honest Match Matrix vs Fake Percentages',
    tagline: 'See direct code evidence vs real skill gaps.',
    body:
      'Other platforms output superficial "89% Match" scores with zero grounding. Evident parses any target Job Description into Must-Haves and Nice-to-Haves, showing an honest Evidence Coverage Matrix with code citations and transparent gaps.',
    demoType: 'matcher',
    takeaway: 'Know your authentic interview risk and strength before you apply.',
    accentColors: ['#FAF5FF', '#F3E8FF'],
  },
  {
    stopNumber: 4,
    totalStops: 5,
    badge: 'STOP 4 OF 5 • DEFENSE ARENA',
    badgeColor: Colors.amber,
    icon: 'chatbubbles-outline',
    title: 'FAANG Bar-Raiser Defense Arena',
    tagline: 'Practice defending your actual architecture live.',
    body:
      'The hardest part of senior engineering interviews is articulating architectural trade-offs. Evident formulates targeted technical questions directly from your files (e.g. model/train_rf.py, proofPackService.ts) and grades your trade-off depth.',
    demoType: 'defense',
    takeaway: 'Transform code familiarity into confident, senior-caliber interview responses.',
    accentColors: ['#FFFBEB', '#FEF3C7'],
  },
  {
    stopNumber: 5,
    totalStops: 5,
    badge: 'STOP 5 OF 5 • CRYPTOGRAPHIC SEAL',
    badgeColor: Colors.gold,
    icon: 'shield-checkmark',
    title: 'Sealed Proof Pack & Executive Dossier',
    tagline: 'Export recruiter-ready PDF/Markdown dossiers.',
    body:
      'Compile your entire candidacy into an immutable, SHA-256 Merkle-sealed Proof Pack. Hiring managers can scan the cryptographic root or click commit links to verify your code in under 3 seconds.',
    demoType: 'merkle',
    takeaway: 'Stand out from 1,000 AI-generated resumes with verifiable cryptographic proof.',
    accentColors: ['#EFF6FF', '#EDE9FE'],
  },
];

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentStop = TUTORIAL_STOPS[currentStep];

  const animateToStep = (newStep: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: newStep > currentStep ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(newStep);
      slideAnim.setValue(newStep > currentStep ? 20 : -20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STOPS.length - 1) {
      animateToStep(currentStep + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onComplete) onComplete();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1);
    }
  };

  const renderDemoWidget = () => {
    switch (currentStop.demoType) {
      case 'repos':
        return (
          <View style={styles.demoBox}>
            <View style={styles.demoHeaderRow}>
              <View style={styles.demoDotActive} />
              <Text style={styles.demoTitle}>LIVE GITHUB PROVENANCE</Text>
              <Text style={styles.demoTag}>@nika619</Text>
            </View>
            <View style={styles.demoRepoPills}>
              <View style={styles.repoPill}>
                <Ionicons name="git-branch-outline" size={12} color={Colors.primary} />
                <Text style={styles.repoPillText}>Evident--the-ultimate-help- (TypeScript)</Text>
              </View>
              <View style={styles.repoPill}>
                <Ionicons name="git-branch-outline" size={12} color={Colors.emerald} />
                <Text style={styles.repoPillText}>nids-project (Python • ML)</Text>
              </View>
              <View style={styles.repoPill}>
                <Ionicons name="git-branch-outline" size={12} color={Colors.purple} />
                <Text style={styles.repoPillText}>SepsisGuard-AI-MCP (FastAPI)</Text>
              </View>
            </View>
          </View>
        );

      case 'receipt':
        return (
          <View style={styles.demoBox}>
            <View style={styles.demoHeaderRow}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.emerald} />
              <Text style={[styles.demoTitle, { color: Colors.emerald }]}>VERIFIED CODE RECEIPT</Text>
              <Text style={styles.demoTag}>SHA-256</Text>
            </View>
            <View style={styles.receiptBody}>
              <Text style={styles.receiptFile}>src/services/proofPackService.ts:L20-45</Text>
              <Text style={styles.receiptClaim}>
                "Deterministic Merkle root provenance generator for zero-hallucination claims"
              </Text>
              <View style={styles.receiptMetaRow}>
                <Text style={styles.receiptCommit}>Commit: 98047cc</Text>
                <View style={styles.verifiedCheckPill}>
                  <Ionicons name="checkmark" size={11} color="#FFF" />
                  <Text style={styles.verifiedCheckText}>100% Proven</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'matcher':
        return (
          <View style={styles.demoBox}>
            <View style={styles.demoHeaderRow}>
              <Ionicons name="git-compare-outline" size={14} color={Colors.purple} />
              <Text style={[styles.demoTitle, { color: Colors.purple }]}>EVIDENCE COVERAGE MATRIX</Text>
            </View>
            <View style={styles.matchRows}>
              <View style={styles.matchItemRow}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.emerald} />
                <Text style={styles.matchItemLabel}>Python & TypeScript Architecture</Text>
                <Text style={styles.matchItemStatus}>DIRECT</Text>
              </View>
              <View style={styles.matchItemRow}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.emerald} />
                <Text style={styles.matchItemLabel}>Applied AI & MCP Tooling</Text>
                <Text style={styles.matchItemStatus}>DIRECT</Text>
              </View>
              <View style={styles.matchItemRow}>
                <Ionicons name="alert-circle-outline" size={14} color={Colors.amber} />
                <Text style={styles.matchItemLabel}>Kubernetes Cluster Ingress</Text>
                <Text style={[styles.matchItemStatus, { color: Colors.amber }]}>GAP (HONEST)</Text>
              </View>
            </View>
          </View>
        );

      case 'defense':
        return (
          <View style={styles.demoBox}>
            <View style={styles.demoHeaderRow}>
              <Ionicons name="mic-outline" size={14} color={Colors.amber} />
              <Text style={[styles.demoTitle, { color: Colors.amber }]}>FAANG BAR-RAISER PROMPT</Text>
            </View>
            <View style={styles.defenseCard}>
              <Text style={styles.defenseQuestion}>
                "In nids-project, how did you tune SMOTE oversampling in `model/train_rf.py` to balance intrusion sensitivity against false alarms?"
              </Text>
              <View style={styles.defenseScorePill}>
                <Ionicons name="ribbon-outline" size={12} color={Colors.emerald} />
                <Text style={styles.defenseScoreText}>Feedback: Comprehensive Trade-Off Awareness</Text>
              </View>
            </View>
          </View>
        );

      case 'merkle':
      default:
        return (
          <View style={styles.demoBox}>
            <View style={styles.demoHeaderRow}>
              <Ionicons name="finger-print-outline" size={14} color={Colors.primary} />
              <Text style={styles.demoTitle}>ED25519 MERKLE PROOF SEAL</Text>
            </View>
            <View style={styles.merkleBox}>
              <Text style={styles.merkleHash}>Root: 0x811c9dc57f4a9b2c8e1d5a3f90e712cd58b9f3041a92e47c1b820fae</Text>
              <Text style={styles.merkleDossierMeta}>
                15 Verified Repositories • 24 Verified Code Receipts • Zero Hallucination
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Control Bar */}
          <View style={styles.topBar}>
            <View style={styles.stopBadgePill}>
              <Text style={styles.stopBadgeText}>{currentStop.badge}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }}
            >
              {/* Stop Icon & Header */}
              <LinearGradient
                colors={currentStop.accentColors}
                style={styles.iconCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={currentStop.icon} size={32} color={currentStop.badgeColor} />
              </LinearGradient>

              <Text style={styles.title}>{currentStop.title}</Text>
              <Text style={styles.tagline}>{currentStop.tagline}</Text>

              {/* Interactive Visual Widget */}
              {renderDemoWidget()}

              {/* Body Text */}
              <Text style={styles.body}>{currentStop.body}</Text>

              {/* Core Takeaway Box */}
              <View style={styles.takeawayBox}>
                <Ionicons name="bulb-outline" size={16} color={Colors.gold} />
                <Text style={styles.takeawayText}>{currentStop.takeaway}</Text>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Navigation Dock */}
          <View style={styles.footerDock}>
            {/* Progress Dots */}
            <View style={styles.dotsRow}>
              {TUTORIAL_STOPS.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => animateToStep(idx)}
                  style={[
                    styles.dot,
                    idx === currentStep && styles.dotActive,
                    idx < currentStep && styles.dotCompleted,
                  ]}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            {/* Buttons Row */}
            <View style={styles.actionButtonsRow}>
              {currentStep > 0 ? (
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={handlePrev}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipBtnText}>Skip Tour</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    currentStep === TUTORIAL_STOPS.length - 1
                      ? [Colors.emerald, '#059669']
                      : [Colors.primary, '#1D4ED8']
                  }
                  style={styles.nextBtnGradient}
                >
                  <Text style={styles.nextBtnText}>
                    {currentStep === TUTORIAL_STOPS.length - 1
                      ? 'Finish & Enter Cockpit'
                      : 'Next Stop'}
                  </Text>
                  <Ionicons
                    name={
                      currentStep === TUTORIAL_STOPS.length - 1
                        ? 'rocket-outline'
                        : 'arrow-forward'
                    }
                    size={16}
                    color="#FFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stopBadgePill: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  stopBadgeText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.primary,
    letterSpacing: 1,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    maxHeight: 520,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '900',
    marginBottom: 4,
  },
  tagline: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  body: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  demoDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
  },
  demoTitle: {
    ...Typography.label,
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    flex: 1,
  },
  demoTag: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.textSecondary,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoRepoPills: {
    gap: 6,
  },
  repoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  repoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  receiptBody: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptFile: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  receiptClaim: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptCommit: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.textMuted,
  },
  verifiedCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.emerald,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedCheckText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: '800',
  },
  matchRows: {
    gap: 6,
  },
  matchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  matchItemStatus: {
    ...Typography.label,
    fontSize: 8,
    fontWeight: '800',
    color: Colors.emerald,
  },
  defenseCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  defenseQuestion: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 16,
    marginBottom: 6,
  },
  defenseScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  defenseScoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.emerald,
  },
  merkleBox: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  merkleHash: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.primary,
    marginBottom: 4,
    lineHeight: 13,
  },
  merkleDossierMeta: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  takeawayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: Spacing.lg,
  },
  takeawayText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
    flex: 1,
  },
  footerDock: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotCompleted: {
    backgroundColor: Colors.emerald,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F1F5F9',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  nextBtn: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
