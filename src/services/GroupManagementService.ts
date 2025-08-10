import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupRole, GroupPermissions, GroupMember, Chat } from '../types';

class GroupManagementService {
  private groupMembers: Map<string, Map<string, GroupMember>> = new Map(); // chatId -> userId -> member
  private onGroupUpdated?: (chatId: string) => void;

  // Default permissions for each role
  private defaultPermissions: Record<GroupRole, GroupPermissions> = {
    admin: {
      canInviteMembers: true,
      canRemoveMembers: true,
      canEditGroupInfo: true,
      canDeleteMessages: true,
      canPinMessages: true,
      canCreatePolls: true,
      canCreateSubGroups: true,
      canManageRoles: true,
      canMuteMembers: true,
      canBanMembers: true,
    },
    moderator: {
      canInviteMembers: true,
      canRemoveMembers: true,
      canEditGroupInfo: false,
      canDeleteMessages: true,
      canPinMessages: true,
      canCreatePolls: true,
      canCreateSubGroups: true,
      canManageRoles: false,
      canMuteMembers: true,
      canBanMembers: false,
    },
    member: {
      canInviteMembers: false,
      canRemoveMembers: false,
      canEditGroupInfo: false,
      canDeleteMessages: false,
      canPinMessages: false,
      canCreatePolls: true,
      canCreateSubGroups: false,
      canManageRoles: false,
      canMuteMembers: false,
      canBanMembers: false,
    },
  };

  // Initialize service
  async initialize(): Promise<void> {
    await this.loadGroupMembers();
  }

