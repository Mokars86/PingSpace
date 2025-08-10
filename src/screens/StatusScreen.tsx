import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useStatus } from '../contexts/StatusContext';
import { RootStackParamList } from '../navigation/MainNavigator';
import StatusList from '../components/status/StatusList';

type StatusScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const StatusScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<StatusScreenNavigationProp>();
  const { myStatus, statusRings } = useStatus();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    myStatusSection: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    myStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    myStatusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    statusAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    statusInfo: {
      flex: 1,
    },
    statusTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    statusTime: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    addStatusButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    addStatusText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    recentUpdatesSection: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  const handleStatusPress = (userId: string) => {
    navigation.navigate('StatusViewer', { userId });
  };

  const handleAddStatusPress = () => {
    navigation.navigate('StatusUpload');
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddStatusPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* My Status Section */}
        <View style={styles.myStatusSection}>
          <View style={styles.myStatusHeader}>
            <Text style={styles.sectionTitle}>My Status</Text>
          </View>
          
          {myStatus.length > 0 ? (
            myStatus.map((status) => (
              <TouchableOpacity
                key={status.id}
                style={styles.myStatusItem}
                onPress={() => handleStatusPress(status.userId)}
                activeOpacity={0.7}
              >
                <View style={styles.statusAvatar}>
                  <Ionicons name="person" size={24} color={theme.colors.textMuted} />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusTitle}>
                    {status.type === 'text' ? 'Text Status' : 'Photo Status'}
                  </Text>
                  <Text style={styles.statusTime}>
                    {formatTimeAgo(status.createdAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              style={styles.addStatusButton}
              onPress={handleAddStatusPress}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.accent} />
              <Text style={styles.addStatusText}>Add to my status</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Updates Section */}
        <View style={styles.recentUpdatesSection}>
          {statusRings.filter(ring => !ring.isMyStatus).length > 0 ? (
            <StatusList
              onStatusPress={handleStatusPress}
              onAddStatusPress={handleAddStatusPress}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="radio-button-off-outline"
                size={80}
                color={theme.colors.textMuted}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>No recent updates</Text>
              <Text style={styles.emptyStateText}>
                When your contacts share status updates, they'll appear here.
                Share your first status to get started!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatusScreen;
