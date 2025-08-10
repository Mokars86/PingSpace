import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'failed';

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export interface CallSession {
  id: string;
  type: CallType;
  status: CallStatus;
  participants: CallParticipant[];
  initiator: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  isRecording: boolean;
  recordingPath?: string;
  chatId?: string;
  isGroupCall: boolean;
}

export interface CallSettings {
  autoAnswer: boolean;
  videoQuality: 'low' | 'medium' | 'high';
  audioQuality: 'low' | 'medium' | 'high';
  enableNoiseCancellation: boolean;
  enableEchoCancellation: boolean;
  defaultCamera: 'front' | 'back';
  enableCallRecording: boolean;
  enableScreenSharing: boolean;
}

class CallService {
  private currentCall: CallSession | null = null;
  private audioRecording: Audio.Recording | null = null;
  private settings: CallSettings = {
    autoAnswer: false,
    videoQuality: 'medium',
    audioQuality: 'high',
    enableNoiseCancellation: true,
    enableEchoCancellation: true,
    defaultCamera: 'front',
    enableCallRecording: false,
    enableScreenSharing: true,
  };

  private onCallStatusChanged?: (call: CallSession) => void;
  private onIncomingCall?: (call: CallSession) => void;
  private onCallEnded?: (call: CallSession) => void;

  // Initialize the call service
  async initialize(): Promise<void> {
    try {
      // Request audio permissions
      const audioPermission = await Audio.requestPermissionsAsync();
      if (audioPermission.status !== 'granted') {
        console.warn('Audio permission not granted');
      }

      // Set audio mode for calls
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Call service initialized');
    } catch (error) {
      console.error('Failed to initialize call service:', error);
    }
  }

  // Start a new call
  async startCall(
    participants: string[],
    type: CallType,
    chatId?: string
  ): Promise<CallSession> {
    try {
      if (this.currentCall && this.currentCall.status !== 'ended') {
        throw new Error('Another call is already in progress');
      }

      const callId = `call_${Date.now()}`;
      const callParticipants: CallParticipant[] = participants.map(id => ({
        id,
        name: `User ${id}`, // In real app, get from user service
        isMuted: false,
        isVideoEnabled: type === 'video',
        isScreenSharing: false,
        connectionStatus: 'connecting',
      }));

      const call: CallSession = {
        id: callId,
        type,
        status: 'calling',
        participants: callParticipants,
        initiator: 'current_user', // Replace with actual user ID
        chatId,
        isGroupCall: participants.length > 1,
        isRecording: false,
      };

      this.currentCall = call;
      this.notifyCallStatusChanged(call);

      // Simulate call connection process
      setTimeout(() => {
        this.updateCallStatus('connecting');
      }, 1000);

      setTimeout(() => {
        this.updateCallStatus('connected');
        this.currentCall!.startTime = new Date();
      }, 3000);

      return call;
    } catch (error) {
      console.error('Failed to start call:', error);
      throw error;
    }
  }

  // Answer an incoming call
  async answerCall(callId: string): Promise<void> {
    if (!this.currentCall || this.currentCall.id !== callId) {
      throw new Error('No matching call found');
    }

    this.updateCallStatus('connecting');
    
    // Simulate connection
    setTimeout(() => {
      this.updateCallStatus('connected');
      this.currentCall!.startTime = new Date();
    }, 2000);
  }

  // Reject an incoming call
  async rejectCall(callId: string): Promise<void> {
    if (!this.currentCall || this.currentCall.id !== callId) {
      throw new Error('No matching call found');
    }

    this.endCall();
  }

  // End the current call
  async endCall(): Promise<void> {
    if (!this.currentCall) {
      return;
    }

    const call = this.currentCall;
    call.status = 'ended';
    call.endTime = new Date();
    
    if (call.startTime) {
      call.duration = call.endTime.getTime() - call.startTime.getTime();
    }

    // Stop recording if active
    if (call.isRecording) {
      await this.stopRecording();
    }

    this.notifyCallStatusChanged(call);
    
    if (this.onCallEnded) {
      this.onCallEnded(call);
    }

    this.currentCall = null;
  }

  // Toggle mute
  async toggleMute(): Promise<boolean> {
    if (!this.currentCall) {
      return false;
    }

    const currentUser = this.currentCall.participants.find(p => p.id === 'current_user');
    if (currentUser) {
      currentUser.isMuted = !currentUser.isMuted;
      this.notifyCallStatusChanged(this.currentCall);
      return currentUser.isMuted;
    }

    return false;
  }

  // Toggle video
  async toggleVideo(): Promise<boolean> {
    if (!this.currentCall) {
      return false;
    }

    const currentUser = this.currentCall.participants.find(p => p.id === 'current_user');
    if (currentUser) {
      currentUser.isVideoEnabled = !currentUser.isVideoEnabled;
      this.notifyCallStatusChanged(this.currentCall);
      return currentUser.isVideoEnabled;
    }

    return false;
  }

