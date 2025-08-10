import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Chat } from '../../types';
import PresenceService from '../../services/PresenceService';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onChatSelect,
  onDeleteChat,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return matchesSearch && chat.unreadCount > 0;
      case 'pinned':
        return matchesSearch && chat.isPinned;
      default:
        return matchesSearch;
    }
  });

  const formatLastMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    header: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    filterButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.accent,
    },
    filterText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedChatItem: {
      backgroundColor: theme.colors.accent + '20',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
    },
    chatInfo: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    chatName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    timestamp: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    lastMessageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastMessage: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    unreadLastMessage: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.medium,
    },
    rightSection: {
      alignItems: 'flex-end',
    },
    unreadBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      marginTop: 2,
    },
    unreadText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
    },
    pinnedIcon: {
      marginLeft: theme.spacing.xs,
    },
    mutedIcon: {
      marginLeft: theme.spacing.xs,
    },
    avatarContainer: {
      position: 'relative',
    },
    presenceIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    lastSeenText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
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

  const handleDeleteChat = (chat: Chat) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete the chat with ${chat.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteChat(chat.id),
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedChat?.id === item.id;
    const hasUnread = item.unreadCount > 0;

    // Get presence info for direct chats
    const otherParticipant = item.type === 'direct' ? item.participants.find(p => p !== '1') : null;
    const presenceStatus = otherParticipant ? PresenceService.getUserStatus(otherParticipant) : null;
    const lastSeen = otherParticipant ? PresenceService.formatLastSeen(otherParticipant) : null;
    const statusColor = otherParticipant ? PresenceService.getStatusColor(otherParticipant) : null;

    return (
      <TouchableOpacity
        style={[styles.chatItem, isSelected && styles.selectedChatItem]}
        onPress={() => onChatSelect(item)}
        onLongPress={() => handleDeleteChat(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(item.name || 'Unknown')}
            </Text>
          </View>
          {/* Presence indicator for direct chats */}
          {item.type === 'direct' && statusColor && (
            <View style={[styles.presenceIndicator, { backgroundColor: statusColor }]} />
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name || 'Unknown Chat'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.isPinned && (
                <Ionicons
                  name="pin"
                  size={12}
                  color={theme.colors.accent}
                  style={styles.pinnedIcon}
                />
              )}
              {item.isMuted && (
                <Ionicons
                  name="volume-mute"
                  size={12}
                  color={theme.colors.textMuted}
                  style={styles.mutedIcon}
                />
              )}
              <Text style={styles.timestamp}>
                {item.lastMessage && formatLastMessageTime(item.lastMessage.timestamp)}
              </Text>
            </View>
          </View>

          <View style={styles.lastMessageContainer}>
            <Text
              style={[
                styles.lastMessage,
                hasUnread && styles.unreadLastMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage?.text || 'No messages yet'}
            </Text>
            {/* Show last seen for direct chats */}
            {item.type === 'direct' && lastSeen && presenceStatus !== 'online' && (
              <Text style={styles.lastSeenText}>
                Last seen {lastSeen}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount.toString()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search chats..."
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'unread', 'pinned'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === filterType && styles.activeFilterText,
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatList;
