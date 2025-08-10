import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Message, Chat } from '../types';
import { RootStackParamList } from '../navigation/MainNavigator';

import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import ChatList from '../components/chat/ChatList';
import StatusList from '../components/status/StatusList';
import SendMoneyModal from '../components/chat/SendMoneyModal';
import MessageSearch from '../components/chat/MessageSearch';
import UserStatusSelector, { UserStatus } from '../components/ui/UserStatusSelector';
import ContactSync from '../components/ui/ContactSync';
import AppShortcuts from '../components/ui/AppShortcuts';
import TypingIndicator from '../components/chat/TypingIndicator';
import EncryptionSettings from '../components/security/EncryptionSettings';
import CallInterface from '../components/call/CallInterface';
import EncryptionService from '../services/EncryptionService';
import DisappearingMessagesService from '../services/DisappearingMessagesService';
import ScreenshotDetectionService from '../services/ScreenshotDetectionService';
import CallService, { CallSession } from '../services/CallService';
import StarredMessagesService from '../services/StarredMessagesService';
import LinkPreviewService from '../services/LinkPreviewService';
import PresenceService from '../services/PresenceService';
import GroupManagementService from '../services/GroupManagementService';
import PollService from '../services/PollService';
import MessageManagementService from '../services/MessageManagementService';
import SubGroupService from '../services/SubGroupService';
import StarredMessagesView from '../components/chat/StarredMessagesView';
import GroupManagement from '../components/group/GroupManagement';
import CreatePoll from '../components/poll/CreatePoll';
import EditMessage from '../components/message/EditMessage';
import PinnedMessages from '../components/message/PinnedMessages';
import SubGroups from '../components/group/SubGroups';
import VoiceMessageService, { VoiceMessage } from '../services/VoiceMessageService';
import VoiceInput from '../components/chat/VoiceInput';



