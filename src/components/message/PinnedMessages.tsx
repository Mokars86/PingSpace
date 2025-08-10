import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, PinnedMessage } from '../../types';
import MessageManagementService from '../../services/MessageManagementService';
import MessageBubble from '../chat/MessageBubble';

interface PinnedMessagesProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
  messages: Message[];
  currentUserId: string;
  onNavigateToMessage?: (messageId: string) => void;
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  visible,
  onClose,
  chatId,
  messages,
  currentUserId,
  onNavigateToMessage,
}) => {
  const { theme } = useTheme();
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);

  useEffect(() => {
    if (visible) {
      loadPinnedMessages();
    }
  }, [visible, chatId]);

  const loadPinnedMessages = () => {
    const pinned = MessageManagementService.getPinnedMessages(chatId);
    setPinnedMessages(pinned.sort((a, b) => b.pinnedAt.getTime() - a.pinnedAt.getTime()));
  };

  const handleUnpinMessage = (messageId: string) => {
    Alert.alert(
      'Unpin Message',
      'Are you sure you want to unpin this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unpin',
          style: 'destructive',
          onPress: async () => {
            try {
              await MessageManagementService.unpinMessage(messageId, chatId);
              loadPinnedMessages();
            } catch (error) {
              Alert.alert('Error', 'Failed to unpin message');
            }
          },
        },
      ]
    );
  };

  const handleClearAllPinned = () => {
    Alert.alert(
      'Clear All Pinned Messages',
      'Are you sure you want to unpin all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await MessageManagementService.clearAllPinnedMessages(chatId);
              loadPinnedMessages();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear pinned messages');
            }
          },
        },
      ]
    );
  };

  const renderPinnedMessage = ({ item }: { item: PinnedMessage }) => {
    const message = messages.find(m => m.id === item.messageId);
    if (!message) {
      return (
        <View style={styles.deletedMessage}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.textMuted} />
          <Text style={styles.deletedMessageText}>Message no longer available</Text>
        </View>
      );
    }

    return (
      <View style={styles.pinnedMessageContainer}>
        <View style={styles.pinnedHeader}>
          <View style={styles.pinnedInfo}>
            <Ionicons name="pin" size={16} color={theme.colors.accent} />
            <Text style={styles.pinnedBy}>
              Pinned by {item.pinnedBy} • {item.pinnedAt.toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.unpinButton}
            onPress={() => handleUnpinMessage(item.messageId)}
          >
            <Ionicons name="close" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {item.reason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonText}>"{item.reason}"</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => {
            onNavigateToMessage?.(item.messageId);
            onClose();
          }}
          activeOpacity={0.7}
        >
          <MessageBubble
            message={message}
            showDeliveryReceipts={false}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goToButton}
          onPress={() => {
            onNavigateToMessage?.(item.messageId);
            onClose();
          }}
        >
          <Text style={styles.goToButtonText}>Go to message</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
    );
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    clearAllButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.error + '20',
    },
    clearAllText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.error,
    },
    content: {
      flex: 1,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statsText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    pinnedMessageContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    pinnedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.accent + '10',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pinnedInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    pinnedBy: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    unpinButton: {
      padding: theme.spacing.xs,
    },
    reasonContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
    },
    reasonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    messageContainer: {
      padding: theme.spacing.sm,
    },
    goToButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    goToButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginRight: theme.spacing.xs,
    },
    deletedMessage: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    deletedMessageText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.sm,
    },
    limitWarning: {
      backgroundColor: theme.colors.warning + '20',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    limitWarningText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.warning,
      textAlign: 'center',
    },
  });

  const pinnedCount = pinnedMessages.length;
  const isNearLimit = pinnedCount >= 45; // Warn when approaching 50 limit

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Pinned Messages</Text>
          <View style={styles.headerActions}>
            {pinnedCount > 0 && (
              <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAllPinned}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {pinnedCount > 0 && (
          <View style={styles.statsContainer}>
            <Ionicons name="pin" size={16} color={theme.colors.accent} />
            <Text style={styles.statsText}>
              {' '}{pinnedCount} pinned message{pinnedCount !== 1 ? 's' : ''} (max 50)
            </Text>
          </View>
        )}

        {isNearLimit && (
          <View style={styles.limitWarning}>
            <Text style={styles.limitWarningText}>
              Approaching pin limit ({pinnedCount}/50). Consider unpinning old messages.
            </Text>
          </View>
        )}

        <View style={styles.content}>
          {pinnedCount === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="pin-outline" 
                size={64} 
                color={theme.colors.textMuted} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>No Pinned Messages</Text>
              <Text style={styles.emptyStateText}>
                Long press on any message and tap the pin icon to save important messages here.
                Pinned messages help keep important information easily accessible.
              </Text>
            </View>
          ) : (
            <FlatList
              data={pinnedMessages}
              renderItem={renderPinnedMessage}
              keyExtractor={(item) => item.messageId}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PinnedMessages;
