import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, Chat } from '../../types';

interface MessageSearchProps {
  visible: boolean;
  onClose: () => void;
  messages: Message[];
  chats: Chat[];
  onMessageSelect: (message: Message, chat: Chat) => void;
}

interface SearchResult {
  message: Message;
  chat: Chat;
  highlightedText: string;
}

const MessageSearch: React.FC<MessageSearchProps> = ({
  visible,
  onClose,
  messages,
  chats,
  onMessageSelect,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery.trim());
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results: SearchResult[] = [];
      const lowercaseQuery = query.toLowerCase();

      messages.forEach((message) => {
        if (message.text.toLowerCase().includes(lowercaseQuery)) {
          const chat = chats.find(c => c.id === message.chatId);
          if (chat) {
            // Highlight the search term in the message
            const highlightedText = highlightSearchTerm(message.text, query);
            results.push({
              message,
              chat,
              highlightedText,
            });
          }
        }
      });

      // Sort by timestamp (most recent first)
      results.sort((a, b) => b.message.timestamp.getTime() - a.message.timestamp.getTime());
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const highlightSearchTerm = (text: string, query: string): string => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '**$1**'); // Use ** for highlighting
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        onMessageSelect(item.message, item.chat);
        onClose();
      }}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.chatName}>{item.chat.name || 'Unknown Chat'}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.message.timestamp)}</Text>
      </View>
      <Text style={styles.messageText} numberOfLines={2}>
        {item.message.text}
      </Text>
    </TouchableOpacity>
  );

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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      margin: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
    },
    clearButton: {
      padding: theme.spacing.sm,
    },
    resultsContainer: {
      flex: 1,
    },
    resultItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    chatName: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
    },
    timestamp: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    messageText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
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
      marginBottom: theme.spacing.sm,
    },
    emptyStateSubtext: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
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
          <Text style={styles.title}>Search Messages</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in messages..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="search" size={32} color={theme.colors.textMuted} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => `${item.message.id}-${item.chat.id}`}
              showsVerticalScrollIndicator={false}
            />
          ) : searchQuery.length > 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyStateText}>No messages found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyStateText}>Search your messages</Text>
              <Text style={styles.emptyStateSubtext}>
                Type to search across all your conversations
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MessageSearch;
