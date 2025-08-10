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

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isFrequent: boolean;
}

const SendMoneyScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { wallet, formatCurrency } = useWallet();
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contacts
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Alice Johnson', phone: '+1234567890', isFrequent: true },
    { id: '2', name: 'Bob Smith', phone: '+1234567891', isFrequent: true },
    { id: '3', name: 'Carol Davis', phone: '+1234567892', isFrequent: false },
    { id: '4', name: 'David Wilson', phone: '+1234567893', isFrequent: true },
    { id: '5', name: 'Emma Brown', phone: '+1234567894', isFrequent: false },
    { id: '6', name: 'Frank Miller', phone: '+1234567895', isFrequent: false },
  ]);

  const quickAmounts = [10, 25, 50, 100];

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
    searchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
    },
    frequentContacts: {
      marginBottom: theme.spacing.md,
    },
    frequentTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    frequentList: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.xs,
    },
    frequentContact: {
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
      width: 70,
    },
    frequentAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    frequentAvatarSelected: {
      borderWidth: 3,
      borderColor: theme.colors.accent,
    },
    frequentInitials: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    frequentName: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      textAlign: 'center',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    contactItemSelected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    contactAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    contactInitials: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    contactPhone: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
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
      justifyContent: 'space-between',
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
      backgroundColor: theme.colors.surface,
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
    selectedContactCard: {
      backgroundColor: theme.colors.accent + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedContactInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    selectedContactName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    selectedContactPhone: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    changeContactButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    changeContactText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const frequentContacts = contacts.filter(contact => contact.isFrequent);

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleSendMoney = async () => {
    const sendAmount = parseFloat(amount);
    
    if (!selectedContact) {
      Alert.alert('Select Recipient', 'Please select a contact to send money to.');
      return;
    }

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
        `$${sendAmount.toFixed(2)} has been sent to ${selectedContact.name}${note ? `\n\nNote: ${note}` : ''}`,
        [
          {
            text: 'Send Another',
            onPress: () => {
              setAmount('');
              setNote('');
              setSelectedContact(null);
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
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
    return selectedContact && amount && sendAmount > 0 && wallet && sendAmount <= wallet.balance;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
          </Text>
        </View>

        {/* Selected Contact */}
        {selectedContact ? (
          <View style={styles.selectedContactCard}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactInitials}>{getInitials(selectedContact.name)}</Text>
            </View>
            <View style={styles.selectedContactInfo}>
              <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
              <Text style={styles.selectedContactPhone}>{selectedContact.phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.changeContactButton}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={styles.changeContactText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Contact Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Send To</Text>
              
              {/* Search */}
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={theme.colors.textMuted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Frequent Contacts */}
              {frequentContacts.length > 0 && !searchQuery && (
                <View style={styles.frequentContacts}>
                  <Text style={styles.frequentTitle}>Frequent</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.frequentList}>
                    {frequentContacts.map((contact) => (
                      <TouchableOpacity
                        key={contact.id}
                        style={styles.frequentContact}
                        onPress={() => setSelectedContact(contact)}
                      >
                        <View style={[
                          styles.frequentAvatar,
                          selectedContact?.id === contact.id && styles.frequentAvatarSelected,
                        ]}>
                          <Text style={styles.frequentInitials}>{getInitials(contact.name)}</Text>
                        </View>
                        <Text style={styles.frequentName} numberOfLines={1}>
                          {contact.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* All Contacts */}
              {filteredContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    selectedContact?.id === contact.id && styles.contactItemSelected,
                  ]}
                  onPress={() => setSelectedContact(contact)}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitials}>{getInitials(contact.name)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </View>
                  {selectedContact?.id === contact.id && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Amount Section */}
        {selectedContact && (
          <>
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

            {/* Note Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Note (Optional)</Text>
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

            {/* Send Button */}
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendMoneyScreen;
