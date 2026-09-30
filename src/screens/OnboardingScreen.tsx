import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Opportunity } from '../domain/types';

export const OnboardingScreen = () => {
  const [githubUser, setGithubUser] = useState('');
  const [jdText, setJdText] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  const triggerSync = useEvidenceStore((s) => s.triggerContinuousSync);
  const setOnboardingComplete = useEvidenceStore((s) => s.setOnboardingComplete);
  const setOpportunity = useOpportunityStore((s) => s.setOpportunity);

  const handleInitialize = async () => {
    if (!githubUser.trim()) return;

    setIsInitializing(true);

    try {
      // 1. Sync GitHub data
      const syncResult = await triggerSync(githubUser);

      if (!syncResult.success) {
        Alert.alert('GitHub Sync Notice', syncResult.error || 'GitHub profile not found. Please verify the username or link.');
        setIsInitializing(false);
        return;
      }

      // 2. Save JD if provided
      if (jdText.trim()) {
        const customOpp: Opportunity = {
          id: 'opp_' + Date.now(),
          title: 'Target Engineering Role',
          companyOrContext: 'Target Organization',
          domain: 'Production Systems & Architecture',
          descriptionRaw: jdText,
          requirements: [
            {
              id: 'req_custom_1',
              name: 'Core System Programming',
              description: 'Proficiency in primary backend, systems, or application languages.',
              category: 'technical_core',
              isMustHave: true,
            },
            {
              id: 'req_custom_2',
              name: 'Modular Architecture & APIs',
              description: 'Experience authoring resilient services, endpoints, and data layers.',
              category: 'architecture',
              isMustHave: true,
            },
          ],
          createdAt: new Date().toISOString().split('T')[0],
        };
        setOpportunity(customOpp);
      } else {
        useOpportunityStore.getState().runAnalysis();
      }

      // 3. Complete Onboarding
      useInterviewStore.getState().initialize();
      setOnboardingComplete(true);
    } catch (e) {
      console.error('Failed to initialize', e);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoPill}>
            <View style={styles.solidDot} />
            <Text style={styles.brandName}>EVIDENT</Text>
          </View>
          <Text style={styles.subtitle}>Initialize Your Career Intelligence</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>GITHUB USERNAME OR URL</Text>
          <TextInput
            style={styles.input}
            value={githubUser}
            onChangeText={setGithubUser}
            placeholder="e.g. torvalds"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: Spacing.xl }]}>TARGET JOB DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={jdText}
            onChangeText={setJdText}
            placeholder="Paste the requirements of the job you want..."
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.button, !githubUser.trim() && styles.buttonDisabled]}
            onPress={handleInitialize}
            disabled={!githubUser.trim() || isInitializing}
          >
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              style={styles.buttonGradient}
            >
              {isInitializing ? (
                <Text style={styles.buttonText}>INITIALIZING...</Text>
              ) : (
                <>
                  <Text style={styles.buttonText}>BUILD ENVIRONMENT</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: Spacing.sm,
  },
  solidDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  brandName: {
    ...Typography.h1,
    color: Colors.textPrimary,
    letterSpacing: 3,
    fontWeight: '900',
    fontSize: 28,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.bgSurface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  textArea: {
    height: 120,
  },
  button: {
    marginTop: Spacing.xxl,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  buttonText: {
    ...Typography.label,
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
