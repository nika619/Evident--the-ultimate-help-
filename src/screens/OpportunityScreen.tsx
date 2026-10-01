/**
 * Evident Opportunity Screen
 * Analyzes target internship/job requirements against the student's Evidence Graph,
 * generating a transparent Evidence Coverage Matrix without false precision.
 */

import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { GlassCard } from '../components/GlassCard';
import { EvidentButton } from '../components/EvidentButton';
import { SAMPLE_OPPORTUNITY } from '../domain/fixtures';

interface OpportunityScreenProps {
  onNavigateToApplication: () => void;
}

export const OpportunityScreen: React.FC<OpportunityScreenProps> = ({
  onNavigateToApplication,
}) => {
  const opportunity = useOpportunityStore((s) => s.opportunity);
  const matches = useOpportunityStore((s) => s.matches);
  const coverage = useOpportunityStore((s) => s.coverage);
  const isAnalyzing = useOpportunityStore((s) => s.isAnalyzing);
  const runAnalysis = useOpportunityStore((s) => s.runAnalysis);
  const setOpportunity = useOpportunityStore((s) => s.setOpportunity);

  const [isEditingJD, setIsEditingJD] = useState(false);
  const [jdText, setJdText] = useState(opportunity.descriptionRaw);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Opportunity Card Header */}
        <LinearGradient
          colors={['#E0F2FE', '#FFFFFF']}
          style={styles.targetCard}
        >
          <View style={styles.glowOrbCyan} />
          <View style={styles.targetBadge}>
            <Text style={styles.targetBadgeText}>ACTIVE TARGET</Text>
          </View>
          <Text style={styles.targetTitle}>{opportunity.title}</Text>
          <Text style={styles.targetContext}>{opportunity.companyOrContext}</Text>
          <Text style={styles.targetDomain}>{opportunity.domain}</Text>

          <TouchableOpacity
            style={styles.toggleJdBtn}
            onPress={() => setIsEditingJD(!isEditingJD)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isEditingJD ? 'chevron-up' : 'document-text-outline'}
              size={13}
              color={Colors.textSecondary}
            />
            <Text style={styles.toggleJdText}>
              {isEditingJD ? 'Hide Job Description Text' : 'Inspect / Edit Job Description'}
            </Text>
          </TouchableOpacity>

          {isEditingJD && (
            <View style={styles.jdEditorBox}>
              <TextInput
                style={styles.jdInput}
                multiline
                value={jdText}
                onChangeText={setJdText}
                placeholder="Paste Job Description here..."
                placeholderTextColor={Colors.textMuted}
              />
              <EvidentButton
                title="Re-Match Against Proof Graph"
                size="small"
                onPress={() => {
                  setOpportunity({ ...opportunity, descriptionRaw: jdText });
                  setIsEditingJD(false);
                }}
              />
            </View>
          )}
        </LinearGradient>

        {/* Evidence Coverage Matrix (Honest & Transparent) */}
        {coverage && (
          <View style={styles.coverageSection}>
            <View style={styles.coverageHeader}>
              <Ionicons name="pie-chart-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.sectionHeaderTitle}>VERIFIABLE EVIDENCE COVERAGE</Text>
            </View>

            <GlassCard style={styles.coverageCard}>
              <Text style={styles.coverageSummaryText}>{coverage.summarySentence}</Text>

              <View style={styles.coverageStatsGrid}>
                <View style={[styles.statBox, { borderColor: Colors.emerald }]}>
                  <Text style={[styles.statNum, { color: Colors.emerald }]}>
                    {coverage.directCount}
                  </Text>
                  <Text style={styles.statLabel}>DIRECT PROVEN</Text>
                </View>

                <View style={[styles.statBox, { borderColor: Colors.amber }]}>
                  <Text style={[styles.statNum, { color: Colors.amber }]}>
                    {coverage.supportedCount}
                  </Text>
                  <Text style={styles.statLabel}>SUPPORTED</Text>
                </View>

                <View style={[styles.statBox, { borderColor: Colors.purple }]}>
                  <Text style={[styles.statNum, { color: Colors.purple }]}>
                    {coverage.partialCount}
                  </Text>
                  <Text style={styles.statLabel}>PARTIAL</Text>
                </View>

                <View style={[styles.statBox, { borderColor: Colors.borderSubtle }]}>
                  <Text style={[styles.statNum, { color: Colors.textMuted }]}>
                    {coverage.notFoundCount}
                  </Text>
                  <Text style={styles.statLabel}>GROWTH VECTOR</Text>
                </View>
              </View>

              <View style={styles.mustHavePill}>
                <Ionicons name="checkmark-circle-outline" size={15} color={Colors.textPrimary} />
                <Text style={styles.mustHaveText}>
                  {coverage.coveredMustHaves} of {coverage.totalMustHaves} core must-have requirements backed by code
                </Text>
              </View>
            </GlassCard>
          </View>
        )}

        {/* Requirement Match Breakdown List */}
        <View style={styles.requirementsSection}>
          <Text style={styles.sectionHeaderTitle}>REQUIREMENT PROVENANCE BREAKDOWN</Text>

          <View style={styles.matchList}>
            {matches.map((match) => (
              <View key={match.requirementId} style={styles.matchCard}>
                <View style={styles.matchCardHeader}>
                  <View style={styles.reqNameRow}>
                    <Text style={styles.reqTitle}>{match.requirementName}</Text>
                    {match.isMustHave && (
                      <View style={styles.mustHaveTag}>
                        <Text style={styles.mustHaveTagText}>MUST HAVE</Text>
                      </View>
                    )}
                  </View>
                  <EvidenceBadge status={match.status} />
                </View>

                <Text style={styles.matchRationale}>{match.rationale}</Text>

                {match.topProjectName && (
                  <View style={styles.projectTag}>
                    <Ionicons name="git-branch-outline" size={11} color={Colors.textSecondary} />
                    <Text style={styles.projectTagText}>
                      Backed by project: {match.topProjectName}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom CTA to Application Studio */}
        <View style={styles.ctaBox}>
          <EvidentButton
            title="Synthesize Grounded Bullets →"
            size="large"
            onPress={onNavigateToApplication}
          />
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  targetCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  glowOrbCyan: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#38BDF8',
    opacity: 0.15,
  },
  targetBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  targetBadgeText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  targetTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  targetContext: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  targetDomain: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  toggleJdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingVertical: 6,
  },
  toggleJdText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 9.5,
  },
  jdEditorBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.codeBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  jdInput: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    minHeight: 80,
    marginBottom: Spacing.sm,
  },
  coverageSection: {
    marginTop: Spacing.lg,
  },
  coverageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  sectionHeaderTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 11,
  },
  coverageCard: {
    padding: Spacing.md,
  },
  coverageSummaryText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  coverageStatsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  statNum: {
    ...Typography.h2,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.label,
    color: '#475569',
    fontSize: 8.5,
    marginTop: 2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mustHavePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  mustHaveText: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  requirementsSection: {
    marginTop: Spacing.xl,
  },
  matchList: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  matchCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reqNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  reqTitle: {
    ...Typography.h3,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  mustHaveTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  mustHaveTagText: {
    ...Typography.label,
    color: '#DC2626',
    fontSize: 8,
    fontWeight: '800',
  },
  matchRationale: {
    ...Typography.bodySmall,
    color: '#334155',
    lineHeight: 18,
    fontSize: 12,
    marginBottom: 6,
  },
  projectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  projectTagText: {
    ...Typography.code,
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '600',
  },
  ctaBox: {
    marginTop: Spacing.xl,
  },
});
