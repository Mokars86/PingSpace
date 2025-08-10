import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, MessageEdit, PinnedMessage } from '../types';

class MessageManagementService {
  private editHistory: Map<string, MessageEdit[]> = new Map(); // messageId -> edits
  private pinnedMessages: Map<string, PinnedMessage[]> = new Map(); // chatId -> pinned messages
  private onMessageEdited?: (messageId: string, newText: string) => void;
  private onMessagePinned?: (messageId: string, chatId: string) => void;
  private onMessageUnpinned?: (messageId: string, chatId: string) => void;

  // Initialize service
  async initialize(): Promise<void> {
    await this.loadEditHistory();
    await this.loadPinnedMessages();
  }

  // Edit a message
  async editMessage(
    messageId: string,
    newText: string,
    editedBy: string,
    reason?: string
  ): Promise<MessageEdit> {
    // Get current message text (in real app, fetch from message store)
    const currentText = this.getCurrentMessageText(messageId);
    
    const edit: MessageEdit = {
      id: `edit_${Date.now()}`,
      editedAt: new Date(),
      editedBy,
      previousText: currentText,
      newText,
      reason,
    };

    // Add to edit history
    if (!this.editHistory.has(messageId)) {
      this.editHistory.set(messageId, []);
    }
    this.editHistory.get(messageId)!.push(edit);

    await this.saveEditHistory();

    if (this.onMessageEdited) {
      this.onMessageEdited(messageId, newText);
    }

    return edit;
  }

  // Get edit history for a message
  getEditHistory(messageId: string): MessageEdit[] {
    return this.editHistory.get(messageId) || [];
  }

  // Check if message has been edited
  isMessageEdited(messageId: string): boolean {
    return this.editHistory.has(messageId) && this.editHistory.get(messageId)!.length > 0;
  }

  // Get latest edit for a message
  getLatestEdit(messageId: string): MessageEdit | null {
    const edits = this.getEditHistory(messageId);
    return edits.length > 0 ? edits[edits.length - 1] : null;
  }

  // Get original message text
  getOriginalText(messageId: string): string {
    const edits = this.getEditHistory(messageId);
    if (edits.length === 0) {
      return this.getCurrentMessageText(messageId);
    }
    return edits[0].previousText;
  }

  // Pin a message
  async pinMessage(
    messageId: string,
    chatId: string,
    pinnedBy: string,
    reason?: string
  ): Promise<void> {
    // Check if message is already pinned
    if (this.isMessagePinned(messageId, chatId)) {
      throw new Error('Message is already pinned');
    }

    // Check pin limit (max 50 pinned messages per chat)
    const pinnedCount = this.getPinnedMessagesCount(chatId);
    if (pinnedCount >= 50) {
      throw new Error('Maximum number of pinned messages reached (50)');
    }

    const pinnedMessage: PinnedMessage = {
      messageId,
      chatId,
      pinnedBy,
      pinnedAt: new Date(),
      reason,
    };

    if (!this.pinnedMessages.has(chatId)) {
      this.pinnedMessages.set(chatId, []);
    }
    this.pinnedMessages.get(chatId)!.push(pinnedMessage);

    await this.savePinnedMessages();

    if (this.onMessagePinned) {
      this.onMessagePinned(messageId, chatId);
    }
  }

  // Unpin a message
  async unpinMessage(messageId: string, chatId: string): Promise<void> {
    const chatPinned = this.pinnedMessages.get(chatId);
    if (!chatPinned) return;

    const index = chatPinned.findIndex(pin => pin.messageId === messageId);
    if (index === -1) return;

    chatPinned.splice(index, 1);
    await this.savePinnedMessages();

    if (this.onMessageUnpinned) {
      this.onMessageUnpinned(messageId, chatId);
    }
  }

  // Check if message is pinned
  isMessagePinned(messageId: string, chatId: string): boolean {
    const chatPinned = this.pinnedMessages.get(chatId);
    return chatPinned ? chatPinned.some(pin => pin.messageId === messageId) : false;
  }

  // Get pinned messages for a chat
  getPinnedMessages(chatId: string): PinnedMessage[] {
    return this.pinnedMessages.get(chatId) || [];
  }

  // Get pinned messages count
  getPinnedMessagesCount(chatId: string): number {
    return this.getPinnedMessages(chatId).length;
  }

  // Get pinned message info
  getPinnedMessageInfo(messageId: string, chatId: string): PinnedMessage | null {
    const chatPinned = this.pinnedMessages.get(chatId);
    return chatPinned?.find(pin => pin.messageId === messageId) || null;
  }

  // Clear all pinned messages for a chat
  async clearAllPinnedMessages(chatId: string): Promise<void> {
    this.pinnedMessages.delete(chatId);
    await this.savePinnedMessages();
  }

