import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useStatus } from '../../contexts/StatusContext';
import { StatusRing } from '../../types';

interface StatusListProps {
  onStatusPress: (userId: string) => void;
  onAddStatusPress: () => void;
}

const StatusList: React.FC<StatusListProps> = ({ onStatusPress, onAddStatusPress }) => {
  const { theme } = useTheme();
  const { statusRings } = useStatus();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    statusItem: {
      alignItems: 'center',
      marginRight: theme.spacing.md,
      width: 80,
    },
    statusRingContainer: {
      position: 'relative',
      marginBottom: theme.spacing.sm,
    },
    statusRing: {
      width: 70,
      height: 70,
      borderRadius: 35,
      padding: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.inputBackground,
    },
    addStatusContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    addIcon: {
      marginBottom: 4,
    },
    statusBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    statusBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
    },
    statusName: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    myStatusName: {
      color: theme.colors.accent,
    },
    timeAgo: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: 2,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyStateSubtext: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const renderAddStatusItem = () => (
    <TouchableOpacity
      style={styles.statusItem}
      onPress={onAddStatusPress}
      activeOpacity={0.7}
    >
      <View style={styles.statusRingContainer}>
        <View style={styles.addStatusContainer}>
          <Ionicons
            name="add"
            size={24}
            color={theme.colors.accent}
            style={styles.addIcon}
          />
        </View>
      </View>
      <Text style={[styles.statusName, styles.myStatusName]}>Add Status</Text>
    </TouchableOpacity>
  );

  const renderStatusItem = ({ item }: { item: StatusRing }) => (
    <TouchableOpacity
      style={styles.statusItem}
      onPress={() => onStatusPress(item.userId)}
      activeOpacity={0.7}
    >
      <View style={styles.statusRingContainer}>
        <View
          style={[
            styles.statusRing,
            {
              backgroundColor: item.ringColor,
              borderWidth: item.hasUnseenStatus ? 3 : 2,
              borderColor: item.hasUnseenStatus ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          <Image
            source={{ uri: item.userAvatar || 'https://via.placeholder.com/74x74' }}
            style={styles.statusAvatar}
            resizeMode="cover"
          />
        </View>

        {item.statusCount > 1 && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {item.statusCount > 9 ? '9+' : item.statusCount.toString()}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.statusName,
          item.isMyStatus && styles.myStatusName,
        ]}
        numberOfLines={1}
      >
        {item.isMyStatus ? 'My Status' : item.userName}
      </Text>

      <Text style={styles.timeAgo}>
        {formatTimeAgo(item.lastStatusTime)}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (statusRings.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No status updates yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Be the first to share a status with your contacts
          </Text>
        </View>
      );
    }

    // Check if current user has status
    const hasMyStatus = statusRings.some(ring => ring.isMyStatus);

    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={hasMyStatus ? statusRings : []}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
        }}
        ListHeaderComponent={!hasMyStatus ? renderAddStatusItem : undefined}
        snapToInterval={100} // Snap to each item (90 width + 10 margin)
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={true}
        bouncesZoom={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Status</Text>
      {renderContent()}
    </View>
  );
};

export default StatusList;
