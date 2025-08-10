import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Chat } from '../../types';

interface ChatHeaderProps {
  chat: Chat;
  onBackPress?: () => void;
  onCallPress?: () => void;
  onVideoPress?: () => void;
  onMorePress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onBackPress,
  onCallPress,
  onVideoPress,
  onMorePress,
}) => {
  const { theme } = useTheme();

  const getOnlineStatus = () => {
    // Mock online status - in real app, this would come from user presence
    return 'online';
  };

  const getStatusText = () => {
    if (chat.type === 'group') {
      return `${chat.participants.length} members`;
    }
    
    const status = getOnlineStatus();
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      default:
        return 'Last seen recently';
    }
  };

  const getStatusColor = () => {
    if (chat.type === 'group') {
      return theme.colors.textMuted;
    }
    
    const status = getOnlineStatus();
    switch (status) {
      case 'online':
        return theme.colors.online;
      case 'away':
        return theme.colors.away;
      default:
        return theme.colors.textMuted;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
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
    chatName: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
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
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(chat.name || 'Unknown')}
          </Text>
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.chatName} numberOfLines={1}>
            {chat.name || 'Unknown Chat'}
          </Text>
          <View style={styles.statusContainer}>
            {chat.type === 'direct' && (
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor() }
                ]}
              />
            )}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCallPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="call"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onVideoPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="videocam"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onMorePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
