/**
 * Evident — Code-Grounded Career Intelligence Engine
 * Entry Point for Devpost RevenueCat Shipathon 2026
 *
 * Core Thesis:
 * "Your resume should describe what you can prove.
 *  Evident remembers what you have done. Apply knows when it matters."
 */

import React, { useEffect, useRef } from 'react';
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
import { CloudCursorBackground } from './src/components/CloudCursorBackground';

export default function App() {
  const initializeEvidence = useEvidenceStore((s) => s.initialize);
  const initializeOpportunity = useOpportunityStore((s) => s.initialize);
  const initializeInterview = useInterviewStore((s) => s.initialize);
  const initializeSubscription = useSubscriptionStore((s) => s.initializeSubscription);

  // Dynamic Background State centered on mount
  const pointerX = useRef(new Animated.Value(150)).current;
  const pointerY = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    initializeEvidence();
    initializeOpportunity();
    initializeInterview();
    initializeSubscription();
  }, []);

  const handlePointerMove = (e: any) => {
    // Calculate relative coordinates in the appContainer
    Animated.spring(pointerX, {
      toValue: e.nativeEvent.pageX - 200, // Center the 400x400 orb
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
    Animated.spring(pointerY, {
      toValue: e.nativeEvent.pageY - 200,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.outerShell} onPointerMove={handlePointerMove}>
        <View style={styles.appContainer}>
          {/* Dynamic Cursor Glow Background */}
          <View style={styles.dynamicBackground}>
            <CloudCursorBackground pointerX={pointerX} pointerY={pointerY} />
          </View>

          <StatusBar style="dark" />
          <RootNavigator />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#E2E8F0' : Colors.bgPrimary,
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
