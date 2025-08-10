import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, MessageEdit } from '../../types';
import MessageManagementService from '../../services/MessageManagementService';

interface EditMessageProps {
  visible: boolean;
  onClose: () => void;
  message: Message;
  onMessageEdited?: (messageId: string, newText: string) => void;
}

const EditMessage: React.FC<EditMessageProps> = ({
  visible,
  onClose,
  message,
  onMessageEdited,
}) => {
  const { theme } = useTheme();
  const [editedText, setEditedText] = useState(message.text);
  const [reason, setReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editHistory, setEditHistory] = useState<MessageEdit[]>([]);

  useEffect(() => {
    if (visible) {
      setEditedText(message.text);
      setReason('');
      loadEditHistory();
    }
  }, [visible, message.id]);

  const loadEditHistory = () => {
    const history = MessageManagementService.getEditHistory(message.id);
    setEditHistory(history);
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    if (editedText.trim() === message.text) {
      Alert.alert('No Changes', 'No changes were made to the message');
      return;
    }

    if (editedText.length > 4000) {
      Alert.alert('Error', 'Message is too long (maximum 4000 characters)');
      return;
    }

    setIsEditing(true);

    try {
      await MessageManagementService.editMessage(
        message.id,
        editedText.trim(),
        message.senderId, // In real app, use current user ID
        reason.trim() || undefined
      );

      onMessageEdited?.(message.id, editedText.trim());
      onClose();
      Alert.alert('Success', 'Message edited successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to edit message');
    } finally {
      setIsEditing(false);
    }
  };

  const canEdit = MessageManagementService.canEditMessage(
    message.id,
    message.senderId,
    message.timestamp
  );

  const timeRemaining = MessageManagementService.formatEditTimeRemaining(message.timestamp);

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
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    content: {
      padding: theme.spacing.md,
    },
    timeWarning: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeWarningText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.warning,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    expiredWarning: {
      backgroundColor: theme.colors.error + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expiredWarningText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    originalMessage: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    originalLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
    },
    originalText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    editInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: theme.spacing.sm,
    },
    characterCount: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'right',
      marginBottom: theme.spacing.md,
    },
    overLimit: {
      color: theme.colors.error,
    },
    reasonInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    reasonLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
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
    disabledButton: {
      backgroundColor: theme.colors.textMuted,
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
    historySection: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    historyTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    historyItem: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    historyDate: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    historyReason: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
    },
    historyText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    noHistory: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });

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
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Message</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!canEdit ? (
              <View style={styles.expiredWarning}>
                <Ionicons name="time" size={20} color={theme.colors.error} />
                <Text style={styles.expiredWarningText}>
                  Edit time has expired. Messages can only be edited within 48 hours.
                </Text>
              </View>
            ) : (
              <View style={styles.timeWarning}>
                <Ionicons name="time" size={20} color={theme.colors.warning} />
                <Text style={styles.timeWarningText}>{timeRemaining}</Text>
              </View>
            )}

            <View style={styles.originalMessage}>
              <Text style={styles.originalLabel}>Original Message</Text>
              <Text style={styles.originalText}>{message.text}</Text>
            </View>

            {canEdit && (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editedText}
                  onChangeText={setEditedText}
                  placeholder="Edit your message..."
                  placeholderTextColor={theme.colors.textMuted}
                  multiline
                  maxLength={4000}
                />
                <Text style={[styles.characterCount, editedText.length > 3800 && styles.overLimit]}>
                  {editedText.length}/4000
                </Text>

                <Text style={styles.reasonLabel}>Reason for edit (optional)</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Why are you editing this message?"
                  placeholderTextColor={theme.colors.textMuted}
                  maxLength={200}
                />

                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.saveButton,
                      (isEditing || !editedText.trim() || editedText.trim() === message.text) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleSaveEdit}
                    disabled={isEditing || !editedText.trim() || editedText.trim() === message.text}
                  >
                    <Text style={[styles.buttonText, styles.saveButtonText]}>
                      {isEditing ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {editHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Edit History</Text>
                {editHistory.map((edit, index) => (
                  <View key={edit.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>
                        {edit.editedAt.toLocaleString()}
                      </Text>
                      {edit.reason && (
                        <Text style={styles.historyReason}>{edit.reason}</Text>
                      )}
                    </View>
                    <Text style={styles.historyText}>{edit.previousText}</Text>
                  </View>
                ))}
              </View>
            )}

            {editHistory.length === 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Edit History</Text>
                <Text style={styles.noHistory}>No previous edits</Text>
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditMessage;
