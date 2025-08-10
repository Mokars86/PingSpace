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

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isFrequent: boolean;
}

const RequestMoneyScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
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

  const quickAmounts = [20, 50, 100, 200];
  const dueDateOptions = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In 3 days', days: 3 },
    { label: 'In a week', days: 7 },
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
    infoCard: {
      backgroundColor: theme.colors.info + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.info,
    },
    infoText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 20,
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
    reasonInput: {
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
    dueDateOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    dueDateButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: '48%',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    dueDateButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    dueDateText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    dueDateTextActive: {
      color: '#FFFFFF',
    },
    requestButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    requestButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    requestButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    previewCard: {
      backgroundColor: theme.colors.warning + '20',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.warning,
    },
    previewTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    previewText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleDueDateSelect = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDueDate(date);
  };

  const getSelectedDueDateOption = () => {
    if (!dueDate) return null;
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return dueDateOptions.find(option => option.days === diffDays);
  };

  const handleRequestMoney = async () => {
    const requestAmount = parseFloat(amount);
    
    if (!selectedContact) {
      Alert.alert('Select Contact', 'Please select a contact to request money from.');
      return;
    }

    if (!amount || requestAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to request.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Add Reason', 'Please add a reason for this money request.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Request Sent! 📤',
        `Your request for $${requestAmount.toFixed(2)} has been sent to ${selectedContact.name}. They will receive a notification and can respond directly.`,
        [
          {
            text: 'Send Another',
            onPress: () => {
              setAmount('');
              setReason('');
              setSelectedContact(null);
              setDueDate(null);
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canRequest = () => {
    const requestAmount = parseFloat(amount);
    return selectedContact && amount && requestAmount > 0 && reason.trim();
  };

  const formatDueDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Money</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Request money from friends, family, or colleagues. They'll receive a notification and can pay you directly through PingSpace.
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Request From</Text>
            
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

            {/* Contacts List */}
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

            {/* Reason Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's this for? *</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="e.g., Dinner split, Concert tickets, Rent..."
                placeholderTextColor={theme.colors.textMuted}
                value={reason}
                onChangeText={setReason}
                multiline
                maxLength={100}
              />
            </View>

            {/* Due Date Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due Date (Optional)</Text>
              <View style={styles.dueDateOptions}>
                {dueDateOptions.map((option) => {
                  const selectedOption = getSelectedDueDateOption();
                  const isSelected = selectedOption?.days === option.days;
                  return (
                    <TouchableOpacity
                      key={option.days}
                      style={[
                        styles.dueDateButton,
                        isSelected && styles.dueDateButtonActive,
                      ]}
                      onPress={() => handleDueDateSelect(option.days)}
                    >
                      <Text
                        style={[
                          styles.dueDateText,
                          isSelected && styles.dueDateTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Preview */}
            {canRequest() && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Request Preview</Text>
                <Text style={styles.previewText}>
                  "{selectedContact.name}, can you send me ${parseFloat(amount).toFixed(2)} for {reason}?{dueDate ? ` Due by ${formatDueDate(dueDate)}.` : ''}"
                </Text>
              </View>
            )}

            {/* Request Button */}
            <TouchableOpacity
              style={[
                styles.requestButton,
                !canRequest() && styles.requestButtonDisabled,
              ]}
              onPress={handleRequestMoney}
              disabled={!canRequest() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.requestButtonText}>
                  Request {amount ? `$${parseFloat(amount).toFixed(2)}` : 'Money'}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestMoneyScreen;
