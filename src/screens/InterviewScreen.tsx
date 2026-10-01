/**
 * Evident Interview Defense Arena Screen
 * Prepares the student to defend the claims on their resume during technical interviews.
 * Questions are derived strictly from their actual files, commits, and trade-offs.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useInterviewStore } from '../store/useInterviewStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { GlassCard } from '../components/GlassCard';
import { EvidentButton } from '../components/EvidentButton';
import { AnimatedTextReveal } from '../components/AnimatedTextReveal';
import { AnimatedListItem } from '../components/AnimatedListItem';

interface InterviewScreenProps {
  onNavigateToPaywall: () => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ onNavigateToPaywall }) => {
  const questions = useInterviewStore((s) => s.questions);
  const currentIndex = useInterviewStore((s) => s.currentQuestionIndex);
  const userAnswers = useInterviewStore((s) => s.userAnswers);
  const evaluations = useInterviewStore((s) => s.evaluations);
  const isEvaluating = useInterviewStore((s) => s.isEvaluating);
  const initialize = useInterviewStore((s) => s.initialize);
  const setAnswer = useInterviewStore((s) => s.setAnswer);
  const evaluateCurrent = useInterviewStore((s) => s.evaluateCurrentQuestion);
  const nextQuestion = useInterviewStore((s) => s.nextQuestion);
  const previousQuestion = useInterviewStore((s) => s.previousQuestion);
  const defenseMode = useInterviewStore((s) => s.defenseMode);
  const setDefenseMode = useInterviewStore((s) => s.setDefenseMode);

  const isPro = useSubscriptionStore((s) => s.subscription.isPro);

  useEffect(() => {
    initialize();
  }, []);

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? userAnswers[currentQ.id] || '' : '';
  const currentEval = currentQ ? evaluations[currentQ.id] : undefined;

  const isSystemDesign = defenseMode === 'system_design';
  // Free tier preview: allow 1 question on code provenance; System Design Arena is 100% Pro
  const isLocked = (!isPro && isSystemDesign) || (!isPro && currentIndex >= 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.badgeRow}>
            <View style={styles.arenaBadge}>
              <Ionicons name="chatbubbles-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.arenaBadgeText}>
                {isSystemDesign ? 'SYSTEM DESIGN LIVE ARENA' : 'DEFENSE SIMULATOR'}
              </Text>
            </View>
            {questions.length > 0 && (
              <Text style={styles.progressText}>
                Question {currentIndex + 1} of {questions.length}
              </Text>
            )}
          </View>
          <AnimatedTextReveal
            text={isSystemDesign ? 'AI System Design Arena' : 'Architectural Code Defense'}
            style={styles.headerTitle}
            stagger={40}
          />
          <Text style={styles.headerSubtitle}>
            {isSystemDesign
              ? 'Simulate Staff/Principal bar-raiser trade-offs, scaling bottlenecks, and failure modes.'
              : 'Can you explain and defend the code choices appearing in your application?'}
          </Text>
        </View>

        {/* Defense Arena Mode Switcher */}
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity
            style={[
              styles.modeSegmentBtn,
              defenseMode === 'code_provenance' && styles.modeSegmentBtnActive,
            ]}
            onPress={() => setDefenseMode('code_provenance')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="code-slash-outline"
              size={13}
              color={defenseMode === 'code_provenance' ? Colors.textPrimary : Colors.textMuted}
            />
            <Text
              style={[
                styles.modeSegmentText,
                defenseMode === 'code_provenance' && styles.modeSegmentTextActive,
              ]}
            >
              Code Provenance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeSegmentBtn,
              defenseMode === 'system_design' && styles.modeSegmentBtnActivePro,
            ]}
            onPress={() => setDefenseMode('system_design')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="hardware-chip-outline"
              size={13}
              color={defenseMode === 'system_design' ? '#FFFFFF' : Colors.primary}
            />
            <Text
              style={[
                styles.modeSegmentText,
                defenseMode === 'system_design' && styles.modeSegmentTextActivePro,
              ]}
            >
              System Design Arena ⚡
            </Text>
          </TouchableOpacity>
        </View>

        {isLocked ? (
          <GlassCard style={styles.lockedCard}>
            {isSystemDesign && (
              <View style={styles.arenaProBadge}>
                <Ionicons name="sparkles" size={13} color={Colors.primary} />
                <Text style={styles.arenaProBadgeText}>REVENUECAT PRO SUITE</Text>
              </View>
            )}
            <Ionicons
              name={isSystemDesign ? 'hardware-chip-outline' : 'lock-closed'}
              size={36}
              color={Colors.primary}
              style={{ marginVertical: 6 }}
            />
            <Text style={styles.lockedTitle}>
              {isSystemDesign ? 'Unlock System Design Arena' : 'Unlock Deep Interview Defense'}
            </Text>
            <Text style={styles.lockedSubtitle}>
              {isSystemDesign
                ? 'Simulate Staff/Principal level distributed architecture grilling, 100k TPS scaling budgets, and partition tolerance tailored to your repositories.'
                : 'Pro tier provides unlimited architectural probing, trade-off evaluations, and commit citations across all your repositories.'}
            </Text>
            <EvidentButton
              title="Unlock Pro Arena (RevenueCat)"
              size="medium"
              onPress={onNavigateToPaywall}
              style={{ marginTop: Spacing.md }}
            />
          </GlassCard>
        ) : questions.length === 0 ? (
          <GlassCard style={styles.lockedCard}>
            <Ionicons name="cube-outline" size={32} color={Colors.textSecondary} />
            <Text style={styles.lockedTitle}>Awaiting Architecture</Text>
            <Text style={styles.lockedSubtitle}>
              Please sync your GitHub profile to build the environment. We need verified code artifacts before we can synthesize your architectural defense questions.
            </Text>
          </GlassCard>
        ) : (
          currentQ && (
            <View style={styles.questionSection}>
              {/* Question Card */}
              <AnimatedListItem delayIndex={1}>
              <GlassCard style={styles.qCard}>
                <View style={styles.qMeta}>
                  <Text style={styles.qProject}>{currentQ.projectName}</Text>
                  <Text style={styles.qSkill}>{currentQ.targetedSkill}</Text>
                </View>

                <Text style={styles.qText}>{currentQ.question}</Text>

                <View style={styles.sourceAnchor}>
                  <Ionicons name="code-working-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.sourceAnchorText}>
                    Targeted File: {currentQ.relevantFile}
                  </Text>
                </View>
              </GlassCard>
              </AnimatedListItem>

              {/* FAANG Bar-Raiser Blindspot Radar ($1M Tier Defense) */}
              <AnimatedListItem delayIndex={1.5}>
                {isPro ? (
                  <GlassCard style={styles.radarCard}>
                    <View style={styles.radarHeader}>
                      <View style={styles.radarPill}>
                        <Ionicons name="shield-half-outline" size={13} color={Colors.accent} />
                        <Text style={styles.radarPillText}>BAR-RAISER BLINDSPOT RADAR (PRO ACTIVE)</Text>
                      </View>
                      <Text style={styles.radarRiskBadge}>3 VECTORS ANALYZED</Text>
                    </View>
                    <Text style={styles.radarTitle}>Potential Interview Traps in this Code</Text>
                    
                    <View style={styles.vectorList}>
                      <View style={styles.vectorItem}>
                        <Ionicons name="alert-circle" size={14} color={Colors.amber} />
                        <Text style={styles.vectorText}>
                          <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>Concurrency & Race Conditions: </Text>
                          Interviewer will probe how this handles concurrent mutations or shared memory buffers.
                        </Text>
                      </View>
                      <View style={styles.vectorItem}>
                        <Ionicons name="hardware-chip-outline" size={14} color={Colors.emerald} />
                        <Text style={styles.vectorText}>
                          <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>Throughput Threshold: </Text>
                          {currentQ.keyTradeoffHint}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.defenseTipBox}>
                      <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                      <Text style={styles.defenseTipText}>
                        <Text style={{ fontWeight: '700', color: Colors.primary }}>Staff Defense Strategy: </Text>
                        Cite concrete backoff policies, idempotent mutations, and clean separation between controller logic and service state.
                      </Text>
                    </View>
                  </GlassCard>
                ) : (
                  <TouchableOpacity
                    style={styles.radarLockedCard}
                    onPress={onNavigateToPaywall}
                    activeOpacity={0.8}
                  >
                    <View style={styles.radarLockedHeader}>
                      <View style={styles.radarLockedBadge}>
                        <Ionicons name="lock-closed" size={12} color={Colors.textPrimary} />
                        <Text style={styles.radarLockedBadgeText}>PRO DEFENSE RADAR</Text>
                      </View>
                      <Text style={styles.radarLockedUpgrade}>Unlock Pro →</Text>
                    </View>
                    <Text style={styles.radarLockedTitle}>FAANG Bar-Raiser Blindspot Radar</Text>
                    <Text style={styles.radarLockedSub}>
                      2 potential architectural traps & edge-case vulnerabilities detected in `{currentQ.relevantFile}`. Unlock Pro to review before answering.
                    </Text>
                  </TouchableOpacity>
                )}
              </AnimatedListItem>

              {/* Answer Box */}
              <AnimatedListItem delayIndex={2}>
              <View style={styles.answerSection}>
                <Text style={styles.sectionLabel}>YOUR ARCHITECTURAL DEFENSE</Text>
                <TextInput
                  style={styles.answerInput}
                  multiline
                  placeholder="Explain your technical rationale, personal contribution, and trade-offs considered..."
                  placeholderTextColor={Colors.textMuted}
                  value={currentAnswer}
                  onChangeText={(text) => setAnswer(currentQ.id, text)}
                />

                <EvidentButton
                  title={currentEval ? 'Re-Evaluate Defense' : 'Evaluate Architectural Defense'}
                  loading={isEvaluating}
                  onPress={evaluateCurrent}
                  size="medium"
                  style={{ marginTop: Spacing.sm }}
                />
              </View>
              </AnimatedListItem>

              {/* Defense Evaluation Feedback Card */}
              {currentEval && (
                <AnimatedListItem delayIndex={3}>
                <GlassCard style={styles.evalCard}>
                  <View style={styles.evalHeader}>
                    <Ionicons name="analytics-outline" size={16} color={Colors.textPrimary} />
                    <Text style={styles.evalTitle}>DEFENSE EVALUATION</Text>
                  </View>

                  <View style={styles.evalScoresRow}>
                    <View style={styles.evalScorePill}>
                      <Text style={styles.evalScoreLabel}>TECHNICAL DEPTH</Text>
                      <Text style={[styles.evalScoreValue, { color: Colors.accent }]}>
                        {currentEval.technicalUnderstanding}
                      </Text>
                    </View>
                    <View style={styles.evalScorePill}>
                      <Text style={styles.evalScoreLabel}>CONTRIBUTION</Text>
                      <Text style={[styles.evalScoreValue, { color: Colors.emerald }]}>
                        {currentEval.contributionClarity}
                      </Text>
                    </View>
                    <View style={styles.evalScorePill}>
                      <Text style={styles.evalScoreLabel}>TRADE-OFFS</Text>
                      <Text style={[styles.evalScoreValue, { color: Colors.amber }]}>
                        {currentEval.tradeoffAwareness}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.evalNotes}>{currentEval.feedbackNotes}</Text>

                  <View style={styles.citationBox}>
                    <Ionicons name="bulb-outline" size={14} color={Colors.gold} />
                    <Text style={styles.citationText}>
                      Code Citation Tip: {currentEval.codeCitationSuggestion}
                    </Text>
                  </View>
                </GlassCard>
                </AnimatedListItem>
              )}

              {/* Navigation Buttons */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
                  disabled={currentIndex === 0}
                  onPress={previousQuestion}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
                  <Text style={styles.navBtnText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.navBtn,
                    currentIndex === questions.length - 1 && styles.navBtnDisabled,
                  ]}
                  disabled={currentIndex === questions.length - 1}
                  onPress={nextQuestion}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navBtnText}>Next Question</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          )
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerBox: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  arenaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  arenaBadgeText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  questionSection: {
    marginTop: Spacing.lg,
  },
  qCard: {
    padding: Spacing.md,
  },
  qMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  qProject: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qSkill: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
  },
  qText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  sourceAnchor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.codeBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sourceAnchorText: {
    ...Typography.code,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  answerSection: {
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 6,
  },
  answerInput: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    color: Colors.textPrimary,
    padding: Spacing.md,
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 13,
    lineHeight: 19,
  },
  evalCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  evalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  evalTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  evalScoresRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  evalScorePill: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  evalScoreLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 8,
    marginBottom: 2,
  },
  evalScoreValue: {
    ...Typography.label,
    fontSize: 10,
    fontWeight: '700',
  },
  evalNotes: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  citationText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontSize: 11,
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  lockedCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  lockedTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  lockedSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  radarCard: {
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  radarPillText: {
    ...Typography.label,
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.accent,
  },
  radarRiskBadge: {
    ...Typography.label,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  radarTitle: {
    ...Typography.h3,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  vectorList: {
    gap: 6,
    marginVertical: 4,
  },
  vectorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 6,
    borderRadius: BorderRadius.sm,
  },
  vectorText: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  defenseTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    padding: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  defenseTipText: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 16,
  },
  radarLockedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed',
    gap: 4,
  },
  radarLockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radarLockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radarLockedBadgeText: {
    ...Typography.label,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  radarLockedUpgrade: {
    ...Typography.label,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  radarLockedTitle: {
    ...Typography.h3,
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  radarLockedSub: {
    ...Typography.bodySmall,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  modeSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  modeSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeSegmentBtnActivePro: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modeSegmentText: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 10.5,
    fontWeight: '700',
  },
  modeSegmentTextActive: {
    color: Colors.textPrimary,
  },
  modeSegmentTextActivePro: {
    color: '#FFFFFF',
  },
  arenaProBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginBottom: 4,
  },
  arenaProBadgeText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
