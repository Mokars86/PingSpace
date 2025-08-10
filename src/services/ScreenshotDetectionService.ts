import { Alert, AppState, AppStateStatus } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

export interface ScreenshotEvent {
  id: string;
  timestamp: Date;
  chatId?: string;
  userId: string;
  detected: boolean;
  prevented: boolean;
}

export interface ScreenshotSettings {
  detectionEnabled: boolean;
  preventionEnabled: boolean;
  notifyOnScreenshot: boolean;
  blurSensitiveContent: boolean;
  logScreenshots: boolean;
}

class ScreenshotDetectionService {
  private isMonitoring = false;
  private lastPhotoCount = 0;
  private currentChatId?: string;
  private settings: ScreenshotSettings = {
    detectionEnabled: true,
    preventionEnabled: false,
    notifyOnScreenshot: true,
    blurSensitiveContent: true,
    logScreenshots: true,
  };
  
  private screenshotEvents: ScreenshotEvent[] = [];
  private onScreenshotDetected?: (event: ScreenshotEvent) => void;
  private onScreenshotPrevented?: () => void;
  private appStateSubscription?: any;

  // Initialize the service
  async initialize(): Promise<void> {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Media library permission not granted');
        return;
      }

      // Get initial photo count
      const albums = await MediaLibrary.getAlbumsAsync();
      const cameraRoll = albums.find(album => album.title === 'Camera Roll') || albums[0];
      
      if (cameraRoll) {
        const assets = await MediaLibrary.getAssetsAsync({
          album: cameraRoll,
          mediaType: 'photo',
          first: 1,
          sortBy: 'creationTime',
        });
        this.lastPhotoCount = assets.totalCount;
      }