  // Add member to group
  async addMember(
    chatId: string,
    userId: string,
    role: GroupRole = 'member',
    invitedBy?: string
  ): Promise<void> {
    if (!this.groupMembers.has(chatId)) {
      this.groupMembers.set(chatId, new Map());
    }

    const member: GroupMember = {
      userId,
      role,
      joinedAt: new Date(),
      invitedBy,
      permissions: this.defaultPermissions[role],
    };

    this.groupMembers.get(chatId)!.set(userId, member);
    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Remove member from group
  async removeMember(chatId: string, userId: string, removedBy: string): Promise<void> {
    const groupMap = this.groupMembers.get(chatId);
    if (!groupMap) return;

    // Check if remover has permission
    if (!this.hasPermission(chatId, removedBy, 'canRemoveMembers')) {
      throw new Error('Insufficient permissions to remove member');
    }

    groupMap.delete(userId);
    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Change member role
  async changeMemberRole(
    chatId: string,
    userId: string,
    newRole: GroupRole,
    changedBy: string
  ): Promise<void> {
    const member = this.getMember(chatId, userId);
    if (!member) {
      throw new Error('Member not found');
    }

    // Check if changer has permission
    if (!this.hasPermission(chatId, changedBy, 'canManageRoles')) {
      throw new Error('Insufficient permissions to change roles');
    }

    member.role = newRole;
    member.permissions = { ...this.defaultPermissions[newRole], ...member.permissions };

    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Get member info
  getMember(chatId: string, userId: string): GroupMember | null {
    return this.groupMembers.get(chatId)?.get(userId) || null;
  }

  // Get all members of a group
  getGroupMembers(chatId: string): GroupMember[] {
    const groupMap = this.groupMembers.get(chatId);
    return groupMap ? Array.from(groupMap.values()) : [];
  }

  // Get members by role
  getMembersByRole(chatId: string, role: GroupRole): GroupMember[] {
    return this.getGroupMembers(chatId).filter(member => member.role === role);
  }

  // Check if user has specific permission
  hasPermission(chatId: string, userId: string, permission: keyof GroupPermissions): boolean {
    const member = this.getMember(chatId, userId);
    if (!member) return false;

    return member.permissions?.[permission] || this.defaultPermissions[member.role][permission];
  }

  // Get user role in group
  getUserRole(chatId: string, userId: string): GroupRole | null {
    const member = this.getMember(chatId, userId);
    return member?.role || null;
  }

  // Check if user is admin
  isAdmin(chatId: string, userId: string): boolean {
    return this.getUserRole(chatId, userId) === 'admin';
  }

  // Check if user is moderator or admin
  isModerator(chatId: string, userId: string): boolean {
    const role = this.getUserRole(chatId, userId);
    return role === 'admin' || role === 'moderator';
  }

  // Mute member
  async muteMember(
    chatId: string,
    userId: string,
    mutedBy: string,
    duration?: number // minutes
  ): Promise<void> {
    const member = this.getMember(chatId, userId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (!this.hasPermission(chatId, mutedBy, 'canMuteMembers')) {
      throw new Error('Insufficient permissions to mute member');
    }

    member.isMuted = true;
    if (duration) {
      member.mutedUntil = new Date(Date.now() + duration * 60 * 1000);
    }

    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Unmute member
  async unmuteMember(chatId: string, userId: string, unmutedBy: string): Promise<void> {
    const member = this.getMember(chatId, userId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (!this.hasPermission(chatId, unmutedBy, 'canMuteMembers')) {
      throw new Error('Insufficient permissions to unmute member');
    }

    member.isMuted = false;
    member.mutedUntil = undefined;

    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Check if member is muted
  isMemberMuted(chatId: string, userId: string): boolean {
    const member = this.getMember(chatId, userId);
    if (!member || !member.isMuted) return false;

    // Check if mute has expired
    if (member.mutedUntil && member.mutedUntil < new Date()) {
      this.unmuteMember(chatId, userId, 'system');
      return false;
    }

    return true;
  }

  // Get group statistics
  getGroupStats(chatId: string): {
    totalMembers: number;
    adminCount: number;
    moderatorCount: number;
    memberCount: number;
    mutedCount: number;
  } {
    const members = this.getGroupMembers(chatId);
    
    return {
      totalMembers: members.length,
      adminCount: members.filter(m => m.role === 'admin').length,
      moderatorCount: members.filter(m => m.role === 'moderator').length,
      memberCount: members.filter(m => m.role === 'member').length,
      mutedCount: members.filter(m => m.isMuted).length,
    };
  }

  // Set custom permissions for a member
  async setCustomPermissions(
    chatId: string,
    userId: string,
    permissions: Partial<GroupPermissions>,
    setBy: string
  ): Promise<void> {
    const member = this.getMember(chatId, userId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (!this.hasPermission(chatId, setBy, 'canManageRoles')) {
      throw new Error('Insufficient permissions to modify permissions');
    }

    member.permissions = { ...member.permissions, ...permissions };
    await this.saveGroupMembers();
    this.notifyGroupUpdate(chatId);
  }

  // Initialize group with creator as admin
  async initializeGroup(chatId: string, creatorId: string): Promise<void> {
    await this.addMember(chatId, creatorId, 'admin');
  }

  // Set callback for group updates
  setOnGroupUpdated(callback: (chatId: string) => void): void {
    this.onGroupUpdated = callback;
  }

  // Notify about group updates
  private notifyGroupUpdate(chatId: string): void {
    if (this.onGroupUpdated) {
      this.onGroupUpdated(chatId);
    }
  }

  // Save to storage
  private async saveGroupMembers(): Promise<void> {
    try {
      const data = Array.from(this.groupMembers.entries()).map(([chatId, memberMap]) => [
        chatId,
        Array.from(memberMap.entries()).map(([userId, member]) => [
          userId,
          {
            ...member,
            joinedAt: member.joinedAt.toISOString(),
            mutedUntil: member.mutedUntil?.toISOString(),
          },
        ]),
      ]);
      await AsyncStorage.setItem('group_members', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save group members:', error);
    }
  }

  // Load from storage
  private async loadGroupMembers(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('group_members');
      if (data) {
        const parsed = JSON.parse(data);
        this.groupMembers = new Map(
          parsed.map(([chatId, memberArray]: [string, any[]]) => [
            chatId,
            new Map(
              memberArray.map(([userId, member]: [string, any]) => [
                userId,
                {
                  ...member,
                  joinedAt: new Date(member.joinedAt),
                  mutedUntil: member.mutedUntil ? new Date(member.mutedUntil) : undefined,
                },
              ])
            ),
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load group members:', error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    this.groupMembers.clear();
    await AsyncStorage.removeItem('group_members');
  }
}

export default new GroupManagementService();
