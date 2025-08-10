import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export type UserStatus = 'online' | 'away' | 'busy' | 'invisible';

interface StatusOption {
  id: UserStatus;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface UserStatusSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: UserStatus;
  customMessage?: string;
  onStatusChange: (status: UserStatus, customMessage?: string) => void;
}

const UserStatusSelector: React.FC<UserStatusSelectorProps> = ({
  visible,
  onClose,
  currentStatus,
  customMessage = '',
  onStatusChange,
}) => {
  const { theme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(currentStatus);
  const [statusMessage, setStatusMessage] = useState(customMessage);

  const statusOptions: StatusOption[] = [
    {
      id: 'online',
      label: 'Online',
      icon: 'radio-button-on',
      color: '#4CAF50',
      description: 'Available to chat',
    },
    {
      id: 'away',
      label: 'Away',
      icon: 'time',
      color: '#FF9800',
      description: 'Not at my device',
    },
    {
      id: 'busy',
      label: 'Busy',
      icon: 'remove-circle',
      color: '#F44336',
      description: 'Do not disturb',
    },
    {
      id: 'invisible',
      label: 'Invisible',
      icon: 'eye-off',
      color: '#9E9E9E',
      description: 'Appear offline to others',
    },
  ];

  const handleSave = () => {
    onStatusChange(selectedStatus, statusMessage);
    onClose();
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setStatusMessage(customMessage);
    onClose();
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.xl,
      minWidth: 300,
      maxWidth: 400,
      ...theme.shadows.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    statusOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.xs,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedOption: {
      backgroundColor: theme.colors.accent + '20',
      borderColor: theme.colors.accent,
    },
    statusIcon: {
      marginRight: theme.spacing.md,
    },
    statusInfo: {
      flex: 1,
    },
    statusLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    statusDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    messageSection: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    messageLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    messageInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 40,
    },
    messageHint: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    saveButton: {
      backgroundColor: theme.colors.accent,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    saveButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity 
        style={styles.modal}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity 
          style={styles.container}
          activeOpacity={1}
          onPress={() => {}} // Prevent modal close when tapping inside
        >
          <View style={styles.header}>
            <Text style={styles.title}>Set Status</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.statusOption,
                selectedStatus === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedStatus(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={option.color}
                style={styles.statusIcon}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>{option.label}</Text>
                <Text style={styles.statusDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>Status Message (Optional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.colors.textMuted}
              value={statusMessage}
              onChangeText={setStatusMessage}
              maxLength={100}
              multiline
            />
            <Text style={styles.messageHint}>
              {statusMessage.length}/100 characters
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default UserStatusSelector;
