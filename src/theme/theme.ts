import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Light theme colors (Day Mode)
const lightColors = {
  // Primary Colors
  primary: '#000000',        // Black
  accent: '#ff1744',         // Vibrant Red

  // Background Colors
  background: '#FFFFFF',     // White background
  surface: '#F8F9FA',        // Light gray surface
  surfaceVariant: '#E9ECEF', // Lighter surface

  // Text Colors
  text: '#000000',           // Black text for maximum contrast
  textSecondary: '#333333',  // Dark gray text
  textMuted: '#666666',      // Medium gray text

  // Message Bubble Colors
  messageSent: '#ff1744',    // User's messages (red)
  messageReceived: '#E9ECEF', // Received messages (light gray)

  // Status Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Online Status
  online: '#28A745',
  offline: '#999999',
  away: '#FFC107',

  // Borders and Dividers
  border: '#CCCCCC',
  divider: '#E0E0E0',

  // Overlay and Modal
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#FFFFFF',

  // Input and Interactive Elements
  inputBackground: '#F8F9FA',
  inputBorder: '#CCCCCC',
  buttonPrimary: '#ff1744',
  buttonSecondary: '#333333',

  // Mood Theme Colors (for dynamic theming)
  mood: {
    energetic: '#FF6B6B',
    calm: '#4ECDC4',
    focused: '#6C5CE7',
    creative: '#FD79A8',
    social: '#00B894',
  },
};

// Dark theme colors (Night Mode)
const darkColors = {
  // Primary Colors
  primary: '#000000',        // Black
  accent: '#ff1744',         // Vibrant Red

  // Background Colors (Dark Mode)
  background: '#0F1419',     // Dark background
  surface: '#1E2A38',        // Dark surface
  surfaceVariant: '#2A3441', // Lighter dark surface

  // Text Colors (Dark Mode)
  text: '#FFFFFF',           // White text
  textSecondary: '#B0BEC5',  // Light gray text
  textMuted: '#78909C',      // Muted light text

  // Message Bubble Colors
  messageSent: '#ff1744',    // User's messages (red)
  messageReceived: '#2A3441', // Received messages (dark gray)

  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Online Status
  online: '#4CAF50',
  offline: '#78909C',
  away: '#FF9800',

  // Borders and Dividers (Dark Mode)
  border: '#37474F',
  divider: '#263238',

  // Overlay and Modal (Dark Mode)
  overlay: 'rgba(0, 0, 0, 0.7)',
  modalBackground: '#1E2A38',

  // Input and Interactive Elements (Dark Mode)
  inputBackground: '#263238',
  inputBorder: '#37474F',
  buttonPrimary: '#ff1744',
  buttonSecondary: '#37474F',

  // Mood Theme Colors (for dynamic theming)
  mood: {
    energetic: '#FF6B6B',
    calm: '#4ECDC4',
    focused: '#6C5CE7',
    creative: '#FD79A8',
    social: '#00B894',
  },
};

export const theme = {
  colors: lightColors, // Default to light mode (day mode)

  typography: {
    // Font families
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  
  dimensions: {
    window: {
      width,
      height,
    },
    // Chat list width (for tablet/desktop)
    chatListWidth: 320,
    // Bottom tab bar height
    tabBarHeight: 70,
  },
  
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in',
    },
  },
};
