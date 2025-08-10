import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import * as Contacts from 'expo-contacts';

interface Contact {
  id: string;
  name: string;
  phoneNumbers: string[];
  emails: string[];
  isOnPingSpace: boolean;
  avatar?: string;
}

interface ContactSyncProps {
  visible: boolean;
  onClose: () => void;
  onContactsSync: (contacts: Contact[]) => void;
}

const ContactSync: React.FC<ContactSyncProps> = ({
  visible,
  onClose,
  onContactsSync,
}) => {
  const { theme } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible) {
      checkPermissions();
    }
  }, [visible]);

  const checkPermissions = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        loadContacts();
      }
    } catch (error) {
      console.error('Error checking contacts permission:', error);
      Alert.alert('Error', 'Failed to check contacts permission');
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
      });

      // Transform contacts and simulate checking if they're on PingSpace
      const transformedContacts: Contact[] = data
        .filter(contact => contact.name && (contact.phoneNumbers?.length || contact.emails?.length))
        .map(contact => ({
          id: contact.id || Math.random().toString(),
          name: contact.name || 'Unknown',
          phoneNumbers: contact.phoneNumbers?.map(phone => phone.number || '') || [],
          emails: contact.emails?.map(email => email.email || '') || [],
          isOnPingSpace: Math.random() > 0.7, // Simulate 30% of contacts being on PingSpace
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        loadContacts();
      } else {
        Alert.alert(
          'Permission Required',
          'PingSpace needs access to your contacts to help you find friends who are already using the app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {/* Open settings */} },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  const handleSyncSelected = () => {
    const selectedContactsList = contacts.filter(contact => 
      selectedContacts.has(contact.id)
    );
    onContactsSync(selectedContactsList);
    onClose();
  };

  const handleSyncAll = () => {
    const pingSpaceContacts = contacts.filter(contact => contact.isOnPingSpace);
    onContactsSync(pingSpaceContacts);
    onClose();
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContacts.has(item.id) && styles.selectedContact,
      ]}
      onPress={() => toggleContactSelection(item.id)}
    >
      <View style={styles.contactInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>
            {item.phoneNumbers[0] || item.emails[0] || 'No contact info'}
          </Text>
          {item.isOnPingSpace && (
            <View style={styles.pingSpaceBadge}>
              <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
              <Text style={styles.pingSpaceText}>On PingSpace</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.checkbox}>
        {selectedContacts.has(item.id) ? (
          <Ionicons name="checkbox" size={24} color={theme.colors.accent} />
        ) : (
          <Ionicons name="square-outline" size={24} color={theme.colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
    },
    permissionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    permissionIcon: {
      marginBottom: theme.spacing.lg,
    },
    permissionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    permissionText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    permissionButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    permissionButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    contactsList: {
      flex: 1,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selectedContact: {
      backgroundColor: theme.colors.accent + '10',
    },
    contactInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
    },
    contactDetails: {
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
      marginBottom: 2,
    },
    pingSpaceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pingSpaceText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.success,
      marginLeft: 4,
    },
    checkbox: {
      marginLeft: theme.spacing.md,
    },
    footer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    footerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    primaryButton: {
      backgroundColor: theme.colors.accent,
    },
    secondaryButton: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
    selectionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    selectionText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Sync Contacts</Text>
        </View>

        <View style={styles.content}>
          {!hasPermission ? (
            <View style={styles.permissionContainer}>
              <Ionicons 
                name="people" 
                size={64} 
                color={theme.colors.textMuted} 
                style={styles.permissionIcon}
              />
              <Text style={styles.permissionTitle}>Find Your Friends</Text>
              <Text style={styles.permissionText}>
                Allow PingSpace to access your contacts to find friends who are already using the app. 
                We'll only use this to help you connect with people you know.
              </Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Allow Access</Text>
              </TouchableOpacity>
            </View>
          ) : isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={32} color={theme.colors.textMuted} />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : (
            <>
              <FlatList
                style={styles.contactsList}
                data={contacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
              
              {contacts.length > 0 && (
                <View style={styles.footer}>
                  <View style={styles.selectionInfo}>
                    <Text style={styles.selectionText}>
                      {selectedContacts.size} of {contacts.length} contacts selected
                    </Text>
                  </View>
                  <View style={styles.footerButtons}>
                    <TouchableOpacity 
                      style={[styles.footerButton, styles.secondaryButton]} 
                      onPress={handleSyncAll}
                    >
                      <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        Sync All on PingSpace
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.footerButton, styles.primaryButton]} 
                      onPress={handleSyncSelected}
                      disabled={selectedContacts.size === 0}
                    >
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>
                        Sync Selected
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ContactSync;
