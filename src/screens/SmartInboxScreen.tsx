import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SmartInboxItem, Chat, Message } from '../types';

const SmartInboxScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'important' | 'muted' | 'unread' | 'todo'>('important');

  // Mock data for Smart Inbox
  const mockInboxItems: SmartInboxItem[] = [
    {
      id: '1',
      type: 'important',
      chatId: '1',
      messageId: 'msg1',
      priority: 95,
      reason: 'Contains urgent keywords and from frequent contact',
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: '2',
      type: 'important',
      chatId: '2',
      messageId: 'msg2',
      priority: 88,
      reason: 'Meeting reminder with time-sensitive information',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'todo',
      chatId: '3',
      messageId: 'msg3',
      priority: 75,
      reason: 'Contains actionable items and deadlines',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '4',
      type: 'unread',
      chatId: '4',
      messageId: 'msg4',
      priority: 60,
      reason: 'Unread message from new contact',
      timestamp: new Date(Date.now() - 10800000),
    },
  ];

  const mockChats: Record<string, Chat> = {
    '1': { id: '1', name: 'Alice Johnson', type: 'direct', participants: [], unreadCount: 1, isPinned: false, isMuted: false, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
    '2': { id: '2', name: 'Team Alpha', type: 'group', participants: [], unreadCount: 3, isPinned: false, isMuted: false, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
    '3': { id: '3', name: 'Project Beta', type: 'group', participants: [], unreadCount: 2, isPinned: false, isMuted: false, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
    '4': { id: '4', name: 'Bob Wilson', type: 'direct', participants: [], unreadCount: 1, isPinned: false, isMuted: false, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  };

  const mockMessages: Record<string, string> = {
    'msg1': 'URGENT: Please review the contract by EOD',
    'msg2': 'Team meeting moved to 3 PM today - Conference Room A',
    'msg3': 'Can you send me the quarterly reports by Friday?',
    'msg4': 'Hi! I got your contact from Sarah. Would love to discuss the project.',
  };

  const categories = [
    { key: 'important' as const, label: 'Important', icon: 'star', color: theme.colors.warning },
    { key: 'muted' as const, label: 'Muted', icon: 'volume-mute', color: theme.colors.textMuted },
    { key: 'unread' as const, label: 'Unread', icon: 'mail-unread', color: theme.colors.info },
    { key: 'todo' as const, label: 'To-Do', icon: 'checkmark-circle', color: theme.colors.success },
  ];

  const filteredItems = mockInboxItems.filter(item => item.type === selectedCategory);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleItemPress = (item: SmartInboxItem) => {
    Alert.alert(
      'Smart Inbox Item',
      `Chat: ${mockChats[item.chatId]?.name}\nMessage: ${mockMessages[item.messageId || '']}\nReason: ${item.reason}`,
      [
        { text: 'Open Chat', onPress: () => console.log('Open chat:', item.chatId) },
        { text: 'Mark as Done', onPress: () => console.log('Mark done:', item.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleConvertToTodo = (item: SmartInboxItem) => {
    Alert.alert('Convert to To-Do', 'This message has been added to your to-do list!');
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
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    categoriesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.md,
    },
    categoryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
      minWidth: 80,
    },
    activeCategoryButton: {
      backgroundColor: theme.colors.accent + '20',
    },
    categoryIcon: {
      marginBottom: theme.spacing.xs,
    },
    categoryLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeCategoryLabel: {
      color: theme.colors.accent,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    inboxItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    chatName: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    priorityBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    priorityText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    messagePreview: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    reasonContainer: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    reasonLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginBottom: 2,
    },
    reasonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timestamp: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.inputBackground,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyStateSubtext: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  const renderInboxItem = ({ item }: { item: SmartInboxItem }) => {
    const chat = mockChats[item.chatId];
    const message = mockMessages[item.messageId || ''];

    return (
      <TouchableOpacity
        style={styles.inboxItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.chatName}>{chat?.name || 'Unknown Chat'}</Text>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{item.priority}%</Text>
          </View>
        </View>

        <Text style={styles.messagePreview} numberOfLines={2}>
          {message}
        </Text>

        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>AI INSIGHT</Text>
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>

        <View style={styles.itemFooter}>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          
          <View style={styles.actionButtons}>
            {item.type !== 'todo' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleConvertToTodo(item)}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={theme.colors.success}
                />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleItemPress(item)}
            >
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Inbox</Text>
        <Text style={styles.subtitle}>
          AI-powered message prioritization and organization
        </Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons
                name={category.icon as any}
                size={24}
                color={selectedCategory === category.key ? theme.colors.accent : category.color}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.key && styles.activeCategoryLabel,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            renderItem={renderInboxItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {selectedCategory} items
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Your {selectedCategory} messages will appear here when available
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SmartInboxScreen;
