import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { CallSession, CallParticipant } from '../../services/CallService';

interface CallInterfaceProps {
  visible: boolean;
  call: CallSession | null;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAddParticipant: () => void;
  onSwitchCamera: () => void;
}

const { width, height } = Dimensions.get('window');

const CallInterface: React.FC<CallInterfaceProps> = ({
  visible,
  call,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onStartRecording,
  onStopRecording,
  onAddParticipant,
  onSwitchCamera,
}) => {
  const { theme } = useTheme();
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!call || !call.startTime || call.status !== 'connected') {
      return;
    }

    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - call.startTime!.getTime()) / 1000);
      setCallDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [call?.startTime, call?.status]);

  useEffect(() => {
    if (visible) {
      // Hide controls after 5 seconds
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [visible, showControls]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (): string => {
    if (!call) return '';
    
    switch (call.status) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return 'Incoming call';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  const getCurrentUser = (): CallParticipant | undefined => {
    return call?.participants.find(p => p.id === 'current_user');
  };

  const getOtherParticipants = (): CallParticipant[] => {
    return call?.participants.filter(p => p.id !== 'current_user') || [];
  };

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleRecordingToggle = () => {
    if (call?.isRecording) {
      Alert.alert(
        'Stop Recording',
        'Are you sure you want to stop recording this call?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Stop', style: 'destructive', onPress: onStopRecording },
        ]
      );
    } else {
      Alert.alert(
        'Start Recording',
        'This call will be recorded. All participants will be notified.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Record', onPress: onStartRecording },
        ]
      );
    }
  };

  const currentUser = getCurrentUser();
  const otherParticipants = getOtherParticipants();

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: '#000000',
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    videoContainer: {
      flex: 1,
      backgroundColor: '#1a1a1a',
      justifyContent: 'center',
      alignItems: 'center',
    },
    participantVideo: {
      width: width,
      height: height * 0.7,
      backgroundColor: '#2a2a2a',
      justifyContent: 'center',
      alignItems: 'center',
    },
    participantName: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    participantStatus: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: '#CCCCCC',
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    selfVideo: {
      position: 'absolute',
      top: 60,
      right: 20,
      width: 120,
      height: 160,
      backgroundColor: '#333333',
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    selfVideoText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: StatusBar.currentHeight || 44,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: 'rgba(0,0,0,0.5)',
      opacity: showControls ? 1 : 0,
    },
    headerContent: {
      alignItems: 'center',
    },
    callStatus: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    participantCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: '#CCCCCC',
      textAlign: 'center',
      marginTop: 4,
    },
    recordingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    recordingText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      marginLeft: theme.spacing.xs,
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 40,
      backgroundColor: 'rgba(0,0,0,0.5)',
      opacity: showControls ? 1 : 0,
    },
    controlsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    controlButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeControlButton: {
      backgroundColor: theme.colors.accent,
    },
    muteButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    mutedButton: {
      backgroundColor: theme.colors.error,
    },
    endCallButton: {
      backgroundColor: theme.colors.error,
    },
    recordingButton: {
      backgroundColor: call?.isRecording ? theme.colors.error : 'rgba(255,255,255,0.2)',
    },
    secondaryControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.md,
    },
    incomingCallContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
    },
    incomingCallContent: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    incomingCallName: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    incomingCallType: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.regular,
      color: '#CCCCCC',
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    incomingCallActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      maxWidth: 300,
    },
    answerButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rejectButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!call) {
    return null;
  }

  const renderIncomingCall = () => (
    <View style={styles.incomingCallContainer}>
      <View style={styles.incomingCallContent}>
        <Text style={styles.incomingCallName}>
          {otherParticipants[0]?.name || 'Unknown'}
        </Text>
        <Text style={styles.incomingCallType}>
          Incoming {call.type} call
        </Text>
        
        <View style={styles.incomingCallActions}>
          <TouchableOpacity style={styles.rejectButton} onPress={onEndCall}>
            <Ionicons name="call" size={32} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.answerButton} onPress={() => {}}>
            <Ionicons name="call" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActiveCall = () => (
    <TouchableOpacity style={styles.container} onPress={handleScreenTap} activeOpacity={1}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.callStatus}>{getStatusText()}</Text>
          {call.isGroupCall && (
            <Text style={styles.participantCount}>
              {call.participants.length} participants
            </Text>
          )}
          {call.isRecording && (
            <View style={styles.recordingIndicator}>
              <Ionicons name="radio-button-on" size={12} color="#FFFFFF" />
              <Text style={styles.recordingText}>Recording</Text>
            </View>
          )}
        </View>
      </View>

      {/* Video/Audio Area */}
      <View style={styles.videoContainer}>
        <View style={styles.participantVideo}>
          <Text style={styles.participantName}>
            {otherParticipants[0]?.name || 'Unknown'}
          </Text>
          <Text style={styles.participantStatus}>
            {call.type === 'video' ? 'Video' : 'Voice'} call
          </Text>
        </View>

        {/* Self video (for video calls) */}
        {call.type === 'video' && (
          <TouchableOpacity style={styles.selfVideo} onPress={onSwitchCamera}>
            <Text style={styles.selfVideoText}>You</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Primary Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.muteButton,
              currentUser?.isMuted && styles.mutedButton,
            ]}
            onPress={onToggleMute}
          >
            <Ionicons
              name={currentUser?.isMuted ? 'mic-off' : 'mic'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={onEndCall}
          >
            <Ionicons name="call" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>

          {call.type === 'video' && (
            <TouchableOpacity
              style={[
                styles.controlButton,
                currentUser?.isVideoEnabled && styles.activeControlButton,
              ]}
              onPress={onToggleVideo}
            >
              <Ionicons
                name={currentUser?.isVideoEnabled ? 'videocam' : 'videocam-off'}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.recordingButton]}
            onPress={handleRecordingToggle}
          >
            <Ionicons
              name={call.isRecording ? 'stop' : 'radio-button-on'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {call.type === 'video' && (
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                currentUser?.isScreenSharing && styles.activeControlButton,
              ]}
              onPress={onToggleScreenShare}
            >
              <Ionicons
                name="desktop"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}

          {call.isGroupCall && (
            <TouchableOpacity style={styles.secondaryButton} onPress={onAddParticipant}>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onEndCall}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.modal}>
        {call.status === 'ringing' ? renderIncomingCall() : renderActiveCall()}
      </View>
    </Modal>
  );
};

export default CallInterface;
