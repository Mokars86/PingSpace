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
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, MoodTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/MainNavigator';
import DeviceManager, { LinkedDevice } from '../components/profile/DeviceManager';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, currentMood, setMoodTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [linkedDevices, setLinkedDevices] = useState<LinkedDevice[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      platform: 'iOS 17.1',
      lastActive: new Date(),
      isCurrentDevice: true,
      location: 'New York, US',
      linkedAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      platform: 'macOS Sonoma',
      lastActive: new Date(Date.now() - 3600000), // 1 hour ago
      isCurrentDevice: false,
      location: 'New York, US',
      linkedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    },
    {
      id: '3',
      name: 'Chrome Browser',
      type: 'web',
      platform: 'Windows 11',
      lastActive: new Date(Date.now() - 86400000 * 2), // 2 days ago
      isCurrentDevice: false,
      location: 'San Francisco, US',
      linkedAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
    },
  ]);

  const moodThemes: { key: MoodTheme; label: string; color: string; icon: string }[] = [
    { key: 'default', label: 'Default', color: theme.colors.accent, icon: 'water' },
    { key: 'energetic', label: 'Energetic', color: theme.colors.mood.energetic, icon: 'flash' },
    { key: 'calm', label: 'Calm', color: theme.colors.mood.calm, icon: 'leaf' },
    { key: 'focused', label: 'Focused', color: theme.colors.mood.focused, icon: 'eye' },
    { key: 'creative', label: 'Creative', color: theme.colors.mood.creative, icon: 'color-palette' },
    { key: 'social', label: 'Social', color: theme.colors.mood.social, icon: 'people' },
  ];

  const handleDeviceRemove = (deviceId: string) => {
    setLinkedDevices(prev => prev.filter(device => device.id !== deviceId));
    Alert.alert('Device Removed', 'The device has been successfully removed from your account.');
  };

  const handleDeviceAdd = async (deviceCode: string): Promise<boolean> => {
    // Simulate device linking process
    return new Promise((resolve) => {
      setTimeout(() => {
        if (deviceCode === 'ABC123') {
          const newDevice: LinkedDevice = {
            id: Date.now().toString(),
            name: 'New Device',
            type: 'web',
            platform: 'Chrome Browser',
            lastActive: new Date(),
            isCurrentDevice: false,
            location: 'Unknown',
            linkedAt: new Date(),
          };
          setLinkedDevices(prev => [...prev, newDevice]);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 2000);
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your local data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('Logout completed successfully');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert('Data Export', 'Your data export will be ready shortly and sent to your email.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted.') },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
    },
    userName: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      fontWeight: 'bold',
      borderBottomColor: theme.colors.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastSettingItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    settingDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    settingAction: {
      marginLeft: theme.spacing.md,
    },
    moodThemesContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    moodThemesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    moodThemeItem: {
      width: '30%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
    },
    activeMoodTheme: {
      borderWidth: 2,
    },
    moodThemeIcon: {
      marginBottom: theme.spacing.xs,
    },
    moodThemeLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
    },
    activeMoodThemeLabel: {
      color: theme.colors.accent,
    },
    chevron: {
      color: theme.colors.textMuted,
    },
    destructiveText: {
      color: theme.colors.error,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    editImageButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.accent,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    userUsername: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    userBio: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      lineHeight: 20,
    },
    userInfoRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    userInfoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
    },
    userInfoText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    editProfileText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginLeft: theme.spacing.xs,
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.name || 'User')}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'Unknown User'}</Text>
        {user?.username && (
          <Text style={styles.userUsername}>@{user.username}</Text>
        )}
        {user?.bio && (
          <Text style={styles.userBio}>{user.bio}</Text>
        )}

        <View style={styles.userInfoRow}>
          {user?.location && (
            <View style={styles.userInfoItem}>
              <Ionicons name="location" size={14} color={theme.colors.textMuted} />
              <Text style={styles.userInfoText}>{user.location}</Text>
            </View>
          )}
          {user?.joinedDate && (
            <View style={styles.userInfoItem}>
              <Ionicons name="calendar" size={14} color={theme.colors.textMuted} />
              <Text style={styles.userInfoText}>
                Joined {new Date(user.joinedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create" size={16} color={theme.colors.accent} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Themes</Text>
          <View style={styles.moodThemesContainer}>
            <View style={styles.moodThemesGrid}>
              {moodThemes.map((moodTheme) => (
                <TouchableOpacity
                  key={moodTheme.key}
                  style={[
                    styles.moodThemeItem,
                    currentMood === moodTheme.key && styles.activeMoodTheme,
                    currentMood === moodTheme.key && { borderColor: moodTheme.color },
                  ]}
                  onPress={() => setMoodTheme(moodTheme.key)}
                >
                  <Ionicons
                    name={moodTheme.icon as any}
                    size={24}
                    color={currentMood === moodTheme.key ? moodTheme.color : theme.colors.textMuted}
                    style={styles.moodThemeIcon}
                  />
                  <Text
                    style={[
                      styles.moodThemeLabel,
                      currentMood === moodTheme.key && styles.activeMoodThemeLabel,
                    ]}
                  >
                    {moodTheme.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons
              name="settings"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>All Settings</Text>
              <Text style={styles.settingDescription}>
                Manage all app settings and preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <Ionicons
              name="moon"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Toggle between light and dark themes
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
              style={styles.settingAction}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="notifications"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive push notifications for new messages
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
              style={styles.settingAction}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="mic"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Voice Commands</Text>
              <Text style={styles.settingDescription}>
                Enable voice-first interface features
              </Text>
            </View>
            <Switch
              value={voiceCommandsEnabled}
              onValueChange={setVoiceCommandsEnabled}
              trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
              style={styles.settingAction}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowDeviceManager(true)}
          >
            <Ionicons
              name="devices"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Linked Devices</Text>
              <Text style={styles.settingDescription}>
                Manage devices connected to your account ({linkedDevices.length} devices)
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastSettingItem]}>
            <Ionicons
              name="language"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons
              name="person"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingDescription}>
                Update your name, avatar, and status
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacySecurity')}
          >
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy & Security</Text>
              <Text style={styles.settingDescription}>
                Manage your privacy settings and security
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('SupportApp')}
          >
            <Ionicons
              name="heart"
              size={20}
              color={theme.colors.accent}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Support PingSpace</Text>
              <Text style={styles.settingDescription}>
                Donate, refer friends, and help us grow
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDataExport}>
            <Ionicons
              name="download"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download a copy of your data
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              style={[styles.settingAction, styles.chevron]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Ionicons
              name="log-out"
              size={20}
              color={theme.colors.error}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, styles.destructiveText]}>Logout</Text>
              <Text style={styles.settingDescription}>
                Sign out of your account
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastSettingItem]} onPress={handleDeleteAccount}>
            <Ionicons
              name="trash"
              size={20}
              color={theme.colors.error}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, styles.destructiveText]}>Delete Account</Text>
              <Text style={styles.settingDescription}>
                Permanently delete your account and data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Device Manager Modal */}
      <DeviceManager
        visible={showDeviceManager}
        onClose={() => setShowDeviceManager(false)}
        devices={linkedDevices}
        onDeviceRemove={handleDeviceRemove}
        onDeviceAdd={handleDeviceAdd}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
