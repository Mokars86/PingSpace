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
import VoiceMessageService, { RecordingState, VoiceMessage } from '../../services/VoiceMessageService';

interface VoiceRecorderProps {
  onVoiceMessageSent?: (voiceMessage: VoiceMessage) => void;
  onRecordingStateChanged?: (isRecording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onVoiceMessageSent,
  onRecordingStateChanged,
}) => {
  const { theme } = useTheme();
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    waveform: [],
  });
  const [isLocked, setIsLocked] = useState(false);
  const [slideToCancel, setSlideToCancel] = useState(false);

  // Animations
  const recordButtonScale = useRef(new Animated.Value(1)).current;
  const recordButtonOpacity = useRef(new Animated.Value(1)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const lockAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    VoiceMessageService.setOnRecordingStateChanged(setRecordingState);
    
    return () => {
      VoiceMessageService.cleanup();
    };
  }, []);

  useEffect(() => {
    onRecordingStateChanged?.(recordingState.isRecording);
    
    if (recordingState.isRecording) {
      startRecordingAnimations();
    } else {
      stopRecordingAnimations();
    }
  }, [recordingState.isRecording]);

  const startRecordingAnimations = () => {
    // Pulse animation for record button
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordButtonScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(recordButtonScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Waveform animation
    Animated.loop(
      Animated.timing(waveformAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
  };

  const stopRecordingAnimations = () => {
    recordButtonScale.stopAnimation();
    waveformAnimation.stopAnimation();
    
    Animated.timing(recordButtonScale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(waveformAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleRecordStart = async () => {
    try {
      await VoiceMessageService.initialize();
      await VoiceMessageService.startRecording();
      setIsLocked(false);
      setSlideToCancel(false);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleRecordStop = async () => {
    try {
      const voiceMessage = await VoiceMessageService.stopRecording();
      if (voiceMessage && voiceMessage.duration > 1000) { // Minimum 1 second
        onVoiceMessageSent?.(voiceMessage);
      }
      setIsLocked(false);
      setSlideToCancel(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleRecordCancel = async () => {
    try {
      await VoiceMessageService.cancelRecording();
      setIsLocked(false);
      setSlideToCancel(false);
    } catch (error) {
      console.error('Failed to cancel recording:', error);
    }
  };

  const handleGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    
    // Slide to cancel (horizontal)
    if (translationX < -100 && !isLocked) {
      setSlideToCancel(true);
      Animated.timing(slideAnimation, {
        toValue: translationX,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
    
    // Lock recording (vertical)
    if (translationY < -100 && !slideToCancel) {
      setIsLocked(true);
      Animated.timing(lockAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleGestureStateChange = (event: any) => {
    const { state, translationX } = event.nativeEvent;
    
    if (state === State.BEGAN && !recordingState.isRecording) {
      handleRecordStart();
    } else if (state === State.END || state === State.CANCELLED) {
      if (slideToCancel || translationX < -100) {
        handleRecordCancel();
      } else if (recordingState.isRecording && !isLocked) {
        handleRecordStop();
      }
      
      // Reset animations
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      setSlideToCancel(false);
    }
  };

  const renderWaveform = () => {
    if (!recordingState.isRecording || recordingState.waveform.length === 0) {
      return null;
    }

    return (
      <View style={styles.waveformContainer}>
        {recordingState.waveform.map((amplitude, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: waveformAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, amplitude * 30 + 4],
                }),
                backgroundColor: theme.colors.accent,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    recordingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.md,
      minWidth: 200,
    },
    recordingInfo: {
      flex: 1,
      alignItems: 'center',
    },
    recordingTime: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.error,
      marginBottom: theme.spacing.xs,
    },
    recordingText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    waveformContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
      marginVertical: theme.spacing.sm,
    },
    waveformBar: {
      width: 3,
      backgroundColor: theme.colors.accent,
      marginHorizontal: 1,
      borderRadius: 1.5,
    },
    recordButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    recordingButton: {
      backgroundColor: theme.colors.error,
      transform: [{ scale: 1.2 }],
    },
    lockContainer: {
      position: 'absolute',
      top: -80,
      alignItems: 'center',
    },
    lockIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    lockText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    slideContainer: {
      position: 'absolute',
      left: -150,
      flexDirection: 'row',
      alignItems: 'center',
    },
    slideText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.md,
    },
    slideIcon: {
      marginLeft: theme.spacing.sm,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: theme.spacing.md,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    cancelButton: {
      backgroundColor: theme.colors.error + '20',
    },
    sendButton: {
      backgroundColor: theme.colors.accent,
    },
    instructions: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
  });

  if (recordingState.isRecording) {
    return (
      <View style={styles.container}>
        <View style={styles.recordingContainer}>
          <View style={styles.recordingInfo}>
            <Text style={styles.recordingTime}>
              {VoiceMessageService.formatDuration(recordingState.duration)}
            </Text>
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        </View>

        {renderWaveform()}

        {isLocked ? (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, styles.cancelButton]}
              onPress={handleRecordCancel}
            >
              <Ionicons name="trash" size={24} color={theme.colors.error} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.sendButton]}
              onPress={handleRecordStop}
            >
              <Ionicons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleGestureStateChange}
          >
            <Animated.View style={{ transform: [{ translateX: slideAnimation }] }}>
              <Animated.View
                style={[
                  styles.recordButton,
                  styles.recordingButton,
                  { transform: [{ scale: recordButtonScale }] },
                ]}
              >
                <Ionicons name="mic" size={24} color="#FFFFFF" />
              </Animated.View>

              {/* Lock indicator */}
              <Animated.View
                style={[
                  styles.lockContainer,
                  {
                    opacity: lockAnimation,
                    transform: [
                      {
                        translateY: lockAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={16} color={theme.colors.textSecondary} />
                </View>
                <Text style={styles.lockText}>Lock</Text>
              </Animated.View>

              {/* Slide to cancel */}
              {slideToCancel && (
                <View style={styles.slideContainer}>
                  <Text style={styles.slideText}>Release to cancel</Text>
                  <Ionicons name="arrow-back" size={16} color={theme.colors.textSecondary} />
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
        )}

        <Text style={styles.instructions}>
          {isLocked 
            ? 'Tap send to share or trash to delete'
            : 'Slide up to lock, slide left to cancel'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureStateChange}
      >
        <Animated.View style={styles.recordButton}>
          <Ionicons name="mic" size={24} color="#FFFFFF" />
        </Animated.View>
      </PanGestureHandler>
      
      <Text style={styles.instructions}>
        Hold to record voice message
      </Text>
    </View>
  );
};

export default VoiceRecorder;