  // Toggle screen sharing
  async toggleScreenShare(): Promise<boolean> {
    if (!this.currentCall || !this.settings.enableScreenSharing) {
      return false;
    }

    const currentUser = this.currentCall.participants.find(p => p.id === 'current_user');
    if (currentUser) {
      currentUser.isScreenSharing = !currentUser.isScreenSharing;
      
      // If starting screen share, disable video
      if (currentUser.isScreenSharing) {
        currentUser.isVideoEnabled = false;
      }
      
      this.notifyCallStatusChanged(this.currentCall);
      return currentUser.isScreenSharing;
    }

    return false;
  }

  // Start call recording
  async startRecording(): Promise<void> {
    if (!this.currentCall || !this.settings.enableCallRecording) {
      throw new Error('Cannot start recording');
    }

    try {
      // Request media library permissions for saving
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission required for recording');
      }

      // Start audio recording
      this.audioRecording = new Audio.Recording();
      await this.audioRecording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await this.audioRecording.startAsync();
      
      this.currentCall.isRecording = true;
      this.notifyCallStatusChanged(this.currentCall);

      console.log('Call recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  // Stop call recording
  async stopRecording(): Promise<string | null> {
    if (!this.audioRecording || !this.currentCall) {
      return null;
    }

    try {
      await this.audioRecording.stopAndUnloadAsync();
      const uri = this.audioRecording.getURI();
      
      this.currentCall.isRecording = false;
      this.currentCall.recordingPath = uri || undefined;
      
      this.audioRecording = null;
      this.notifyCallStatusChanged(this.currentCall);

      console.log('Call recording stopped:', uri);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }

  // Add participant to group call
  async addParticipant(userId: string, userName: string): Promise<void> {
    if (!this.currentCall || !this.currentCall.isGroupCall) {
      throw new Error('Cannot add participant to non-group call');
    }

    const newParticipant: CallParticipant = {
      id: userId,
      name: userName,
      isMuted: false,
      isVideoEnabled: this.currentCall.type === 'video',
      isScreenSharing: false,
      connectionStatus: 'connecting',
    };

    this.currentCall.participants.push(newParticipant);
    this.notifyCallStatusChanged(this.currentCall);

    // Simulate connection
    setTimeout(() => {
      newParticipant.connectionStatus = 'connected';
      this.notifyCallStatusChanged(this.currentCall!);
    }, 2000);
  }

  // Remove participant from group call
  async removeParticipant(userId: string): Promise<void> {
    if (!this.currentCall) {
      return;
    }

    this.currentCall.participants = this.currentCall.participants.filter(p => p.id !== userId);
    this.notifyCallStatusChanged(this.currentCall);
  }

  // Switch camera (front/back)
  async switchCamera(): Promise<void> {
    if (!this.currentCall || this.currentCall.type !== 'video') {
      return;
    }

    // In a real implementation, this would switch the camera
    console.log('Camera switched');
  }

  // Update call status
  private updateCallStatus(status: CallStatus): void {
    if (this.currentCall) {
      this.currentCall.status = status;
      this.notifyCallStatusChanged(this.currentCall);
    }
  }

  // Notify call status change
  private notifyCallStatusChanged(call: CallSession): void {
    if (this.onCallStatusChanged) {
      this.onCallStatusChanged({ ...call });
    }
  }

  // Simulate incoming call
  simulateIncomingCall(fromUserId: string, fromUserName: string, type: CallType): void {
    const callId = `incoming_call_${Date.now()}`;
    const call: CallSession = {
      id: callId,
      type,
      status: 'ringing',
      participants: [
        {
          id: fromUserId,
          name: fromUserName,
          isMuted: false,
          isVideoEnabled: type === 'video',
          isScreenSharing: false,
          connectionStatus: 'connected',
        },
      ],
      initiator: fromUserId,
      isGroupCall: false,
      isRecording: false,
    };

    this.currentCall = call;
    
    if (this.onIncomingCall) {
      this.onIncomingCall(call);
    }

    // Auto-reject after 30 seconds if not answered
    setTimeout(() => {
      if (this.currentCall?.id === callId && this.currentCall.status === 'ringing') {
        this.endCall();
      }
    }, 30000);
  }

  // Set callbacks
  setOnCallStatusChanged(callback: (call: CallSession) => void): void {
    this.onCallStatusChanged = callback;
  }

  setOnIncomingCall(callback: (call: CallSession) => void): void {
    this.onIncomingCall = callback;
  }

  setOnCallEnded(callback: (call: CallSession) => void): void {
    this.onCallEnded = callback;
  }

  // Get current call
  getCurrentCall(): CallSession | null {
    return this.currentCall ? { ...this.currentCall } : null;
  }

  // Update settings
  updateSettings(newSettings: Partial<CallSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get settings
  getSettings(): CallSettings {
    return { ...this.settings };
  }

  // Check if in call
  isInCall(): boolean {
    return this.currentCall !== null && this.currentCall.status !== 'ended';
  }
}

export default new CallService();
