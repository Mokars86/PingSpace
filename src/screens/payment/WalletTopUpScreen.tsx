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
import { useWallet } from '../../contexts/WalletContext';

const WalletTopUpScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { 
    wallet, 
    topUpOptions, 
    mobileMoneyProviders, 
    paymentMethods, 
    topUpWallet, 
    isLoading, 
    formatCurrency 
  } = useWallet();
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'quick' | 'card' | 'bank' | 'mobile' | 'crypto'>('quick');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards] = useState([
    { id: '1', type: 'visa', last4: '4242', expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: '2', type: 'mastercard', last4: '5555', expiryMonth: 8, expiryYear: 2026, isDefault: false },
  ]);
  const [bankAccounts] = useState([
    { id: '1', bankName: 'Chase Bank', accountType: 'Checking', last4: '1234', isDefault: true },
    { id: '2', bankName: 'Bank of America', accountType: 'Savings', last4: '5678', isDefault: false },
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
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    section: {
      padding: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    amountGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    amountOption: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      width: '48%',
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedAmount: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    popularBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    popularText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      fontWeight: 'bold',
    },
    amountText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    bonusText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.success,
      marginTop: 2,
    },
    customAmountContainer: {
      marginTop: theme.spacing.md,
    },
    customAmountInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    customAmountInputFocused: {
      borderColor: theme.colors.accent,
    },
    paymentMethodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedPaymentMethod: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    paymentMethodIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    paymentMethodDetails: {
      flex: 1,
    },
    paymentMethodName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    paymentMethodSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    mobileMoneyProvider: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    providerLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    providerDetails: {
      flex: 1,
    },
    providerName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    providerCountry: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    summaryTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    totalValue: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      fontWeight: 'bold',
    },
    topUpButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    disabledButton: {
      backgroundColor: theme.colors.textMuted,
    },
    topUpButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      marginLeft: theme.spacing.sm,
      fontWeight: 'bold',
    },
    categoryTabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    categoryTab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    categoryTabActive: {
      backgroundColor: theme.colors.accent,
    },
    categoryTabText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    categoryTabTextActive: {
      color: '#FFFFFF',
    },
    paymentMethodFee: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    defaultBadge: {
      backgroundColor: theme.colors.success + '20',
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.sm,
    },
    defaultBadgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.success,
    },
    addPaymentMethodButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    addPaymentMethodText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginLeft: theme.spacing.sm,
    },
  });

  const getTopUpAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount) || 0;
    return 0;
  };

  const getSelectedOption = () => {
    return topUpOptions.find(option => option.amount === selectedAmount);
  };

  const getTotalAmount = (): number => {
    const amount = getTopUpAmount();
    const option = getSelectedOption();
    return amount + (option?.bonus || 0);
  };

  const canTopUp = (): boolean => {
    return getTopUpAmount() > 0 && selectedPaymentMethod !== null;
  };

  const handleTopUp = async () => {
    if (!canTopUp()) return;

    setIsProcessing(true);
    try {
      await topUpWallet(getTotalAmount(), selectedPaymentMethod!);
      Alert.alert(
        'Top-Up Successful!',
        `Your wallet has been topped up with ${formatCurrency(getTotalAmount())}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Top-Up Failed', 'Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up Wallet</Text>
      </View>

      <ScrollView>
        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Amount</Text>
          <View style={styles.amountGrid}>
            {topUpOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.amountOption,
                  selectedAmount === option.amount && styles.selectedAmount,
                ]}
                onPress={() => handleAmountSelect(option.amount)}
              >
                {option.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                <Text style={styles.amountText}>
                  {formatCurrency(option.amount, option.currency)}
                </Text>
                {option.bonus && (
                  <Text style={styles.bonusText}>{option.description}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <TextInput
              style={[
                styles.customAmountInput,
                customAmount.length > 0 && styles.customAmountInputFocused,
              ]}
              placeholder="Enter custom amount"
              placeholderTextColor={theme.colors.textMuted}
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Method Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* Category Tabs */}
          <View style={styles.categoryTabs}>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'quick' && styles.categoryTabActive]}
              onPress={() => setSelectedCategory('quick')}
            >
              <Text style={[styles.categoryTabText, selectedCategory === 'quick' && styles.categoryTabTextActive]}>
                Quick
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'card' && styles.categoryTabActive]}
              onPress={() => setSelectedCategory('card')}
            >
              <Text style={[styles.categoryTabText, selectedCategory === 'card' && styles.categoryTabTextActive]}>
                Cards
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'bank' && styles.categoryTabActive]}
              onPress={() => setSelectedCategory('bank')}
            >
              <Text style={[styles.categoryTabText, selectedCategory === 'bank' && styles.categoryTabTextActive]}>
                Bank
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'mobile' && styles.categoryTabActive]}
              onPress={() => setSelectedCategory('mobile')}
            >
              <Text style={[styles.categoryTabText, selectedCategory === 'mobile' && styles.categoryTabTextActive]}>
                Mobile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'crypto' && styles.categoryTabActive]}
              onPress={() => setSelectedCategory('crypto')}
            >
              <Text style={[styles.categoryTabText, selectedCategory === 'crypto' && styles.categoryTabTextActive]}>
                Crypto
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Payment Methods */}
          {selectedCategory === 'quick' && (
            <View>
              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'apple_pay' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('apple_pay')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#000000' }]}>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>Apple Pay</Text>
                  <Text style={styles.paymentMethodSubtitle}>Touch ID or Face ID</Text>
                </View>
                <Text style={styles.paymentMethodFee}>Free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'google_pay' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('google_pay')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#4285F4' }]}>
                  <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>Google Pay</Text>
                  <Text style={styles.paymentMethodSubtitle}>Fingerprint or PIN</Text>
                </View>
                <Text style={styles.paymentMethodFee}>Free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'paypal' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('paypal')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#0070BA' }]}>
                  <Ionicons name="logo-paypal" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>PayPal</Text>
                  <Text style={styles.paymentMethodSubtitle}>john@example.com</Text>
                </View>
                <Text style={styles.paymentMethodFee}>2.9%</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Saved Cards */}
          {selectedCategory === 'card' && (
            <View>
              {savedCards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.paymentMethodItem, selectedPaymentMethod === card.id && styles.selectedPaymentMethod]}
                  onPress={() => setSelectedPaymentMethod(card.id)}
                >
                  <View style={[styles.paymentMethodIcon, { backgroundColor: card.type === 'visa' ? '#1A1F71' : '#EB001B' }]}>
                    <Ionicons name="card" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.paymentMethodDetails}>
                    <Text style={styles.paymentMethodName}>
                      {card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
                    </Text>
                    <Text style={styles.paymentMethodSubtitle}>
                      Expires {card.expiryMonth}/{card.expiryYear}
                    </Text>
                  </View>
                  {card.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  <Text style={styles.paymentMethodFee}>2.9%</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addPaymentMethodButton}>
                <Ionicons name="add" size={20} color={theme.colors.accent} />
                <Text style={styles.addPaymentMethodText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bank Accounts */}
          {selectedCategory === 'bank' && (
            <View>
              {bankAccounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.paymentMethodItem, selectedPaymentMethod === account.id && styles.selectedPaymentMethod]}
                  onPress={() => setSelectedPaymentMethod(account.id)}
                >
                  <View style={[styles.paymentMethodIcon, { backgroundColor: theme.colors.info }]}>
                    <Ionicons name="business" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.paymentMethodDetails}>
                    <Text style={styles.paymentMethodName}>{account.bankName}</Text>
                    <Text style={styles.paymentMethodSubtitle}>
                      {account.accountType} •••• {account.last4}
                    </Text>
                  </View>
                  {account.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                  <Text style={styles.paymentMethodFee}>Free</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addPaymentMethodButton}>
                <Ionicons name="add" size={20} color={theme.colors.accent} />
                <Text style={styles.addPaymentMethodText}>Link Bank Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Mobile Money */}
          {selectedCategory === 'mobile' && (
            <View>
              {mobileMoneyProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.paymentMethodItem,
                    selectedPaymentMethod === provider.id && styles.selectedPaymentMethod,
                  ]}
                  onPress={() => setSelectedPaymentMethod(provider.id)}
                >
                  <View style={styles.paymentMethodIcon}>
                    <Ionicons name="phone-portrait" size={20} color={theme.colors.accent} />
                  </View>
                  <View style={styles.paymentMethodDetails}>
                    <Text style={styles.paymentMethodName}>{provider.name}</Text>
                    <Text style={styles.paymentMethodSubtitle}>
                      {provider.country} • {provider.currency}
                    </Text>
                  </View>
                  <Text style={styles.paymentMethodFee}>1.5%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Cryptocurrency */}
          {selectedCategory === 'crypto' && (
            <View>
              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'bitcoin' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('bitcoin')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#F7931A' }]}>
                  <Ionicons name="logo-bitcoin" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>Bitcoin</Text>
                  <Text style={styles.paymentMethodSubtitle}>BTC Network</Text>
                </View>
                <Text style={styles.paymentMethodFee}>1.0%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'ethereum' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('ethereum')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#627EEA' }]}>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Ξ</Text>
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>Ethereum</Text>
                  <Text style={styles.paymentMethodSubtitle}>ETH Network</Text>
                </View>
                <Text style={styles.paymentMethodFee}>1.2%</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodItem, selectedPaymentMethod === 'usdc' && styles.selectedPaymentMethod]}
                onPress={() => setSelectedPaymentMethod('usdc')}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: '#2775CA' }]}>
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>USDC</Text>
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>USD Coin</Text>
                  <Text style={styles.paymentMethodSubtitle}>Stablecoin</Text>
                </View>
                <Text style={styles.paymentMethodFee}>0.5%</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Summary */}
        {getTopUpAmount() > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Top-Up Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(getTopUpAmount())}
              </Text>
            </View>
            {getSelectedOption()?.bonus && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Bonus</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  +{formatCurrency(getSelectedOption()!.bonus!)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.summaryLabel}>Total Credit</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(getTotalAmount())}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Top-Up Button */}
      <TouchableOpacity
        style={[
          styles.topUpButton,
          !canTopUp() && styles.disabledButton,
        ]}
        onPress={handleTopUp}
        disabled={!canTopUp() || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
        )}
        <Text style={styles.topUpButtonText}>
          {isProcessing ? 'Processing...' : `Top Up ${formatCurrency(getTotalAmount())}`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WalletTopUpScreen;
