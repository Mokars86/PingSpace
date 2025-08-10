import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { StarredMessage, Message, Chat } from '../../types';
import MessageBubble from './MessageBubble';

interface StarredMessagesViewProps {
  visible: boolean;
  onClose: () => void;
  starredMessages: StarredMessage[];
  messages: Message[];
  chats: Chat[];
  onUnstar: (messageId: string) => void;
  onNavigateToMessage: (messageId: string, chatId: string) => void;
}

const StarredMessagesView: React.FC<StarredMessagesViewProps> = ({
  visible,
  onClose,
  starredMessages,
  messages,
  chats,
  onUnstar,
  onNavigateToMessage,
}) => {
  const { theme } = useTheme();
  const [groupedMessages, setGroupedMessages] = useState<{ [chatId: string]: { chat: Chat; messages: Message[] } }>({});

  useEffect(() => {
    groupMessagesByChat();
  }, [starredMessages, messages, chats]);

  const groupMessagesByChat = () => {
    const grouped: { [chatId: string]: { chat: Chat; messages: Message[] } } = {};

    starredMessages.forEach(starred => {
      const message = messages.find(m => m.id === starred.messageId);
      const chat = chats.find(c => c.id === starred.chatId);

      if (message && chat) {
        if (!grouped[starred.chatId]) {
          grouped[starred.chatId] = {
            chat,
            messages: [],
          };
        }
        grouped[starred.chatId].messages.push(message);
      }
    });

    // Sort messages within each chat by timestamp
    Object.values(grouped).forEach(group => {
      group.messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    setGroupedMessages(grouped);
  };

  const handleUnstarAll = () => {
    Alert.alert(
      'Unstar All Messages',
      'Are you sure you want to remove all starred messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unstar All',
          style: 'destructive',
          onPress: () => {
            starredMessages.forEach(starred => onUnstar(starred.messageId));
          },
        },
      ]
    );
  };

  const renderChatGroup = ({ item }: { item: { chatId: string; data: { chat: Chat; messages: Message[] } } }) => (
    <View style={styles.chatGroup}>
      <View style={styles.chatHeader}>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.data.chat.name || 'Unknown Chat'}</Text>
          <Text style={styles.messageCount}>
            {item.data.messages.length} starred message{item.data.messages.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewChatButton}
          onPress={() => {
            onNavigateToMessage(item.data.messages[0].id, item.chatId);
            onClose();
          }}
        >
          <Ionicons name="arrow-forward" size={16} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      {item.data.messages.map((message, index) => (
        <View key={message.id} style={styles.messageContainer}>
          <MessageBubble
            message={message}
            onStar={onUnstar}
            showDeliveryReceipts={false}
          />
          <TouchableOpacity
            style={styles.goToMessageButton}
            onPress={() => {
              onNavigateToMessage(message.id, item.chatId);
              onClose();
            }}
          >
            <Text style={styles.goToMessageText}>Go to message</Text>
            <Ionicons name="arrow-forward" size={12} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const chatGroups = Object.entries(groupedMessages).map(([chatId, data]) => ({
    chatId,
    data,
  }));

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
    unstarAllButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.error + '20',
      marginLeft: theme.spacing.sm,
    },
    unstarAllText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.error,
    },
    content: {
      flex: 1,
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
    chatGroup: {
      marginBottom: theme.spacing.lg,
    },
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chatInfo: {
      flex: 1,
    },
    chatName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    messageCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    viewChatButton: {
      padding: theme.spacing.sm,
    },
    messageContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '50',
    },
    goToMessageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    goToMessageText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginRight: theme.spacing.xs,
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
          <Text style={styles.title}>Starred Messages</Text>
          <View style={styles.headerActions}>
            {starredMessages.length > 0 && (
              <TouchableOpacity style={styles.unstarAllButton} onPress={handleUnstarAll}>
                <Text style={styles.unstarAllText}>Unstar All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {starredMessages.length > 0 && (
          <View style={styles.statsContainer}>
            <Ionicons name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.statsText}>
              {' '}{starredMessages.length} starred message{starredMessages.length !== 1 ? 's' : ''} across {Object.keys(groupedMessages).length} chat{Object.keys(groupedMessages).length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          {starredMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="star-outline" 
                size={64} 
                color={theme.colors.textMuted} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>No Starred Messages</Text>
              <Text style={styles.emptyStateText}>
                Long press on any message and tap the star icon to save important messages here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={chatGroups}
              renderItem={renderChatGroup}
              keyExtractor={(item) => item.chatId}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StarredMessagesView;
