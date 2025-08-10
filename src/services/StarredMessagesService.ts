import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarredMessage, Message } from '../types';

class StarredMessagesService {
  private starredMessages: Map<string, StarredMessage> = new Map();
  private onStarredMessagesChanged?: (starredMessages: StarredMessage[]) => void;

  // Initialize service
  async initialize(): Promise<void> {
    await this.loadStarredMessages();
  }

  // Star a message
  async starMessage(messageId: string, chatId: string, userId: string): Promise<void> {
    const starredMessage: StarredMessage = {
      messageId,
      chatId,
      starredAt: new Date(),
      starredBy: userId,
    };

    this.starredMessages.set(messageId, starredMessage);
    await this.saveStarredMessages();
    this.notifyChange();
  }

  // Unstar a message
  async unstarMessage(messageId: string): Promise<void> {
    this.starredMessages.delete(messageId);
    await this.saveStarredMessages();
    this.notifyChange();
  }

  // Toggle star status
  async toggleStar(messageId: string, chatId: string, userId: string): Promise<boolean> {
    const isStarred = this.isMessageStarred(messageId);
    
    if (isStarred) {
      await this.unstarMessage(messageId);
      return false;
    } else {
      await this.starMessage(messageId, chatId, userId);
      return true;
    }
  }

  // Check if message is starred
  isMessageStarred(messageId: string): boolean {
    return this.starredMessages.has(messageId);
  }

  // Get starred message info
  getStarredMessage(messageId: string): StarredMessage | null {
    return this.starredMessages.get(messageId) || null;
  }

  // Get all starred messages
  getAllStarredMessages(): StarredMessage[] {
    return Array.from(this.starredMessages.values())
      .sort((a, b) => b.starredAt.getTime() - a.starredAt.getTime());
  }

  // Get starred messages for a specific chat
  getStarredMessagesForChat(chatId: string): StarredMessage[] {
    return this.getAllStarredMessages().filter(starred => starred.chatId === chatId);
  }

  // Get starred messages count
  getStarredCount(): number {
    return this.starredMessages.size;
  }

  // Get starred messages count for chat
  getStarredCountForChat(chatId: string): number {
    return this.getStarredMessagesForChat(chatId).length;
  }

  // Clear all starred messages
  async clearAllStarred(): Promise<void> {
    this.starredMessages.clear();
    await this.saveStarredMessages();
    this.notifyChange();
  }

  // Clear starred messages for a chat
  async clearStarredForChat(chatId: string): Promise<void> {
    const toRemove = Array.from(this.starredMessages.entries())
      .filter(([_, starred]) => starred.chatId === chatId)
      .map(([messageId]) => messageId);

    toRemove.forEach(messageId => this.starredMessages.delete(messageId));
    await this.saveStarredMessages();
    this.notifyChange();
  }

  // Set callback for changes
  setOnStarredMessagesChanged(callback: (starredMessages: StarredMessage[]) => void): void {
    this.onStarredMessagesChanged = callback;
  }

  // Notify about changes
  private notifyChange(): void {
    if (this.onStarredMessagesChanged) {
      this.onStarredMessagesChanged(this.getAllStarredMessages());
    }
  }

  // Save to storage
  private async saveStarredMessages(): Promise<void> {
    try {
      const starredArray = Array.from(this.starredMessages.entries()).map(([id, starred]) => [
        id,
        {
          ...starred,
          starredAt: starred.starredAt.toISOString(),
        },
      ]);
      await AsyncStorage.setItem('starred_messages', JSON.stringify(starredArray));
    } catch (error) {
      console.error('Failed to save starred messages:', error);
    }
  }

  // Load from storage
  private async loadStarredMessages(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('starred_messages');
      if (data) {
        const starredArray = JSON.parse(data);
        this.starredMessages = new Map(
          starredArray.map(([id, starred]: [string, any]) => [
            id,
            {
              ...starred,
              starredAt: new Date(starred.starredAt),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load starred messages:', error);
    }
  }

  // Export starred messages
  async exportStarredMessages(): Promise<StarredMessage[]> {
    return this.getAllStarredMessages();
  }

  // Import starred messages
  async importStarredMessages(starredMessages: StarredMessage[]): Promise<void> {
    this.starredMessages.clear();
    starredMessages.forEach(starred => {
      this.starredMessages.set(starred.messageId, starred);
    });
    await this.saveStarredMessages();
    this.notifyChange();
  }
}

export default new StarredMessagesService();
