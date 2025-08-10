import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { usePoints } from '../../contexts/PointsContext';

interface PointsDisplayProps {
  variant?: 'compact' | 'full';
  showTier?: boolean;
  onPress?: () => void;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  variant = 'compact', 
  showTier = false,
  onPress 
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userPoints, formatPoints, calculateTierProgress } = usePoints();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    fullContainer: {
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
    pointsText: {
      fontSize: variant === 'compact' ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.accent,
    },
    label: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    tierContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    tierIcon: {
      marginRight: theme.spacing.xs,
    },
    tierText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    chevron: {
      marginLeft: 'auto',
    },
  });

  const tierProgress = calculateTierProgress();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('PointsRewards' as never);
    }
  };

  if (!userPoints) {
    return null;
  }

  if (variant === 'full') {
    return (
      <TouchableOpacity style={[styles.container, styles.fullContainer]} onPress={handlePress}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="gift"
              size={20}
              color={theme.colors.accent}
              style={styles.icon}
            />
            <Text style={styles.pointsText}>
              {formatPoints(userPoints.availablePoints)} points
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.textMuted}
              style={styles.chevron}
            />
          </View>
          
          {showTier && (
            <View style={styles.tierContainer}>
              <Ionicons
                name={tierProgress.current.icon as any}
                size={14}
                color={tierProgress.current.color}
                style={styles.tierIcon}
              />
              <Text style={styles.tierText}>
                {tierProgress.current.name} Member
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons
        name="gift"
        size={16}
        color={theme.colors.accent}
        style={styles.icon}
      />
      <Text style={styles.pointsText}>
        {formatPoints(userPoints.availablePoints)}
      </Text>
      <Text style={styles.label}>pts</Text>
    </TouchableOpacity>
  );
};

export default PointsDisplay;
