import AsyncStorage from '@react-native-async-storage/async-storage';

export type DisappearingDuration = 
  | '10s' | '30s' | '1m' | '5m' | '15m' | '30m' 
  | '1h' | '6h' | '12h' | '24h' | '7d' | 'off';

export interface DisappearingMessage {
  messageId: string;
  chatId: string;
  expiresAt: Date;
  duration: DisappearingDuration;
  isRead: boolean;
  readAt?: Date;
}

export interface ChatDisappearingSettings {
  chatId: string;
  isEnabled: boolean;
  duration: DisappearingDuration;
  enabledBy: string;
  enabledAt: Date;
}

class DisappearingMessagesService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private disappearingMessages: Map<string, DisappearingMessage> = new Map();
  private chatSettings: Map<string, ChatDisappearingSettings> = new Map();
  private onMessageExpired?: (messageId: string, chatId: string) => void;

  // Duration mappings in milliseconds
  private durationMap: Record<DisappearingDuration, number> = {
    '10s': 10 * 1000,
    '30s': 30 * 1000,
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    'off': 0,
  };

  // Set callback for when messages expire
  setOnMessageExpired(callback: (messageId: string, chatId: string) => void): void {
    this.onMessageExpired = callback;
  }

  // Enable disappearing messages for a chat
  async enableDisappearingMessages(
    chatId: string,
    duration: DisappearingDuration,
    enabledBy: string
  ): Promise<void> {
    const settings: ChatDisappearingSettings = {
      chatId,
      isEnabled: true,
      duration,
      enabledBy,
      enabledAt: new Date(),
    };

    this.chatSettings.set(chatId, settings);
    await this.saveChatSettings();
  }

  // Disable disappearing messages for a chat
  async disableDisappearingMessages(chatId: string): Promise<void> {
    const settings = this.chatSettings.get(chatId);
    if (settings) {
      settings.isEnabled = false;
      this.chatSettings.set(chatId, settings);
      await this.saveChatSettings();
    }

    // Clear all timers for this chat
    this.clearChatTimers(chatId);
  }

  // Add a disappearing message
  async addDisappearingMessage(
    messageId: string,
    chatId: string,
    duration?: DisappearingDuration
  ): Promise<void> {
    const chatSettings = this.chatSettings.get(chatId);
    const messageDuration = duration || chatSettings?.duration || 'off';

    if (messageDuration === 'off') {
      return;
    }

    const durationMs = this.durationMap[messageDuration];
    const expiresAt = new Date(Date.now() + durationMs);

    const disappearingMessage: DisappearingMessage = {
      messageId,
      chatId,
      expiresAt,
      duration: messageDuration,
      isRead: false,
    };

    this.disappearingMessages.set(messageId, disappearingMessage);
    await this.saveDisappearingMessages();

    // Set timer for message expiration
    this.setExpirationTimer(messageId, durationMs);
  }

  // Mark message as read (starts disappearing timer for read-based expiration)
  async markMessageAsRead(messageId: string): Promise<void> {
    const message = this.disappearingMessages.get(messageId);
    if (!message || message.isRead) {
      return;
    }

    message.isRead = true;
    message.readAt = new Date();

    // For some durations, we might want to start timer after read
    // For now, we'll keep the original timer
    this.disappearingMessages.set(messageId, message);
    await this.saveDisappearingMessages();
  }

  // Set expiration timer for a message
  private setExpirationTimer(messageId: string, durationMs: number): void {
    // Clear existing timer if any
    const existingTimer = this.timers.get(messageId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.expireMessage(messageId);
    }, durationMs);

    this.timers.set(messageId, timer);
  }

  // Expire a message
  private async expireMessage(messageId: string): Promise<void> {
    const message = this.disappearingMessages.get(messageId);
    if (!message) {
      return;
    }

    // Remove from storage
    this.disappearingMessages.delete(messageId);
    this.timers.delete(messageId);
    await this.saveDisappearingMessages();

    // Notify callback
    if (this.onMessageExpired) {
      this.onMessageExpired(messageId, message.chatId);
    }

    console.log(`Message ${messageId} expired and deleted`);
  }

  // Check if message is disappearing
  isDisappearingMessage(messageId: string): boolean {
    return this.disappearingMessages.has(messageId);
  }

  // Get disappearing message info
  getDisappearingMessageInfo(messageId: string): DisappearingMessage | null {
    return this.disappearingMessages.get(messageId) || null;
  }

  // Get chat disappearing settings
  getChatSettings(chatId: string): ChatDisappearingSettings | null {
    return this.chatSettings.get(chatId) || null;
  }

  // Get time remaining for a message
  getTimeRemaining(messageId: string): number {
    const message = this.disappearingMessages.get(messageId);
    if (!message) {
      return 0;
    }

    const now = Date.now();
    const expiresAt = message.expiresAt.getTime();
    return Math.max(0, expiresAt - now);
  }

  // Format time remaining as human readable
  formatTimeRemaining(messageId: string): string {
    const remaining = this.getTimeRemaining(messageId);
    if (remaining === 0) {
      return 'Expired';
    }

    const seconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Clear all timers for a chat
  private clearChatTimers(chatId: string): void {
    for (const [messageId, message] of this.disappearingMessages.entries()) {
      if (message.chatId === chatId) {
        const timer = this.timers.get(messageId);
        if (timer) {
          clearTimeout(timer);
          this.timers.delete(messageId);
        }
      }
    }
  }

  // Initialize service (load from storage)
  async initialize(): Promise<void> {
    await this.loadChatSettings();
    await this.loadDisappearingMessages();
    this.restoreTimers();
  }

  // Restore timers after app restart
  private restoreTimers(): void {
    const now = Date.now();
    
    for (const [messageId, message] of this.disappearingMessages.entries()) {
      const expiresAt = message.expiresAt.getTime();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        // Message should have already expired
        this.expireMessage(messageId);
      } else {
        // Set timer for remaining time
        this.setExpirationTimer(messageId, remaining);
      }
    }
  }

  // Save chat settings to storage
  private async saveChatSettings(): Promise<void> {
    try {
      const settings = Array.from(this.chatSettings.entries());
      await AsyncStorage.setItem('disappearing_chat_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save chat settings:', error);
    }
  }

  // Load chat settings from storage
  private async loadChatSettings(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('disappearing_chat_settings');
      if (data) {
        const settings = JSON.parse(data);
        this.chatSettings = new Map(settings);
      }
    } catch (error) {
      console.error('Failed to load chat settings:', error);
    }
  }

  // Save disappearing messages to storage
  private async saveDisappearingMessages(): Promise<void> {
    try {
      const messages = Array.from(this.disappearingMessages.entries()).map(([id, msg]) => [
        id,
        {
          ...msg,
          expiresAt: msg.expiresAt.toISOString(),
          readAt: msg.readAt?.toISOString(),
        },
      ]);
      await AsyncStorage.setItem('disappearing_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save disappearing messages:', error);
    }
  }

  // Load disappearing messages from storage
  private async loadDisappearingMessages(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('disappearing_messages');
      if (data) {
        const messages = JSON.parse(data);
        this.disappearingMessages = new Map(
          messages.map(([id, msg]: [string, any]) => [
            id,
            {
              ...msg,
              expiresAt: new Date(msg.expiresAt),
              readAt: msg.readAt ? new Date(msg.readAt) : undefined,
            },
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load disappearing messages:', error);
    }
  }

  // Clear all data (for logout)
  async clearAll(): Promise<void> {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.disappearingMessages.clear();
    this.chatSettings.clear();

    // Clear storage
    await AsyncStorage.removeItem('disappearing_chat_settings');
    await AsyncStorage.removeItem('disappearing_messages');
  }
}

export default new DisappearingMessagesService();
