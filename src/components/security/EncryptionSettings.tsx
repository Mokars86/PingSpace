import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import EncryptionService from '../../services/EncryptionService';
import DisappearingMessagesService, { DisappearingDuration } from '../../services/DisappearingMessagesService';
import ScreenshotDetectionService from '../../services/ScreenshotDetectionService';

interface EncryptionSettingsProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
  chatName: string;
  participants: string[];
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({
  visible,
  onClose,
  chatId,
  chatName,
  participants,
}) => {
  const { theme } = useTheme();
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [disappearingSettings, setDisappearingSettings] = useState<any>(null);
  const [screenshotSettings, setScreenshotSettings] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<DisappearingDuration>('off');

  const durations: { value: DisappearingDuration; label: string }[] = [
    { value: 'off', label: 'Off' },
    { value: '10s', label: '10 seconds' },
    { value: '30s', label: '30 seconds' },
    { value: '1m', label: '1 minute' },
    { value: '5m', label: '5 minutes' },
    { value: '15m', label: '15 minutes' },
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '6h', label: '6 hours' },
    { value: '12h', label: '12 hours' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' },
  ];

  useEffect(() => {
    loadSettings();
  }, [chatId]);

  const loadSettings = () => {
    // Load encryption status
    setIsEncryptionEnabled(EncryptionService.isEncryptionEnabled(chatId));
    
    // Load disappearing messages settings
    const disappearing = DisappearingMessagesService.getChatSettings(chatId);
    setDisappearingSettings(disappearing);
    setSelectedDuration(disappearing?.duration || 'off');
    
    // Load screenshot detection settings
    const screenshot = ScreenshotDetectionService.getSettings();
    setScreenshotSettings(screenshot);
  };

  const handleToggleEncryption = async () => {
    try {
      if (isEncryptionEnabled) {
        EncryptionService.disableEncryption(chatId);
        setIsEncryptionEnabled(false);
        Alert.alert('Encryption Disabled', 'Messages in this chat are no longer encrypted.');
      } else {
        await EncryptionService.enableEncryption(chatId, participants);
        setIsEncryptionEnabled(true);
        Alert.alert('Encryption Enabled', 'All new messages in this chat will be encrypted.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle encryption. Please try again.');
    }
  };

  const handleDisappearingMessages = async (duration: DisappearingDuration) => {
    try {
      if (duration === 'off') {
        await DisappearingMessagesService.disableDisappearingMessages(chatId);
        Alert.alert('Disappearing Messages Disabled', 'Messages will no longer disappear automatically.');
      } else {
        await DisappearingMessagesService.enableDisappearingMessages(chatId, duration, 'current_user');
        Alert.alert('Disappearing Messages Enabled', `Messages will disappear after ${durations.find(d => d.value === duration)?.label.toLowerCase()}.`);
      }
      setSelectedDuration(duration);
      loadSettings();
    } catch (error) {
      Alert.alert('Error', 'Failed to update disappearing messages settings.');
    }
  };

  const handleScreenshotDetection = (enabled: boolean) => {
    ScreenshotDetectionService.updateSettings({
      detectionEnabled: enabled,
      notifyOnScreenshot: enabled,
    });
    setScreenshotSettings(ScreenshotDetectionService.getSettings());
    
    if (enabled) {
      Alert.alert('Screenshot Detection Enabled', 'You will be notified if someone takes a screenshot of this chat.');
    } else {
      Alert.alert('Screenshot Detection Disabled', 'Screenshot detection has been turned off.');
    }
  };

  const handleScreenshotPrevention = (enabled: boolean) => {
    ScreenshotDetectionService.updateSettings({
      preventionEnabled: enabled,
    });
    setScreenshotSettings(ScreenshotDetectionService.getSettings());
    
    if (enabled) {
      Alert.alert('Screenshot Prevention Enabled', 'Screenshot prevention measures have been activated.');
    } else {
      Alert.alert('Screenshot Prevention Disabled', 'Screenshot prevention has been turned off.');
    }
  };

  const showKeyFingerprint = async () => {
    try {
      const fingerprint = await EncryptionService.getKeyFingerprint('current_user');
      Alert.alert(
        'Key Fingerprint',
        `Your encryption key fingerprint:\n\n${fingerprint.substring(0, 32)}...\n\nShare this with the other party to verify secure communication.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get key fingerprint.');
    }
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    sectionDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
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
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    settingAction: {
      marginLeft: theme.spacing.md,
    },
    durationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    durationOption: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      margin: theme.spacing.xs,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    selectedDuration: {
      backgroundColor: theme.colors.accent + '20',
      borderColor: theme.colors.accent,
    },
    durationText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    selectedDurationText: {
      color: theme.colors.accent,
    },
    warningBox: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    warningText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.warning,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    fingerprintButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    fingerprintButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Security Settings</Text>
            <Text style={styles.subtitle}>{chatName}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* End-to-End Encryption */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 End-to-End Encryption</Text>
            <Text style={styles.sectionDescription}>
              When enabled, only you and the recipient can read messages. Not even PingSpace can access them.
            </Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleToggleEncryption}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={isEncryptionEnabled ? theme.colors.success : theme.colors.textMuted}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Encrypt Messages</Text>
                <Text style={styles.settingDescription}>
                  {isEncryptionEnabled ? 'Messages are encrypted' : 'Messages are not encrypted'}
                </Text>
              </View>
              <Switch
                value={isEncryptionEnabled}
                onValueChange={handleToggleEncryption}
                trackColor={{ false: theme.colors.inputBackground, true: theme.colors.success }}
                thumbColor="#FFFFFF"
                style={styles.settingAction}
              />
            </TouchableOpacity>

            {isEncryptionEnabled && (
              <TouchableOpacity style={styles.fingerprintButton} onPress={showKeyFingerprint}>
                <Text style={styles.fingerprintButtonText}>View Key Fingerprint</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Disappearing Messages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Disappearing Messages</Text>
            <Text style={styles.sectionDescription}>
              Messages will automatically delete after the selected time period.
            </Text>
            
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.durationOption,
                    selectedDuration === duration.value && styles.selectedDuration,
                  ]}
                  onPress={() => handleDisappearingMessages(duration.value)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === duration.value && styles.selectedDurationText,
                    ]}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedDuration !== 'off' && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ Disappearing messages will only work if both parties have updated versions of PingSpace.
                </Text>
              </View>
            )}
          </View>

          {/* Screenshot Protection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Screenshot Protection</Text>
            <Text style={styles.sectionDescription}>
              Protect your conversations from unauthorized screenshots.
            </Text>
            
            <View style={styles.settingItem}>
              <Ionicons
                name="eye"
                size={24}
                color={screenshotSettings?.detectionEnabled ? theme.colors.accent : theme.colors.textMuted}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Screenshot Detection</Text>
                <Text style={styles.settingDescription}>
                  Get notified when someone takes a screenshot
                </Text>
              </View>
              <Switch
                value={screenshotSettings?.detectionEnabled || false}
                onValueChange={handleScreenshotDetection}
                trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
                thumbColor="#FFFFFF"
                style={styles.settingAction}
              />
            </View>

            <View style={styles.settingItem}>
              <Ionicons
                name="shield"
                size={24}
                color={screenshotSettings?.preventionEnabled ? theme.colors.success : theme.colors.textMuted}
                style={styles.settingIcon}
              />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Screenshot Prevention</Text>
                <Text style={styles.settingDescription}>
                  Attempt to prevent screenshots (limited effectiveness)
                </Text>
              </View>
              <Switch
                value={screenshotSettings?.preventionEnabled || false}
                onValueChange={handleScreenshotPrevention}
                trackColor={{ false: theme.colors.inputBackground, true: theme.colors.success }}
                thumbColor="#FFFFFF"
                style={styles.settingAction}
              />
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Screenshot prevention has limitations and may not work on all devices or with all screenshot methods.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EncryptionSettings;
