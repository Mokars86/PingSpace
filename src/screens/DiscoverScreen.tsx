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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Space, Extension } from '../types';

const DiscoverScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'spaces' | 'extensions' | 'nearby'>('spaces');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for discovery
  const mockPublicSpaces: Space[] = [
    {
      id: 'ps1',
      name: 'React Native Developers',
      description: 'Community for React Native developers to share knowledge and collaborate',
      isPublic: true,
      memberCount: 1250,
      channels: [],
      notes: [],
      calendar: [],
      files: [],
      goals: [],
      createdBy: 'user1',
      createdAt: new Date(),
      settings: { allowMemberInvites: true, requireApproval: false, allowFileSharing: true },
    },
    {
      id: 'ps2',
      name: 'Design Systems',
      description: 'Best practices and resources for building design systems',
      isPublic: true,
      memberCount: 890,
      channels: [],
      notes: [],
      calendar: [],
      files: [],
      goals: [],
      createdBy: 'user2',
      createdAt: new Date(),
      settings: { allowMemberInvites: true, requireApproval: true, allowFileSharing: true },
    },
    {
      id: 'ps3',
      name: 'Startup Founders',
      description: 'Network of startup founders sharing experiences and advice',
      isPublic: true,
      memberCount: 2100,
      channels: [],
      notes: [],
      calendar: [],
      files: [],
      goals: [],
      createdBy: 'user3',
      createdAt: new Date(),
      settings: { allowMemberInvites: true, requireApproval: true, allowFileSharing: true },
    },
  ];

  const mockExtensions: Extension[] = [
    {
      id: 'ext1',
      name: 'AI Assistant Pro',
      description: 'Advanced AI assistant for message summarization and translation',
      type: 'bot',
      icon: '🤖',
      isInstalled: false,
      permissions: ['read_messages', 'send_messages'],
      developer: 'PingSpace Labs',
      rating: 4.8,
      downloadCount: 15000,
    },
    {
      id: 'ext2',
      name: 'Task Manager',
      description: 'Convert messages to tasks and track project progress',
      type: 'tool',
      icon: '✅',
      isInstalled: true,
      permissions: ['read_messages', 'create_tasks'],
      developer: 'Productivity Inc',
      rating: 4.6,
      downloadCount: 8500,
    },
    {
      id: 'ext3',
      name: 'Trivia Bot',
      description: 'Fun trivia games for team building and entertainment',
      type: 'game',
      icon: '🎮',
      isInstalled: false,
      permissions: ['send_messages', 'read_reactions'],
      developer: 'GameDev Studio',
      rating: 4.3,
      downloadCount: 12000,
    },
    {
      id: 'ext4',
      name: 'Calendar Sync',
      description: 'Sync with Google Calendar and schedule meetings',
      type: 'integration',
      icon: '📅',
      isInstalled: false,
      permissions: ['read_calendar', 'create_events'],
      developer: 'Calendar Co',
      rating: 4.7,
      downloadCount: 6800,
    },
  ];

  const tabs = [
    { key: 'spaces' as const, label: 'Public Spaces', icon: 'globe' },
    { key: 'extensions' as const, label: 'Extensions', icon: 'extension-puzzle' },
    { key: 'nearby' as const, label: 'Nearby', icon: 'location' },
  ];

  const filteredSpaces = mockPublicSpaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExtensions = mockExtensions.filter(ext =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinSpace = (space: Space) => {
    Alert.alert(
      'Join Space',
      `Would you like to join "${space.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => Alert.alert('Success', 'You have joined the space!') },
      ]
    );
  };

  const handleInstallExtension = (extension: Extension) => {
    Alert.alert(
      'Install Extension',
      `Install "${extension.name}" by ${extension.developer}?\n\nPermissions needed:\n${extension.permissions.join(', ')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Install', onPress: () => Alert.alert('Success', 'Extension installed!') },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    tabsContainer: {
      flexDirection: 'row',
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
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    spaceItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    spaceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    spaceName: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.md,
      fontWeight: 'bold',
    },
    joinButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    joinButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
    spaceDescription: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    spaceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    extensionItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    extensionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    extensionIcon: {
      fontSize: 32,
      marginRight: theme.spacing.md,
    },
    extensionInfo: {
      flex: 1,
    },
    extensionName: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    extensionDeveloper: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    extensionDescription: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    extensionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    extensionMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    ratingText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    downloadCount: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    installButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    installedButton: {
      backgroundColor: theme.colors.success,
    },
    installButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
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
  });

  const renderSpaceItem = ({ item }: { item: Space }) => (
    <View style={styles.spaceItem}>
      <View style={styles.spaceHeader}>
        <Text style={styles.spaceName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinSpace(item)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.spaceDescription}>{item.description}</Text>
      
      <View style={styles.spaceMeta}>
        <Ionicons
          name="people"
          size={16}
          color={theme.colors.textMuted}
        />
        <Text style={styles.memberCount}>
          {item.memberCount.toLocaleString()} members
        </Text>
      </View>
    </View>
  );

  const renderExtensionItem = ({ item }: { item: Extension }) => (
    <View style={styles.extensionItem}>
      <View style={styles.extensionHeader}>
        <Text style={styles.extensionIcon}>{item.icon}</Text>
        <View style={styles.extensionInfo}>
          <Text style={styles.extensionName}>{item.name}</Text>
          <Text style={styles.extensionDeveloper}>by {item.developer}</Text>
        </View>
      </View>
      
      <Text style={styles.extensionDescription}>{item.description}</Text>
      
      <View style={styles.extensionFooter}>
        <View style={styles.extensionMeta}>
          <View style={styles.rating}>
            <Ionicons
              name="star"
              size={14}
              color={theme.colors.warning}
            />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.downloadCount}>
            {item.downloadCount.toLocaleString()} downloads
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.installButton,
            item.isInstalled && styles.installedButton,
          ]}
          onPress={() => !item.isInstalled && handleInstallExtension(item)}
          disabled={item.isInstalled}
        >
          <Text style={styles.installButtonText}>
            {item.isInstalled ? 'Installed' : 'Install'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'spaces':
        return filteredSpaces.length > 0 ? (
          <FlatList
            data={filteredSpaces}
            renderItem={renderSpaceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No spaces found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search terms
            </Text>
          </View>
        );

      case 'extensions':
        return filteredExtensions.length > 0 ? (
          <FlatList
            data={filteredExtensions}
            renderItem={renderExtensionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No extensions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search terms
            </Text>
          </View>
        );

      case 'nearby':
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nearby Friends</Text>
            <Text style={styles.emptyStateSubtext}>
              This feature requires location permission and is coming soon
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search spaces and extensions..."
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

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

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default DiscoverScreen;
