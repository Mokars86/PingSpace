import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { RootStackParamList } from '../navigation/MainNavigator';

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const PaymentScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { 
    wallet, 
    transactions, 
    paymentRequests, 
    isLoading, 
    formatCurrency, 
    refreshData 
  } = useWallet();
  
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    walletCard: {
      backgroundColor: theme.colors.accent,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    walletBalance: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    walletLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: theme.spacing.xs,
    },
    walletActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    walletButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    walletButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.xs,
    },
    quickActions: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
      width: '48%',
      marginBottom: theme.spacing.sm,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    actionIcon: {
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
    },
    actionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    actionSubtitle: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: 2,
    },
    recentSection: {
      paddingHorizontal: theme.spacing.md,
      flex: 1,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    transactionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      fontWeight: 'bold',
    },
    creditAmount: {
      color: theme.colors.success,
    },
    debitAmount: {
      color: theme.colors.error,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.md,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    requestBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      marginLeft: theme.spacing.sm,
    },
    requestBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      fontWeight: 'bold',
    },
    settingsSection: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingsIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    settingsInfo: {
      flex: 1,
    },
    settingsTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    settingsSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleTopUp = () => {
    Alert.alert(
      'Top Up Wallet',
      'Choose your top-up method',
      [
        { text: 'Credit/Debit Card', onPress: () => console.log('Card top-up') },
        { text: 'Mobile Money', onPress: () => console.log('Mobile money top-up') },
        { text: 'Bank Transfer', onPress: () => console.log('Bank transfer') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSendMoney = () => {
    navigation.navigate('SendMoney');
  };

  const handleRequestMoney = () => {
    navigation.navigate('RequestMoney');
  };

  const handleMobileMoney = () => {
    navigation.navigate('MobileMoney');
  };

  const formatTransactionDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getTransactionIcon = (transaction: any) => {
    switch (transaction.category) {
      case 'top_up':
        return { name: 'add-circle', color: theme.colors.success };
      case 'payment':
        return { name: 'arrow-up-circle', color: theme.colors.error };
      case 'request':
        return { name: 'arrow-down-circle', color: theme.colors.info };
      default:
        return { name: 'swap-horizontal', color: theme.colors.textMuted };
    }
  };

  const recentTransactions = transactions.slice(0, 5);
  const pendingRequests = paymentRequests.filter(req => req.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Payment</Text>
          {pendingRequests > 0 && (
            <View style={styles.requestBadge}>
              <Text style={styles.requestBadgeText}>{pendingRequests}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletBalance}>
            {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
          </Text>
          
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletButton} onPress={handleTopUp}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.walletButtonText}>Top Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletButton} onPress={handleSendMoney}>
              <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
              <Text style={styles.walletButtonText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletButton} onPress={() => navigation.navigate('Withdraw')}>
              <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
              <Text style={styles.walletButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSendMoney}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="paper-plane"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.actionTitle}>Send Money</Text>
              <Text style={styles.actionSubtitle}>To contacts or phone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRequestMoney}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="hand-left"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.actionTitle}>Request Money</Text>
              <Text style={styles.actionSubtitle}>From anyone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleMobileMoney}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="phone-portrait"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.actionTitle}>Mobile Money</Text>
              <Text style={styles.actionSubtitle}>M-Pesa, MTN, Airtel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SendMoney')}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="paper-plane"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.actionTitle}>Send Money</Text>
              <Text style={styles.actionSubtitle}>To contacts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => {
              const icon = getTransactionIcon(transaction);
              return (
                <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, { backgroundColor: `${icon.color}20` }]}>
                    <Ionicons name={icon.name as any} size={20} color={icon.color} />
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{transaction.description}</Text>
                    <Text style={styles.transactionSubtitle}>
                      {formatTransactionDate(transaction.createdAt)} • {transaction.status}
                    </Text>
                  </View>
                  
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="receipt-outline" 
                size={48} 
                color={theme.colors.textMuted} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateText}>
                No transactions yet.{'\n'}Start by topping up your wallet!
              </Text>
            </View>
          )}
        </View>

        {/* Wallet Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Wallet Settings</Text>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('BankAccounts')}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="card" size={20} color={theme.colors.accent} />
            </View>
            <View style={styles.settingsInfo}>
              <Text style={styles.settingsTitle}>Bank Accounts</Text>
              <Text style={styles.settingsSubtitle}>Manage linked bank accounts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('WithdrawalHistory')}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="receipt" size={20} color={theme.colors.accent} />
            </View>
            <View style={styles.settingsInfo}>
              <Text style={styles.settingsTitle}>Withdrawal History</Text>
              <Text style={styles.settingsSubtitle}>View all withdrawals</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;