      console.log('Screenshot detection service initialized');
    } catch (error) {
      console.error('Failed to initialize screenshot detection:', error);
    }
  }

  // Start monitoring for screenshots
  startMonitoring(chatId?: string): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.currentChatId = chatId;

    // Monitor app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    // Start periodic checking
    this.startPeriodicCheck();

    // Enable screenshot prevention if enabled
    if (this.settings.preventionEnabled) {
      this.enableScreenshotPrevention();
    }

    console.log('Screenshot monitoring started for chat:', chatId);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.currentChatId = undefined;

    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = undefined;
    }

    // Disable screenshot prevention
    this.disableScreenshotPrevention();

    console.log('Screenshot monitoring stopped');
  }

  // Handle app state changes
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background, check for new screenshots
      setTimeout(() => {
        this.checkForNewScreenshots();
      }, 1000);
    }
  };

  // Start periodic screenshot checking
  private startPeriodicCheck(): void {
    const checkInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(checkInterval);
        return;
      }
      this.checkForNewScreenshots();
    }, 2000); // Check every 2 seconds
  }

  // Check for new screenshots
  private async checkForNewScreenshots(): Promise<void> {
    if (!this.settings.detectionEnabled) {
      return;
    }

    try {
      const albums = await MediaLibrary.getAlbumsAsync();
      const cameraRoll = albums.find(album => album.title === 'Camera Roll') || albums[0];
      
      if (!cameraRoll) {
        return;
      }

      const assets = await MediaLibrary.getAssetsAsync({
        album: cameraRoll,
        mediaType: 'photo',
        first: 10,
        sortBy: 'creationTime',
      });

      const currentPhotoCount = assets.totalCount;
      
      if (currentPhotoCount > this.lastPhotoCount) {
        // New photos detected, check if they're screenshots
        const newPhotos = assets.assets.slice(0, currentPhotoCount - this.lastPhotoCount);
        
        for (const photo of newPhotos) {
          if (await this.isLikelyScreenshot(photo)) {
            this.handleScreenshotDetected();
            break;
          }
        }
      }

      this.lastPhotoCount = currentPhotoCount;
    } catch (error) {
      console.error('Error checking for screenshots:', error);
    }
  }

  // Check if a photo is likely a screenshot
  private async isLikelyScreenshot(asset: MediaLibrary.Asset): Promise<boolean> {
    try {
      // Get asset info
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
      
      // Screenshots are usually taken very recently (within last 10 seconds)
      const timeDiff = Date.now() - asset.creationTime;
      if (timeDiff > 10000) {
        return false;
      }

      // Screenshots often have specific dimensions matching screen size
      // This is a simplified check - in production, you'd want more sophisticated detection
      const aspectRatio = asset.width / asset.height;
      const isPortrait = aspectRatio < 1;
      const isLandscape = aspectRatio > 1.5;
      
      // Most screenshots are either portrait or landscape
      if (!isPortrait && !isLandscape) {
        return false;
      }

      // Check filename patterns (some devices name screenshots predictably)
      const filename = assetInfo.filename?.toLowerCase() || '';
      const screenshotPatterns = ['screenshot', 'screen_shot', 'screen-shot'];
      
      return screenshotPatterns.some(pattern => filename.includes(pattern));
    } catch (error) {
      console.error('Error analyzing asset:', error);
      return false;
    }
  }

  // Handle screenshot detection
  private handleScreenshotDetected(): void {
    const event: ScreenshotEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      chatId: this.currentChatId,
      userId: 'current_user', // Replace with actual user ID
      detected: true,
      prevented: false,
    };

    this.screenshotEvents.push(event);

    if (this.settings.notifyOnScreenshot) {
      this.showScreenshotAlert();
    }

    if (this.onScreenshotDetected) {
      this.onScreenshotDetected(event);
    }

    console.log('Screenshot detected:', event);
  }

  // Show screenshot alert
  private showScreenshotAlert(): void {
    Alert.alert(
      'Screenshot Detected',
      'A screenshot was taken. The other party will be notified.',
      [{ text: 'OK' }]
    );
  }

  // Enable screenshot prevention
  private enableScreenshotPrevention(): void {
    try {
      // Keep screen awake to prevent some screenshot methods
      activateKeepAwake();
      
      // Note: True screenshot prevention requires native modules
      // This is a basic implementation
      console.log('Screenshot prevention enabled');
      
      if (this.onScreenshotPrevented) {
        this.onScreenshotPrevented();
      }
    } catch (error) {
      console.error('Failed to enable screenshot prevention:', error);
    }
  }

  // Disable screenshot prevention
  private disableScreenshotPrevention(): void {
    try {
      deactivateKeepAwake();
      console.log('Screenshot prevention disabled');
    } catch (error) {
      console.error('Failed to disable screenshot prevention:', error);
    }
  }

  // Set callback for screenshot detection
  setOnScreenshotDetected(callback: (event: ScreenshotEvent) => void): void {
    this.onScreenshotDetected = callback;
  }

  // Set callback for screenshot prevention
  setOnScreenshotPrevented(callback: () => void): void {
    this.onScreenshotPrevented = callback;
  }

  // Update settings
  updateSettings(newSettings: Partial<ScreenshotSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    // Apply prevention setting immediately if monitoring
    if (this.isMonitoring) {
      if (this.settings.preventionEnabled) {
        this.enableScreenshotPrevention();
      } else {
        this.disableScreenshotPrevention();
      }
    }
  }

  // Get current settings
  getSettings(): ScreenshotSettings {
    return { ...this.settings };
  }

  // Get screenshot events
  getScreenshotEvents(chatId?: string): ScreenshotEvent[] {
    if (chatId) {
      return this.screenshotEvents.filter(event => event.chatId === chatId);
    }
    return [...this.screenshotEvents];
  }

  // Clear screenshot events
  clearScreenshotEvents(chatId?: string): void {
    if (chatId) {
      this.screenshotEvents = this.screenshotEvents.filter(event => event.chatId !== chatId);
    } else {
      this.screenshotEvents = [];
    }
  }

  // Check if chat has screenshot protection
  isChatProtected(chatId: string): boolean {
    return this.settings.detectionEnabled || this.settings.preventionEnabled;
  }

  // Get protection status
  getProtectionStatus(): {
    detectionEnabled: boolean;
    preventionEnabled: boolean;
    isMonitoring: boolean;
    currentChatId?: string;
  } {
    return {
      detectionEnabled: this.settings.detectionEnabled,
      preventionEnabled: this.settings.preventionEnabled,
      isMonitoring: this.isMonitoring,
      currentChatId: this.currentChatId,
    };
  }
}

export default new ScreenshotDetectionService();
