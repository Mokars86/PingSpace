import { UserPresence } from '../types';

class PresenceService {
  private userPresences: Map<string, UserPresence> = new Map();
  private onPresenceChanged?: (userId: string, presence: UserPresence) => void;
  private heartbeatInterval?: NodeJS.Timeout;
  private currentUserId?: string;

  // Initialize service
  initialize(userId: string): void {
    this.currentUserId = userId;
    this.startHeartbeat();
    this.setUserOnline(userId);
  }

  // Set user online
  setUserOnline(userId: string, customStatus?: string): void {
    const presence: UserPresence = {
      userId,
      status: 'online',
      lastSeen: new Date(),
      customStatus,
    };

    this.userPresences.set(userId, presence);
    this.notifyPresenceChange(userId, presence);
  }

  // Set user away
  setUserAway(userId: string): void {
    const currentPresence = this.userPresences.get(userId);
    if (currentPresence) {
      const presence: UserPresence = {
        ...currentPresence,
        status: 'away',
        lastSeen: new Date(),
      };

      this.userPresences.set(userId, presence);
      this.notifyPresenceChange(userId, presence);
    }
  }

  // Set user busy
  setUserBusy(userId: string, customStatus?: string): void {
    const currentPresence = this.userPresences.get(userId);
    if (currentPresence) {
      const presence: UserPresence = {
        ...currentPresence,
        status: 'busy',
        lastSeen: new Date(),
        customStatus,
      };

      this.userPresences.set(userId, presence);
      this.notifyPresenceChange(userId, presence);
    }
  }

  // Set user offline
  setUserOffline(userId: string): void {
    const currentPresence = this.userPresences.get(userId);
    if (currentPresence) {
      const presence: UserPresence = {
        ...currentPresence,
        status: 'offline',
        lastSeen: new Date(),
      };

      this.userPresences.set(userId, presence);
      this.notifyPresenceChange(userId, presence);
    }
  }

  // Set typing status
  setTypingStatus(userId: string, isTyping: boolean): void {
    const currentPresence = this.userPresences.get(userId);
    if (currentPresence) {
      const presence: UserPresence = {
        ...currentPresence,
        isTyping,
        lastSeen: new Date(),
      };

      this.userPresences.set(userId, presence);
      this.notifyPresenceChange(userId, presence);
    }
  }

  // Get user presence
  getUserPresence(userId: string): UserPresence | null {
    return this.userPresences.get(userId) || null;
  }

  // Get user status
  getUserStatus(userId: string): 'online' | 'away' | 'busy' | 'offline' {
    const presence = this.getUserPresence(userId);
    return presence?.status || 'offline';
  }

  // Get last seen
  getLastSeen(userId: string): Date | null {
    const presence = this.getUserPresence(userId);
    return presence?.lastSeen || null;
  }

  // Format last seen as human readable
  formatLastSeen(userId: string): string {
    const lastSeen = this.getLastSeen(userId);
    if (!lastSeen) {
      return 'Never seen';
    }

    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const status = this.getUserStatus(userId);
    
    if (status === 'online') {
      return 'Online';
    }

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return lastSeen.toLocaleDateString();
    }
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.getUserStatus(userId) === 'online';
  }

  // Check if user is typing
  isUserTyping(userId: string): boolean {
    const presence = this.getUserPresence(userId);
    return presence?.isTyping || false;
  }

  // Get online users
  getOnlineUsers(): string[] {
    return Array.from(this.userPresences.entries())
      .filter(([_, presence]) => presence.status === 'online')
      .map(([userId]) => userId);
  }

  // Get all presences
  getAllPresences(): UserPresence[] {
    return Array.from(this.userPresences.values());
  }

  // Simulate other users' presence (for demo)
  simulateUserPresence(): void {
    const demoUsers = [
      { id: '2', name: 'Alice Johnson', status: 'online' as const },
      { id: '3', name: 'Bob Smith', status: 'away' as const },
      { id: '4', name: 'Carol Davis', status: 'busy' as const },
      { id: '5', name: 'David Wilson', status: 'offline' as const },
    ];

    demoUsers.forEach(user => {
      const presence: UserPresence = {
        userId: user.id,
        status: user.status,
        lastSeen: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        customStatus: user.status === 'busy' ? 'In a meeting' : undefined,
      };

      this.userPresences.set(user.id, presence);
    });

    // Simulate random status changes
    setInterval(() => {
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const statuses: ('online' | 'away' | 'busy' | 'offline')[] = ['online', 'away', 'busy', 'offline'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const presence: UserPresence = {
        userId: randomUser.id,
        status: randomStatus,
        lastSeen: new Date(),
        customStatus: randomStatus === 'busy' ? 'In a meeting' : undefined,
      };

      this.userPresences.set(randomUser.id, presence);
      this.notifyPresenceChange(randomUser.id, presence);
    }, 30000); // Change every 30 seconds
  }

  // Start heartbeat to keep current user online
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.currentUserId) {
        this.updateLastSeen(this.currentUserId);
      }
    }, 30000); // Update every 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  // Update last seen
  private updateLastSeen(userId: string): void {
    const currentPresence = this.userPresences.get(userId);
    if (currentPresence && currentPresence.status === 'online') {
      const presence: UserPresence = {
        ...currentPresence,
        lastSeen: new Date(),
      };

      this.userPresences.set(userId, presence);
    }
  }

  // Set callback for presence changes
  setOnPresenceChanged(callback: (userId: string, presence: UserPresence) => void): void {
    this.onPresenceChanged = callback;
  }

  // Notify about presence changes
  private notifyPresenceChange(userId: string, presence: UserPresence): void {
    if (this.onPresenceChanged) {
      this.onPresenceChanged(userId, presence);
    }
  }

  // Cleanup
  cleanup(): void {
    this.stopHeartbeat();
    if (this.currentUserId) {
      this.setUserOffline(this.currentUserId);
    }
  }

  // Get status color for UI
  getStatusColor(userId: string): string {
    const status = this.getUserStatus(userId);
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'busy': return '#F44336';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }

  // Get status icon for UI
  getStatusIcon(userId: string): string {
    const status = this.getUserStatus(userId);
    switch (status) {
      case 'online': return 'radio-button-on';
      case 'away': return 'time';
      case 'busy': return 'remove-circle';
      case 'offline': return 'radio-button-off';
      default: return 'radio-button-off';
    }
  }
}

export default new PresenceService();
