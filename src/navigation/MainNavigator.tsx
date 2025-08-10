import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import StatusUploadScreen from '../screens/status/StatusUploadScreen';
import StatusViewerScreen from '../screens/status/StatusViewerScreen';
import SmartInboxScreen from '../screens/SmartInboxScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import SpacesScreen from '../screens/SpacesScreen';
import SellerDashboardScreen from '../screens/marketplace/SellerDashboardScreen';
import AddProductScreen from '../screens/marketplace/AddProductScreen';
import ProductManagementScreen from '../screens/marketplace/ProductManagementScreen';
import WalletTopUpScreen from '../screens/payment/WalletTopUpScreen';
import NewChatOptionsScreen from '../screens/NewChatOptionsScreen';
import ContactListScreen from '../screens/ContactListScreen';
import SupportAppScreen from '../screens/SupportAppScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import NewBroadcastScreen from '../screens/NewBroadcastScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import WithdrawalHistoryScreen from '../screens/wallet/WithdrawalHistoryScreen';
import BankAccountsScreen, { AddBankAccountScreen } from '../screens/wallet/BankAccountsScreen';
import CreateSpaceScreen from '../screens/CreateSpaceScreen';
import SendMoneyScreen from '../screens/payment/SendMoneyScreen';
import RequestMoneyScreen from '../screens/payment/RequestMoneyScreen';
import MobileMoneyScreen from '../screens/payment/MobileMoneyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen';
import PointsRewardsScreen from '../screens/PointsRewardsScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: { chatId: string };
  Profile: { userId: string };
  SpaceDetail: { spaceId: string };
  Settings: undefined;
  StatusUpload: undefined;
  StatusViewer: { userId: string; initialIndex?: number };
  SmartInbox: undefined;
  Discover: undefined;
  Spaces: undefined;
  SellerDashboard: undefined;
  AddProduct: undefined;
  ProductManagement: undefined;
  WalletTopUp: undefined;
  Withdraw: undefined;
  WithdrawalHistory: undefined;
  BankAccounts: undefined;
  AddBankAccount: undefined;
  CreateSpace: undefined;
  SendMoney: undefined;
  RequestMoney: undefined;
  MobileMoney: undefined;
  PrivacySecurity: undefined;
  DeleteAccount: undefined;
  NewChatOptions: undefined;
  ContactList: { mode?: 'select' | 'view'; title?: string; maxSelection?: number };
  SupportApp: undefined;
  CreateGroup: undefined;
  NewBroadcast: undefined;
  EditProfile: undefined;
  PointsRewards: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="StatusUpload"
            component={StatusUploadScreen}
            options={{
              presentation: 'modal',
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="StatusViewer"
            component={StatusViewerScreen}
            options={{
              presentation: 'modal',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="SmartInbox"
            component={SmartInboxScreen}
            options={{
              headerShown: true,
              title: 'Smart Inbox',
            }}
          />
          <Stack.Screen
            name="Discover"
            component={DiscoverScreen}
            options={{
              headerShown: true,
              title: 'Discover',
            }}
          />
          <Stack.Screen
            name="Spaces"
            component={SpacesScreen}
            options={{
              headerShown: true,
              title: 'Spaces',
            }}
          />
          <Stack.Screen
            name="SellerDashboard"
            component={SellerDashboardScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProductManagement"
            component={ProductManagementScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="WalletTopUp"
            component={WalletTopUpScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NewChatOptions"
            component={NewChatOptionsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ContactList"
            component={ContactListScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SupportApp"
            component={SupportAppScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CreateGroup"
            component={CreateGroupScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NewBroadcast"
            component={NewBroadcastScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Withdraw"
            component={WithdrawScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="WithdrawalHistory"
            component={WithdrawalHistoryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BankAccounts"
            component={BankAccountsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddBankAccount"
            component={AddBankAccountScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CreateSpace"
            component={CreateSpaceScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SendMoney"
            component={SendMoneyScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RequestMoney"
            component={RequestMoneyScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MobileMoney"
            component={MobileMoneyScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PrivacySecurity"
            component={PrivacySecurityScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DeleteAccount"
            component={DeleteAccountScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PointsRewards"
            component={PointsRewardsScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
