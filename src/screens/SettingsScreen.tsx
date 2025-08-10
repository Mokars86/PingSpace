import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigation/MainNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    messageNotifications: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    lastSeenStatus: true,
    readReceipts: true,
    onlineStatus: true,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    settingAction: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingValue: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    dangerItem: {
      backgroundColor: theme.colors.error + '10',
    },
    dangerIcon: {
      backgroundColor: theme.colors.error + '20',
    },
    dangerTitle: {
      color: theme.colors.error,
    },
    versionInfo: {
      padding: theme.spacing.md,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    versionText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    appName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
  });

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => navigation.navigate('DeleteAccount'),
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared for download. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Export Started', 'You will receive an email when your data is ready for download.');
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          iconColor: theme.colors.accent,
          iconBg: theme.colors.accent + '20',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          action: 'toggle',
          value: isDarkMode,
          onToggle: toggleDarkMode,
        },
        {
          icon: 'color-palette',
          iconColor: theme.colors.info,
          iconBg: theme.colors.info + '20',
          title: 'Theme',
          subtitle: 'Customize app appearance',
          action: 'navigate',
          onPress: () => console.log('Theme settings'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          iconColor: theme.colors.warning,
          iconBg: theme.colors.warning + '20',
          title: 'Push Notifications',
          subtitle: 'Receive notifications on your device',
          action: 'toggle',
          value: notificationSettings.pushNotifications,
          onToggle: () => handleNotificationToggle('pushNotifications'),
        },
        {
          icon: 'chatbubble',
          iconColor: theme.colors.info,
          iconBg: theme.colors.info + '20',
          title: 'Message Notifications',
          subtitle: 'Get notified about new messages',
          action: 'toggle',
          value: notificationSettings.messageNotifications,
          onToggle: () => handleNotificationToggle('messageNotifications'),
        },
        {
          icon: 'card',
          iconColor: theme.colors.success,
          iconBg: theme.colors.success + '20',
          title: 'Payment Notifications',
          subtitle: 'Alerts for payment activities',
          action: 'toggle',
          value: notificationSettings.paymentNotifications,
          onToggle: () => handleNotificationToggle('paymentNotifications'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: 'shield-checkmark',
          iconColor: theme.colors.success,
          iconBg: theme.colors.success + '20',
          title: 'Privacy Settings',
          subtitle: 'Control who can see your information',
          action: 'navigate',
          onPress: () => navigation.navigate('PrivacySecurity'),
        },
        {
          icon: 'lock-closed',
          iconColor: theme.colors.error,
          iconBg: theme.colors.error + '20',
          title: 'Security',
          subtitle: 'Password, 2FA, and security options',
          action: 'navigate',
          onPress: () => navigation.navigate('PrivacySecurity'),
        },
        {
          icon: 'eye',
          iconColor: theme.colors.info,
          iconBg: theme.colors.info + '20',
          title: 'Profile Visibility',
          subtitle: 'Control who can find you',
          action: 'toggle',
          value: privacySettings.profileVisibility,
          onToggle: () => handlePrivacyToggle('profileVisibility'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'person',
          iconColor: theme.colors.accent,
          iconBg: theme.colors.accent + '20',
          title: 'Edit Profile',
          subtitle: 'Update your profile information',
          action: 'navigate',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          icon: 'download',
          iconColor: theme.colors.info,
          iconBg: theme.colors.info + '20',
          title: 'Export Data',
          subtitle: 'Download a copy of your data',
          action: 'navigate',
          onPress: handleExportData,
        },
        {
          icon: 'trash',
          iconColor: theme.colors.error,
          iconBg: theme.colors.error + '20',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          action: 'navigate',
          onPress: handleDeleteAccount,
          isDanger: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          iconColor: theme.colors.info,
          iconBg: theme.colors.info + '20',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          action: 'navigate',
          onPress: () => navigation.navigate('SupportApp'),
        },
        {
          icon: 'document-text',
          iconColor: theme.colors.textSecondary,
          iconBg: theme.colors.textSecondary + '20',
          title: 'Terms & Privacy',
          subtitle: 'Read our terms and privacy policy',
          action: 'navigate',
          onPress: () => console.log('Terms & Privacy'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, isLast: boolean) => (
    <TouchableOpacity
      key={item.title}
      style={[
        styles.settingItem,
        isLast && styles.settingItemLast,
        item.isDanger && styles.dangerItem,
      ]}
      onPress={item.onPress}
      disabled={item.action === 'toggle'}
    >
      <View style={[styles.settingIcon, { backgroundColor: item.iconBg }, item.isDanger && styles.dangerIcon]}>
        <Ionicons
          name={item.icon as any}
          size={18}
          color={item.isDanger ? theme.colors.error : item.iconColor}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.isDanger && styles.dangerTitle]}>
          {item.title}
        </Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.settingAction}>
        {item.action === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section) => (
          <View key={section.title}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.section}>
              {section.items.map((item, index) =>
                renderSettingItem(item, index === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        <View style={styles.versionInfo}>
          <Text style={styles.appName}>PingSpace</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>© 2024 PingSpace. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
