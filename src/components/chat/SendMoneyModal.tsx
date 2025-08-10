import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useWallet } from '../../contexts/WalletContext';

interface SendMoneyModalProps {
  visible: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: string;
  onSendSuccess: (amount: number, note: string) => void;
}

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  visible,
  onClose,
  recipientName,
  recipientId,
  onSendSuccess,
}) => {
  const { theme } = useTheme();
  const { wallet, formatCurrency } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [10, 25, 50, 100];

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      margin: theme.spacing.md,
      width: '90%',
      maxWidth: 400,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    recipientInfo: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    recipientAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    recipientInitials: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    recipientName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    balanceInfo: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    balanceAmount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    amountSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
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
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
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
    noteInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 80,
      textAlignVertical: 'top',
      marginBottom: theme.spacing.lg,
    },
    sendButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    sendButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
  });

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleSendMoney = async () => {
    const sendAmount = parseFloat(amount);
    
    if (!amount || sendAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to send.');
      return;
    }

    if (!wallet || sendAmount > wallet.balance) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough balance to send this amount.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Money Sent! 💰',
        `$${sendAmount.toFixed(2)} has been sent to ${recipientName}${note ? `\n\nNote: ${note}` : ''}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSendSuccess(sendAmount, note);
              onClose();
              setAmount('');
              setNote('');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send money. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = () => {
    const sendAmount = parseFloat(amount);
    return amount && sendAmount > 0 && wallet && sendAmount <= wallet.balance;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleClose = () => {
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={handleClose}
        >
          <TouchableOpacity 
            style={styles.modalContainer} 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Send Money</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.recipientInfo}>
              <View style={styles.recipientAvatar}>
                <Text style={styles.recipientInitials}>{getInitials(recipientName)}</Text>
              </View>
              <Text style={styles.recipientName}>To: {recipientName}</Text>
            </View>

            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Your Balance</Text>
              <Text style={styles.balanceAmount}>
                {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
              </Text>
            </View>

            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Amount</Text>
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

            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Note (Optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="What's this for?"
                placeholderTextColor={theme.colors.textMuted}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={100}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !canSend() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMoney}
              disabled={!canSend() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>
                  Send {amount ? `$${parseFloat(amount).toFixed(2)}` : 'Money'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SendMoneyModal;
