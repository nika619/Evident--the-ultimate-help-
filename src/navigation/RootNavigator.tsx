/**
 * Evident Root Navigator
 * Clean Bottom Tabs with dark cockpit styling and smooth transitions.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import {
  EvidenceScreen,
  OpportunityScreen,
  ApplicationScreen,
  InterviewScreen,
  PaywallScreen,
} from '../screens';
import { Header } from '../components/Header';
import { useEvidenceStore } from '../store/useEvidenceStore';

export type TabKey = 'evidence' | 'opportunity' | 'application' | 'interview';

export const RootNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('evidence');
  const [paywallVisible, setPaywallVisible] = useState<boolean>(false);
  const triggerSync = useEvidenceStore((s) => s.triggerContinuousSync);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'opportunity':
        return (
          <OpportunityScreen
            onNavigateToApplication={() => setActiveTab('application')}
          />
        );
      case 'application':
        return (
          <ApplicationScreen
            onNavigateToInterview={() => setActiveTab('interview')}
            onNavigateToPaywall={() => setPaywallVisible(true)}
          />
        );
      case 'interview':
        return <InterviewScreen onNavigateToPaywall={() => setPaywallVisible(true)} />;
      case 'evidence':
      default:
        return (
          <EvidenceScreen
            onNavigateToOpportunity={() => setActiveTab('opportunity')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header
        onPressPro={() => setPaywallVisible(true)}
        onPressSync={triggerSync}
      />

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Bottom Cockpit Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('evidence')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'evidence' ? 'layers' : 'layers-outline'}
            size={19}
            color={activeTab === 'evidence' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'evidence' && styles.tabLabelActive,
            ]}
          >
            Evidence
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('opportunity')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'opportunity' ? 'briefcase' : 'briefcase-outline'}
            size={19}
            color={activeTab === 'opportunity' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'opportunity' && styles.tabLabelActive,
            ]}
          >
            Opportunity
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('application')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'application' ? 'document-text' : 'document-text-outline'}
            size={19}
            color={activeTab === 'application' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'application' && styles.tabLabelActive,
            ]}
          >
            Application
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('interview')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'interview' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={19}
            color={activeTab === 'interview' ? Colors.primary : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'interview' && styles.tabLabelActive,
            ]}
          >
            Defense
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
    backgroundColor: Colors.bgPrimary,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  tabLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontSize: 9.5,
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
