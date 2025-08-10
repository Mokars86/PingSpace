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
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface SpaceMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  isActive: boolean;
}

const SpaceSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [spaceSettings, setSpaceSettings] = useState({
    name: 'Project Alpha',
    description: 'Main development project workspace',
    isPrivate: false,
    allowMemberInvites: true,
    requireApproval: false,
    allowFileSharing: true,
    allowPayments: true,
  });

  const [members] = useState<SpaceMember[]>([
    { id: '1', name: 'Alice Johnson', role: 'admin', joinedAt: new Date(), isActive: true },
    { id: '2', name: 'Bob Smith', role: 'moderator', joinedAt: new Date(), isActive: true },
    { id: '3', name: 'Carol Davis', role: 'member', joinedAt: new Date(), isActive: false },
    { id: '4', name: 'David Wilson', role: 'member', joinedAt: new Date(), isActive: true },
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
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
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
    textArea: {
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
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    settingDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    memberInitials: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    memberRole: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    memberStatus: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    activeStatus: {
      backgroundColor: theme.colors.success,
    },
    inactiveStatus: {
      backgroundColor: theme.colors.textMuted,
    },
    actionButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    actionButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    dangerButtonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    addMemberButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    addMemberText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'Space settings have been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteSpace = () => {
    Alert.alert(
      'Delete Space',
      'Are you sure you want to delete this space? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Space Deleted', 'The space has been deleted.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddMember = () => {
    Alert.alert(
      'Add Member',
      'Choose how to add a new member',
      [
        { text: 'Invite by Email', onPress: () => console.log('Invite by email') },
        { text: 'Share Invite Link', onPress: () => console.log('Share link') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return theme.colors.error;
      case 'moderator':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Space Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Space Name</Text>
            <TextInput
              style={styles.input}
              value={spaceSettings.name}
              onChangeText={(text) => setSpaceSettings(prev => ({ ...prev, name: text }))}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={spaceSettings.description}
              onChangeText={(text) => setSpaceSettings(prev => ({ ...prev, description: text }))}
              multiline
              maxLength={200}
            />
          </View>
        </View>

        {/* Privacy & Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Permissions</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Private Space</Text>
              <Text style={styles.settingDescription}>
                Only invited members can join
              </Text>
            </View>
            <Switch
              value={spaceSettings.isPrivate}
              onValueChange={(value) => setSpaceSettings(prev => ({ ...prev, isPrivate: value }))}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Member Invites</Text>
              <Text style={styles.settingDescription}>
                Allow members to invite others
              </Text>
            </View>
            <Switch
              value={spaceSettings.allowMemberInvites}
              onValueChange={(value) => setSpaceSettings(prev => ({ ...prev, allowMemberInvites: value }))}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>File Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow file uploads and sharing
              </Text>
            </View>
            <Switch
              value={spaceSettings.allowFileSharing}
              onValueChange={(value) => setSpaceSettings(prev => ({ ...prev, allowFileSharing: value }))}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Space Payments</Text>
              <Text style={styles.settingDescription}>
                Enable money transfers within space
              </Text>
            </View>
            <Switch
              value={spaceSettings.allowPayments}
              onValueChange={(value) => setSpaceSettings(prev => ({ ...prev, allowPayments: value }))}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members ({members.length})</Text>
          
          {members.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitials}>{getInitials(member.name)}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: getRoleColor(member.role) }]}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Text>
              </View>
              <View style={[
                styles.memberStatus,
                member.isActive ? styles.activeStatus : styles.inactiveStatus,
              ]} />
            </View>
          ))}

          <TouchableOpacity style={styles.addMemberButton} onPress={handleAddMember}>
            <Ionicons name="person-add" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.addMemberText}>Add Member</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveSettings}>
          <Text style={styles.actionButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteSpace}>
          <Text style={styles.dangerButtonText}>Delete Space</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SpaceSettingsScreen;
