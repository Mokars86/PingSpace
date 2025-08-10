import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigation/MainNavigator';

type NewChatOptionsNavigationProp = StackNavigationProp<RootStackParamList>;

const NewChatOptionsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NewChatOptionsNavigationProp>();

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
    optionsContainer: {
      padding: theme.spacing.md,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    newGroupIcon: {
      backgroundColor: `${theme.colors.accent}20`,
    },
    broadcastIcon: {
      backgroundColor: `${theme.colors.info}20`,
    },
    contactsIcon: {
      backgroundColor: `${theme.colors.success}20`,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    chevron: {
      marginLeft: theme.spacing.sm,
    },
  });

  const handleNewGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleNewBroadcast = () => {
    navigation.navigate('NewBroadcast');
  };

  const handleSelectContacts = () => {
    navigation.navigate('ContactList', {
      mode: 'view',
      title: 'Select Contact'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleNewGroup}
          activeOpacity={0.7}
        >
          <View style={[styles.optionIcon, styles.newGroupIcon]}>
            <Ionicons name="people" size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>New Group</Text>
            <Text style={styles.optionDescription}>
              Create a group chat with multiple contacts. Share messages, photos, and files with everyone at once.
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.chevron}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleNewBroadcast}
          activeOpacity={0.7}
        >
          <View style={[styles.optionIcon, styles.broadcastIcon]}>
            <Ionicons name="megaphone" size={24} color={theme.colors.info} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>New Broadcast</Text>
            <Text style={styles.optionDescription}>
              Send a message to multiple contacts at once. Recipients won't see each other's responses.
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.chevron}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleSelectContacts}
          activeOpacity={0.7}
        >
          <View style={[styles.optionIcon, styles.contactsIcon]}>
            <Ionicons name="person-add" size={24} color={theme.colors.success} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Select Contacts</Text>
            <Text style={styles.optionDescription}>
              Browse your contact list and start a one-on-one conversation with anyone.
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.chevron}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NewChatOptionsScreen;
