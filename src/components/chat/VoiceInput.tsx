import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import VoiceRecorder from '../voice/VoiceRecorder';
import { VoiceMessage } from '../../services/VoiceMessageService';

interface VoiceInputProps {
  visible: boolean;
  onVoiceMessageSent?: (voiceMessage: VoiceMessage) => void;
  onClose?: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  visible,
  onVoiceMessageSent,
  onClose,
}) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  
  // Animations
  const slideAnimation = new Animated.Value(0);
  const backgroundOpacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      showVoiceInput();
    } else {
      hideVoiceInput();
    }
  }, [visible]);

  const showVoiceInput = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideVoiceInput = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!visible) {
        onClose?.();
      }
    });
  };

  const handleVoiceMessageSent = (voiceMessage: VoiceMessage) => {
    onVoiceMessageSent?.(voiceMessage);
    hideVoiceInput();
  };

  const handleRecordingStateChanged = (recording: boolean) => {
    setIsRecording(recording);
  };

  if (!visible) {
    return null;
  }

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      zIndex: 1000,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl + 20, // Extra padding for safe area
      paddingHorizontal: theme.spacing.xl,
      minHeight: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recordingContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      width: '100%',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginBottom: theme.spacing.lg,
    },
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: backgroundOpacity,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.handle} />
        
        <View style={styles.recordingContainer}>
          <VoiceRecorder
            onVoiceMessageSent={handleVoiceMessageSent}
            onRecordingStateChanged={handleRecordingStateChanged}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default VoiceInput;
