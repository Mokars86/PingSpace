import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TabParamList } from '../../navigation/TabNavigator';

interface TabItem {
  key: keyof TabParamList;
  icon: string;
  label: string;
  badge?: number;
}

interface VerticalTabBarProps {
  activeTab: keyof TabParamList;
  onTabPress: (tab: keyof TabParamList) => void;
}

const VerticalTabBar: React.FC<VerticalTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme } = useTheme();

  const tabs: TabItem[] = [
    { key: 'Chat', icon: 'chatbubbles', label: 'Chat', badge: 3 },
    { key: 'Spaces', icon: 'grid', label: 'Spaces' },
    { key: 'SmartInbox', icon: 'brain', label: 'Smart' },
    { key: 'Discover', icon: 'search', label: 'Discover' },
    { key: 'Profile', icon: 'person', label: 'Profile' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingTop: theme.spacing.lg,
    },
    tabContainer: {
      flex: 1,
      paddingVertical: theme.spacing.md,
    },
    tab: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      position: 'relative',
    },
    activeTab: {
      backgroundColor: theme.colors.accent + '20',
    },
    iconContainer: {
      position: 'relative',
      marginBottom: theme.spacing.xs,
    },
    tabLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      textAlign: 'center',
    },
    activeTabLabel: {
      color: theme.colors.accent,
    },
    inactiveTabLabel: {
      color: theme.colors.textMuted,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.full,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontFamily: theme.typography.fontFamily.bold,
    },
    bottomSection: {
      paddingBottom: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.md,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: theme.spacing.sm,
    },
    userInitial: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
    },
    statusIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.online,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
  });

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.key;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => onTabPress(tab.key)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={isActive ? theme.colors.accent : theme.colors.textMuted}
          />
          {tab.badge && tab.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {tab.badge > 99 ? '99+' : tab.badge.toString()}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabLabel,
            isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map(renderTab)}
      </View>
      
      {/* User section at bottom */}
      <View style={styles.bottomSection}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>J</Text>
          <View style={styles.statusIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerticalTabBar;
