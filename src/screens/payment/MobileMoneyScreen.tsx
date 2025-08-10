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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useWallet } from '../../contexts/WalletContext';

interface MobileMoneyProvider {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  countries: string[];
  isActive: boolean;
  fees: {
    topUp: number;
    withdrawal: number;
  };
}

const MobileMoneyScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { wallet, formatCurrency } = useWallet();
  
  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'topup' | 'withdraw'>('topup');
  const [isLoading, setIsLoading] = useState(false);

  // Mock mobile money providers
  const [providers] = useState<MobileMoneyProvider[]>([
    {
      id: 'mpesa',
      name: 'M-Pesa',
      shortName: 'M-PESA',
      logo: '📱',
      color: '#00A651',
      countries: ['Kenya', 'Tanzania', 'Mozambique', 'DRC', 'Lesotho', 'Ghana', 'Egypt'],
      isActive: true,
      fees: { topUp: 0.02, withdrawal: 0.03 },
    },
    {
      id: 'mtn_money',
      name: 'MTN Mobile Money',
      shortName: 'MTN MoMo',
      logo: '💛',
      color: '#FFCC00',
      countries: ['Uganda', 'Rwanda', 'Zambia', 'Ghana', 'Cameroon', 'Benin', 'Congo'],
      isActive: true,
      fees: { topUp: 0.025, withdrawal: 0.035 },
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      shortName: 'Airtel',
      logo: '🔴',
      color: '#E60012',
      countries: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Zambia', 'Malawi', 'Madagascar'],
      isActive: true,
      fees: { topUp: 0.02, withdrawal: 0.03 },
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      shortName: 'Orange',
      logo: '🧡',
      color: '#FF6600',
      countries: ['Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Guinea', 'Ivory Coast'],
      isActive: true,
      fees: { topUp: 0.03, withdrawal: 0.04 },
    },
    {
      id: 'wave',
      name: 'Wave',
      shortName: 'Wave',
      logo: '🌊',
      color: '#00D4FF',
      countries: ['Senegal', 'Ivory Coast', 'Mali', 'Burkina Faso'],
      isActive: true,
      fees: { topUp: 0.01, withdrawal: 0.02 },
    },
    {
      id: 'ecocash',
      name: 'EcoCash',
      shortName: 'EcoCash',
      logo: '💚',
      color: '#00A651',
      countries: ['Zimbabwe', 'Lesotho'],
      isActive: true,
      fees: { topUp: 0.025, withdrawal: 0.035 },
    },
  ]);

  const quickAmounts = [10, 25, 50, 100, 200];

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
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.accent,
    },
    toggleButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    toggleButtonTextActive: {
      color: '#FFFFFF',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    providersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    providerCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    providerCardSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    providerLogo: {
      fontSize: 32,
      marginBottom: theme.spacing.sm,
    },
    providerName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    providerShortName: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    providerCountries: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    selectedProviderCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedProviderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    selectedProviderLogo: {
      fontSize: 24,
      marginRight: theme.spacing.sm,
    },
    selectedProviderName: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
      fontWeight: '600',
    },
    changeProviderButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    changeProviderText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
    },
    feeInfo: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
    },
    feeText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
    },
    phoneInputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    phonePrefix: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    phoneInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
    },
    amountContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
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
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickAmountButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: '18%',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
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
    actionButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    actionButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    actionButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    summaryCard: {
      backgroundColor: theme.colors.info + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.info,
    },
    summaryTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    summaryTotal: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    summaryTotalLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    summaryTotalValue: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
  });

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const calculateFee = () => {
    if (!selectedProvider || !amount) return 0;
    const transactionAmount = parseFloat(amount);
    const feeRate = transactionType === 'topup' ? selectedProvider.fees.topUp : selectedProvider.fees.withdrawal;
    return transactionAmount * feeRate;
  };

  const getTotalAmount = () => {
    const transactionAmount = parseFloat(amount) || 0;
    const fee = calculateFee();
    return transactionType === 'topup' ? transactionAmount : transactionAmount + fee;
  };

  const handleTransaction = async () => {
    const transactionAmount = parseFloat(amount);
    
    if (!selectedProvider) {
      Alert.alert('Select Provider', 'Please select a mobile money provider.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your mobile money phone number.');
      return;
    }

    if (!amount || transactionAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (transactionType === 'withdraw' && wallet && transactionAmount > wallet.balance) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough balance to withdraw this amount.');
      return;
    }

    const fee = calculateFee();
    const total = getTotalAmount();

    Alert.alert(
      'Confirm Transaction',
      `${transactionType === 'topup' ? 'Top up' : 'Withdraw'} $${transactionAmount.toFixed(2)} ${transactionType === 'topup' ? 'to' : 'from'} your PingSpace wallet using ${selectedProvider.name}?\n\nFee: $${fee.toFixed(2)}\nTotal: $${total.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => processTransaction() },
      ]
    );
  };

  const processTransaction = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionAmount = parseFloat(amount);
      const actionText = transactionType === 'topup' ? 'topped up' : 'withdrawn';
      
      Alert.alert(
        'Transaction Successful! ✅',
        `$${transactionAmount.toFixed(2)} has been ${actionText} ${transactionType === 'topup' ? 'to' : 'from'} your wallet using ${selectedProvider?.name}.`,
        [
          {
            text: 'Done',
            onPress: () => {
              setAmount('');
              setPhoneNumber('');
              setSelectedProvider(null);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Transaction Failed', 'Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    const transactionAmount = parseFloat(amount);
    return selectedProvider && phoneNumber.trim() && amount && transactionAmount > 0;
  };

  const formatPhoneNumber = (number: string) => {
    // Remove non-digits
    const cleaned = number.replace(/\D/g, '');
    // Format as needed (this is a simple example)
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Money</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>
            {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
          </Text>
        </View>

        {/* Transaction Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, transactionType === 'topup' && styles.toggleButtonActive]}
            onPress={() => setTransactionType('topup')}
          >
            <Text style={[
              styles.toggleButtonText,
              transactionType === 'topup' && styles.toggleButtonTextActive,
            ]}>
              Top Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, transactionType === 'withdraw' && styles.toggleButtonActive]}
            onPress={() => setTransactionType('withdraw')}
          >
            <Text style={[
              styles.toggleButtonText,
              transactionType === 'withdraw' && styles.toggleButtonTextActive,
            ]}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Provider */}
        {selectedProvider ? (
          <View style={styles.selectedProviderCard}>
            <View style={styles.selectedProviderHeader}>
              <Text style={styles.selectedProviderLogo}>{selectedProvider.logo}</Text>
              <Text style={styles.selectedProviderName}>{selectedProvider.name}</Text>
              <TouchableOpacity
                style={styles.changeProviderButton}
                onPress={() => setSelectedProvider(null)}
              >
                <Text style={styles.changeProviderText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.feeInfo}>
              <Text style={styles.feeText}>
                {transactionType === 'topup' ? 'Top up' : 'Withdrawal'} fee: {((transactionType === 'topup' ? selectedProvider.fees.topUp : selectedProvider.fees.withdrawal) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Provider</Text>
            <View style={styles.providersGrid}>
              {providers.filter(p => p.isActive).map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    selectedProvider?.id === provider.id && styles.providerCardSelected,
                  ]}
                  onPress={() => setSelectedProvider(provider)}
                >
                  <Text style={styles.providerLogo}>{provider.logo}</Text>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerShortName}>{provider.shortName}</Text>
                  <Text style={styles.providerCountries} numberOfLines={2}>
                    {provider.countries.slice(0, 3).join(', ')}
                    {provider.countries.length > 3 && '...'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Phone Number Input */}
        {selectedProvider && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter your mobile money number"
                  placeholderTextColor={theme.colors.textMuted}
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>

            {/* Amount Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountContainer}>
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

            {/* Transaction Summary */}
            {canProceed() && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Transaction Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount</Text>
                  <Text style={styles.summaryValue}>${parseFloat(amount).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee</Text>
                  <Text style={styles.summaryValue}>${calculateFee().toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>
                    {transactionType === 'topup' ? 'You will receive' : 'Total to pay'}
                  </Text>
                  <Text style={styles.summaryTotalValue}>${getTotalAmount().toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                !canProceed() && styles.actionButtonDisabled,
              ]}
              onPress={handleTransaction}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {transactionType === 'topup' ? 'Top Up Wallet' : 'Withdraw to Mobile Money'}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MobileMoneyScreen;
