import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Shortcut {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
  badge?: number;
}

interface AppShortcutsProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const AppShortcuts: React.FC<AppShortcutsProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const shortcuts: Shortcut[] = [
    {
      id: 'new-chat',
      title: 'New Chat',
      subtitle: 'Start a conversation',
      icon: 'chatbubble-ellipses',
      color: '#4CAF50',
      action: () => {
        onClose();
        navigation.navigate('NewChatOptions');
      },
    },
    {
      id: 'new-group',
      title: 'New Group',
      subtitle: 'Create a group chat',
      icon: 'people',
      color: '#2196F3',
      action: () => {
        onClose();
        navigation.navigate('CreateGroup');
      },
    },
    {
      id: 'new-space',
      title: 'New Space',
      subtitle: 'Create a workspace',
      icon: 'apps',
      color: '#9C27B0',
      action: () => {
        onClose();
        navigation.navigate('CreateSpace');
      },
    },
    {
      id: 'smart-inbox',
      title: 'Smart Inbox',
      subtitle: 'AI-prioritized messages',
      icon: 'bulb',
      color: '#FF9800',
      action: () => {
        onClose();
        navigation.navigate('SmartInbox');
      },
      badge: 3,
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      subtitle: 'Buy and sell items',
      icon: 'storefront',
      color: '#E91E63',
      action: () => {
        onClose();
        navigation.navigate('Marketplace');
      },
    },
    {
      id: 'wallet',
      title: 'Wallet',
      subtitle: 'Manage payments',
      icon: 'wallet',
      color: '#00BCD4',
      action: () => {
        onClose();
        navigation.navigate('Wallet');
      },
    },
    {
      id: 'status',
      title: 'Add Status',
      subtitle: 'Share your moment',
      icon: 'add-circle',
      color: '#8BC34A',
      action: () => {
        onClose();
        navigation.navigate('StatusUpload');
      },
    },
    {
      id: 'discover',
      title: 'Discover',
      subtitle: 'Find new spaces',
      icon: 'compass',
      color: '#FF5722',
      action: () => {
        onClose();
        navigation.navigate('Discover');
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings',
      color: '#607D8B',
      action: () => {
        onClose();
        navigation.navigate('Settings');
      },
    },
  ];

  const quickActions = [
    {
      id: 'search',
      title: 'Search',
      icon: 'search',
      color: theme.colors.accent,
      action: () => {
        onClose();
        // Trigger search functionality
      },
    },
    {
      id: 'scan-qr',
      title: 'Scan QR',
      icon: 'qr-code',
      color: '#4CAF50',
      action: () => {
        onClose();
        // Open QR scanner
      },
    },
    {
      id: 'voice-note',
      title: 'Voice Note',
      icon: 'mic',
      color: '#FF5722',
      action: () => {
        onClose();
        // Start voice recording
      },
    },
    {
      id: 'location',
      title: 'Share Location',
      icon: 'location',
      color: '#2196F3',
      action: () => {
        onClose();
        // Share location
      },
    },
  ];

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      maxHeight: '80%',
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.textMuted,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    shortcutsGrid: {
      paddingHorizontal: theme.spacing.lg,
    },
    shortcutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    shortcutItem: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      minHeight: 100,
      justifyContent: 'center',
      ...theme.shadows.sm,
    },
    shortcutIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    shortcutTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 2,
    },
    shortcutSubtitle: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    badge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    quickActionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      justifyContent: 'space-around',
    },
    quickActionItem: {
      alignItems: 'center',
      padding: theme.spacing.sm,
    },
    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    quickActionTitle: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

  // Group shortcuts into rows of 3
  const shortcutRows = [];
  for (let i = 0; i < shortcuts.length; i += 3) {
    shortcutRows.push(shortcuts.slice(i, i + 3));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modal}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.container}
          activeOpacity={1}
          onPress={() => {}} // Prevent modal close when tapping inside
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Quick Actions</Text>
            <Text style={styles.subtitle}>Choose an action to get started</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Main Actions</Text>
              <View style={styles.shortcutsGrid}>
                {shortcutRows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.shortcutRow}>
                    {row.map((shortcut) => (
                      <TouchableOpacity
                        key={shortcut.id}
                        style={styles.shortcutItem}
                        onPress={shortcut.action}
                        activeOpacity={0.8}
                      >
                        {shortcut.badge && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{shortcut.badge}</Text>
                          </View>
                        )}
                        <View style={[styles.shortcutIcon, { backgroundColor: shortcut.color + '20' }]}>
                          <Ionicons name={shortcut.icon as any} size={24} color={shortcut.color} />
                        </View>
                        <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                        <Text style={styles.shortcutSubtitle}>{shortcut.subtitle}</Text>
                      </TouchableOpacity>
                    ))}
                    {/* Fill empty slots in the last row */}
                    {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, index) => (
                      <View key={`empty-${index}`} style={[styles.shortcutItem, { opacity: 0 }]} />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Tools</Text>
              <View style={styles.quickActionsContainer}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionItem}
                    onPress={action.action}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                      <Ionicons name={action.icon as any} size={20} color={action.color} />
                    </View>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AppShortcuts;
