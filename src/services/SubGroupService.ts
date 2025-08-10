import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubGroup } from '../types';

class SubGroupService {
  private subGroups: Map<string, SubGroup> = new Map(); // subGroupId -> SubGroup
  private parentGroups: Map<string, string[]> = new Map(); // parentGroupId -> subGroupIds
  private onSubGroupCreated?: (subGroup: SubGroup) => void;
  private onSubGroupUpdated?: (subGroup: SubGroup) => void;
  private onSubGroupDeleted?: (subGroupId: string) => void;

  // Initialize service
  async initialize(): Promise<void> {
    await this.loadSubGroups();
  }

  // Create a new sub-group
  async createSubGroup(
    name: string,
    parentGroupId: string,
    createdBy: string,
    options: {
      description?: string;
      topic?: string;
      isPrivate?: boolean;
      initialMembers?: string[];
    } = {}
  ): Promise<SubGroup> {
    const subGroupId = `subgroup_${Date.now()}`;
    
    const subGroup: SubGroup = {
      id: subGroupId,
      name,
      description: options.description,
      parentGroupId,
      createdBy,
      createdAt: new Date(),
      members: [createdBy, ...(options.initialMembers || [])],
      isPrivate: options.isPrivate || false,
      topic: options.topic,
      messageCount: 0,
      lastActivity: new Date(),
    };

    this.subGroups.set(subGroupId, subGroup);
    
    // Add to parent group's sub-groups list
    if (!this.parentGroups.has(parentGroupId)) {
      this.parentGroups.set(parentGroupId, []);
    }
    this.parentGroups.get(parentGroupId)!.push(subGroupId);

    await this.saveSubGroups();

    if (this.onSubGroupCreated) {
      this.onSubGroupCreated(subGroup);
    }

    return subGroup;
  }

  // Get sub-group by ID
  getSubGroup(subGroupId: string): SubGroup | null {
    return this.subGroups.get(subGroupId) || null;
  }

  // Get all sub-groups for a parent group
  getSubGroups(parentGroupId: string): SubGroup[] {
    const subGroupIds = this.parentGroups.get(parentGroupId) || [];
    return subGroupIds
      .map(id => this.subGroups.get(id))
      .filter((subGroup): subGroup is SubGroup => subGroup !== undefined)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  // Get public sub-groups for a parent group
  getPublicSubGroups(parentGroupId: string): SubGroup[] {
    return this.getSubGroups(parentGroupId).filter(subGroup => !subGroup.isPrivate);
  }

  // Get sub-groups where user is a member
  getUserSubGroups(parentGroupId: string, userId: string): SubGroup[] {
    return this.getSubGroups(parentGroupId).filter(subGroup => 
      subGroup.members.includes(userId)
    );
  }

  // Add member to sub-group
  async addMember(subGroupId: string, userId: string, addedBy: string): Promise<void> {
    const subGroup = this.subGroups.get(subGroupId);
    if (!subGroup) {
      throw new Error('Sub-group not found');
    }

    if (subGroup.members.includes(userId)) {
      throw new Error('User is already a member');
    }

    subGroup.members.push(userId);
    subGroup.lastActivity = new Date();
    
    await this.saveSubGroups();

    if (this.onSubGroupUpdated) {
      this.onSubGroupUpdated(subGroup);
    }
  }

  // Remove member from sub-group
  async removeMember(subGroupId: string, userId: string, removedBy: string): Promise<void> {
    const subGroup = this.subGroups.get(subGroupId);
    if (!subGroup) {
      throw new Error('Sub-group not found');
    }

    const memberIndex = subGroup.members.indexOf(userId);
    if (memberIndex === -1) {
      throw new Error('User is not a member');
    }

    subGroup.members.splice(memberIndex, 1);
    subGroup.lastActivity = new Date();

    // If creator leaves, transfer ownership to first member
    if (subGroup.createdBy === userId && subGroup.members.length > 0) {
      subGroup.createdBy = subGroup.members[0];
    }

    await this.saveSubGroups();

    if (this.onSubGroupUpdated) {
      this.onSubGroupUpdated(subGroup);
    }
  }

  // Update sub-group info
  async updateSubGroup(
    subGroupId: string,
    updates: {
      name?: string;
      description?: string;
      topic?: string;
      isPrivate?: boolean;
    },
    updatedBy: string
  ): Promise<void> {
    const subGroup = this.subGroups.get(subGroupId);
    if (!subGroup) {
      throw new Error('Sub-group not found');
    }

    // Check if user has permission to update (creator or admin)
    if (subGroup.createdBy !== updatedBy) {
      throw new Error('Only the creator can update sub-group info');
    }

    Object.assign(subGroup, updates);
    subGroup.lastActivity = new Date();

    await this.saveSubGroups();

    if (this.onSubGroupUpdated) {
      this.onSubGroupUpdated(subGroup);
    }
  }

  // Delete sub-group
  async deleteSubGroup(subGroupId: string, deletedBy: string): Promise<void> {
    const subGroup = this.subGroups.get(subGroupId);
    if (!subGroup) {
      throw new Error('Sub-group not found');
    }

    // Check if user has permission to delete (creator or admin)
    if (subGroup.createdBy !== deletedBy) {
      throw new Error('Only the creator can delete the sub-group');
    }

    // Remove from parent group's list
    const parentSubGroups = this.parentGroups.get(subGroup.parentGroupId);
    if (parentSubGroups) {
      const index = parentSubGroups.indexOf(subGroupId);
      if (index > -1) {
        parentSubGroups.splice(index, 1);
      }
    }

    this.subGroups.delete(subGroupId);
    await this.saveSubGroups();

    if (this.onSubGroupDeleted) {
      this.onSubGroupDeleted(subGroupId);
    }
  }

  // Check if user is member of sub-group
  isMember(subGroupId: string, userId: string): boolean {
    const subGroup = this.subGroups.get(subGroupId);
    return subGroup ? subGroup.members.includes(userId) : false;
  }

  // Check if user is creator of sub-group
  isCreator(subGroupId: string, userId: string): boolean {
    const subGroup = this.subGroups.get(subGroupId);
    return subGroup ? subGroup.createdBy === userId : false;
  }

  // Update message count for sub-group
  async updateMessageCount(subGroupId: string, increment: number = 1): Promise<void> {
    const subGroup = this.subGroups.get(subGroupId);
    if (!subGroup) return;

    subGroup.messageCount += increment;
    subGroup.lastActivity = new Date();

    await this.saveSubGroups();

    if (this.onSubGroupUpdated) {
      this.onSubGroupUpdated(subGroup);
    }
  }

  // Get sub-group statistics
  getSubGroupStats(parentGroupId: string): {
    totalSubGroups: number;
    publicSubGroups: number;
    privateSubGroups: number;
    totalMembers: number;
    totalMessages: number;
    activeSubGroups: number; // with activity in last 7 days
  } {
    const subGroups = this.getSubGroups(parentGroupId);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalSubGroups: subGroups.length,
      publicSubGroups: subGroups.filter(sg => !sg.isPrivate).length,
      privateSubGroups: subGroups.filter(sg => sg.isPrivate).length,
      totalMembers: subGroups.reduce((sum, sg) => sum + sg.members.length, 0),
      totalMessages: subGroups.reduce((sum, sg) => sum + sg.messageCount, 0),
      activeSubGroups: subGroups.filter(sg => sg.lastActivity > sevenDaysAgo).length,
    };
  }

