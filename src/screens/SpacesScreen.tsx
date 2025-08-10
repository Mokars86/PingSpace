import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Space, Channel, Note, Goal } from '../types';
import { RootStackParamList } from '../navigation/MainNavigator';

type SpacesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SpacesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<SpacesScreenNavigationProp>();
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [activeTab, setActiveTab] = useState<'channels' | 'notes' | 'calendar' | 'files' | 'goals'>('channels');

  // Mock data for Spaces
  const mockSpaces: Space[] = [
    {
      id: '1',
      name: 'Project Alpha',
      description: 'Main development project workspace',
      isPublic: false,
      memberCount: 12,
      channels: [
        { id: 'ch1', name: 'general', spaceId: '1', type: 'text', isPrivate: false, members: [], lastActivity: new Date() },
        { id: 'ch2', name: 'development', spaceId: '1', type: 'text', isPrivate: false, members: [], lastActivity: new Date() },
        { id: 'ch3', name: 'design', spaceId: '1', type: 'text', isPrivate: false, members: [], lastActivity: new Date() },
      ],
      notes: [
        { id: 'n1', title: 'Project Requirements', content: 'Key requirements for the project...', authorId: '1', spaceId: '1', isShared: true, tags: ['requirements'], createdAt: new Date(), updatedAt: new Date() },
        { id: 'n2', title: 'Meeting Notes - Week 1', content: 'Discussion points from this week...', authorId: '2', spaceId: '1', isShared: true, tags: ['meeting'], createdAt: new Date(), updatedAt: new Date() },
      ],
      calendar: [],
      files: [],
      goals: [
        { id: 'g1', title: 'Complete MVP', description: 'Finish minimum viable product', spaceId: '1', createdBy: '1', assignees: ['1', '2'], status: 'in_progress', priority: 'high', progress: 65, createdAt: new Date(), updatedAt: new Date() },
        { id: 'g2', title: 'User Testing', description: 'Conduct user testing sessions', spaceId: '1', createdBy: '2', assignees: ['3'], status: 'not_started', priority: 'medium', progress: 0, createdAt: new Date(), updatedAt: new Date() },
      ],
      createdBy: '1',
      createdAt: new Date(),
      settings: { allowMemberInvites: true, requireApproval: false, allowFileSharing: true },
    },
    {
      id: '2',
      name: 'Marketing Team',
      description: 'Marketing campaigns and strategies',
      isPublic: true,
      memberCount: 8,
      channels: [
        { id: 'ch4', name: 'campaigns', spaceId: '2', type: 'text', isPrivate: false, members: [], lastActivity: new Date() },
        { id: 'ch5', name: 'analytics', spaceId: '2', type: 'text', isPrivate: false, members: [], lastActivity: new Date() },
      ],
      notes: [],
      calendar: [],
      files: [],
      goals: [],
      createdBy: '2',
      createdAt: new Date(),
      settings: { allowMemberInvites: true, requireApproval: true, allowFileSharing: true },
    },
  ];

  const tabs = [
    { key: 'channels' as const, label: 'Channels', icon: 'chatbubbles' },
    { key: 'notes' as const, label: 'Notes', icon: 'document-text' },
    { key: 'calendar' as const, label: 'Calendar', icon: 'calendar' },
    { key: 'files' as const, label: 'Files', icon: 'folder' },
    { key: 'goals' as const, label: 'Goals', icon: 'flag' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    spacesList: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    sidebarHeader: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.sm,
    },
    spaceItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedSpaceItem: {
      backgroundColor: theme.colors.accent + '20',
    },
    spaceName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    spaceDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    spaceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberCount: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    publicBadge: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 1,
      marginLeft: theme.spacing.sm,
    },
    publicBadgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentHeader: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      padding: theme.spacing.md,
    },
    spaceTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.md,
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
    },
    activeTab: {
      backgroundColor: theme.colors.accent,
    },
    tabText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    tabContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyStateSubtext: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    channelItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    channelIcon: {
      marginRight: theme.spacing.md,
    },
    channelName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
    },
    noteItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    noteTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    noteContent: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    noteTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    noteTag: {
      backgroundColor: theme.colors.accent + '20',
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    noteTagText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.accent,
    },
    goalItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    goalTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      flex: 1,
      fontWeight: 'bold',
    },
    priorityBadge: {
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    priorityText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    goalDescription: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    progressContainer: {
      marginBottom: theme.spacing.sm,
    },
    progressLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.accent,
    },
  });

  const renderSpaceItem = ({ item }: { item: Space }) => {
    const isSelected = selectedSpace?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.spaceItem, isSelected && styles.selectedSpaceItem]}
        onPress={() => setSelectedSpace(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.spaceName}>{item.name}</Text>
        <Text style={styles.spaceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.spaceMeta}>
          <Ionicons
            name="people"
            size={12}
            color={theme.colors.textMuted}
          />
          <Text style={styles.memberCount}>{item.memberCount} members</Text>
          {item.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicBadgeText}>PUBLIC</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    if (!selectedSpace) return null;

    switch (activeTab) {
      case 'channels':
        return (
          <FlatList
            data={selectedSpace.channels}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.channelItem}>
                <Ionicons
                  name="chatbubble"
                  size={20}
                  color={theme.colors.accent}
                  style={styles.channelIcon}
                />
                <Text style={styles.channelName}>#{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'notes':
        return (
          <FlatList
            data={selectedSpace.notes}
            renderItem={({ item }) => (
              <View style={styles.noteItem}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteContent} numberOfLines={3}>
                  {item.content}
                </Text>
                <View style={styles.noteTags}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={styles.noteTag}>
                      <Text style={styles.noteTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'goals':
        return (
          <FlatList
            data={selectedSpace.goals}
            renderItem={({ item }) => {
              const getPriorityColor = () => {
                switch (item.priority) {
                  case 'high': return theme.colors.error;
                  case 'medium': return theme.colors.warning;
                  default: return theme.colors.success;
                }
              };

              return (
                <View style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{item.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                      <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.goalDescription}>{item.description}</Text>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${item.progress}%` }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );

      default:
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
            </Text>
            <Text style={styles.emptyStateSubtext}>
              This feature is under development
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedSpace ? (
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.spaceTitle}>{selectedSpace.name}</Text>

            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={16}
                    color={activeTab === tab.key ? '#FFFFFF' : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.key && styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>
        </View>
      ) : (
        <View style={styles.spacesList}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.title}>Spaces</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateSpace')}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Space</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockSpaces}
            renderItem={renderSpaceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SpacesScreen;
