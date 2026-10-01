/**
 * Evident — Code-Grounded Career Intelligence Engine
 * Entry Point for Devpost RevenueCat Shipathon 2026
 *
 * Core Thesis:
 * "Your resume should describe what you can prove.
 *  Evident remembers what you have done. Apply knows when it matters."
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme';
import { useEvidenceStore } from './src/store/useEvidenceStore';
import { useOpportunityStore } from './src/store/useOpportunityStore';
import { useInterviewStore } from './src/store/useInterviewStore';
import { useSubscriptionStore } from './src/store/useSubscriptionStore';
import { LinearGradient } from 'expo-linear-gradient';
import { AmbientAuroraBackground } from './src/components/AmbientAuroraBackground';
import { LoadingScreen } from './src/screens/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const initializeEvidence = useEvidenceStore((s) => s.initialize);
  const initializeOpportunity = useOpportunityStore((s) => s.initialize);
  const initializeInterview = useInterviewStore((s) => s.initialize);
  const initializeSubscription = useSubscriptionStore((s) => s.initializeSubscription);

  useEffect(() => {
    initializeEvidence();
    initializeOpportunity();
    initializeInterview();
    initializeSubscription();

    // On Web: inject Google Fonts for Apple/Linear-grade typography combo (Inter + JetBrains Mono)
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontId = 'evident-typography-fonts';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.outerShell}>
        {Platform.OS === 'web' && (
          <LinearGradient
            colors={['#0B0F17', '#111827', '#1E293B']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <View style={styles.appContainer}>
          {/* Autonomous 3D Ambient Light Aurora (Mobile & Web Native - No Pointer Tracking) */}
          <View style={styles.dynamicBackground}>
            <AmbientAuroraBackground />
          </View>

          <StatusBar style="dark" />
          <RootNavigator />
          {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: '#0B0F17',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : ('100%' as any),
    backgroundColor: Colors.bgPrimary,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          maxHeight: 920,
        }
      : {}),
  },
  dynamicBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.bgPrimary,
    zIndex: -1, // Keep behind all content
  },
  glowOrb: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.6,
    // Add shadow to heavily blur the gradient edge
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
});
