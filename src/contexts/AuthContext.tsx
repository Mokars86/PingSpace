import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  updateUserStatus: (status: 'online' | 'offline' | 'away') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Ensure splash screen shows for at least 2 seconds
      const startTime = Date.now();

      // For demo purposes, always start with login screen
      // Comment out the lines below to enable persistent login
      console.log('Starting fresh - showing login screen');
      setUser(null);

      // Uncomment these lines to enable persistent login:
      // const savedUser = await AsyncStorage.getItem('user');
      // if (savedUser) {
      //   const parsedUser = JSON.parse(savedUser);
      //   setUser(parsedUser);
      //   console.log('User loaded from storage:', parsedUser.name);
      // } else {
      //   console.log('No saved user found');
      //   setUser(null);
      // }

      // Ensure minimum splash screen time
      const elapsedTime = Date.now() - startTime;
      const minDisplayTime = 2000; // 2 seconds
      if (elapsedTime < minDisplayTime) {
        await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Mock login - replace with actual authentication logic
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: email,
        phone: '+1234567890',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Welcome to PingSpace!',
        location: 'New York, USA',
        website: '',
        isOnline: true,
        lastSeen: new Date(),
        status: 'Available',
        joinedDate: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
          privacy: {
            showPhone: false,
            showEmail: false,
            showLastSeen: true,
            allowMessages: 'everyone',
          },
        },
      };

      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);

      // Mock registration - replace with actual registration logic
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar,
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        isOnline: true,
        lastSeen: new Date(),
        status: 'Available',
        joinedDate: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
          privacy: {
            showPhone: false,
            showEmail: false,
            showLastSeen: true,
            allowMessages: 'everyone',
          },
        },
      };

      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: User) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear user state first
      setUser(null);

      // Clear all user-related data from AsyncStorage
      await AsyncStorage.multiRemove([
        'user',
        'user_wallet',
        'wallet_transactions',
        'payment_requests',
        'payment_methods',
        'payment_settings',
        'cart_items',
        'user_status',
        'status_settings',
        'user_donations',
        'user_referrals',
        'user_referral_code',
        'donation_settings',
      ]);

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (status: User['status']) => {
    if (user) {
      const updatedUser = { ...user, status };
      setUser(updatedUser);
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updateUserStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
