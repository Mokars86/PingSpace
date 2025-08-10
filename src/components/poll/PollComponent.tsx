import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Poll, PollOption } from '../../types';
import PollService from '../../services/PollService';

interface PollComponentProps {
  poll: Poll;
  currentUserId: string;
  onVote?: (pollId: string, optionId: string) => void;
  onClose?: (pollId: string) => void;
  showResults?: boolean;
}

const PollComponent: React.FC<PollComponentProps> = ({
  poll,
  currentUserId,
  onVote,
  onClose,
  showResults = false,
}) => {
  const { theme } = useTheme();
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [animatedValues] = useState(
    poll.options.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    const votes = PollService.getUserVote(poll.id, currentUserId);
    setUserVotes(votes);
  }, [poll.id, currentUserId]);

  useEffect(() => {
    if (showResults || !poll.isActive) {
      // Animate progress bars
      poll.options.forEach((option, index) => {
        Animated.timing(animatedValues[index], {
          toValue: option.percentage || 0,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [showResults, poll.isActive, poll.options]);

  const handleVote = async (optionId: string) => {
    if (!poll.isActive) {
      Alert.alert('Poll Closed', 'This poll is no longer accepting votes.');
      return;
    }

    try {
      await PollService.vote(poll.id, optionId, currentUserId);
      const newVotes = PollService.getUserVote(poll.id, currentUserId);
      setUserVotes(newVotes);
      onVote?.(poll.id, optionId);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to vote');
    }
  };

  const handleRemoveVote = async (optionId: string) => {
    try {
      await PollService.removeVote(poll.id, optionId, currentUserId);
      const newVotes = PollService.getUserVote(poll.id, currentUserId);
      setUserVotes(newVotes);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove vote');
    }
  };

  const handleClosePoll = () => {
    Alert.alert(
      'Close Poll',
      'Are you sure you want to close this poll? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              await PollService.closePoll(poll.id, currentUserId);
              onClose?.(poll.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to close poll');
            }
          },
        },
      ]
    );
  };

  const getTimeRemaining = (): string => {
    if (!poll.expiresAt) return '';
    
    const now = new Date();
    const timeLeft = poll.expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const renderOption = (option: PollOption, index: number) => {
    const hasVoted = userVotes.includes(option.id);
    const showResultsForOption = showResults || !poll.isActive || userVotes.length > 0;
    const percentage = option.percentage || 0;
    const voteCount = option.votes.length;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionContainer,
          hasVoted && styles.votedOption,
          !poll.isActive && styles.disabledOption,
        ]}
        onPress={() => {
          if (hasVoted && poll.allowMultipleVotes) {
            handleRemoveVote(option.id);
          } else {
            handleVote(option.id);
          }
        }}
        disabled={!poll.isActive}
        activeOpacity={0.7}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionHeader}>
            <Text style={[styles.optionText, hasVoted && styles.votedOptionText]}>
              {option.text}
            </Text>
            {hasVoted && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.accent} />
            )}
          </View>

          {showResultsForOption && (
            <View style={styles.resultContainer}>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: animatedValues[index].interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
              </View>
              <View style={styles.resultStats}>
                <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
                <Text style={styles.voteCountText}>
                  {voteCount} vote{voteCount !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    pollIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    headerContent: {
      flex: 1,
    },
    question: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    pollInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    infoText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.md,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    activeBadge: {
      backgroundColor: theme.colors.success + '20',
    },
    closedBadge: {
      backgroundColor: theme.colors.textMuted + '20',
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    activeText: {
      color: theme.colors.success,
    },
    closedText: {
      color: theme.colors.textMuted,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    optionsContainer: {
      marginBottom: theme.spacing.md,
    },
    optionContainer: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    votedOption: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    disabledOption: {
      opacity: 0.6,
    },
    optionContent: {
      padding: theme.spacing.md,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    optionText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      flex: 1,
    },
    votedOptionText: {
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
    },
    resultContainer: {
      marginTop: theme.spacing.sm,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: theme.spacing.xs,
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.accent,
      borderRadius: 3,
    },
    resultStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    percentageText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
    },
    voteCountText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalVotes: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    timeRemaining: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.warning,
    },
    anonymousText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="bar-chart"
          size={20}
          color={theme.colors.accent}
          style={styles.pollIcon}
        />
        <View style={styles.headerContent}>
          <Text style={styles.question}>{poll.question}</Text>
          <View style={styles.pollInfo}>
            <View style={[styles.statusBadge, poll.isActive ? styles.activeBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, poll.isActive ? styles.activeText : styles.closedText]}>
                {poll.isActive ? 'Active' : 'Closed'}
              </Text>
            </View>
            {poll.allowMultipleVotes && (
              <Text style={styles.infoText}>Multiple votes allowed</Text>
            )}
            {poll.isAnonymous && (
              <Text style={styles.anonymousText}>Anonymous</Text>
            )}
          </View>
        </View>
        {poll.createdBy === currentUserId && poll.isActive && (
          <TouchableOpacity style={styles.closeButton} onPress={handleClosePoll}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {poll.options.map((option, index) => renderOption(option, index))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalVotes}>
          {poll.totalVotes} total vote{poll.totalVotes !== 1 ? 's' : ''}
        </Text>
        {poll.expiresAt && poll.isActive && (
          <Text style={styles.timeRemaining}>{getTimeRemaining()}</Text>
        )}
      </View>
    </View>
  );
};

export default PollComponent;
