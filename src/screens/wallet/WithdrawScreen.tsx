import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const WithdrawScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock wallet balance
  const walletBalance = 1250.75;
  
  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Account',
      description: 'Transfer to your linked bank account',
      icon: 'card',
      processingTime: '1-3 business days',
      fee: 0,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Transfer to your PayPal account',
      icon: 'logo-paypal',
      processingTime: 'Instant',
      fee: 0.25,
    },
    {
      id: 'venmo',
      name: 'Venmo',
      description: 'Transfer to your Venmo account',
      icon: 'phone-portrait',
      processingTime: 'Instant',
      fee: 0.25,
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      description: 'Transfer to your Cash App account',
      icon: 'wallet',
      processingTime: 'Instant',
      fee: 0.25,
    },
  ];

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
      padding: theme.spacing.md,
    },
    balanceCard: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing.xs,
    },
    balanceAmount: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    amountContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    amountLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    currencySymbol: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginRight: theme.spacing.xs,
      fontWeight: 'bold',
    },
    amountInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
      fontWeight: 'bold',
    },
    quickAmounts: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    quickAmountButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
    },
    quickAmountButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    quickAmountText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    quickAmountTextActive: {
      color: '#FFFFFF',
    },
    methodCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    methodCardSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    methodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    methodIcon: {
      marginRight: theme.spacing.md,
    },
    methodInfo: {
      flex: 1,
    },
    methodName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    methodDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    methodDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
    },
    methodDetail: {
      flex: 1,
    },
    methodDetailLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
    },
    methodDetailValue: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
    },
    withdrawButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    withdrawButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    withdrawButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    noteContainer: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    noteText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  const quickAmounts = [50, 100, 250, 500];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > walletBalance) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough balance for this withdrawal.');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Select Method', 'Please select a withdrawal method.');
      return;
    }

    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    const fee = method?.fee || 0;
    const totalAmount = withdrawAmount + fee;

    if (totalAmount > walletBalance) {
      Alert.alert('Insufficient Funds', `You need $${totalAmount.toFixed(2)} including fees, but only have $${walletBalance.toFixed(2)}.`);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Withdrawal Initiated! 💰',
        `$${withdrawAmount.toFixed(2)} withdrawal to ${method?.name} has been initiated.\n\nProcessing time: ${method?.processingTime}\nFee: $${fee.toFixed(2)}`,
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('WithdrawalHistory'),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    return amount && withdrawAmount > 0 && withdrawAmount <= walletBalance && selectedMethod;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${walletBalance.toFixed(2)}</Text>
        </View>

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter amount to withdraw</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textMuted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            
            <View style={styles.quickAmounts}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    amount === quickAmount.toString() && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => handleQuickAmount(quickAmount)}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === quickAmount.toString() && styles.quickAmountTextActive,
                    ]}
                  >
                    ${quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Withdrawal Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdrawal Method</Text>
          {withdrawalMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodHeader}>
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={selectedMethod === method.id ? theme.colors.accent : theme.colors.text}
                  style={styles.methodIcon}
                />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                {selectedMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.accent} />
                )}
              </View>
              
              <View style={styles.methodDetails}>
                <View style={styles.methodDetail}>
                  <Text style={styles.methodDetailLabel}>Processing Time</Text>
                  <Text style={styles.methodDetailValue}>{method.processingTime}</Text>
                </View>
                <View style={styles.methodDetail}>
                  <Text style={styles.methodDetailLabel}>Fee</Text>
                  <Text style={styles.methodDetailValue}>
                    {method.fee === 0 ? 'Free' : `$${method.fee.toFixed(2)}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            !canWithdraw() && styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          disabled={!canWithdraw() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.withdrawButtonText}>
              Withdraw {amount ? `$${parseFloat(amount).toFixed(2)}` : 'Funds'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            • Bank transfers are free but take 1-3 business days{'\n'}
            • Mobile wallet transfers are instant but include a small fee{'\n'}
            • All withdrawals are subject to verification for security
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawScreen;
