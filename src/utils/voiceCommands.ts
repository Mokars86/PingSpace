// Voice Commands Utility for PingSpace
// This would integrate with speech recognition APIs in a real implementation

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
}

export const VOICE_COMMANDS: Record<string, any> = {
  // Navigation commands
  'go to chat': { action: 'navigate', screen: 'Chat' },
  'go to spaces': { action: 'navigate', screen: 'Spaces' },
  'go to inbox': { action: 'navigate', screen: 'SmartInbox' },
  'go to discover': { action: 'navigate', screen: 'Discover' },
  'go to profile': { action: 'navigate', screen: 'Profile' },

  // Messaging commands
  'send message to': { action: 'compose_message', requiresParameter: 'contact' },
  'call': { action: 'start_call', requiresParameter: 'contact' },
  'video call': { action: 'start_video_call', requiresParameter: 'contact' },

  // Smart Inbox commands
  'show important messages': { action: 'filter_inbox', category: 'important' },
  'show unread messages': { action: 'filter_inbox', category: 'unread' },
  'show todo items': { action: 'filter_inbox', category: 'todo' },

  // Theme commands
  'change theme to energetic': { action: 'change_theme', theme: 'energetic' },
  'change theme to calm': { action: 'change_theme', theme: 'calm' },
  'change theme to focused': { action: 'change_theme', theme: 'focused' },
  'change theme to creative': { action: 'change_theme', theme: 'creative' },
  'change theme to social': { action: 'change_theme', theme: 'social' },
  'change theme to default': { action: 'change_theme', theme: 'default' },

  // AI commands
  'summarize conversation': { action: 'ai_summarize' },
  'translate message': { action: 'ai_translate' },
  'rephrase message': { action: 'ai_rephrase' },
};

export class VoiceCommandProcessor {
  private static instance: VoiceCommandProcessor;
  
  static getInstance(): VoiceCommandProcessor {
    if (!VoiceCommandProcessor.instance) {
      VoiceCommandProcessor.instance = new VoiceCommandProcessor();
    }
    return VoiceCommandProcessor.instance;
  }

  processCommand(spokenText: string): VoiceCommand | null {
    const normalizedText = spokenText.toLowerCase().trim();

    // Direct command match
    if (VOICE_COMMANDS[normalizedText]) {
      return {
        command: normalizedText,
        action: VOICE_COMMANDS[normalizedText].action,
        parameters: VOICE_COMMANDS[normalizedText],
      };
    }

    // Pattern matching for parameterized commands
    for (const [pattern, config] of Object.entries(VOICE_COMMANDS)) {
      if (config && typeof config === 'object' && 'requiresParameter' in config) {
        const regex = new RegExp(`^${pattern}\\s+(.+)$`, 'i');
        const match = normalizedText.match(regex);

        if (match) {
          return {
            command: pattern,
            action: config.action,
            parameters: {
              ...config,
              [config.requiresParameter]: match[1],
            },
          };
        }
      }
    }

    return null;
  }

  getAvailableCommands(): string[] {
    return Object.keys(VOICE_COMMANDS);
  }
}

// Mock speech recognition for demo purposes
export class MockSpeechRecognition {
  private isListening = false;
  private onResult?: (text: string) => void;
  private onError?: (error: string) => void;

  start(onResult: (text: string) => void, onError?: (error: string) => void) {
    this.onResult = onResult;
    this.onError = onError;
    this.isListening = true;
    
    // Simulate speech recognition with a delay
    setTimeout(() => {
      if (this.isListening) {
        // Mock some common commands for demo
        const mockCommands = [
          'go to chat',
          'show important messages',
          'change theme to energetic',
          'send message to Alice',
        ];
        
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        this.onResult?.(randomCommand);
      }
    }, 2000);
  }

  stop() {
    this.isListening = false;
  }

  isActive(): boolean {
    return this.isListening;
  }
}

export const speechRecognition = new MockSpeechRecognition();