type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [showContactSync, setShowContactSync] = useState(false);
  const [showAppShortcuts, setShowAppShortcuts] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>('online');
  const [statusMessage, setStatusMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showEncryptionSettings, setShowEncryptionSettings] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [starredMessages, setStarredMessages] = useState<any[]>([]);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showEditMessage, setShowEditMessage] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showSubGroups, setShowSubGroups] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Initialize services on component mount
  useEffect(() => {
    initializeServices();
  }, []);

  // Mock data for demonstration
  const [mockChats, setMockChats] = useState<Chat[]>([
    {
      id: '1',
      type: 'direct',
      name: 'Alice Johnson',
      participants: ['1', '2'],
      unreadCount: 2,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: {
        id: '1',
        text: 'Hey! How are you doing?',
        senderId: '2',
        chatId: '1',
        timestamp: new Date(),
        type: 'text',
        status: 'read',
      },
    },
    {
      id: '2',
      type: 'group',
      name: 'Team Alpha',
      participants: ['1', '2', '3', '4'],
      unreadCount: 5,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: {
        id: '2',
        text: 'Meeting at 3 PM today',
        senderId: '3',
        chatId: '2',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered',
      },
    },
  ]);

  const mockMessages: Message[] = [
    {
      id: '1',
      text: 'Hey! How are you doing?',
      senderId: '2',
      chatId: '1',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read',
    },
    {
      id: '2',
      text: 'I\'m doing great! Just working on the new PingSpace features.',
      senderId: '1',
      chatId: '1',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read',
    },
    {
      id: '3',
      text: 'That sounds exciting! Can\'t wait to see what you\'ve built.',
      senderId: '2',
      chatId: '1',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      status: 'read',
    },
  ];

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(mockMessages);
  };

  const handleDeleteChat = (chatId: string) => {
    // Remove the chat from the list
    setMockChats(prevChats => prevChats.filter(chat => chat.id !== chatId));

    // If the deleted chat was selected, clear the selection
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }

    console.log(`Chat ${chatId} deleted`);
  };

  const handleSendMessage = async (text: string, replyToId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: '1', // Current user
      chatId: selectedChat?.id || '1',
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
      replyTo: replyToId,
      deliveryReceipts: {
        sentAt: new Date(),
      },
    };

    // Process link previews
    const linkPreviews = await LinkPreviewService.processMessageForPreviews(text);
    if (linkPreviews.length > 0) {
      newMessage.linkPreviews = linkPreviews;
    }

    setMessages(prev => [...prev, newMessage]);
    setReplyingTo(null); // Clear reply state after sending

    // Simulate delivery and read receipts
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, status: 'delivered', deliveryReceipts: { ...msg.deliveryReceipts, deliveredAt: new Date() } }
          : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, status: 'read', deliveryReceipts: { ...msg.deliveryReceipts, readAt: new Date() } }
          : msg
      ));
    }, 3000);
  };

  const handleStatusPress = (userId: string) => {
    navigation.navigate('StatusViewer', { userId });
  };

  const handleAddStatusPress = () => {
    navigation.navigate('StatusUpload');
  };



  const handleNewChatPress = () => {
    navigation.navigate('NewChatOptions');
  };

  const handleSendMoney = () => {
    if (selectedChat) {
      setShowSendMoneyModal(true);
    } else {
      Alert.alert('No Chat Selected', 'Please select a chat to send money.');
    }
  };

  const handleSendMoneySuccess = (amount: number, note: string) => {
    // Create a money transfer message
    const moneyMessage: Message = {
      id: Date.now().toString(),
      text: `💰 Sent $${amount.toFixed(2)}${note ? `\n📝 ${note}` : ''}`,
      senderId: '1', // Current user
      chatId: selectedChat?.id || '1',
      timestamp: new Date(),
      type: 'money_transfer',
      status: 'sent',
      metadata: {
        amount,
        note,
        transferType: 'sent',
      },
    };

    setMessages(prev => [...prev, moneyMessage]);

    // You would also update the wallet balance here
    // and send the transaction to the backend
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
    setMessages([]);
    setReplyingTo(null);
  };

  const handleMessageReaction = (messageId: string, emoji: string) => {
    // Update message with reaction
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.userId === '1' && r.emoji === emoji);

        if (existingReaction) {
          // Remove reaction
          return {
            ...msg,
            reactions: reactions.filter(r => r.id !== existingReaction.id),
          };
        } else {
          // Add reaction
          return {
            ...msg,
            reactions: [...reactions, {
              id: Date.now().toString(),
              emoji,
              userId: '1',
              timestamp: new Date(),
            }],
          };
        }
      }
      return msg;
    }));
  };

  const handleMessageReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleMessageForward = (message: Message) => {
    Alert.alert(
      'Forward Message',
      'Choose where to forward this message',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Select Chat', onPress: () => {
          // Navigate to chat selection for forwarding
          console.log('Forward message:', message.text);
        }},
      ]
    );
  };

  const handleMessageSearch = (message: Message, chat: Chat) => {
    setSelectedChat(chat);
    setMessages([message]); // In a real app, load the full conversation
  };

  const handleStatusChange = (status: UserStatus, customMessage?: string) => {
    setUserStatus(status);
    setStatusMessage(customMessage || '');
    // In a real app, update the user's status on the server
  };

  const handleContactsSync = (contacts: any[]) => {
    // In a real app, sync contacts with the server
    Alert.alert('Contacts Synced', `${contacts.length} contacts have been synced.`);
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'busy': return '#F44336';
      case 'invisible': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  // Typing indicator functions
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      // In a real app, emit typing event to other users
      console.log('User started typing');
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      setIsTyping(false);
      console.log('User stopped typing');
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleTypingStop = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    setIsTyping(false);
    console.log('User stopped typing');
  };



  // Initialize services
  const initializeServices = async () => {
    try {
      // Initialize encryption service
      await EncryptionService.generateKeyPair('current_user');

      // Initialize disappearing messages service
      await DisappearingMessagesService.initialize();
      DisappearingMessagesService.setOnMessageExpired((messageId, chatId) => {
        // Remove expired message from UI
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      });

      // Initialize screenshot detection service
      await ScreenshotDetectionService.initialize();
      ScreenshotDetectionService.setOnScreenshotDetected((event) => {
        Alert.alert('Screenshot Detected', 'A screenshot was taken of this conversation.');
      });

      // Initialize call service
      await CallService.initialize();
      CallService.setOnCallStatusChanged((call) => {
        setCurrentCall(call);
        if (call.status === 'ringing' || call.status === 'connecting' || call.status === 'connected') {
          setShowCallInterface(true);
        } else if (call.status === 'ended') {
          setShowCallInterface(false);
        }
      });

      CallService.setOnIncomingCall((call) => {
        setCurrentCall(call);
        setShowCallInterface(true);
      });

      // Initialize starred messages service
      await StarredMessagesService.initialize();
      StarredMessagesService.setOnStarredMessagesChanged((starred) => {
        setStarredMessages(starred);
      });

      // Initialize presence service
      PresenceService.initialize('current_user');
      PresenceService.simulateUserPresence();

      // Initialize group management service
      await GroupManagementService.initialize();

      // Initialize poll service
      await PollService.initialize();
      PollService.startExpirationCheck();

      // Initialize message management service
      await MessageManagementService.initialize();

      // Initialize sub-group service
      await SubGroupService.initialize();

      // Initialize voice message service
      await VoiceMessageService.initialize();

    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  };

  // Call handlers
  const handleVoiceCall = async () => {
    if (!selectedChat) return;

    try {
      const participants = selectedChat.participants.filter(p => p !== '1');
      await CallService.startCall(participants, 'voice', selectedChat.id);
    } catch (error) {
      Alert.alert('Call Failed', 'Unable to start voice call. Please try again.');
    }
  };

  const handleVideoCall = async () => {
    if (!selectedChat) return;

    try {
      const participants = selectedChat.participants.filter(p => p !== '1');
      await CallService.startCall(participants, 'video', selectedChat.id);
    } catch (error) {
      Alert.alert('Call Failed', 'Unable to start video call. Please try again.');
    }
  };

  const handleEndCall = async () => {
    await CallService.endCall();
  };

  const handleToggleMute = async () => {
    await CallService.toggleMute();
  };

  const handleToggleVideo = async () => {
    await CallService.toggleVideo();
  };

  const handleToggleScreenShare = async () => {
    await CallService.toggleScreenShare();
  };

  const handleStartRecording = async () => {
    try {
      await CallService.startRecording();
    } catch (error) {
      Alert.alert('Recording Failed', 'Unable to start call recording.');
    }
  };

  const handleStopRecording = async () => {
    try {
      await CallService.stopRecording();
    } catch (error) {
      Alert.alert('Recording Failed', 'Unable to stop call recording.');
    }
  };

  const handleAddParticipant = () => {
    // Navigate to participant selection
    Alert.alert('Add Participant', 'Feature coming soon!');
  };

  const handleSwitchCamera = async () => {
    await CallService.switchCamera();
  };

  // Message interaction handlers
  const handleStarMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const isStarred = await StarredMessagesService.toggleStar(messageId, message.chatId, 'current_user');

      // Update message in state
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isStarred } : msg
      ));
    }
  };

  const handleCopyMessage = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const handleDoubleTapMessage = (messageId: string) => {
    // Double tap adds heart reaction
    handleMessageReaction(messageId, '❤️');
  };

  const handleNavigateToMessage = (messageId: string, chatId: string) => {
    // Find and select the chat
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      // In a real app, you'd scroll to the specific message
    }
  };

  const handleUnstarMessage = async (messageId: string) => {
    await StarredMessagesService.unstarMessage(messageId);

    // Update message in state
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isStarred: false } : msg
    ));
  };

  // New message handlers for advanced features
  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setShowEditMessage(true);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.filter(msg => msg.id !== messageId)
    );
    console.log(`Message ${messageId} deleted`);
  };

  const handleMessageEdited = (messageId: string, newText: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            text: newText,
            isEdited: true,
            editedAt: new Date()
          }
        : msg
    ));
  };

  const handlePinMessage = async (messageId: string) => {
    try {
      await MessageManagementService.pinMessage(messageId, selectedChat?.id || '1', '1');

      // Update message in state
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              isPinned: true,
              pinnedBy: '1',
              pinnedAt: new Date()
            }
          : msg
      ));

      Alert.alert('Success', 'Message pinned successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to pin message');
    }
  };

  const handleUnpinMessage = async (messageId: string) => {
    try {
      await MessageManagementService.unpinMessage(messageId, selectedChat?.id || '1');

      // Update message in state
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isPinned: false } : msg
      ));

      Alert.alert('Success', 'Message unpinned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to unpin message');
    }
  };

  const handleCreatePoll = async (pollId: string) => {
    // Poll created successfully, you might want to add it to messages or refresh
    console.log('Poll created:', pollId);
  };

  // Voice message handlers
  const handleVoicePress = () => {
    setShowVoiceInput(true);
  };

  const handleSendVoiceMessage = async (voiceMessage: VoiceMessage) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: '', // Voice messages don't have text
      senderId: '1', // Current user
      chatId: selectedChat?.id || '1',
      timestamp: new Date(),
      type: 'voice',
      status: 'sending',
      metadata: {
        voiceMessage,
        duration: voiceMessage.duration,
        fileSize: voiceMessage.size,
      },
      deliveryReceipts: {
        sentAt: new Date(),
      },
    };

    setMessages(prev => [...prev, newMessage]);
    setShowVoiceInput(false);

    // Simulate delivery and read receipts
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, status: 'delivered', deliveryReceipts: { ...msg.deliveryReceipts, deliveredAt: new Date() } }
          : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, status: 'read', deliveryReceipts: { ...msg.deliveryReceipts, readAt: new Date() } }
          : msg
      ));
    }, 3000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    appName: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      letterSpacing: 1.5,
      fontWeight: 'bold',
    },
    topRightNav: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navButton: {
      padding: theme.spacing.md,
      marginLeft: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.accent,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      minWidth: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    chatListContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    messagesContainer: {
      flex: 1,
    },
    fab: {
      position: 'absolute',
      bottom: 100,
      right: theme.spacing.md,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    badgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
  });

  const renderMessage = ({ item }: { item: Message }) => {
    const repliedMessage = item.replyTo ? messages.find(m => m.id === item.replyTo) : undefined;
    return (
      <MessageBubble
        message={item}
        onReaction={handleMessageReaction}
        onReply={handleMessageReply}
        onForward={handleMessageForward}
        onStar={handleStarMessage}
        onCopy={handleCopyMessage}
        onDoubleTap={handleDoubleTapMessage}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
        onPin={handlePinMessage}
        onUnpin={handleUnpinMessage}
        repliedMessage={repliedMessage}
        showDeliveryReceipts={true}
        currentUserId="1"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat ? (
        <View style={styles.chatContainer}>
          <ChatHeader
            chat={selectedChat}
            onBackPress={handleBackToChats}
            onCallPress={handleVoiceCall}
            onVideoPress={handleVideoCall}
            onMorePress={() => setShowEncryptionSettings(true)}
          />
          <View style={styles.messagesContainer}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: theme.spacing.md }}
              showsVerticalScrollIndicator={false}
            />
            <TypingIndicator
              isVisible={typingUsers.length > 0}
              userNames={typingUsers}
            />
          </View>
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendVoiceMessage={handleSendVoiceMessage}
            onVoicePress={handleVoicePress}
            onSendMoney={handleSendMoney}
            recipientName={selectedChat?.name}
            recipientId={selectedChat?.participants.find(p => p !== '1')}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
          />
        </View>
      ) : (
        <View style={styles.chatListContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => setShowStatusSelector(true)}
            >
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(userStatus) }]} />
              <Text style={styles.appName}>PingSpace</Text>
            </TouchableOpacity>
            <View style={styles.topRightNav}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('SmartInbox')}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Discover')}
                activeOpacity={0.8}
              >
                <Ionicons name="compass" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Spaces')}
                activeOpacity={0.8}
              >
                <Ionicons name="planet" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <StatusList
            onStatusPress={handleStatusPress}
            onAddStatusPress={handleAddStatusPress}
          />
          <ChatList
            chats={mockChats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            onDeleteChat={handleDeleteChat}
          />

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={handleNewChatPress}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Send Money Modal */}
      <SendMoneyModal
        visible={showSendMoneyModal}
        onClose={() => setShowSendMoneyModal(false)}
        recipientName={selectedChat?.name || ''}
        recipientId={selectedChat?.participants.find(p => p !== '1') || ''}
        onSendSuccess={handleSendMoneySuccess}
      />

      {/* Message Search Modal */}
      <MessageSearch
        visible={showMessageSearch}
        onClose={() => setShowMessageSearch(false)}
        messages={messages}
        chats={mockChats}
        onMessageSelect={handleMessageSearch}
      />

      {/* User Status Selector Modal */}
      <UserStatusSelector
        visible={showStatusSelector}
        onClose={() => setShowStatusSelector(false)}
        currentStatus={userStatus}
        customMessage={statusMessage}
        onStatusChange={handleStatusChange}
      />

      {/* Contact Sync Modal */}
      <ContactSync
        visible={showContactSync}
        onClose={() => setShowContactSync(false)}
        onContactsSync={handleContactsSync}
      />

      {/* App Shortcuts Modal */}
      <AppShortcuts
        visible={showAppShortcuts}
        onClose={() => setShowAppShortcuts(false)}
      />

      {/* Encryption Settings Modal */}
      <EncryptionSettings
        visible={showEncryptionSettings}
        onClose={() => setShowEncryptionSettings(false)}
        chatId={selectedChat?.id || ''}
        chatName={selectedChat?.name || ''}
        participants={selectedChat?.participants || []}
      />

      {/* Call Interface Modal */}
      <CallInterface
        visible={showCallInterface}
        call={currentCall}
        onEndCall={handleEndCall}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onAddParticipant={handleAddParticipant}
        onSwitchCamera={handleSwitchCamera}
      />

      {/* Starred Messages Modal */}
      <StarredMessagesView
        visible={showStarredMessages}
        onClose={() => setShowStarredMessages(false)}
        starredMessages={starredMessages}
        messages={messages}
        chats={mockChats}
        onUnstar={handleUnstarMessage}
        onNavigateToMessage={handleNavigateToMessage}
      />

      {/* Group Management Modal */}
      {selectedChat && (
        <GroupManagement
          visible={showGroupManagement}
          onClose={() => setShowGroupManagement(false)}
          chat={selectedChat}
          currentUserId="1"
        />
      )}

      {/* Create Poll Modal */}
      {selectedChat && (
        <CreatePoll
          visible={showCreatePoll}
          onClose={() => setShowCreatePoll(false)}
          chatId={selectedChat.id}
          currentUserId="1"
          onPollCreated={handleCreatePoll}
        />
      )}

      {/* Edit Message Modal */}
      {editingMessage && (
        <EditMessage
          visible={showEditMessage}
          onClose={() => {
            setShowEditMessage(false);
            setEditingMessage(null);
          }}
          message={editingMessage}
          onMessageEdited={handleMessageEdited}
        />
      )}

      {/* Pinned Messages Modal */}
      {selectedChat && (
        <PinnedMessages
          visible={showPinnedMessages}
          onClose={() => setShowPinnedMessages(false)}
          chatId={selectedChat.id}
          messages={messages}
          currentUserId="1"
          onNavigateToMessage={(messageId) => handleNavigateToMessage(messageId, selectedChat.id)}
        />
      )}

      {/* Sub-groups Modal */}
      {selectedChat && (
        <SubGroups
          visible={showSubGroups}
          onClose={() => setShowSubGroups(false)}
          parentGroupId={selectedChat.id}
          currentUserId="1"
          onSubGroupSelect={(subGroup) => {
            console.log('Selected sub-group:', subGroup);
            // In a real app, navigate to the sub-group chat
          }}
        />
      )}

      {/* Voice Input Modal */}
      <VoiceInput
        visible={showVoiceInput}
        onVoiceMessageSent={handleSendVoiceMessage}
        onClose={() => setShowVoiceInput(false)}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
