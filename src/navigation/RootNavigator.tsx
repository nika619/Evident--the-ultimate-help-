/**
 * Evident Root Navigator (Pure Mobile Architecture)
 * 5-Tab mobile navigation with true navigation stack history,
 * native back button support, and Android hardware back handling.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, BackHandler, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import {
  HomeScreen,
  EvidenceScreen,
  OpportunityScreen,
  ApplicationScreen,
  InterviewScreen,
  HistoryScreen,
  AccountScreen,
  PaywallScreen,
  OnboardingScreen,
} from '../screens';
import { Header } from '../components/Header';
import { useEvidenceStore } from '../store/useEvidenceStore';

export type ScreenKey =
  | 'home'
  | 'evidence'
  | 'opportunity'
  | 'application'
  | 'interview'
  | 'history'
  | 'account';

const SCREEN_TITLES: Record<ScreenKey, string> = {
  home: 'Home',
  evidence: 'Evidence Graph',
  opportunity: 'Role Matching',
  application: 'Application Studio',
  interview: 'Defense Arena',
  history: 'Audit History',
  account: 'Account & Legal',
};

export const RootNavigator: React.FC = () => {
  const [navigationStack, setNavigationStack] = useState<ScreenKey[]>(['home']);
  const [paywallVisible, setPaywallVisible] = useState<boolean>(false);
  const triggerSync = useEvidenceStore((s) => s.triggerContinuousSync);
  const hasCompletedOnboarding = useEvidenceStore((s) => s.hasCompletedOnboarding);

  const currentScreen = navigationStack[navigationStack.length - 1] || 'home';

  const navigateTo = (screen: ScreenKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNavigationStack((prev) => [...prev, screen]);
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNavigationStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return ['home'];
    });
  };

  const switchTab = (tab: ScreenKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNavigationStack([tab]);
  };

  // Hardware Back Button for Android APK
  useEffect(() => {
    const onBackPress = () => {
      if (navigationStack.length > 1) {
        goBack();
        return true;
      }
      return false;
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSub.remove();
  }, [navigationStack]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToEvidence={() => navigateTo('evidence')}
            onNavigateToOpportunity={() => navigateTo('opportunity')}
            onNavigateToApplication={() => navigateTo('application')}
            onNavigateToInterview={() => navigateTo('interview')}
            onNavigateToHistory={() => navigateTo('history')}
            onNavigateToAccount={() => navigateTo('account')}
            onNavigateToPaywall={() => setPaywallVisible(true)}
          />
        );
      case 'opportunity':
        return (
          <OpportunityScreen
            onNavigateToApplication={() => navigateTo('application')}
          />
        );
      case 'application':
        return (
          <ApplicationScreen
            onNavigateToInterview={() => navigateTo('interview')}
            onNavigateToPaywall={() => setPaywallVisible(true)}
          />
        );
      case 'interview':
        return <InterviewScreen onNavigateToPaywall={() => setPaywallVisible(true)} />;
      case 'history':
        return (
          <HistoryScreen
            onNavigateToApplication={() => navigateTo('application')}
            onNavigateToInterview={() => navigateTo('interview')}
            onNavigateToEvidence={() => navigateTo('evidence')}
          />
        );
      case 'account':
        return (
          <AccountScreen
            onNavigateToPaywall={() => setPaywallVisible(true)}
            onGoBack={goBack}
          />
        );
      case 'evidence':
      default:
        return (
          <EvidenceScreen
            onNavigateToOpportunity={() => navigateTo('opportunity')}
          />
        );
    }
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  const canGoBack = navigationStack.length > 1 || currentScreen !== 'home';

  return (
    <View style={styles.container}>
      {/* Top Mobile Cockpit Header with Back Button */}
      <Header
        canGoBack={canGoBack}
        onGoBack={goBack}
        title={SCREEN_TITLES[currentScreen]}
        onPressPro={() => setPaywallVisible(true)}
        onPressSync={triggerSync}
      />

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* 5-Tab Pure Mobile Bottom Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => switchTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={currentScreen === 'home' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'home' && styles.tabLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => switchTab('evidence')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'evidence' ? 'layers' : 'layers-outline'}
            size={20}
            color={currentScreen === 'evidence' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'evidence' && styles.tabLabelActive,
            ]}
          >
            Evidence
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => switchTab('application')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'application' ? 'document-text' : 'document-text-outline'}
            size={20}
            color={currentScreen === 'application' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'application' && styles.tabLabelActive,
            ]}
          >
            Apply
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => switchTab('history')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'history' ? 'time' : 'time-outline'}
            size={20}
            color={currentScreen === 'history' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'history' && styles.tabLabelActive,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => switchTab('account')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentScreen === 'account' ? 'person' : 'person-outline'}
            size={20}
            color={currentScreen === 'account' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'account' && styles.tabLabelActive,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Paywall Modal */}
      {paywallVisible && (
        <PaywallScreen onClose={() => setPaywallVisible(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.08)',
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 6,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.04)',
        } as any)
      : {}),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.xs,
    minWidth: 54,
  },
  tabLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
