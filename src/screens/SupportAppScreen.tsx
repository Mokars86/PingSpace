import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  RefreshControl,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useDonation } from '../contexts/DonationContext';

const SupportAppScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const {
    donations,
    referralCode,
    referralStats,
    appSupport,
    generateReferralCode,
    shareReferralLink,
    makeVoluntaryDonation,
    formatCurrency
  } = useDonation();
  
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    impactCard: {
      backgroundColor: theme.colors.accent,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
    },
    impactTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    impactStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    impactStat: {
      alignItems: 'center',
    },
    impactValue: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    impactLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: 2,
    },
    impactDescription: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 22,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
      width: '48%',
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    actionIcon: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    actionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    referralCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    referralCode: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.sm,
    },
    referralCodeText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      fontWeight: 'bold',
    },
    referralStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing.md,
    },
    referralStat: {
      alignItems: 'center',
    },
    referralStatValue: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    referralStatLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    goalTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    goalDescription: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.accent,
    },
    progressText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleVoluntaryDonation = () => {
    Alert.alert(
      'Support PingSpace',
      'Choose donation amount',
      [
        { text: '$1', onPress: () => makeVoluntaryDonation(1.00) },
        { text: '$5', onPress: () => makeVoluntaryDonation(5.00) },
        { text: '$10', onPress: () => makeVoluntaryDonation(10.00) },
        { text: 'Custom', onPress: () => console.log('Custom donation') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGenerateReferral = async () => {
    try {
      if (!referralCode) {
        await generateReferralCode();
      }
      Alert.alert('Referral Code Ready!', 'Your referral code has been generated. Share it with friends to earn rewards!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate referral code. Please try again.');
    }
  };

  const handleShareReferral = async () => {
    try {
      if (!referralCode) {
        await generateReferralCode();
      }

      const shareContent = await shareReferralLink('social');

      await Share.share({
        title: shareContent.title,
        message: shareContent.message,
        url: shareContent.url,
      });
    } catch (error) {
      console.error('Error sharing referral:', error);
      Alert.alert('Error', 'Failed to share referral link. Please try again.');
    }
  };

  const handleCopyReferral = async () => {
    if (!referralCode) {
      await generateReferralCode();
      return;
    }

    await Clipboard.setStringAsync(referralCode.shareLink);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const handleViewDonationHistory = () => {
    console.log('View donation history');
  };

  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support PingSpace</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Impact Card */}
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Your Impact</Text>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{formatCurrency(totalDonated)}</Text>
              <Text style={styles.impactLabel}>Donated</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{referralStats.totalReferrals}</Text>
              <Text style={styles.impactLabel}>Referrals</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{formatCurrency(referralStats.totalRewardsEarned)}</Text>
              <Text style={styles.impactLabel}>Earned</Text>
            </View>
          </View>
          <Text style={styles.impactDescription}>
            Thank you for supporting PingSpace! Your contributions help us build better features and keep the app free for everyone.
          </Text>
        </View>

        {/* Support Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleVoluntaryDonation}>
              <View style={styles.actionIcon}>
                <Ionicons name="heart" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Donate</Text>
              <Text style={styles.actionSubtitle}>Make a voluntary donation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShareReferral}>
              <View style={styles.actionIcon}>
                <Ionicons name="share" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Share App</Text>
              <Text style={styles.actionSubtitle}>Invite friends & earn rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleViewDonationHistory}>
              <View style={styles.actionIcon}>
                <Ionicons name="list" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>History</Text>
              <Text style={styles.actionSubtitle}>View donation history</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Settings')}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>Donation preferences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral Program</Text>
          <View style={styles.referralCard}>
            <Text style={styles.actionTitle}>Your Referral Code</Text>
            <View style={styles.referralCode}>
              <Text style={styles.referralCodeText}>
                {referralCode?.code || 'Generate Code'}
              </Text>
              <TouchableOpacity onPress={handleCopyReferral}>
                <Ionicons name="copy" size={20} color={theme.colors.accent} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.referralStats}>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatValue}>{referralStats.totalReferrals}</Text>
                <Text style={styles.referralStatLabel}>Total</Text>
              </View>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatValue}>{referralStats.successfulReferrals}</Text>
                <Text style={styles.referralStatLabel}>Success</Text>
              </View>
              <View style={styles.referralStat}>
                <Text style={styles.referralStatValue}>{referralStats.conversionRate.toFixed(0)}%</Text>
                <Text style={styles.referralStatLabel}>Rate</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Development Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Goals</Text>
          {appSupport.developmentGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <View key={goal.id} style={styles.goalCard}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} ({progress.toFixed(0)}%)
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportAppScreen;
