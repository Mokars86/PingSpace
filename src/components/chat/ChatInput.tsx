import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Message } from '../../types';

interface ChatInputProps {
  onSendMessage: (text: string, replyToId?: string) => void;
  onSendVoiceMessage?: (voiceMessage: any) => void;
  onAttachPress?: () => void;
  onVoicePress?: () => void;
  onAIPress?: () => void;
  onSchedulePress?: () => void;
  onSendMoney?: () => void;
  recipientName?: string;
  recipientId?: string;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoiceMessage,
  onAttachPress,
  onVoicePress,
  onAIPress,
  onSchedulePress,
  onSendMoney,
  recipientName,
  recipientId,
  replyingTo,
  onCancelReply,
  onTypingStart,
  onTypingStop,
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [showSmartTools, setShowSmartTools] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), replyingTo?.id);
      setMessage('');
      setShowSmartTools(false);
      onCancelReply?.();
    }
  };

  const toggleSmartTools = () => {
    const toValue = showSmartTools ? 0 : 1;
    setShowSmartTools(!showSmartTools);
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleVoicePress = () => {
    if (isRecording) {
      setIsRecording(false);
      Alert.alert('Voice Recording', 'Recording stopped');
    } else {
      setIsRecording(true);
      Alert.alert('Voice Recording', 'Recording started');
      onVoicePress?.();
    }
  };

  const handleAIPress = () => {
    Alert.alert(
      'AI Assistant',
      'Choose an AI action:',
      [
        { text: 'Summarize', onPress: () => console.log('Summarize') },
        { text: 'Translate', onPress: () => console.log('Translate') },
        { text: 'Rephrase', onPress: () => console.log('Rephrase') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
    onAIPress?.();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
    },
    textInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      maxHeight: 120,
      paddingVertical: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    sendButton: {
      backgroundColor: theme.colors.accent,
    },
    voiceButton: {
      backgroundColor: isRecording ? theme.colors.error : theme.colors.buttonSecondary,
    },
    smartToolsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.sm,
    },
    smartToolButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      minWidth: 60,
    },
    toolsToggleButton: {
      backgroundColor: theme.colors.buttonSecondary,
    },
    replyPreview: {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyContent: {
      flex: 1,
    },
    replyLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
      marginBottom: 2,
    },
    replyText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    cancelReplyButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      {/* Reply Preview */}
      {replyingTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>Replying to</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cancelReplyButton}
            onPress={onCancelReply}
          >
            <Ionicons name="close" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toolsToggleButton]}
          onPress={toggleSmartTools}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showSmartTools ? 'chevron-down' : 'add'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            onTypingStart?.();
          }}
          onEndEditing={onTypingStop}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          textAlignVertical="center"
        />

        {message.trim() ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.sendButton]}
            onPress={handleSend}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.voiceButton]}
            onPress={handleVoicePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
      </View>

      {showSmartTools && (
        <Animated.View
          style={[
            styles.smartToolsContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              opacity: slideAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.smartToolButton}
            onPress={onAttachPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="attach"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smartToolButton}
            onPress={handleAIPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="sparkles"
              size={20}
              color={theme.colors.accent}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smartToolButton}
            onPress={onSchedulePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smartToolButton}
            onPress={onSendMoney}
            activeOpacity={0.7}
          >
            <Ionicons
              name="card"
              size={20}
              color={theme.colors.success}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smartToolButton}
            onPress={() => Alert.alert('Undo Send', 'Feature coming soon!')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-undo"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default ChatInput;
