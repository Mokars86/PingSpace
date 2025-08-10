import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SubGroup } from '../../types';
import SubGroupService from '../../services/SubGroupService';

interface SubGroupsProps {
  visible: boolean;
  onClose: () => void;
  parentGroupId: string;
  currentUserId: string;
  onSubGroupSelect?: (subGroup: SubGroup) => void;
}

const SubGroups: React.FC<SubGroupsProps> = ({
  visible,
  onClose,
  parentGroupId,
  currentUserId,
  onSubGroupSelect,
}) => {
  const { theme } = useTheme();
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'trending'>('all');

  // Create form state
  const [newSubGroupName, setNewSubGroupName] = useState('');
  const [newSubGroupDescription, setNewSubGroupDescription] = useState('');
  const [newSubGroupTopic, setNewSubGroupTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSubGroups();
    }
  }, [visible, parentGroupId, filter]);

  const loadSubGroups = () => {
    let groups: SubGroup[] = [];
    
    switch (filter) {
      case 'all':
        groups = SubGroupService.getPublicSubGroups(parentGroupId);
        break;
      case 'joined':
        groups = SubGroupService.getUserSubGroups(parentGroupId, currentUserId);
        break;
      case 'trending':
        groups = SubGroupService.getTrendingSubGroups(parentGroupId);
        break;
    }

    if (searchQuery.trim()) {
      groups = SubGroupService.searchSubGroups(parentGroupId, searchQuery, currentUserId);
    }

    setSubGroups(groups);
  };

  const handleCreateSubGroup = async () => {
    if (!newSubGroupName.trim()) {
      Alert.alert('Error', 'Please enter a name for the sub-group');
      return;
    }

    if (newSubGroupName.length > 50) {
      Alert.alert('Error', 'Sub-group name cannot exceed 50 characters');
      return;
    }

    setIsCreating(true);

    try {
      const subGroup = await SubGroupService.createSubGroup(
        newSubGroupName.trim(),
        parentGroupId,
        currentUserId,
        {
          description: newSubGroupDescription.trim() || undefined,
          topic: newSubGroupTopic.trim() || undefined,
          isPrivate,
        }
      );

      resetCreateForm();
      setShowCreateForm(false);
      loadSubGroups();
      Alert.alert('Success', 'Sub-group created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create sub-group');
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreateForm = () => {
    setNewSubGroupName('');
    setNewSubGroupDescription('');
    setNewSubGroupTopic('');
    setIsPrivate(false);
  };

  const handleJoinSubGroup = async (subGroup: SubGroup) => {
    try {
      await SubGroupService.addMember(subGroup.id, currentUserId, currentUserId);
      loadSubGroups();
      Alert.alert('Success', `Joined ${subGroup.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to join sub-group');
    }
  };

  const handleLeaveSubGroup = (subGroup: SubGroup) => {
    Alert.alert(
      'Leave Sub-group',
      `Are you sure you want to leave ${subGroup.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await SubGroupService.removeMember(subGroup.id, currentUserId, currentUserId);
              loadSubGroups();
            } catch (error) {
              Alert.alert('Error', 'Failed to leave sub-group');
            }
          },
        },
      ]
    );
  };

  const formatLastActivity = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderSubGroup = ({ item }: { item: SubGroup }) => {
    const isMember = SubGroupService.isMember(item.id, currentUserId);
    const isCreator = SubGroupService.isCreator(item.id, currentUserId);

    return (
      <TouchableOpacity
        style={styles.subGroupItem}
        onPress={() => {
          if (isMember) {
            onSubGroupSelect?.(item);
            onClose();
          } else {
            handleJoinSubGroup(item);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.subGroupHeader}>
          <View style={styles.subGroupInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.subGroupName}>{item.name}</Text>
              {item.isPrivate && (
                <Ionicons name="lock-closed" size={14} color={theme.colors.textMuted} />
              )}
              {isCreator && (
                <Ionicons name="crown" size={14} color={theme.colors.warning} />
              )}
            </View>
            {item.topic && (
              <Text style={styles.subGroupTopic}>#{item.topic}</Text>
            )}
            {item.description && (
              <Text style={styles.subGroupDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <View style={styles.subGroupActions}>
            {isMember ? (
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={() => handleLeaveSubGroup(item)}
              >
                <Ionicons name="exit" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.joinButton}>
                <Ionicons name="add" size={16} color={theme.colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.subGroupStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.members.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.messageCount}</Text>
          </View>
          <Text style={styles.lastActivity}>
            {formatLastActivity(item.lastActivity)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const stats = SubGroupService.getSubGroupStats(parentGroupId);

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
    createButton: {
      padding: theme.spacing.sm,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchInput: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeFilter: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    filterText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statContainer: {
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
    content: {
      flex: 1,
    },
    subGroupItem: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    subGroupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    subGroupInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    subGroupName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    subGroupTopic: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
      marginBottom: theme.spacing.xs,
    },
    subGroupDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    },
    subGroupActions: {
      alignItems: 'center',
    },
    joinButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.accent + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    leaveButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.error + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    subGroupStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    lastActivity: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    },
    createFormModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createFormContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      margin: theme.spacing.xl,
      minWidth: 300,
      maxWidth: 400,
    },
    createFormTitle: {
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
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    switchLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    createFormButtons: {
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
    createButtonStyle: {
      backgroundColor: theme.colors.accent,
    },
    disabledButton: {
      backgroundColor: theme.colors.textMuted,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    createButtonText: {
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
          <Text style={styles.title}>Sub-groups</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateForm(true)}>
            <Ionicons name="add" size={24} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search sub-groups..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'joined', 'trending'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[styles.filterButton, filter === filterType && styles.activeFilter]}
              onPress={() => setFilter(filterType)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === filterType && styles.activeFilterText,
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statContainer}>
            <Text style={styles.statNumber}>{stats.totalSubGroups}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statNumber}>{stats.publicSubGroups}</Text>
            <Text style={styles.statLabel}>Public</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statNumber}>{stats.activeSubGroups}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statNumber}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
        </View>

        <View style={styles.content}>
          {subGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="people-outline" 
                size={64} 
                color={theme.colors.textMuted} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? 'No Results Found' : 'No Sub-groups Yet'}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all sub-groups.'
                  : 'Create topic-based sub-conversations to organize discussions better.'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={subGroups}
              renderItem={renderSubGroup}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
            />
          )}
        </View>

        {/* Create Sub-group Modal */}
        <Modal
          visible={showCreateForm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCreateForm(false)}
        >
          <TouchableOpacity
            style={styles.createFormModal}
            activeOpacity={1}
            onPress={() => setShowCreateForm(false)}
          >
            <TouchableOpacity style={styles.createFormContainer} activeOpacity={1}>
              <Text style={styles.createFormTitle}>Create Sub-group</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Sub-group name"
                placeholderTextColor={theme.colors.textMuted}
                value={newSubGroupName}
                onChangeText={setNewSubGroupName}
                maxLength={50}
              />

              <TextInput
                style={styles.input}
                placeholder="Topic (optional)"
                placeholderTextColor={theme.colors.textMuted}
                value={newSubGroupTopic}
                onChangeText={setNewSubGroupTopic}
                maxLength={30}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor={theme.colors.textMuted}
                value={newSubGroupDescription}
                onChangeText={setNewSubGroupDescription}
                multiline
                maxLength={200}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Private sub-group</Text>
                <Switch
                  value={isPrivate}
                  onValueChange={setIsPrivate}
                  trackColor={{ false: theme.colors.inputBackground, true: theme.colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.createFormButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    resetCreateForm();
                    setShowCreateForm(false);
                  }}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.createButtonStyle,
                    (isCreating || !newSubGroupName.trim()) && styles.disabledButton,
                  ]}
                  onPress={handleCreateSubGroup}
                  disabled={isCreating || !newSubGroupName.trim()}
                >
                  <Text style={[styles.buttonText, styles.createButtonText]}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
};

export default SubGroups;
