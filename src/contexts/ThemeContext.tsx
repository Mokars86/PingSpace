import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme as defaultTheme } from '../theme/theme';

export type MoodTheme = 'energetic' | 'calm' | 'focused' | 'creative' | 'social' | 'default';

export interface ThemeContextType {
  theme: typeof defaultTheme;
  currentMood: MoodTheme;
  setMoodTheme: (mood: MoodTheme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodTheme>('default');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode (day mode) as per design

  // Load saved theme preferences
  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedMood = await AsyncStorage.getItem('moodTheme');
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      
      if (savedMood) {
        setCurrentMood(savedMood as MoodTheme);
      }
      
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  const setMoodTheme = async (mood: MoodTheme) => {
    try {
      setCurrentMood(mood);
      await AsyncStorage.setItem('moodTheme', mood);
    } catch (error) {
      console.error('Error saving mood theme:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  };

  // Create dynamic theme based on mood and dark mode
  const getThemeWithMood = () => {
    const baseTheme = { ...defaultTheme };
    
    if (currentMood !== 'default') {
      // Apply mood-based accent color
      baseTheme.colors.accent = baseTheme.colors.mood[currentMood];
      baseTheme.colors.messageSent = baseTheme.colors.mood[currentMood];
    }
    
    // Apply dark/light mode adjustments if needed
    if (!isDarkMode) {
      // Light mode adjustments (keeping dark as default per design)
      baseTheme.colors.background = '#FFFFFF';
      baseTheme.colors.surface = '#F5F5F5';
      baseTheme.colors.text = '#1E2A38';
      baseTheme.colors.textSecondary = '#546E7A';
    }
    
    return baseTheme;
  };

  const contextValue: ThemeContextType = {
    theme: getThemeWithMood(),
    currentMood,
    setMoodTheme,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
