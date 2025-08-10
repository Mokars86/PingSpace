import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import VoiceMessageService, { VoiceMessage } from '../../services/VoiceMessageService';

interface VoicePlayerProps {
  voiceMessage: VoiceMessage;
  isOwnMessage?: boolean;
  onPlaybackStateChanged?: (isPlaying: boolean) => void;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({
  voiceMessage,
  isOwnMessage = false,
  onPlaybackStateChanged,
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(voiceMessage.duration);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Animations
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const waveformProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    VoiceMessageService.setOnPlaybackStateChanged((playing, position, dur) => {
      setIsPlaying(playing);
      setCurrentPosition(position);
      setDuration(dur || voiceMessage.duration);
      onPlaybackStateChanged?.(playing);

      // Update waveform progress
      const progress = dur > 0 ? position / dur : 0;
      Animated.timing(waveformProgress, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      VoiceMessageService.stopPlayback();
    };
  }, [voiceMessage.id]);

  useEffect(() => {
    if (isPlaying) {
      startPlayingAnimation();
    } else {
      stopPlayingAnimation();
    }
  }, [isPlaying]);

  const startPlayingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(playButtonScale, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(playButtonScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPlayingAnimation = () => {
    playButtonScale.stopAnimation();
    Animated.timing(playButtonScale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await VoiceMessageService.pausePlayback();
      } else {
        if (currentPosition === 0) {
          await VoiceMessageService.playVoiceMessage(voiceMessage.uri);
        } else {
          await VoiceMessageService.resumePlayback();
        }
      }
    } catch (error) {
      console.error('Failed to play/pause voice message:', error);
    }
  };

  const handleStop = async () => {
    try {
      await VoiceMessageService.stopPlayback();
      setCurrentPosition(0);
    } catch (error) {
      console.error('Failed to stop voice message:', error);
    }
  };

  const handleSeek = async (position: number) => {
    try {
      await VoiceMessageService.seekTo(position);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  const handleWaveformPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const waveformWidth = 200; // Approximate waveform width
    const progress = locationX / waveformWidth;
    const seekPosition = progress * duration;
    handleSeek(seekPosition);
  };

  const togglePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    // Note: Expo AV doesn't support playback rate, this is for UI demonstration
  };

  const formatTime = (milliseconds: number): string => {
    return VoiceMessageService.formatDuration(milliseconds);
  };

  const renderWaveform = () => {
    const waveform = voiceMessage.waveform || [];
    const progress = duration > 0 ? currentPosition / duration : 0;

    return (
      <TouchableOpacity
        style={styles.waveformContainer}
        onPress={handleWaveformPress}
        activeOpacity={0.7}
      >
        {waveform.map((amplitude, index) => {
          const isPlayed = index / waveform.length <= progress;
          return (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: Math.max(amplitude * 30, 4),
                  backgroundColor: isPlayed 
                    ? theme.colors.accent 
                    : theme.colors.border,
                },
              ]}
            />
          );
        })}
        
        {/* Progress indicator */}
        <Animated.View
          style={[
            styles.progressIndicator,
            {
              left: waveformProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200], // Waveform width
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isOwnMessage 
        ? theme.colors.accent + '10' 
        : theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      minWidth: 250,
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    playButtonPlaying: {
      backgroundColor: theme.colors.error,
    },
    contentContainer: {
      flex: 1,
    },
    waveformContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
      marginBottom: theme.spacing.sm,
      position: 'relative',
    },
    waveformBar: {
      width: 3,
      marginHorizontal: 0.5,
      borderRadius: 1.5,
    },
    progressIndicator: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: theme.colors.accent,
      borderRadius: 1,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    currentTime: {
      color: theme.colors.accent,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    controlButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    playbackRateButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      marginLeft: theme.spacing.sm,
    },
    playbackRateText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
    },
    sizeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonPlaying]}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.contentContainer}>
        {renderWaveform()}
        
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, styles.currentTime]}>
            {formatTime(currentPosition)}
          </Text>
          
          <View style={styles.controlsContainer}>
            {currentPosition > 0 && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleStop}
              >
                <Ionicons name="stop" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.playbackRateButton}
              onPress={togglePlaybackRate}
            >
              <Text style={styles.playbackRateText}>{playbackRate}x</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.timeText}>
            {formatTime(duration)}
          </Text>
        </View>
        
        <Text style={styles.sizeText}>
          {formatFileSize(voiceMessage.size)}
        </Text>
      </View>
    </View>
  );
};

export default VoicePlayer;
