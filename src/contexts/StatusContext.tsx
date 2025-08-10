import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusPost, StatusReaction, StatusView, StatusRing, StatusUploadData, StatusSettings } from '../types';

export interface StatusContextType {
  statusPosts: StatusPost[];
  statusRings: StatusRing[];
  myStatus: StatusPost[];
  statusSettings: StatusSettings;
  isUploading: boolean;
  uploadStatus: (data: StatusUploadData) => Promise<void>;
  deleteStatus: (statusId: string) => void;
  addReaction: (statusId: string, reactionType: string) => void;
  removeReaction: (statusId: string) => void;
  markAsViewed: (statusId: string) => void;
  getStatusesByUser: (userId: string) => StatusPost[];
  updateStatusSettings: (settings: Partial<StatusSettings>) => void;
  refreshStatuses: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [statusPosts, setStatusPosts] = useState<StatusPost[]>([]);
  const [statusRings, setStatusRings] = useState<StatusRing[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusSettings, setStatusSettings] = useState<StatusSettings>({
    autoSaveToGallery: true,
    allowReplies: true,
    showViewers: true,
    allowForwarding: true,
    defaultPrivacy: 'contacts',
    muteStatusFrom: [],
    closeFreindsList: [],
  });

  // Mock current user ID (in real app, this would come from auth context)
  const currentUserId = 'current_user';

  useEffect(() => {
    loadStatusData();
    loadStatusSettings();
  }, []);

  useEffect(() => {
    saveStatusData();
  }, [statusPosts]);

  useEffect(() => {
    updateStatusRings();
  }, [statusPosts]);

  const loadStatusData = async () => {
    try {
      const savedStatuses = await AsyncStorage.getItem('status_posts');
      if (savedStatuses) {
        const parsedStatuses = JSON.parse(savedStatuses).map((status: any) => ({
          ...status,
          createdAt: new Date(status.createdAt),
          expiresAt: new Date(status.expiresAt),
          reactions: status.reactions.map((reaction: any) => ({
            ...reaction,
            createdAt: new Date(reaction.createdAt),
          })),
          views: status.views.map((view: any) => ({
            ...view,
            viewedAt: new Date(view.viewedAt),
          })),
        }));
        
        // Filter out expired statuses
        const activeStatuses = parsedStatuses.filter((status: StatusPost) => 
          status.expiresAt > new Date()
        );
        
        setStatusPosts(activeStatuses);
      }
    } catch (error) {
      console.error('Error loading status data:', error);
    }
  };

  const saveStatusData = async () => {
    try {
      await AsyncStorage.setItem('status_posts', JSON.stringify(statusPosts));
    } catch (error) {
      console.error('Error saving status data:', error);
    }
  };

