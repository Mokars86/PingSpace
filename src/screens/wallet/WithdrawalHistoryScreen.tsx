import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface WithdrawalTransaction {
  id: string;
  amount: number;
  fee: number;
  method: string;
  methodIcon: string;
  destination: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  estimatedArrival?: Date;
  transactionId?: string;
}

const WithdrawalHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  
  const [transactions] = useState<WithdrawalTransaction[]>([
    {
      id: '1',
      amount: 250.00,
      fee: 0,
      method: 'Chase Bank',
      methodIcon: 'card',
      destination: 'Checking •••• 4567',
      status: 'completed',
      date: new Date('2024-01-15'),
      transactionId: 'WD-2024-001',
    },
    {
      id: '2',
      amount: 100.00,
      fee: 0.25,
      method: 'PayPal',
      methodIcon: 'logo-paypal',
      destination: 'john@example.com',
      status: 'processing',
      date: new Date('2024-01-14'),
      estimatedArrival: new Date('2024-01-14'),
      transactionId: 'WD-2024-002',
    },
    {
      id: '3',
      amount: 75.00,
      fee: 0.25,
      method: 'Venmo',
      methodIcon: 'phone-portrait',
      destination: '@johndoe',
      status: 'pending',
      date: new Date('2024-01-13'),
      estimatedArrival: new Date('2024-01-13'),
      transactionId: 'WD-2024-003',
    },
    {
      id: '4',
      amount: 500.00,
      fee: 0,
      method: 'Bank of America',
      methodIcon: 'card',
      destination: 'Savings •••• 8901',
      status: 'failed',
      date: new Date('2024-01-12'),
      transactionId: 'WD-2024-004',
    },
  ]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    transactionCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    transactionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    methodIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    transactionInfo: {
      flex: 1,
    },
    methodName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    destination: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    fee: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
    transactionDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    pendingBadge: {
      backgroundColor: theme.colors.warning + '20',
    },
    processingBadge: {
      backgroundColor: theme.colors.info + '20',
    },
    completedBadge: {
      backgroundColor: theme.colors.success + '20',
    },
    failedBadge: {
      backgroundColor: theme.colors.error + '20',
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      textTransform: 'uppercase',
    },
    pendingText: {
      color: theme.colors.warning,
    },
    processingText: {
      color: theme.colors.info,
    },
    completedText: {
      color: theme.colors.success,
    },
    failedText: {
      color: theme.colors.error,
    },
    dateText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    estimatedArrival: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    emptyDescription: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    withdrawButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.md,
    },
    withdrawButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pendingBadge;
      case 'processing':
        return styles.processingBadge;
      case 'completed':
        return styles.completedBadge;
      case 'failed':
        return styles.failedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pendingText;
      case 'processing':
        return styles.processingText;
      case 'completed':
        return styles.completedText;
      case 'failed':
        return styles.failedText;
      default:
        return styles.pendingText;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderTransaction = (transaction: WithdrawalTransaction) => (
    <View key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.methodIcon}>
          <Ionicons name={transaction.methodIcon as any} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.methodName}>{transaction.method}</Text>
          <Text style={styles.destination}>{transaction.destination}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>-${transaction.amount.toFixed(2)}</Text>
          {transaction.fee > 0 && (
            <Text style={styles.fee}>Fee: ${transaction.fee.toFixed(2)}</Text>
          )}
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, getStatusBadgeStyle(transaction.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(transaction.status)]}>
              {transaction.status}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
          {transaction.estimatedArrival && transaction.status !== 'completed' && (
            <Text style={styles.estimatedArrival}>
              Est. arrival: {formatDate(transaction.estimatedArrival)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal History</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {transactions.length > 0 ? (
          <>
            {transactions.map(renderTransaction)}
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdraw')}
            >
              <Text style={styles.withdrawButtonText}>New Withdrawal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="receipt-outline"
              size={64}
              color={theme.colors.textMuted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Withdrawals Yet</Text>
            <Text style={styles.emptyDescription}>
              Your withdrawal history will appear here once you make your first withdrawal.
            </Text>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdraw')}
            >
              <Text style={styles.withdrawButtonText}>Make First Withdrawal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawalHistoryScreen;