  // Get edit statistics
  getEditStatistics(): {
    totalEdits: number;
    editedMessages: number;
    averageEditsPerMessage: number;
  } {
    const totalEdits = Array.from(this.editHistory.values())
      .reduce((sum, edits) => sum + edits.length, 0);
    const editedMessages = this.editHistory.size;
    const averageEditsPerMessage = editedMessages > 0 ? totalEdits / editedMessages : 0;

    return {
      totalEdits,
      editedMessages,
      averageEditsPerMessage,
    };
  }

  // Get pin statistics
  getPinStatistics(): {
    totalPinnedMessages: number;
    chatsWithPinnedMessages: number;
    averagePinsPerChat: number;
  } {
    const totalPinnedMessages = Array.from(this.pinnedMessages.values())
      .reduce((sum, pins) => sum + pins.length, 0);
    const chatsWithPinnedMessages = this.pinnedMessages.size;
    const averagePinsPerChat = chatsWithPinnedMessages > 0 ? totalPinnedMessages / chatsWithPinnedMessages : 0;

    return {
      totalPinnedMessages,
      chatsWithPinnedMessages,
      averagePinsPerChat,
    };
  }

  // Check if user can edit message (within time limit)
  canEditMessage(messageId: string, userId: string, messageTimestamp: Date): boolean {
    // Allow editing within 48 hours
    const editTimeLimit = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const now = new Date();
    const timeDiff = now.getTime() - messageTimestamp.getTime();

    return timeDiff <= editTimeLimit;
  }

  // Get edit time remaining
  getEditTimeRemaining(messageTimestamp: Date): number {
    const editTimeLimit = 48 * 60 * 60 * 1000; // 48 hours
    const now = new Date();
    const timeDiff = now.getTime() - messageTimestamp.getTime();
    const remaining = editTimeLimit - timeDiff;

    return Math.max(0, remaining);
  }

  // Format edit time remaining
  formatEditTimeRemaining(messageTimestamp: Date): string {
    const remaining = this.getEditTimeRemaining(messageTimestamp);
    if (remaining === 0) return 'Edit time expired';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining to edit`;
    } else {
      return `${minutes}m remaining to edit`;
    }
  }

  // Helper method to get current message text (mock implementation)
  private getCurrentMessageText(messageId: string): string {
    // In a real app, this would fetch from the message store
    return `Message ${messageId} text`;
  }

  // Set callbacks
  setOnMessageEdited(callback: (messageId: string, newText: string) => void): void {
    this.onMessageEdited = callback;
  }

  setOnMessagePinned(callback: (messageId: string, chatId: string) => void): void {
    this.onMessagePinned = callback;
  }

  setOnMessageUnpinned(callback: (messageId: string, chatId: string) => void): void {
    this.onMessageUnpinned = callback;
  }

  // Save edit history to storage
  private async saveEditHistory(): Promise<void> {
    try {
      const data = Array.from(this.editHistory.entries()).map(([messageId, edits]) => [
        messageId,
        edits.map(edit => ({
          ...edit,
          editedAt: edit.editedAt.toISOString(),
        })),
      ]);
      await AsyncStorage.setItem('message_edit_history', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save edit history:', error);
    }
  }

  // Load edit history from storage
  private async loadEditHistory(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('message_edit_history');
      if (data) {
        const parsed = JSON.parse(data);
        this.editHistory = new Map(
          parsed.map(([messageId, edits]: [string, any[]]) => [
            messageId,
            edits.map(edit => ({
              ...edit,
              editedAt: new Date(edit.editedAt),
            })),
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load edit history:', error);
    }
  }

  // Save pinned messages to storage
  private async savePinnedMessages(): Promise<void> {
    try {
      const data = Array.from(this.pinnedMessages.entries()).map(([chatId, pins]) => [
        chatId,
        pins.map(pin => ({
          ...pin,
          pinnedAt: pin.pinnedAt.toISOString(),
        })),
      ]);
      await AsyncStorage.setItem('pinned_messages', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save pinned messages:', error);
    }
  }

  // Load pinned messages from storage
  private async loadPinnedMessages(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('pinned_messages');
      if (data) {
        const parsed = JSON.parse(data);
        this.pinnedMessages = new Map(
          parsed.map(([chatId, pins]: [string, any[]]) => [
            chatId,
            pins.map(pin => ({
              ...pin,
              pinnedAt: new Date(pin.pinnedAt),
            })),
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load pinned messages:', error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    this.editHistory.clear();
    this.pinnedMessages.clear();
    await AsyncStorage.removeItem('message_edit_history');
    await AsyncStorage.removeItem('pinned_messages');
  }
}

export default new MessageManagementService();
