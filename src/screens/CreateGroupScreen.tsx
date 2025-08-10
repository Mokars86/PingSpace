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
  FlatList,
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
}

const CreateGroupScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contacts data
  const contacts: Contact[] = [
    { id: '1', name: 'Alice Johnson', phone: '+1234567890', isOnline: true },
    { id: '2', name: 'Bob Smith', phone: '+1234567891', isOnline: false },
    { id: '3', name: 'Carol Davis', phone: '+1234567892', isOnline: true },
    { id: '4', name: 'David Wilson', phone: '+1234567893', isOnline: false },
    { id: '5', name: 'Emma Brown', phone: '+1234567894', isOnline: true },
    { id: '6', name: 'Frank Miller', phone: '+1234567895', isOnline: false },
    { id: '7', name: 'Grace Lee', phone: '+1234567896', isOnline: true },
    { id: '8', name: 'Henry Taylor', phone: '+1234567897', isOnline: false },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

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
    createButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginLeft: 'auto',
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      fontWeight: '600',
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
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
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
      marginBottom: theme.spacing.sm,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    selectedCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    contactAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    contactAvatarText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      fontWeight: '600',
    },
    contactPhone: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    onlineIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.success,
      position: 'absolute',
      bottom: 2,
      right: 2,
      borderWidth: 2,
      borderColor: theme.colors.surface,
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
    checkboxSelected: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    contactsContainer: {
      flex: 1,
    },
  });

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact');
      return;
    }

    // Create group logic here
    Alert.alert(
      'Group Created!',
      `Group "${groupName}" created with ${selectedContacts.length} members`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderContactItem = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.includes(item.id);
    const initials = item.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleContactSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.contactAvatar}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
          ) : (
            <Text style={styles.contactAvatarText}>{initials}</Text>
          )}
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
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
        <Text style={styles.headerTitle}>Create Group</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}
          disabled={!groupName.trim() || selectedContacts.length === 0}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Group name"
            placeholderTextColor={theme.colors.textMuted}
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
          />
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Group description (optional)"
            placeholderTextColor={theme.colors.textMuted}
            value={groupDescription}
            onChangeText={setGroupDescription}
            multiline
            maxLength={200}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Members</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts"
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Text style={styles.selectedCount}>
            {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
          </Text>
          
          <View style={styles.contactsContainer}>
            <FlatList
              data={filteredContacts}
              renderItem={renderContactItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGroupScreen;
