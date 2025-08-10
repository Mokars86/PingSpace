import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ContactListScreenProps {
  mode?: 'select' | 'view';
  onContactsSelected?: (contacts: Contact[]) => void;
  maxSelection?: number;
  title?: string;
}

const ContactListScreen: React.FC<ContactListScreenProps> = ({
  mode = 'view',
  onContactsSelected,
  maxSelection,
  title = 'Contacts',
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Mock contacts data
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      phone: '+1 (555) 123-4567',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      phone: '+1 (555) 234-5678',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '3',
      name: 'Carol Davis',
      phone: '+1 (555) 345-6789',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: true,
    },
    {
      id: '4',
      name: 'David Wilson',
      phone: '+1 (555) 456-7890',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: false,
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '5',
      name: 'Emma Brown',
      phone: '+1 (555) 567-8901',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: true,
    },
    {
      id: '6',
      name: 'Frank Miller',
      phone: '+1 (555) 678-9012',
      avatar: 'https://via.placeholder.com/50x50',
      isOnline: false,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
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
      flex: 1,
      fontWeight: 'bold',
    },
    doneButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    doneButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
    },
    searchInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
    },
    selectedCount: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
    },
    selectedCountText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      textAlign: 'center',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedContactItem: {
      backgroundColor: `${theme.colors.accent}10`,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: theme.spacing.md,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.inputBackground,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    contactPhone: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    lastSeen: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    contactActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.sm,
    },
    checkedCheckbox: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleContactPress = (contact: Contact) => {
    if (mode === 'select') {
      handleContactSelect(contact.id);
    } else {
      // Navigate to chat with this contact
      Alert.alert('Start Chat', `Start a conversation with ${contact.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Chat', onPress: () => console.log('Start chat with', contact.name) },
      ]);
    }
  };

  const handleContactSelect = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      if (maxSelection && selectedContacts.length >= maxSelection) {
        Alert.alert('Selection Limit', `You can only select up to ${maxSelection} contacts.`);
        return;
      }
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleDone = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('No Selection', 'Please select at least one contact.');
      return;
    }

    const selected = mockContacts.filter(contact => 
      selectedContacts.includes(contact.id)
    );

    if (onContactsSelected) {
      onContactsSelected(selected);
    }
    
    navigation.goBack();
  };

  const formatLastSeen = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContactItem]}
        onPress={() => handleContactPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={theme.colors.textMuted} />
            </View>
          )}
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
          {!item.isOnline && item.lastSeen && (
            <Text style={styles.lastSeen}>
              Last seen {formatLastSeen(item.lastSeen)}
            </Text>
          )}
        </View>

        <View style={styles.contactActions}>
          {mode === 'select' && (
            <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        {mode === 'select' && selectedContacts.length > 0 && (
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {mode === 'select' && selectedContacts.length > 0 && (
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      {filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons 
            name="people-outline" 
            size={80} 
            color={theme.colors.textMuted} 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Contacts Found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? `No contacts match "${searchQuery}"`
              : 'Your contact list is empty.\nAdd some contacts to start chatting!'
            }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ContactListScreen;
