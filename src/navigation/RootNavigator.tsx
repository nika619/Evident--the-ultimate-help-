/**
 * Evident Root Navigator (Pure Mobile Architecture)
 * 5-Tab mobile navigation with true navigation stack history,
 * native back button support, and Android hardware back handling.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  LandingScreen,
} from '../screens';
import { Header } from '../components/Header';
import { InteractiveTutorial } from '../components/InteractiveTutorial';
import { useEvidenceStore } from '../store/useEvidenceStore';

export type ScreenKey =
  | 'home'
  | 'landing'
  | 'evidence'
  | 'opportunity'
  | 'application'
  | 'interview'
  | 'history'
  | 'account'
  | 'pro';

const SCREEN_TITLES: Record<ScreenKey, string> = {
  home: 'Home',
  landing: 'Evident Welcome',
  evidence: 'Evidence Graph',
  opportunity: 'Role Matching',
  application: 'Application Studio',
  interview: 'Defense Arena',
  history: 'Audit History',
  account: 'Account & Settings',
  pro: 'Evident Pro ⚡',
};

export const RootNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 32 : 10);
  const [navigationStack, setNavigationStack] = useState<ScreenKey[]>(['home']);
  const [tutorialVisible, setTutorialVisible] = useState<boolean>(false);
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
            onNavigateToPaywall={() => navigateTo('pro')}
            onOpenTutorial={() => setTutorialVisible(true)}
            onOpenLanding={() => navigateTo('landing')}
          />
        );
      case 'landing':
        return (
          <LandingScreen
            onEnterCockpit={() => switchTab('home')}
            onOpenTutorial={() => setTutorialVisible(true)}
            onExploreNikaProfile={() => {
              useEvidenceStore.getState().initialize();
              switchTab('home');
            }}
            onConnectGitHub={() => {
              useEvidenceStore.getState().setOnboardingComplete(false);
            }}
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
            onNavigateToPaywall={() => navigateTo('pro')}
          />
        );
      case 'interview':
        return <InterviewScreen onNavigateToPaywall={() => navigateTo('pro')} />;
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
            onNavigateToPaywall={() => navigateTo('pro')}
            onGoBack={goBack}
            onOpenTutorial={() => setTutorialVisible(true)}
            onOpenLanding={() => navigateTo('landing')}
          />
        );
      case 'pro':
        return <PaywallScreen onClose={goBack} />;
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
        onPressPro={() => navigateTo('pro')}
        onPressSync={triggerSync}
      />

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* 5-Tab Pure Mobile Bottom Bar with Apple Glassmorphism */}
      <View style={[styles.tabBar, { paddingBottom: bottomPadding + 6 }]}>
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

      {/* 5-Stop Guided Trip Tutorial Modal */}
      <InteractiveTutorial
        visible={tutorialVisible}
        onClose={() => setTutorialVisible(false)}
        onComplete={() => {
          useEvidenceStore.getState().setHasSeenTutorial(true);
          setTutorialVisible(false);
        }}
      />
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
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 7,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          boxShadow:
            '0 -8px 28px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
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
    marginTop: 3,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
});

