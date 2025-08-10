import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  lastFour: string;
  isDefault: boolean;
  isVerified: boolean;
}

const BankAccountsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountType: 'checking',
      lastFour: '4567',
      isDefault: true,
      isVerified: true,
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountType: 'savings',
      lastFour: '8901',
      isDefault: false,
      isVerified: false,
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
      padding: theme.spacing.md,
    },
    addButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    addButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      marginLeft: theme.spacing.sm,
      fontWeight: '600',
    },
    accountCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    bankIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    accountInfo: {
      flex: 1,
    },
    bankName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    accountDetails: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    verifiedBadge: {
      backgroundColor: theme.colors.success + '20',
    },
    unverifiedBadge: {
      backgroundColor: theme.colors.warning + '20',
    },
    defaultBadge: {
      backgroundColor: theme.colors.accent + '20',
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      textTransform: 'uppercase',
    },
    verifiedText: {
      color: theme.colors.success,
    },
    unverifiedText: {
      color: theme.colors.warning,
    },
    defaultText: {
      color: theme.colors.accent,
    },
    actionButtons: {
      flexDirection: 'row',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    primaryActionButton: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    actionButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    primaryActionButtonText: {
      color: '#FFFFFF',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
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
      paddingHorizontal: theme.spacing.lg,
    },
  });

  const handleSetDefault = (accountId: string) => {
    setBankAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isDefault: account.id === accountId,
      }))
    );
    Alert.alert('Success', 'Default account updated successfully.');
  };

  const handleVerifyAccount = (accountId: string) => {
    Alert.alert(
      'Verify Account',
      'We\'ll send two small deposits to your account within 1-2 business days. You\'ll need to verify the amounts to complete verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Deposits',
          onPress: () => {
            setBankAccounts(accounts =>
              accounts.map(account =>
                account.id === accountId
                  ? { ...account, isVerified: true }
                  : account
              )
            );
            Alert.alert('Verification Started', 'Verification deposits will be sent within 1-2 business days.');
          },
        },
      ]
    );
  };

  const handleRemoveAccount = (accountId: string) => {
    const account = bankAccounts.find(acc => acc.id === accountId);
    
    Alert.alert(
      'Remove Bank Account',
      `Are you sure you want to remove ${account?.bankName} ending in ${account?.lastFour}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setBankAccounts(accounts => accounts.filter(acc => acc.id !== accountId));
            Alert.alert('Success', 'Bank account removed successfully.');
          },
        },
      ]
    );
  };

  const renderBankAccount = (account: BankAccount) => (
    <View key={account.id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.bankIcon}>
          <Ionicons name="card" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>{account.bankName}</Text>
          <Text style={styles.accountDetails}>
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} •••• {account.lastFour}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          account.isVerified ? styles.verifiedBadge : styles.unverifiedBadge,
        ]}>
          <Text style={[
            styles.statusText,
            account.isVerified ? styles.verifiedText : styles.unverifiedText,
          ]}>
            {account.isVerified ? 'Verified' : 'Unverified'}
          </Text>
        </View>
        
        {account.isDefault && (
          <View style={[styles.statusBadge, styles.defaultBadge]}>
            <Text style={[styles.statusText, styles.defaultText]}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {!account.isVerified && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={() => handleVerifyAccount(account.id)}
          >
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
              Verify
            </Text>
          </TouchableOpacity>
        )}
        
        {!account.isDefault && account.isVerified && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(account.id)}
          >
            <Ionicons name="star" size={16} color={theme.colors.text} />
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveAccount(account.id)}
        >
          <Ionicons name="trash" size={16} color={theme.colors.error} />
          <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Accounts</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBankAccount')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Bank Account</Text>
        </TouchableOpacity>

        {bankAccounts.length > 0 ? (
          bankAccounts.map(renderBankAccount)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="card-outline"
              size={64}
              color={theme.colors.textMuted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Bank Accounts</Text>
            <Text style={styles.emptyDescription}>
              Add a bank account to enable withdrawals and receive payments directly to your bank.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BankAccountsScreen;

// Add Bank Account Screen Component
export const AddBankAccountScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    bankName: '',
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
  });

  const [isLoading, setIsLoading] = useState(false);

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
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    accountTypeContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
    },
    accountTypeButton: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    accountTypeButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    accountTypeText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    accountTypeTextActive: {
      color: '#FFFFFF',
    },
    addButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    addButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    addButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    securityNote: {
      backgroundColor: theme.colors.info + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    securityNoteText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  const validateForm = () => {
    return (
      formData.bankName.trim() &&
      formData.accountHolderName.trim() &&
      formData.routingNumber.trim().length === 9 &&
      formData.accountNumber.trim() &&
      formData.confirmAccountNumber.trim() &&
      formData.accountNumber === formData.confirmAccountNumber
    );
  };

  const handleAddAccount = async () => {
    if (!validateForm()) {
      Alert.alert('Invalid Information', 'Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Bank Account Added! 🏦',
        'Your bank account has been added successfully. We\'ll send verification deposits within 1-2 business days.',
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add bank account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Bank Account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chase Bank"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.bankName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bankName: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name on account"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.accountHolderName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, accountHolderName: text }))}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Routing Number</Text>
            <TextInput
              style={styles.input}
              placeholder="9-digit routing number"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.routingNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, routingNumber: text.replace(/\D/g, '') }))}
              keyboardType="number-pad"
              maxLength={9}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Account number"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.accountNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, accountNumber: text.replace(/\D/g, '') }))}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter account number"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.confirmAccountNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmAccountNumber: text.replace(/\D/g, '') }))}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Type</Text>
            <View style={styles.accountTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  formData.accountType === 'checking' && styles.accountTypeButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, accountType: 'checking' }))}
              >
                <Text style={[
                  styles.accountTypeText,
                  formData.accountType === 'checking' && styles.accountTypeTextActive,
                ]}>
                  Checking
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  formData.accountType === 'savings' && styles.accountTypeButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, accountType: 'savings' }))}
              >
                <Text style={[
                  styles.accountTypeText,
                  formData.accountType === 'savings' && styles.accountTypeTextActive,
                ]}>
                  Savings
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            !validateForm() && styles.addButtonDisabled,
          ]}
          onPress={handleAddAccount}
          disabled={!validateForm() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>Add Bank Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            🔒 Your banking information is encrypted and secure. We use bank-level security to protect your data and never store your full account details.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
