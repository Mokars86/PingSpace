import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VoiceMessage {
  id: string;
  uri: string;
  duration: number;
  waveform: number[];
  createdAt: Date;
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  uri?: string;
  waveform: number[];
}

class VoiceMessageService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private recordingState: RecordingState = {
    isRecording: false,
    duration: 0,
    waveform: [],
  };
  private onRecordingStateChanged?: (state: RecordingState) => void;
  private onPlaybackStateChanged?: (isPlaying: boolean, position: number, duration: number) => void;
  private recordingTimer?: NodeJS.Timeout;
  private playbackTimer?: NodeJS.Timeout;

  // Initialize audio permissions and settings
  async initialize(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw new Error('Audio permissions required for voice messages');
    }
  }

  // Start recording
  async startRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.stopRecording();
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            this.updateRecordingState({
              isRecording: true,
              duration: status.durationMillis || 0,
              waveform: this.generateWaveform(status.durationMillis || 0),
            });
          }
        },
        100 // Update every 100ms
      );

      this.recording = recording;
      this.startRecordingTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Failed to start recording');
    }
  }

  // Stop recording
  async stopRecording(): Promise<VoiceMessage | null> {
    try {
      if (!this.recording) return null;

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      if (!uri) {
        this.recording = null;
        return null;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const duration = this.recordingState.duration;
      
      const voiceMessage: VoiceMessage = {
        id: `voice_${Date.now()}`,
        uri,
        duration,
        waveform: this.recordingState.waveform,
        createdAt: new Date(),
        size: fileInfo.exists ? fileInfo.size || 0 : 0,
      };

      // Save to storage
      await this.saveVoiceMessage(voiceMessage);

      this.recording = null;
      this.stopRecordingTimer();
      this.updateRecordingState({
        isRecording: false,
        duration: 0,
        waveform: [],
      });

      return voiceMessage;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.recording = null;
      return null;
    }
  }

  // Cancel recording
  async cancelRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        
        // Delete the file
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
        
        this.recording = null;
      }

      this.stopRecordingTimer();
      this.updateRecordingState({
        isRecording: false,
        duration: 0,
        waveform: [],
      });
    } catch (error) {
      console.error('Failed to cancel recording:', error);
    }
  }

  // Play voice message
  async playVoiceMessage(uri: string): Promise<void> {
    try {
      // Stop current playback if any
      await this.stopPlayback();

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            const isPlaying = status.isPlaying || false;
            const position = status.positionMillis || 0;
            const duration = status.durationMillis || 0;
            
            this.onPlaybackStateChanged?.(isPlaying, position, duration);

            if (status.didJustFinish) {
              this.stopPlayback();
            }
          }
        }
      );

      this.sound = sound;
      this.startPlaybackTimer();
    } catch (error) {
      console.error('Failed to play voice message:', error);
      throw new Error('Failed to play voice message');
    }
  }

  // Pause playback
  async pausePlayback(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
      }
    } catch (error) {
      console.error('Failed to pause playback:', error);
    }
  }

  // Resume playback
  async resumePlayback(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('Failed to resume playback:', error);
    }
  }

  // Stop playback
  async stopPlayback(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.stopPlaybackTimer();
      this.onPlaybackStateChanged?.(false, 0, 0);
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }

  // Seek to position
  async seekTo(position: number): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
      }
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }

  // Get recording state
  getRecordingState(): RecordingState {
    return { ...this.recordingState };
  }

  // Generate waveform data (simplified simulation)
  private generateWaveform(duration: number): number[] {
    const points = Math.min(Math.floor(duration / 100), 100); // Max 100 points
    const waveform: number[] = [];
    
    for (let i = 0; i < points; i++) {
      // Simulate waveform with random values (in real app, use actual audio analysis)
      waveform.push(Math.random() * 0.8 + 0.2);
    }
    
    return waveform;
  }

  // Update recording state
  private updateRecordingState(updates: Partial<RecordingState>): void {
    this.recordingState = { ...this.recordingState, ...updates };
    this.onRecordingStateChanged?.(this.recordingState);
  }

  // Start recording timer
  private startRecordingTimer(): void {
    this.recordingTimer = setInterval(() => {
      if (this.recording) {
        // Timer is handled by the recording status callback
      }
    }, 100);
  }

  // Stop recording timer
  private stopRecordingTimer(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = undefined;
    }
  }

  // Start playback timer
  private startPlaybackTimer(): void {
    this.playbackTimer = setInterval(async () => {
      if (this.sound) {
        try {
          const status = await this.sound.getStatusAsync();
          if (status.isLoaded) {
            const isPlaying = status.isPlaying || false;
            const position = status.positionMillis || 0;
            const duration = status.durationMillis || 0;
            
            this.onPlaybackStateChanged?.(isPlaying, position, duration);
          }
        } catch (error) {
          // Ignore errors during status check
        }
      }
    }, 100);
  }

  // Stop playback timer
  private stopPlaybackTimer(): void {
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = undefined;
    }
  }

  // Format duration
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Save voice message to storage
  private async saveVoiceMessage(voiceMessage: VoiceMessage): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('voice_messages');
      const voiceMessages: VoiceMessage[] = stored ? JSON.parse(stored) : [];
      
      voiceMessages.push({
        ...voiceMessage,
        createdAt: voiceMessage.createdAt.toISOString() as any,
      });
      
      await AsyncStorage.setItem('voice_messages', JSON.stringify(voiceMessages));
    } catch (error) {
      console.error('Failed to save voice message:', error);
    }
  }

  // Get voice message by ID
  async getVoiceMessage(id: string): Promise<VoiceMessage | null> {
    try {
      const stored = await AsyncStorage.getItem('voice_messages');
      const voiceMessages: any[] = stored ? JSON.parse(stored) : [];
      
      const message = voiceMessages.find(vm => vm.id === id);
      if (message) {
        return {
          ...message,
          createdAt: new Date(message.createdAt),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get voice message:', error);
      return null;
    }
  }

  // Delete voice message
  async deleteVoiceMessage(id: string): Promise<void> {
    try {
      const voiceMessage = await this.getVoiceMessage(id);
      if (voiceMessage) {
        // Delete file
        await FileSystem.deleteAsync(voiceMessage.uri, { idempotent: true });
        
        // Remove from storage
        const stored = await AsyncStorage.getItem('voice_messages');
        const voiceMessages: any[] = stored ? JSON.parse(stored) : [];
        const filtered = voiceMessages.filter(vm => vm.id !== id);
        await AsyncStorage.setItem('voice_messages', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Failed to delete voice message:', error);
    }
  }

  // Set callbacks
  setOnRecordingStateChanged(callback: (state: RecordingState) => void): void {
    this.onRecordingStateChanged = callback;
  }

  setOnPlaybackStateChanged(callback: (isPlaying: boolean, position: number, duration: number) => void): void {
    this.onPlaybackStateChanged = callback;
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await this.stopPlayback();
    await this.cancelRecording();
    this.stopRecordingTimer();
    this.stopPlaybackTimer();
  }
}

export default new VoiceMessageService();
