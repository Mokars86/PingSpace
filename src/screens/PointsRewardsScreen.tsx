import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePoints } from '../contexts/PointsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/MainNavigator';

const PointsRewardsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    userPoints,
    availableRewards,
    pointsTiers,
    referralCode,
    referrals,
    isLoading,
    redeemPoints,
    generateReferralCode,
    shareReferralCode,
    calculateTierProgress,
    getExpiringPoints,
    formatPoints,
    refreshData,
  } = usePoints();

  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'referrals'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      textAlign: 'center',
      flex: 1,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      backgroundColor: 'transparent',
    },
    pointsCard: {
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    pointsCardContent: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    pointsAmount: {
      fontSize: 36,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      marginBottom: theme.spacing.xs,
    },
    pointsLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: theme.spacing.md,
    },
    tierInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    tierIcon: {
      marginRight: theme.spacing.xs,
    },
    tierText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.accent,
    },
    tabText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      marginRight: '2%',
    },
    statValue: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    rewardCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    rewardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    rewardName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    rewardPoints: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
    },
    rewardDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    rewardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rewardCategory: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
    },
    redeemButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    redeemButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    redeemButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: '#FFFFFF',
    },
    referralCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    referralCode: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      letterSpacing: 2,
    },
    referralDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    shareButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    shareButton: {
      alignItems: 'center',
      padding: theme.spacing.sm,
    },
    shareButtonText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const redemption = await redeemPoints(rewardId);
      Alert.alert(
        'Reward Redeemed!',
        `Your redemption code is: ${redemption.redemptionCode}\n\nThis code will expire on ${redemption.expiryDate.toLocaleDateString()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to redeem reward');
    }
  };

  const handleGenerateReferralCode = async () => {
    try {
      await generateReferralCode();
      Alert.alert('Success', 'Your referral code has been generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate referral code');
    }
  };

  const handleShareReferral = async (method: 'sms' | 'email' | 'social' | 'copy') => {
    try {
      await shareReferralCode(method);
      if (method === 'copy') {
        Alert.alert('Copied!', 'Referral link copied to clipboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const tierProgress = calculateTierProgress();
  const expiringIn30Days = getExpiringPoints(30);

  const renderPointsCard = () => (
    <LinearGradient
      colors={[theme.colors.accent, theme.colors.primary]}
      style={styles.pointsCard}
    >
      <View style={styles.pointsCardContent}>
        <Text style={styles.pointsAmount}>
          {userPoints ? formatPoints(userPoints.availablePoints) : '0'}
        </Text>
        <Text style={styles.pointsLabel}>Available Points</Text>

        <View style={styles.tierInfo}>
          <Ionicons
            name={tierProgress.current.icon as any}
            size={16}
            color="#FFFFFF"
            style={styles.tierIcon}
          />
          <Text style={styles.tierText}>
            {tierProgress.current.name} Member
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderOverviewTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Points Summary</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {userPoints ? formatPoints(userPoints.lifetimeEarned) : '0'}
          </Text>
          <Text style={styles.statLabel}>Lifetime Earned</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {userPoints ? formatPoints(userPoints.usedPoints) : '0'}
          </Text>
          <Text style={styles.statLabel}>Points Used</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {formatPoints(expiringIn30Days)}
          </Text>
          <Text style={styles.statLabel}>Expiring in 30 Days</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {referrals.filter(r => r.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Successful Referrals</Text>
        </View>
      </View>

      {tierProgress.next && (
        <View>
          <Text style={styles.sectionTitle}>Next Tier Progress</Text>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardName}>
              {tierProgress.next.name} Tier
            </Text>
            <Text style={styles.rewardDescription}>
              {Math.round(tierProgress.progress)}% complete • {formatPoints(tierProgress.next.minPoints - (userPoints?.totalPoints || 0))} points to go
            </Text>
            <View style={styles.rewardFooter}>
              <Text style={styles.rewardCategory}>
                {tierProgress.next.multiplier}x points multiplier
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderRewardsTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Available Rewards</Text>

      {availableRewards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No rewards available at the moment</Text>
        </View>
      ) : (
        availableRewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardPoints}>
                {formatPoints(reward.pointsCost)} pts
              </Text>
            </View>

            <Text style={styles.rewardDescription}>
              {reward.description}
            </Text>

            <View style={styles.rewardFooter}>
              <Text style={styles.rewardCategory}>
                {reward.category.replace('_', ' ')}
                {reward.isLimited && reward.remainingQuantity !== undefined &&
                  ` • ${reward.remainingQuantity} left`
                }
              </Text>

              <TouchableOpacity
                style={[
                  styles.redeemButton,
                  (!userPoints || userPoints.availablePoints < reward.pointsCost ||
                   (reward.isLimited && reward.remainingQuantity === 0)) &&
                  styles.redeemButtonDisabled
                ]}
                onPress={() => handleRedeemReward(reward.id)}
                disabled={!userPoints || userPoints.availablePoints < reward.pointsCost ||
                         (reward.isLimited && reward.remainingQuantity === 0)}
              >
                <Text style={styles.redeemButtonText}>
                  {!userPoints || userPoints.availablePoints < reward.pointsCost
                    ? 'Insufficient Points'
                    : reward.isLimited && reward.remainingQuantity === 0
                    ? 'Out of Stock'
                    : 'Redeem'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderReferralsTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Refer Friends & Earn Points</Text>

      <View style={styles.referralCard}>
        {referralCode ? (
          <>
            <Text style={styles.referralCode}>{referralCode.code}</Text>
            <Text style={styles.referralDescription}>
              Share your code and earn {formatPoints(500)} points for each friend who joins!
            </Text>

            <View style={styles.shareButtons}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleShareReferral('social')}
              >
                <Ionicons name="share-social" size={24} color={theme.colors.accent} />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleShareReferral('sms')}
              >
                <Ionicons name="chatbubble" size={24} color={theme.colors.accent} />
                <Text style={styles.shareButtonText}>SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleShareReferral('copy')}
              >
                <Ionicons name="copy" size={24} color={theme.colors.accent} />
                <Text style={styles.shareButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.referralDescription}>
              Generate your personal referral code to start earning points!
            </Text>
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={handleGenerateReferralCode}
            >
              <Text style={styles.redeemButtonText}>Generate Code</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {referrals.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Your Referrals</Text>
          {referrals.map((referral) => (
            <View key={referral.id} style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardName}>{referral.refereeName}</Text>
                <Text style={styles.rewardPoints}>
                  {referral.status === 'completed' ? '+500 pts' : 'Pending'}
                </Text>
              </View>
              <Text style={styles.rewardDescription}>
                Joined on {referral.signupDate.toLocaleDateString()}
              </Text>
              <View style={styles.rewardFooter}>
                <Text style={styles.rewardCategory}>
                  Status: {referral.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'rewards':
        return renderRewardsTab();
      case 'referrals':
        return renderReferralsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed');
            try {
              navigation.goBack();
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback navigation
              navigation.navigate('Profile' as any);
            }
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points & Rewards</Text>
      </View>

      {renderPointsCard()}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>
            Rewards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'referrals' && styles.activeTab]}
          onPress={() => setActiveTab('referrals')}
        >
          <Text style={[styles.tabText, activeTab === 'referrals' && styles.activeTabText]}>
            Referrals
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PointsRewardsScreen;
