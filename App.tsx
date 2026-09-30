/**
 * Evident — Code-Grounded Career Intelligence Engine
 * Entry Point for Devpost RevenueCat Shipathon 2026
 *
 * Core Thesis:
 * "Your resume should describe what you can prove.
 *  Evident remembers what you have done. Apply knows when it matters."
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme';
import { useEvidenceStore } from './src/store/useEvidenceStore';
import { useOpportunityStore } from './src/store/useOpportunityStore';
import { useInterviewStore } from './src/store/useInterviewStore';
import { useSubscriptionStore } from './src/store/useSubscriptionStore';

export default function App() {
  const initializeEvidence = useEvidenceStore((s) => s.initialize);
  const initializeOpportunity = useOpportunityStore((s) => s.initialize);
  const initializeInterview = useInterviewStore((s) => s.initialize);
  const initializeSubscription = useSubscriptionStore((s) => s.initializeSubscription);

  useEffect(() => {
    initializeEvidence();
    initializeOpportunity();
    initializeInterview();
    initializeSubscription();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.outerShell}>
        <View style={styles.appContainer}>
          <StatusBar style="light" />
          <RootNavigator />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: '#05060A',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: Colors.bgPrimary,
    overflow: 'hidden',
  },
});
