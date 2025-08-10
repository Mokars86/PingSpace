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
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const PrivacySecurityScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    lastSeenStatus: true,
    readReceipts: true,
    onlineStatus: true,
    phoneNumberVisibility: false,
    emailVisibility: false,
    allowFriendRequests: true,
    allowMessageRequests: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: true,
    loginAlerts: true,
    sessionTimeout: true,
    deviceManagement: true,
  });

  const [blockedUsers] = useState([
    { id: '1', name: 'John Doe', blockedAt: new Date() },
    { id: '2', name: 'Jane Smith', blockedAt: new Date() },
  ]);

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
    warningItem: {
      backgroundColor: theme.colors.warning + '10',
    },
    warningIcon: {
      backgroundColor: theme.colors.warning + '20',
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
    blockedUserItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    blockedUserAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    blockedUserInitials: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    blockedUserInfo: {
      flex: 1,
    },
    blockedUserName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    blockedUserDate: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    unblockButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    unblockButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
    },
    passwordChangeForm: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    changePasswordButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    changePasswordButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    infoCard: {
      backgroundColor: theme.colors.info + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    infoText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSecurityToggle = (key: keyof typeof securitySettings) => {
    if (key === 'twoFactorAuth' && !securitySettings.twoFactorAuth) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'This will add an extra layer of security to your account. You\'ll need to verify your identity with a code sent to your phone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setSecuritySettings(prev => ({ ...prev, [key]: true }));
              Alert.alert('2FA Enabled', 'Two-factor authentication has been enabled for your account.');
            },
          },
        ]
      );
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleUnblockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Unblock ${userName}? They will be able to message you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => {
            Alert.alert('User Unblocked', `${userName} has been unblocked.`);
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Your password has been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const privacyItems = [
    {
      icon: 'eye',
      iconColor: theme.colors.info,
      iconBg: theme.colors.info + '20',
      title: 'Profile Visibility',
      subtitle: 'Allow others to find your profile',
      value: privacySettings.profileVisibility,
      onToggle: () => handlePrivacyToggle('profileVisibility'),
    },
    {
      icon: 'time',
      iconColor: theme.colors.warning,
      iconBg: theme.colors.warning + '20',
      title: 'Last Seen Status',
      subtitle: 'Show when you were last online',
      value: privacySettings.lastSeenStatus,
      onToggle: () => handlePrivacyToggle('lastSeenStatus'),
    },
    {
      icon: 'checkmark-done',
      iconColor: theme.colors.success,
      iconBg: theme.colors.success + '20',
      title: 'Read Receipts',
      subtitle: 'Let others know when you\'ve read their messages',
      value: privacySettings.readReceipts,
      onToggle: () => handlePrivacyToggle('readReceipts'),
    },
    {
      icon: 'radio-button-on',
      iconColor: theme.colors.success,
      iconBg: theme.colors.success + '20',
      title: 'Online Status',
      subtitle: 'Show when you\'re online',
      value: privacySettings.onlineStatus,
      onToggle: () => handlePrivacyToggle('onlineStatus'),
    },
    {
      icon: 'call',
      iconColor: theme.colors.textSecondary,
      iconBg: theme.colors.textSecondary + '20',
      title: 'Phone Number Visibility',
      subtitle: 'Allow others to find you by phone number',
      value: privacySettings.phoneNumberVisibility,
      onToggle: () => handlePrivacyToggle('phoneNumberVisibility'),
    },
    {
      icon: 'mail',
      iconColor: theme.colors.textSecondary,
      iconBg: theme.colors.textSecondary + '20',
      title: 'Email Visibility',
      subtitle: 'Allow others to find you by email',
      value: privacySettings.emailVisibility,
      onToggle: () => handlePrivacyToggle('emailVisibility'),
    },
  ];

  const securityItems = [
    {
      icon: 'shield-checkmark',
      iconColor: theme.colors.success,
      iconBg: theme.colors.success + '20',
      title: 'Two-Factor Authentication',
      subtitle: 'Add extra security to your account',
      value: securitySettings.twoFactorAuth,
      onToggle: () => handleSecurityToggle('twoFactorAuth'),
      isWarning: !securitySettings.twoFactorAuth,
    },
    {
      icon: 'finger-print',
      iconColor: theme.colors.accent,
      iconBg: theme.colors.accent + '20',
      title: 'Biometric Authentication',
      subtitle: 'Use fingerprint or face ID to unlock',
      value: securitySettings.biometricAuth,
      onToggle: () => handleSecurityToggle('biometricAuth'),
    },
    {
      icon: 'notifications',
      iconColor: theme.colors.info,
      iconBg: theme.colors.info + '20',
      title: 'Login Alerts',
      subtitle: 'Get notified of new login attempts',
      value: securitySettings.loginAlerts,
      onToggle: () => handleSecurityToggle('loginAlerts'),
    },
    {
      icon: 'time',
      iconColor: theme.colors.warning,
      iconBg: theme.colors.warning + '20',
      title: 'Auto-Lock',
      subtitle: 'Automatically lock app after inactivity',
      value: securitySettings.sessionTimeout,
      onToggle: () => handleSecurityToggle('sessionTimeout'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🔒 Your privacy and security are important to us. Control who can see your information and how your account is protected.
          </Text>
        </View>

        {/* Privacy Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>
        <View style={styles.section}>
          {privacyItems.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.settingItem,
                index === privacyItems.length - 1 && styles.settingItemLast,
              ]}
            >
              <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.settingAction}>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Security Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security</Text>
        </View>
        <View style={styles.section}>
          {securityItems.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.settingItem,
                index === securityItems.length - 1 && styles.settingItemLast,
                item.isWarning && styles.warningItem,
              ]}
            >
              <View style={[
                styles.settingIcon,
                { backgroundColor: item.iconBg },
                item.isWarning && styles.warningIcon,
              ]}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.isWarning ? theme.colors.warning : item.iconColor}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.settingAction}>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Change Password */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Password</Text>
        </View>
        <View style={styles.passwordChangeForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Blocked Users */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Blocked Users ({blockedUsers.length})</Text>
        </View>
        <View style={styles.section}>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.blockedUserItem,
                  index === blockedUsers.length - 1 && styles.settingItemLast,
                ]}
              >
                <View style={styles.blockedUserAvatar}>
                  <Text style={styles.blockedUserInitials}>{getInitials(user.name)}</Text>
                </View>
                <View style={styles.blockedUserInfo}>
                  <Text style={styles.blockedUserName}>{user.name}</Text>
                  <Text style={styles.blockedUserDate}>
                    Blocked {user.blockedAt.toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() => handleUnblockUser(user.id, user.name)}
                >
                  <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.settingItem}>
              <Text style={styles.settingSubtitle}>No blocked users</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacySecurityScreen;
