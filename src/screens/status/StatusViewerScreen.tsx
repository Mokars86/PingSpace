import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useStatus } from '../../contexts/StatusContext';
import { StatusPost } from '../../types';

const { width, height } = Dimensions.get('window');

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/MainNavigator';

type StatusViewerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StatusViewer'>;
type StatusViewerScreenRouteProp = RouteProp<RootStackParamList, 'StatusViewer'>;

interface StatusViewerScreenProps {
  navigation: StatusViewerScreenNavigationProp;
  route: StatusViewerScreenRouteProp;
}

const StatusViewerScreen: React.FC<StatusViewerScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { getStatusesByUser, addReaction, removeReaction, markAsViewed } = useStatus();
  const { userId, initialIndex = 0 } = route.params;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showReactions, setShowReactions] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const reactionAnim = useRef(new Animated.Value(0)).current;
  const statusTimer = useRef<NodeJS.Timeout | null>(null);
  
  const userStatuses = getStatusesByUser(userId);
  const currentStatus = userStatuses[currentIndex];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    statusContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageStatus: {
      width: width,
      height: height,
      resizeMode: 'cover',
    },
    textStatus: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    statusText: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.semiBold,
      textAlign: 'center',
      color: '#FFFFFF',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      zIndex: 10,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: theme.spacing.sm,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    timeAgo: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    progressContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      zIndex: 10,
    },
    progressBar: {
      flex: 1,
      height: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 1.5,
      marginHorizontal: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 1.5,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      zIndex: 10,
    },
    caption: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: '#FFFFFF',
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    reactionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    reactionButton: {
      padding: theme.spacing.sm,
    },
    reactionEmoji: {
      fontSize: 24,
    },
    reactionCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
      marginLeft: theme.spacing.xs,
    },
    reactionPicker: {
      position: 'absolute',
      bottom: 80,
      left: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.md,
    },
    reactionOption: {
      padding: theme.spacing.sm,
    },
    reactionOptionEmoji: {
      fontSize: 32,
    },
    tapArea: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '50%',
    },
    leftTapArea: {
      left: 0,
    },
    rightTapArea: {
      right: 0,
    },
  });

  useEffect(() => {
    if (currentStatus) {
      markAsViewed(currentStatus.id);
      startStatusTimer();
    }
    
    return () => {
      if (statusTimer.current) {
        clearTimeout(statusTimer.current);
      }
    };
  }, [currentIndex, currentStatus]);

  const startStatusTimer = () => {
    if (statusTimer.current) {
      clearTimeout(statusTimer.current);
    }

    progressAnim.setValue(0);
    
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000, // 5 seconds per status
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const goToNext = () => {
    if (currentIndex < userStatuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const handleReaction = (reactionType: string) => {
    if (currentStatus) {
      const existingReaction = currentStatus.reactions.find(r => r.userId === 'current_user');
      
      if (existingReaction && existingReaction.type === reactionType) {
        removeReaction(currentStatus.id);
      } else {
        addReaction(currentStatus.id, reactionType);
      }
    }
    setShowReactions(false);
  };

  const toggleReactions = () => {
    setShowReactions(!showReactions);
    
    Animated.spring(reactionAnim, {
      toValue: showReactions ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCurrentUserReaction = () => {
    if (!currentStatus) return null;
    return currentStatus.reactions.find(r => r.userId === 'current_user');
  };

  const getReactionCount = () => {
    if (!currentStatus) return 0;
    return currentStatus.reactions.length;
  };

  if (!currentStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.statusContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.statusText, { color: theme.colors.text }]}>
            No status found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const reactionOptions = [
    { type: 'like', emoji: '👍' },
    { type: 'love', emoji: '❤️' },
    { type: 'laugh', emoji: '😂' },
    { type: 'wow', emoji: '😮' },
    { type: 'sad', emoji: '😢' },
    { type: 'angry', emoji: '😠' },
    { type: 'fire', emoji: '🔥' },
    { type: 'heart_eyes', emoji: '😍' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bars */}
      <View style={styles.progressContainer}>
        {userStatuses.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: index === currentIndex 
                    ? progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : index < currentIndex ? '100%' : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: currentStatus.userAvatar || 'https://via.placeholder.com/40x40' }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{currentStatus.userName}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(currentStatus.createdAt)}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status content */}
      <View style={styles.statusContainer}>
        {currentStatus.type === 'image' && currentStatus.content.mediaUrl ? (
          <Image
            source={{ uri: currentStatus.content.mediaUrl }}
            style={styles.imageStatus}
          />
        ) : (
          <View
            style={[
              styles.textStatus,
              { backgroundColor: currentStatus.content.backgroundColor || '#ff1744' },
            ]}
          >
            <Text style={styles.statusText}>
              {currentStatus.content.text}
            </Text>
          </View>
        )}
      </View>

      {/* Tap areas for navigation */}
      <TouchableOpacity
        style={[styles.tapArea, styles.leftTapArea]}
        onPress={goToPrevious}
        activeOpacity={1}
      />
      
      <TouchableOpacity
        style={[styles.tapArea, styles.rightTapArea]}
        onPress={goToNext}
        activeOpacity={1}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {currentStatus.caption && (
          <Text style={styles.caption}>{currentStatus.caption}</Text>
        )}
        
        <View style={styles.reactionBar}>
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={toggleReactions}
          >
            <Text style={styles.reactionEmoji}>
              {getCurrentUserReaction()?.emoji || '👍'}
            </Text>
            {getReactionCount() > 0 && (
              <Text style={styles.reactionCount}>{getReactionCount()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Reaction picker */}
      {showReactions && (
        <Animated.View
          style={[
            styles.reactionPicker,
            {
              transform: [
                {
                  translateY: reactionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
              opacity: reactionAnim,
            },
          ]}
        >
          {reactionOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={styles.reactionOption}
              onPress={() => handleReaction(option.type)}
            >
              <Text style={styles.reactionOptionEmoji}>{option.emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default StatusViewerScreen;
