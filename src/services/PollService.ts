import AsyncStorage from '@react-native-async-storage/async-storage';
import { Poll, PollOption } from '../types';

class PollService {
  private polls: Map<string, Poll> = new Map();
  private onPollUpdated?: (poll: Poll) => void;
  private onPollCreated?: (poll: Poll) => void;

  // Initialize service
  async initialize(): Promise<void> {
    await this.loadPolls();
  }

  // Create a new poll
  async createPoll(
    question: string,
    options: string[],
    chatId: string,
    createdBy: string,
    settings: {
      isAnonymous?: boolean;
      allowMultipleVotes?: boolean;
      expiresIn?: number; // minutes
    } = {}
  ): Promise<Poll> {
    const pollId = `poll_${Date.now()}`;
    const expiresAt = settings.expiresIn 
      ? new Date(Date.now() + settings.expiresIn * 60 * 1000)
      : undefined;

    const pollOptions: PollOption[] = options.map((text, index) => ({
      id: `option_${index}`,
      text,
      votes: [],
      percentage: 0,
    }));

    const poll: Poll = {
      id: pollId,
      question,
      options: pollOptions,
      createdBy,
      createdAt: new Date(),
      expiresAt,
      isAnonymous: settings.isAnonymous || false,
      allowMultipleVotes: settings.allowMultipleVotes || false,
      totalVotes: 0,
      isActive: true,
      chatId,
    };

    this.polls.set(pollId, poll);
    await this.savePolls();

    if (this.onPollCreated) {
      this.onPollCreated(poll);
    }

    return poll;
  }

  // Vote on a poll
  async vote(pollId: string, optionId: string, userId: string): Promise<Poll> {
    const poll = this.polls.get(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    if (!poll.isActive) {
      throw new Error('Poll is no longer active');
    }

    if (poll.expiresAt && poll.expiresAt < new Date()) {
      poll.isActive = false;
      await this.savePolls();
      throw new Error('Poll has expired');
    }

    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error('Option not found');
    }

    // Check if user has already voted
    const hasVoted = poll.options.some(opt => opt.votes.includes(userId));
    
    if (hasVoted && !poll.allowMultipleVotes) {
      // Remove previous vote if not allowing multiple votes
      poll.options.forEach(opt => {
        opt.votes = opt.votes.filter(id => id !== userId);
      });
    }

    // Add vote to selected option
    if (!option.votes.includes(userId)) {
      option.votes.push(userId);
    }

    // Recalculate statistics
    this.updatePollStatistics(poll);
    await this.savePolls();

    if (this.onPollUpdated) {
      this.onPollUpdated(poll);
    }

    return poll;
  }

  // Remove vote from poll
  async removeVote(pollId: string, optionId: string, userId: string): Promise<Poll> {
    const poll = this.polls.get(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error('Option not found');
    }

    option.votes = option.votes.filter(id => id !== userId);
    this.updatePollStatistics(poll);
    await this.savePolls();

    if (this.onPollUpdated) {
      this.onPollUpdated(poll);
    }

    return poll;
  }

  // Close a poll
  async closePoll(pollId: string, closedBy: string): Promise<Poll> {
    const poll = this.polls.get(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    poll.isActive = false;
    await this.savePolls();

    if (this.onPollUpdated) {
      this.onPollUpdated(poll);
    }

    return poll;
  }

  // Get poll by ID
  getPoll(pollId: string): Poll | null {
    return this.polls.get(pollId) || null;
  }

  // Get polls for a chat
  getChatPolls(chatId: string): Poll[] {
    return Array.from(this.polls.values())
      .filter(poll => poll.chatId === chatId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get active polls for a chat
  getActiveChatPolls(chatId: string): Poll[] {
    return this.getChatPolls(chatId).filter(poll => poll.isActive);
  }

  // Get user's vote in a poll
  getUserVote(pollId: string, userId: string): string[] {
    const poll = this.polls.get(pollId);
    if (!poll) return [];

    return poll.options
      .filter(option => option.votes.includes(userId))
      .map(option => option.id);
  }

  // Check if user has voted in poll
  hasUserVoted(pollId: string, userId: string): boolean {
    return this.getUserVote(pollId, userId).length > 0;
  }

  // Get poll results
  getPollResults(pollId: string): {
    totalVotes: number;
    options: Array<{
      id: string;
      text: string;
      votes: number;
      percentage: number;
      isWinner: boolean;
    }>;
    winningOptions: string[];
  } {
    const poll = this.polls.get(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    const maxVotes = Math.max(...poll.options.map(opt => opt.votes.length));
    const winningOptions = poll.options
      .filter(opt => opt.votes.length === maxVotes && maxVotes > 0)
      .map(opt => opt.id);

    return {
      totalVotes: poll.totalVotes,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        votes: option.votes.length,
        percentage: option.percentage || 0,
        isWinner: winningOptions.includes(option.id),
      })),
      winningOptions,
    };
  }

  // Update poll statistics
  private updatePollStatistics(poll: Poll): void {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
    poll.totalVotes = totalVotes;

    poll.options.forEach(option => {
      option.percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
    });
  }

  // Auto-close expired polls
  async checkExpiredPolls(): Promise<void> {
    const now = new Date();
    let hasChanges = false;

    for (const poll of this.polls.values()) {
      if (poll.isActive && poll.expiresAt && poll.expiresAt < now) {
        poll.isActive = false;
        hasChanges = true;

        if (this.onPollUpdated) {
          this.onPollUpdated(poll);
        }
      }
    }

    if (hasChanges) {
      await this.savePolls();
    }
  }

  // Start auto-check for expired polls
  startExpirationCheck(): void {
    setInterval(() => {
      this.checkExpiredPolls();
    }, 60000); // Check every minute
  }

  // Get poll statistics
  getPollStatistics(): {
    totalPolls: number;
    activePolls: number;
    expiredPolls: number;
    totalVotes: number;
  } {
    const polls = Array.from(this.polls.values());
    const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

    return {
      totalPolls: polls.length,
      activePolls: polls.filter(p => p.isActive).length,
      expiredPolls: polls.filter(p => !p.isActive).length,
      totalVotes,
    };
  }

  // Set callbacks
  setOnPollUpdated(callback: (poll: Poll) => void): void {
    this.onPollUpdated = callback;
  }

  setOnPollCreated(callback: (poll: Poll) => void): void {
    this.onPollCreated = callback;
  }

  // Save to storage
  private async savePolls(): Promise<void> {
    try {
      const pollsArray = Array.from(this.polls.entries()).map(([id, poll]) => [
        id,
        {
          ...poll,
          createdAt: poll.createdAt.toISOString(),
          expiresAt: poll.expiresAt?.toISOString(),
        },
      ]);
      await AsyncStorage.setItem('polls', JSON.stringify(pollsArray));
    } catch (error) {
      console.error('Failed to save polls:', error);
    }
  }

  // Load from storage
  private async loadPolls(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('polls');
      if (data) {
        const pollsArray = JSON.parse(data);
        this.polls = new Map(
          pollsArray.map(([id, poll]: [string, any]) => [
            id,
            {
              ...poll,
              createdAt: new Date(poll.createdAt),
              expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : undefined,
            },
          ])
        );

        // Update statistics for loaded polls
        for (const poll of this.polls.values()) {
          this.updatePollStatistics(poll);
        }
      }
    } catch (error) {
      console.error('Failed to load polls:', error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    this.polls.clear();
    await AsyncStorage.removeItem('polls');
  }
}

export default new PollService();