  // Search sub-groups
  searchSubGroups(parentGroupId: string, query: string, userId?: string): SubGroup[] {
    const subGroups = userId 
      ? this.getUserSubGroups(parentGroupId, userId)
      : this.getPublicSubGroups(parentGroupId);

    const lowercaseQuery = query.toLowerCase();
    
    return subGroups.filter(subGroup => 
      subGroup.name.toLowerCase().includes(lowercaseQuery) ||
      subGroup.description?.toLowerCase().includes(lowercaseQuery) ||
      subGroup.topic?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get trending sub-groups (most active)
  getTrendingSubGroups(parentGroupId: string, limit: number = 5): SubGroup[] {
    const subGroups = this.getPublicSubGroups(parentGroupId);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return subGroups
      .filter(sg => sg.lastActivity > sevenDaysAgo)
      .sort((a, b) => {
        // Sort by recent activity and member count
        const aScore = a.members.length + (a.lastActivity.getTime() / 1000000);
        const bScore = b.members.length + (b.lastActivity.getTime() / 1000000);
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  // Set callbacks
  setOnSubGroupCreated(callback: (subGroup: SubGroup) => void): void {
    this.onSubGroupCreated = callback;
  }

  setOnSubGroupUpdated(callback: (subGroup: SubGroup) => void): void {
    this.onSubGroupUpdated = callback;
  }

  setOnSubGroupDeleted(callback: (subGroupId: string) => void): void {
    this.onSubGroupDeleted = callback;
  }

  // Save to storage
  private async saveSubGroups(): Promise<void> {
    try {
      const subGroupsData = Array.from(this.subGroups.entries()).map(([id, subGroup]) => [
        id,
        {
          ...subGroup,
          createdAt: subGroup.createdAt.toISOString(),
          lastActivity: subGroup.lastActivity.toISOString(),
        },
      ]);

      const parentGroupsData = Array.from(this.parentGroups.entries());

      await AsyncStorage.setItem('sub_groups', JSON.stringify({
        subGroups: subGroupsData,
        parentGroups: parentGroupsData,
      }));
    } catch (error) {
      console.error('Failed to save sub-groups:', error);
    }
  }

  // Load from storage
  private async loadSubGroups(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('sub_groups');
      if (data) {
        const { subGroups: subGroupsData, parentGroups: parentGroupsData } = JSON.parse(data);

        this.subGroups = new Map(
          subGroupsData.map(([id, subGroup]: [string, any]) => [
            id,
            {
              ...subGroup,
              createdAt: new Date(subGroup.createdAt),
              lastActivity: new Date(subGroup.lastActivity),
            },
          ])
        );

        this.parentGroups = new Map(parentGroupsData);
      }
    } catch (error) {
      console.error('Failed to load sub-groups:', error);
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    this.subGroups.clear();
    this.parentGroups.clear();
    await AsyncStorage.removeItem('sub_groups');
  }
}

export default new SubGroupService();
