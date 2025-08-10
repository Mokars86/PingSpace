import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

import ChatScreen from '../screens/ChatScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StatusScreen from '../screens/StatusScreen';
import PaymentScreen from '../screens/PaymentScreen';

export type TabParamList = {
  Chat: undefined;
  Status: undefined;
  Marketplace: undefined;
  Payment: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName: string;

          switch (route.name) {
            case 'Chat':
              iconName = 'chatbubbles';
              break;
            case 'Status':
              iconName = 'radio-button-on';
              break;
            case 'Marketplace':
              iconName = 'storefront';
              break;
            case 'Payment':
              iconName = 'wallet';
              break;
            case 'Profile':
              iconName = 'person-circle';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
            }}>
              <View style={{
                backgroundColor: focused ? theme.colors.accent : 'transparent',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}>
                <Ionicons
                  name={iconName as any}
                  size={22}
                  color={focused ? '#FFFFFF' : '#666666'}
                />
              </View>
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 25,
          paddingTop: 8,
          height: 90,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: theme.typography.fontFamily.semiBold,
          fontWeight: '600',
          marginTop: 2,
          textAlign: 'center',
        },
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarBadge: 3, // Unread messages count
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarLabel: 'Status',
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'Shop',
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarLabel: 'Payment',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
