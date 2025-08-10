import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { GroupMember, GroupRole, Chat } from '../../types';
import GroupManagementService from '../../services/GroupManagementService';

interface GroupManagementProps {
  visible: boolean;
  onClose: () => void;
  chat: Chat;
  currentUserId: string;
}

const GroupManagement: React.FC<GroupManagementProps> = ({
  visible,
  onClose,
  chat,
  currentUserId,
}) => {
  const { theme } = useTheme();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<GroupRole>('member');

  useEffect(() => {
    if (visible) {
      loadMembers();
    }
  }, [visible, chat.id]);

  const loadMembers = () => {
    const groupMembers = GroupManagementService.getGroupMembers(chat.id);
    setMembers(groupMembers);
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      // In a real app, you'd validate the email and get user ID
      const newUserId = `user_${Date.now()}`;
      await GroupManagementService.addMember(chat.id, newUserId, selectedRole, currentUserId);
      
      setNewMemberEmail('');
      setShowAddMember(false);
      loadMembers();
      Alert.alert('Success', 'Member added successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
    }
  };

  const handleRemoveMember = (member: GroupMember) => {
    if (member.userId === currentUserId) {
      Alert.alert('Error', 'You cannot remove yourself from the group');
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.userId} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await GroupManagementService.removeMember(chat.id, member.userId, currentUserId);
              loadMembers();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = (member: GroupMember, newRole: GroupRole) => {
    Alert.alert(
      'Change Role',
      `Change ${member.userId}'s role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async () => {
            try {
              await GroupManagementService.changeMemberRole(chat.id, member.userId, newRole, currentUserId);
              loadMembers();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to change role');
            }
          },
        },
      ]
    );
  };

  const handleMuteMember = (member: GroupMember) => {
    Alert.alert(
      'Mute Member',
      `How long would you like to mute ${member.userId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '10 minutes', onPress: () => muteMember(member, 10) },
        { text: '1 hour', onPress: () => muteMember(member, 60) },
        { text: '24 hours', onPress: () => muteMember(member, 1440) },
        { text: 'Indefinitely', onPress: () => muteMember(member) },
      ]
    );
  };

  const muteMember = async (member: GroupMember, duration?: number) => {
    try {
      await GroupManagementService.muteMember(chat.id, member.userId, currentUserId, duration);
      loadMembers();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mute member');
    }
  };

  const getRoleColor = (role: GroupRole): string => {
    switch (role) {
      case 'admin': return theme.colors.error;
      case 'moderator': return theme.colors.warning;
      case 'member': return theme.colors.textSecondary;
    }
  };

  const getRoleIcon = (role: GroupRole): string => {
    switch (role) {
      case 'admin': return 'shield';
      case 'moderator': return 'star';
      case 'member': return 'person';
    }
  };

  const canManageRole = (targetRole: GroupRole): boolean => {
    const currentUserRole = GroupManagementService.getUserRole(chat.id, currentUserId);
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'moderator' && targetRole === 'member') return true;
    return false;
  };

  const renderMember = ({ item }: { item: GroupMember }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.memberHeader}>
          <Text style={styles.memberName}>{item.userId}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
            <Ionicons name={getRoleIcon(item.role) as any} size={12} color={getRoleColor(item.role)} />
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.memberJoined}>
          Joined {item.joinedAt.toLocaleDateString()}
        </Text>
        {item.isMuted && (
          <Text style={styles.mutedText}>
            🔇 Muted {item.mutedUntil ? `until ${item.mutedUntil.toLocaleString()}` : 'indefinitely'}
          </Text>
        )}
      </View>

      {item.userId !== currentUserId && canManageRole(item.role) && (
        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'Member Actions',
                `Choose an action for ${item.userId}`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Change Role', onPress: () => showRoleSelector(item) },
                  { text: item.isMuted ? 'Unmute' : 'Mute', onPress: () => item.isMuted ? unmuteMember(item) : handleMuteMember(item) },
                  { text: 'Remove', style: 'destructive', onPress: () => handleRemoveMember(item) },
                ]
              );
            }}
          >
            <Ionicons name="ellipsis-vertical" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const showRoleSelector = (member: GroupMember) => {
    const roles: GroupRole[] = ['member', 'moderator', 'admin'];
    const currentUserRole = GroupManagementService.getUserRole(chat.id, currentUserId);
    
    const availableRoles = roles.filter(role => {
      if (currentUserRole === 'admin') return true;
      if (currentUserRole === 'moderator') return role !== 'admin';
      return false;
    });

    Alert.alert(
      'Change Role',
      `Select new role for ${member.userId}`,
      [
        { text: 'Cancel', style: 'cancel' },
        ...availableRoles.map(role => ({
          text: role.charAt(0).toUpperCase() + role.slice(1),
          onPress: () => handleChangeRole(member, role),
        })),
      ]
    );
  };

  const unmuteMember = async (member: GroupMember) => {
    try {
      await GroupManagementService.unmuteMember(chat.id, member.userId, currentUserId);
      loadMembers();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to unmute member');
    }
  };

  const stats = GroupManagementService.getGroupStats(chat.id);

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
    addButton: {
      padding: theme.spacing.sm,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    membersList: {
      flex: 1,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '50',
    },
    memberInfo: {
      flex: 1,
    },
    memberHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    memberName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    roleText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: 4,
    },
    memberJoined: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    mutedText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.warning,
      marginTop: 2,
    },
    memberActions: {
      marginLeft: theme.spacing.md,
    },
    actionButton: {
      padding: theme.spacing.sm,
    },
    addMemberModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addMemberContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      margin: theme.spacing.xl,
      minWidth: 300,
    },
    addMemberTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    roleSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.lg,
    },
    roleOption: {
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 60,
    },
    selectedRole: {
      backgroundColor: theme.colors.accent + '20',
      borderColor: theme.colors.accent,
    },
    roleOptionText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginTop: 4,
    },
    addMemberButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    addButtonStyle: {
      backgroundColor: theme.colors.accent,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    addButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Group Members</Text>
          {GroupManagementService.hasPermission(chat.id, currentUserId, 'canInviteMembers') && (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddMember(true)}>
              <Ionicons name="person-add" size={24} color={theme.colors.accent} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.adminCount}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.moderatorCount}</Text>
            <Text style={styles.statLabel}>Moderators</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.mutedCount}</Text>
            <Text style={styles.statLabel}>Muted</Text>
          </View>
        </View>

        <FlatList
          style={styles.membersList}
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.userId}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Member Modal */}
        <Modal
          visible={showAddMember}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddMember(false)}
        >
          <TouchableOpacity
            style={styles.addMemberModal}
            activeOpacity={1}
            onPress={() => setShowAddMember(false)}
          >
            <TouchableOpacity style={styles.addMemberContainer} activeOpacity={1}>
              <Text style={styles.addMemberTitle}>Add Member</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.textMuted}
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.roleSelector}>
                {(['member', 'moderator', 'admin'] as GroupRole[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      selectedRole === role && styles.selectedRole,
                    ]}
                    onPress={() => setSelectedRole(role)}
                  >
                    <Ionicons
                      name={getRoleIcon(role) as any}
                      size={20}
                      color={selectedRole === role ? theme.colors.accent : theme.colors.textSecondary}
                    />
                    <Text style={styles.roleOptionText}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.addMemberButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowAddMember(false)}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.addButtonStyle]}
                  onPress={handleAddMember}
                >
                  <Text style={[styles.buttonText, styles.addButtonText]}>Add Member</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
};

export default GroupManagement;
