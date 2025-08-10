import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Alert,
  Clipboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, Reaction } from '../../types';
import VoicePlayer from '../voice/VoicePlayer';

interface MessageBubbleProps {
  message: Message;
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
  onStar?: (messageId: string) => void;
  onCopy?: (text: string) => void;
  onDoubleTap?: (messageId: string) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onUnpin?: (messageId: string) => void;
  repliedMessage?: Message; // The message being replied to
  showDeliveryReceipts?: boolean;
  currentUserId?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReaction,
  onReply,
  onForward,
  onLongPress,
  onStar,
  onCopy,
  onDoubleTap,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  repliedMessage,
  showDeliveryReceipts = true,
  currentUserId = '1',
}) => {
  const { theme } = useTheme();
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);
  const scaleAnim = new Animated.Value(1);

  const isOwnMessage = message.senderId === '1'; // Current user ID

  const handleLongPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowActions(true);
    onLongPress?.(message);
  };

  const handleReply = () => {
    setShowActions(false);
    onReply?.(message);
  };

  const handleForward = () => {
    setShowActions(false);
    onForward?.(message);
  };

  const handleReact = () => {
    setShowActions(false);
    setShowReactions(true);
  };

  const handleStar = () => {
    setShowActions(false);
    onStar?.(message.id);
  };

  const handleCopy = () => {
    setShowActions(false);
    onCopy?.(message.text);
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap detected - add heart reaction
      onDoubleTap?.(message.id);
      onReaction?.(message.id, '❤️');
    } else {
      // Single tap
      setLastTap(now);
    }
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit?.(message);
  };

  const handlePin = () => {
    setShowActions(false);
    if (message.isPinned) {
      onUnpin?.(message.id);
    } else {
      onPin?.(message.id);
    }
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(message.id),
        },
      ]
    );
  };

  const renderDeliveryReceipts = () => {
    if (!showDeliveryReceipts || !isOwnMessage || !message.deliveryReceipts) {
      return null;
    }

    const { deliveryReceipts } = message;
    let icon = 'checkmark';
    let color = theme.colors.textMuted;

    if (deliveryReceipts.readAt) {
      icon = 'checkmark-done';
      color = theme.colors.accent;
    } else if (deliveryReceipts.deliveredAt) {
      icon = 'checkmark-done';
      color = theme.colors.textMuted;
    } else if (deliveryReceipts.sentAt) {
      icon = 'checkmark';
      color = theme.colors.textMuted;
    }

    return (
      <View style={styles.deliveryReceipts}>
        <Ionicons name={icon as any} size={12} color={color} />
      </View>
    );
  };

  const renderLinkPreviews = () => {
    if (!message.linkPreviews || message.linkPreviews.length === 0) {
      return null;
    }

    return (
      <View style={styles.linkPreviews}>
        {message.linkPreviews.map((preview, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkPreview}
            onPress={() => {
              // In a real app, open the URL
              console.log('Opening URL:', preview.url);
            }}
          >
            {preview.image && (
              <Image source={{ uri: preview.image }} style={styles.linkPreviewImage} />
            )}
            <View style={styles.linkPreviewContent}>
              {preview.title && (
                <Text style={styles.linkPreviewTitle} numberOfLines={2}>
                  {preview.title}
                </Text>
              )}
              {preview.description && (
                <Text style={styles.linkPreviewDescription} numberOfLines={2}>
                  {preview.description}
                </Text>
              )}
              {preview.siteName && (
                <Text style={styles.linkPreviewSite}>
                  {preview.siteName}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return 'time-outline';
      case 'sent':
        return 'checkmark';
      case 'delivered':
        return 'checkmark-done';
      case 'read':
        return 'checkmark-done';
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (message.status) {
      case 'read':
        return theme.colors.accent;
      case 'delivered':
        return theme.colors.success;
      default:
        return theme.colors.textMuted;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    messageRow: {
      flexDirection: isOwnMessage ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
    },
    bubble: {
      maxWidth: '75%',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: isOwnMessage 
        ? theme.colors.messageSent 
        : theme.colors.messageReceived,
    },
    ownBubble: {
      borderBottomRightRadius: theme.borderRadius.sm,
    },
    otherBubble: {
      borderBottomLeftRadius: theme.borderRadius.sm,
    },
    messageText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: isOwnMessage ? '#FFFFFF' : theme.colors.text,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
    },
    messageFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    timestamp: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted,
      marginRight: theme.spacing.xs,
    },
    statusIcon: {
      marginLeft: theme.spacing.xs,
    },
    reactionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs,
      marginHorizontal: theme.spacing.sm,
    },
    reactionBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    reactionEmoji: {
      fontSize: 12,
      marginRight: 2,
    },
    reactionCount: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    quickReactions: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginTop: theme.spacing.xs,
      ...theme.shadows.md,
    },
    quickReactionButton: {
      padding: theme.spacing.sm,
      marginHorizontal: theme.spacing.xs,
    },
    quickReactionEmoji: {
      fontSize: 20,
    },
    replyIndicator: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      paddingLeft: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    replyText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      fontStyle: 'italic',
    },
    actionsModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.xl,
      minWidth: 200,
      ...theme.shadows.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.xs,
    },
    actionButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    cancelButton: {
      backgroundColor: theme.colors.error + '20',
    },
    cancelButtonText: {
      color: theme.colors.error,
    },
    deleteButton: {
      backgroundColor: theme.colors.error + '20',
    },
    deleteButtonText: {
      color: theme.colors.error,
    },
    deliveryReceipts: {
      alignSelf: 'flex-end',
      marginTop: 2,
      marginRight: theme.spacing.xs,
    },
    starIcon: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: theme.colors.warning,
      borderRadius: 8,
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinIcon: {
      position: 'absolute',
      top: -2,
      right: 20, // Offset from star icon
      backgroundColor: theme.colors.accent,
      borderRadius: 8,
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timestampContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editedIndicator: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
      fontStyle: 'italic',
    },
    linkPreviews: {
      marginTop: theme.spacing.sm,
    },
    linkPreview: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    linkPreviewImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    linkPreviewContent: {
      padding: theme.spacing.sm,
    },
    linkPreviewTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    linkPreviewDescription: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    linkPreviewSite: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textMuted,
    },
    moneyTransferContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
    moneyTransferIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.success,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    moneyTransferText: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.success,
      fontWeight: '600',
    },
  });

  const quickReactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) {
      return null;
    }

    const reactionGroups = message.reactions.reduce((groups, reaction) => {
      if (!groups[reaction.emoji]) {
        groups[reaction.emoji] = [];
      }
      groups[reaction.emoji].push(reaction);
      return groups;
    }, {} as Record<string, Reaction[]>);

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(reactionGroups).map(([emoji, reactions]) => (
          <TouchableOpacity
            key={emoji}
            style={styles.reactionBubble}
            onPress={() => onReaction?.(message.id, emoji)}
          >
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            <Text style={styles.reactionCount}>{reactions.length}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.messageRow}>
        <TouchableOpacity
          style={[
            styles.bubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
          onPress={handleTap}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          {/* Star indicator */}
          {message.isStarred && (
            <View style={styles.starIcon}>
              <Ionicons name="star" size={10} color="#FFFFFF" />
            </View>
          )}

          {/* Pin indicator */}
          {message.isPinned && (
            <View style={styles.pinIcon}>
              <Ionicons name="pin" size={10} color="#FFFFFF" />
            </View>
          )}
          {message.replyTo && repliedMessage && (
            <View style={styles.replyIndicator}>
              <Text style={styles.replyText}>
                Replying to: {repliedMessage.text.length > 50
                  ? repliedMessage.text.substring(0, 50) + '...'
                  : repliedMessage.text}
              </Text>
            </View>
          )}
          
          {message.type === 'money_transfer' ? (
            <View style={styles.moneyTransferContainer}>
              <View style={styles.moneyTransferIcon}>
                <Ionicons name="card" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.moneyTransferText}>{message.text}</Text>
            </View>
          ) : message.type === 'voice' && message.metadata?.voiceMessage ? (
            <VoicePlayer
              voiceMessage={message.metadata.voiceMessage}
              isOwnMessage={isOwnMessage}
            />
          ) : (
            <Text style={styles.messageText}>{message.text}</Text>
          )}
          
          {/* Link Previews */}
          {renderLinkPreviews()}

          <View style={styles.messageFooter}>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>
                {formatTime(message.timestamp)}
              </Text>
              {message.isEdited && (
                <Text style={styles.editedIndicator}>edited</Text>
              )}
            </View>
            {isOwnMessage && getStatusIcon() && (
              <Ionicons
                name={getStatusIcon() as any}
                size={12}
                color={getStatusColor()}
                style={styles.statusIcon}
              />
            )}
          </View>
        </TouchableOpacity>

        {/* Delivery Receipts */}
        {renderDeliveryReceipts()}
      </View>

      {renderReactions()}

      {showReactions && (
        <View style={styles.quickReactions}>
          {quickReactionEmojis.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={styles.quickReactionButton}
              onPress={() => {
                onReaction?.(message.id, emoji);
                setShowReactions(false);
              }}
            >
              <Text style={styles.quickReactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Message Actions Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          style={styles.actionsModal}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
              <Ionicons name="arrow-undo" size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleForward}>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>Forward</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleReact}>
              <Ionicons name="happy" size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>React</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleStar}>
              <Ionicons name={message.isStarred ? "star" : "star-outline"} size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>{message.isStarred ? 'Unstar' : 'Star'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <Ionicons name="copy" size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>

            {/* Edit button - only for own messages within edit time limit */}
            {isOwnMessage && (
              <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                <Ionicons name="create" size={20} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {/* Pin/Unpin button */}
            <TouchableOpacity style={styles.actionButton} onPress={handlePin}>
              <Ionicons
                name={message.isPinned ? "pin" : "pin-outline"}
                size={20}
                color={theme.colors.text}
              />
              <Text style={styles.actionButtonText}>
                {message.isPinned ? 'Unpin' : 'Pin'}
              </Text>
            </TouchableOpacity>

            {/* Delete button - only for own messages */}
            {isOwnMessage && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={20} color={theme.colors.error} />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setShowActions(false)}
            >
              <Ionicons name="close" size={20} color={theme.colors.error} />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
};

export default MessageBubble;