  const loadStatusSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('status_settings');
      if (savedSettings) {
        setStatusSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading status settings:', error);
    }
  };

  const saveStatusSettings = async (settings: StatusSettings) => {
    try {
      await AsyncStorage.setItem('status_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving status settings:', error);
    }
  };

  const uploadStatus = async (data: StatusUploadData): Promise<void> => {
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatus: StatusPost = {
        id: `status_${Date.now()}`,
        userId: currentUserId,
        userName: 'You',
        userAvatar: 'https://via.placeholder.com/50x50',
        type: data.type,
        content: {
          mediaUrl: data.mediaUri,
          text: data.text,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          font: data.font,
        },
        caption: data.caption,
        privacy: data.privacy,
        allowedViewers: data.allowedViewers,
        blockedViewers: data.blockedViewers,
        reactions: [],
        views: [],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
        location: data.location,
        music: data.music,
      };

      setStatusPosts(prev => [newStatus, ...prev]);
    } catch (error) {
      console.error('Error uploading status:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteStatus = (statusId: string) => {
    setStatusPosts(prev => prev.filter(status => status.id !== statusId));
  };

  const addReaction = (statusId: string, reactionType: string) => {
    const reactionEmojis: Record<string, string> = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😠',
      fire: '🔥',
      heart_eyes: '😍',
    };

    setStatusPosts(prev => prev.map(status => {
      if (status.id === statusId) {
        // Remove existing reaction from current user
        const filteredReactions = status.reactions.filter(r => r.userId !== currentUserId);
        
        // Add new reaction
        const newReaction: StatusReaction = {
          id: `reaction_${Date.now()}`,
          statusId,
          userId: currentUserId,
          userName: 'You',
          userAvatar: 'https://via.placeholder.com/50x50',
          type: reactionType as any,
          emoji: reactionEmojis[reactionType] || '👍',
          createdAt: new Date(),
        };

        return {
          ...status,
          reactions: [...filteredReactions, newReaction],
        };
      }
      return status;
    }));
  };

  const removeReaction = (statusId: string) => {
    setStatusPosts(prev => prev.map(status => {
      if (status.id === statusId) {
        return {
          ...status,
          reactions: status.reactions.filter(r => r.userId !== currentUserId),
        };
      }
      return status;
    }));
  };

  const markAsViewed = (statusId: string) => {
    setStatusPosts(prev => prev.map(status => {
      if (status.id === statusId) {
        // Check if already viewed by current user
        const alreadyViewed = status.views.some(v => v.userId === currentUserId);
        
        if (!alreadyViewed) {
          const newView: StatusView = {
            id: `view_${Date.now()}`,
            statusId,
            userId: currentUserId,
            userName: 'You',
            userAvatar: 'https://via.placeholder.com/50x50',
            viewedAt: new Date(),
          };

          return {
            ...status,
            views: [...status.views, newView],
          };
        }
      }
      return status;
    }));
  };

  const getStatusesByUser = (userId: string): StatusPost[] => {
    return statusPosts.filter(status => status.userId === userId);
  };

  const updateStatusRings = () => {
    const userStatusMap = new Map<string, StatusPost[]>();
    
    // Group statuses by user
    statusPosts.forEach(status => {
      const userStatuses = userStatusMap.get(status.userId) || [];
      userStatuses.push(status);
      userStatusMap.set(status.userId, userStatuses);
    });

    // Create status rings
    const rings: StatusRing[] = [];
    
    userStatusMap.forEach((userStatuses, userId) => {
      const latestStatus = userStatuses[0]; // Assuming sorted by creation time
      const hasUnseenStatus = userStatuses.some(status => 
        !status.views.some(view => view.userId === currentUserId)
      );

      rings.push({
        userId,
        userName: latestStatus.userName,
        userAvatar: latestStatus.userAvatar,
        hasUnseenStatus,
        lastStatusTime: latestStatus.createdAt,
        statusCount: userStatuses.length,
        isMyStatus: userId === currentUserId,
        ringColor: hasUnseenStatus ? '#ff1744' : '#E9ECEF',
      });
    });

    // Sort: My status first, then unseen, then by time
    rings.sort((a, b) => {
      if (a.isMyStatus) return -1;
      if (b.isMyStatus) return 1;
      if (a.hasUnseenStatus && !b.hasUnseenStatus) return -1;
      if (!a.hasUnseenStatus && b.hasUnseenStatus) return 1;
      return b.lastStatusTime.getTime() - a.lastStatusTime.getTime();
    });

    setStatusRings(rings);
  };

  const updateStatusSettings = (settings: Partial<StatusSettings>) => {
    const newSettings = { ...statusSettings, ...settings };
    setStatusSettings(newSettings);
    saveStatusSettings(newSettings);
  };

  const refreshStatuses = () => {
    loadStatusData();
  };

  const myStatus = statusPosts.filter(status => status.userId === currentUserId);

  const contextValue: StatusContextType = {
    statusPosts,
    statusRings,
    myStatus,
    statusSettings,
    isUploading,
    uploadStatus,
    deleteStatus,
    addReaction,
    removeReaction,
    markAsViewed,
    getStatusesByUser,
    updateStatusSettings,
    refreshStatuses,
  };

  return (
    <StatusContext.Provider value={contextValue}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = (): StatusContextType => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};
