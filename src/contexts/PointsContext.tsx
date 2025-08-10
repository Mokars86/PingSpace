import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';
import {
  UserPoints,
  PointsTransaction,
  PointsTier,
  RewardItem,
  PointsRedemption,
  PointsSettings,
  ReferralCode,
  Referral
} from '../types';

export interface PointsContextType {
  userPoints: UserPoints | null;
  pointsTransactions: PointsTransaction[];
  availableRewards: RewardItem[];
  redemptions: PointsRedemption[];
  pointsTiers: PointsTier[];
  pointsSettings: PointsSettings;
  referralCode: ReferralCode | null;
  referrals: Referral[];
  isLoading: boolean;

  // Points operations
  earnPoints: (amount: number, source: PointsTransaction['source'], description: string, metadata?: any) => Promise<void>;
  redeemPoints: (rewardId: string) => Promise<PointsRedemption>;
  useRedemption: (redemptionId: string, orderId?: string) => Promise<void>;
  
  // Referral operations
  generateReferralCode: () => Promise<ReferralCode>;
  shareReferralCode: (method: 'sms' | 'email' | 'social' | 'copy') => Promise<void>;
  processReferralSignup: (referralCode: string, newUserId: string) => Promise<void>;
  
  // Utilities
  calculateTierProgress: () => { current: PointsTier; next: PointsTier | null; progress: number };
  getExpiringPoints: (days: number) => number;
  formatPoints: (points: number) => string;
  refreshData: () => Promise<void>;
}

interface PointsProviderProps {
  children: ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [pointsTransactions, setPointsTransactions] = useState<PointsTransaction[]>([]);
  const [availableRewards, setAvailableRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<PointsRedemption[]>([]);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user ID
  const currentUserId = '1';

  // Points tiers configuration
  const pointsTiers: PointsTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 999,
      multiplier: 1.0,
      benefits: ['Earn 1 point per $1 spent', 'Basic rewards access'],
      color: '#CD7F32',
      icon: 'medal-outline'
    },
    {
      id: 'silver',
      name: 'Silver',
      minPoints: 1000,
      maxPoints: 4999,
      multiplier: 1.2,
      benefits: ['Earn 1.2 points per $1 spent', 'Priority customer support', 'Exclusive rewards'],
      color: '#C0C0C0',
      icon: 'medal'
    },
    {
      id: 'gold',
      name: 'Gold',
      minPoints: 5000,
      maxPoints: 14999,
      multiplier: 1.5,
      benefits: ['Earn 1.5 points per $1 spent', 'Free shipping', 'Early access to sales', 'Birthday bonus'],
      color: '#FFD700',
      icon: 'trophy'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      minPoints: 15000,
      multiplier: 2.0,
      benefits: ['Earn 2 points per $1 spent', 'VIP customer support', 'Exclusive products', 'Personal shopper'],
      color: '#E5E4E2',
      icon: 'diamond'
    }
  ];

  // Points settings
  const pointsSettings: PointsSettings = {
    isEnabled: true,
    pointsPerDollarSpent: 1,
    referralPoints: {
      referrer: 500, // 500 points for referrer
      referee: 200,  // 200 points for new user
    },
    signupBonus: 100,
    dailyLoginPoints: 5,
    socialSharePoints: 25,
    reviewPoints: 50,
    pointsExpiryDays: 365, // Points expire after 1 year
    minimumRedemption: 100,
    maxPointsPerTransaction: 10000,
    tierBonusEnabled: true,
  };

  // Sample rewards
  const sampleRewards: RewardItem[] = [
    {
      id: 'discount_5',
      name: '$5 Off Purchase',
      description: 'Get $5 off your next purchase of $25 or more',
      pointsCost: 500,
      category: 'discount',
      type: 'fixed_discount',
      value: 5,
      currency: 'USD',
      isActive: true,
      isLimited: false,
      validityDays: 30,
      minimumPurchase: 25,
      terms: ['Valid for 30 days', 'Minimum purchase $25', 'Cannot be combined with other offers'],
      createdAt: new Date(),
    },
    {
      id: 'discount_10_percent',
      name: '10% Off Purchase',
      description: 'Get 10% off your entire purchase',
      pointsCost: 750,
      category: 'discount',
      type: 'percentage_discount',
      value: 10,
      isActive: true,
      isLimited: false,
      validityDays: 30,
      minimumPurchase: 50,
      terms: ['Valid for 30 days', 'Minimum purchase $50', 'Maximum discount $20'],
      createdAt: new Date(),
    },
    {
      id: 'free_shipping',
      name: 'Free Shipping',
      description: 'Free shipping on your next order',
      pointsCost: 300,
      category: 'service',
      type: 'free_shipping',
      value: 0,
      isActive: true,
      isLimited: false,
      validityDays: 60,
      terms: ['Valid for 60 days', 'No minimum purchase required'],
      createdAt: new Date(),
    },
    {
      id: 'gift_card_25',
      name: '$25 Gift Card',
      description: 'Digital gift card worth $25',
      pointsCost: 2500,
      category: 'digital',
      type: 'gift_card',
      value: 25,
      currency: 'USD',
      isActive: true,
      isLimited: true,
      totalQuantity: 100,
      remainingQuantity: 85,
      validityDays: 365,
      terms: ['Valid for 1 year', 'Non-transferable', 'Cannot be exchanged for cash'],
      createdAt: new Date(),
    }
  ];

  useEffect(() => {
    initializePointsSystem();
  }, []);

  const initializePointsSystem = async () => {
    setIsLoading(true);
    try {
      await loadUserPoints();
      await loadPointsTransactions();
      await loadRedemptions();
      await loadReferralCode();
      await loadReferrals();
      setAvailableRewards(sampleRewards);
    } catch (error) {
      console.error('Error initializing points system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      const savedPoints = await AsyncStorage.getItem('user_points');
      if (savedPoints) {
        const parsedPoints = JSON.parse(savedPoints);
        setUserPoints({
          ...parsedPoints,
          lastUpdated: new Date(parsedPoints.lastUpdated),
          expiringPoints: parsedPoints.expiringPoints.map((ep: any) => ({
            ...ep,
            expiryDate: new Date(ep.expiryDate)
          }))
        });
      } else {
        // Create initial points account
        const initialPoints: UserPoints = {
          id: `points_${currentUserId}`,
          userId: currentUserId,
          totalPoints: pointsSettings.signupBonus,
          availablePoints: pointsSettings.signupBonus,
          usedPoints: 0,
          lifetimeEarned: pointsSettings.signupBonus,
          currentTier: pointsTiers[0],
          nextTierPoints: pointsTiers[1].minPoints,
          expiringPoints: [],
          lastUpdated: new Date(),
        };
        setUserPoints(initialPoints);
        await AsyncStorage.setItem('user_points', JSON.stringify(initialPoints));
        
        // Record signup bonus transaction
        await earnPoints(pointsSettings.signupBonus, 'signup', 'Welcome bonus for joining PingSpace!');
      }
    } catch (error) {
      console.error('Error loading user points:', error);
    }
  };

  const loadPointsTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('points_transactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          processedAt: tx.processedAt ? new Date(tx.processedAt) : undefined,
          expiryDate: tx.expiryDate ? new Date(tx.expiryDate) : undefined,
        }));
        setPointsTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading points transactions:', error);
    }
  };

  const loadRedemptions = async () => {
    try {
      const savedRedemptions = await AsyncStorage.getItem('points_redemptions');
      if (savedRedemptions) {
        const parsedRedemptions = JSON.parse(savedRedemptions).map((redemption: any) => ({
          ...redemption,
          expiryDate: new Date(redemption.expiryDate),
          redeemedAt: redemption.redeemedAt ? new Date(redemption.redeemedAt) : undefined,
          usedAt: redemption.usedAt ? new Date(redemption.usedAt) : undefined,
          createdAt: new Date(redemption.createdAt),
        }));
        setRedemptions(parsedRedemptions);
      }
    } catch (error) {
      console.error('Error loading redemptions:', error);
    }
  };

  const loadReferralCode = async () => {
    try {
      const savedCode = await AsyncStorage.getItem('user_referral_code');
      if (savedCode) {
        const parsedCode = JSON.parse(savedCode);
        setReferralCode({
          ...parsedCode,
          createdAt: new Date(parsedCode.createdAt),
          expiresAt: parsedCode.expiresAt ? new Date(parsedCode.expiresAt) : undefined,
        });
      }
    } catch (error) {
      console.error('Error loading referral code:', error);
    }
  };

  const loadReferrals = async () => {
    try {
      const savedReferrals = await AsyncStorage.getItem('user_referrals');
      if (savedReferrals) {
        const parsedReferrals = JSON.parse(savedReferrals).map((referral: any) => ({
          ...referral,
          signupDate: new Date(referral.signupDate),
          firstPurchaseDate: referral.firstPurchaseDate ? new Date(referral.firstPurchaseDate) : undefined,
          rewardClaimedAt: referral.rewardClaimedAt ? new Date(referral.rewardClaimedAt) : undefined,
        }));
        setReferrals(parsedReferrals);
      }
    } catch (error) {
      console.error('Error loading referrals:', error);
    }
  };

  const saveUserPoints = async (points: UserPoints) => {
    try {
      await AsyncStorage.setItem('user_points', JSON.stringify(points));
    } catch (error) {
      console.error('Error saving user points:', error);
    }
  };

  const savePointsTransactions = async (transactions: PointsTransaction[]) => {
    try {
      await AsyncStorage.setItem('points_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving points transactions:', error);
    }
  };

  const saveRedemptions = async (redemptionList: PointsRedemption[]) => {
    try {
      await AsyncStorage.setItem('points_redemptions', JSON.stringify(redemptionList));
    } catch (error) {
      console.error('Error saving redemptions:', error);
    }
  };

  const saveReferrals = async (referralList: Referral[]) => {
    try {
      await AsyncStorage.setItem('user_referrals', JSON.stringify(referralList));
    } catch (error) {
      console.error('Error saving referrals:', error);
    }
  };

  const getCurrentTier = (totalPoints: number): PointsTier => {
    for (let i = pointsTiers.length - 1; i >= 0; i--) {
      if (totalPoints >= pointsTiers[i].minPoints) {
        return pointsTiers[i];
      }
    }
    return pointsTiers[0];
  };

  const earnPoints = async (amount: number, source: PointsTransaction['source'], description: string, metadata?: any): Promise<void> => {
    if (!userPoints) return;

    try {
      // Apply tier multiplier if enabled
      let finalAmount = amount;
      if (pointsSettings.tierBonusEnabled && source === 'purchase') {
        finalAmount = Math.floor(amount * userPoints.currentTier.multiplier);
      }

      // Create transaction
      const transaction: PointsTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUserId,
        type: 'earned',
        amount: finalAmount,
        source,
        description,
        referenceId: metadata?.referenceId,
        metadata,
        status: 'completed',
        expiryDate: new Date(Date.now() + pointsSettings.pointsExpiryDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        processedAt: new Date(),
      };

      // Update user points
      const newTotalPoints = userPoints.totalPoints + finalAmount;
      const newAvailablePoints = userPoints.availablePoints + finalAmount;
      const newLifetimeEarned = userPoints.lifetimeEarned + finalAmount;
      const newCurrentTier = getCurrentTier(newTotalPoints);
      const nextTier = pointsTiers.find(tier => tier.minPoints > newTotalPoints);

      const updatedPoints: UserPoints = {
        ...userPoints,
        totalPoints: newTotalPoints,
        availablePoints: newAvailablePoints,
        lifetimeEarned: newLifetimeEarned,
        currentTier: newCurrentTier,
        nextTierPoints: nextTier ? nextTier.minPoints : newTotalPoints,
        expiringPoints: [
          ...userPoints.expiringPoints,
          {
            amount: finalAmount,
            expiryDate: transaction.expiryDate!
          }
        ],
        lastUpdated: new Date(),
      };

      // Save updates
      setUserPoints(updatedPoints);
      await saveUserPoints(updatedPoints);

      const updatedTransactions = [transaction, ...pointsTransactions];
      setPointsTransactions(updatedTransactions);
      await savePointsTransactions(updatedTransactions);

    } catch (error) {
      console.error('Error earning points:', error);
      throw error;
    }
  };

  const redeemPoints = async (rewardId: string): Promise<PointsRedemption> => {
    if (!userPoints) throw new Error('User points not loaded');

    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward) throw new Error('Reward not found');

    if (userPoints.availablePoints < reward.pointsCost) {
      throw new Error('Insufficient points');
    }

    if (reward.isLimited && reward.remainingQuantity !== undefined && reward.remainingQuantity <= 0) {
      throw new Error('Reward out of stock');
    }

    try {
      // Create redemption
      const redemption: PointsRedemption = {
        id: `redemption_${Date.now()}`,
        userId: currentUserId,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsUsed: reward.pointsCost,
        status: 'approved',
        redemptionCode: `PING${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        expiryDate: new Date(Date.now() + reward.validityDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        redeemedAt: new Date(),
      };

      // Create points transaction for redemption
      const transaction: PointsTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUserId,
        type: 'redeemed',
        amount: -reward.pointsCost,
        source: 'redemption',
        description: `Redeemed: ${reward.name}`,
        referenceId: redemption.id,
        metadata: { rewardId: reward.id },
        status: 'completed',
        createdAt: new Date(),
        processedAt: new Date(),
      };

      // Update user points
      const updatedPoints: UserPoints = {
        ...userPoints,
        availablePoints: userPoints.availablePoints - reward.pointsCost,
        usedPoints: userPoints.usedPoints + reward.pointsCost,
        lastUpdated: new Date(),
      };

      // Update reward quantity if limited
      if (reward.isLimited && reward.remainingQuantity !== undefined) {
        const updatedRewards = availableRewards.map(r =>
          r.id === rewardId
            ? { ...r, remainingQuantity: r.remainingQuantity! - 1 }
            : r
        );
        setAvailableRewards(updatedRewards);
      }

      // Save updates
      setUserPoints(updatedPoints);
      await saveUserPoints(updatedPoints);

      const updatedTransactions = [transaction, ...pointsTransactions];
      setPointsTransactions(updatedTransactions);
      await savePointsTransactions(updatedTransactions);

      const updatedRedemptions = [redemption, ...redemptions];
      setRedemptions(updatedRedemptions);
      await saveRedemptions(updatedRedemptions);

      return redemption;
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  };

  const useRedemption = async (redemptionId: string, orderId?: string): Promise<void> => {
    try {
      const updatedRedemptions = redemptions.map(redemption => {
        if (redemption.id === redemptionId && redemption.status === 'approved') {
          return {
            ...redemption,
            status: 'redeemed' as const,
            usedAt: new Date(),
            metadata: {
              ...redemption.metadata,
              orderId,
            }
          };
        }
        return redemption;
      });

      setRedemptions(updatedRedemptions);
      await saveRedemptions(updatedRedemptions);
    } catch (error) {
      console.error('Error using redemption:', error);
      throw error;
    }
  };

  const generateReferralCode = async (): Promise<ReferralCode> => {
    try {
      const code = `PING${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const shareLink = `https://pingspace.app/join?ref=${code}`;

      const newReferralCode: ReferralCode = {
        id: `ref_${Date.now()}`,
        userId: currentUserId,
        code,
        shareLink,
        isActive: true,
        createdAt: new Date(),
        usageCount: 0,
        description: 'Personal referral code - Earn points for each friend who joins!',
      };

      setReferralCode(newReferralCode);
      await AsyncStorage.setItem('user_referral_code', JSON.stringify(newReferralCode));

      return newReferralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  };

  const shareReferralCode = async (method: 'sms' | 'email' | 'social' | 'copy'): Promise<void> => {
    if (!referralCode) {
      throw new Error('No referral code available');
    }

    const shareContent = {
      title: 'Join PingSpace - Earn Points!',
      message: `Hey! I'm using PingSpace for messaging, shopping, and payments. Join with my referral code ${referralCode.code} and we both earn points! ${referralCode.shareLink}`,
      url: referralCode.shareLink,
    };

    try {
      if (method === 'copy') {
        // In a real app, you'd use Clipboard API
        console.log('Copied to clipboard:', shareContent.message);
      } else {
        await Share.share({
          title: shareContent.title,
          message: shareContent.message,
          url: shareContent.url,
        });
      }

      // Award points for sharing
      await earnPoints(pointsSettings.socialSharePoints, 'social_share', 'Shared referral code');
    } catch (error) {
      console.error('Error sharing referral code:', error);
      throw error;
    }
  };

  const processReferralSignup = async (referralCode: string, newUserId: string): Promise<void> => {
    try {
      // Create referral record
      const referral: Referral = {
        id: `referral_${Date.now()}`,
        referrerId: currentUserId,
        refereeId: newUserId,
        referrerName: 'Current User',
        refereeName: 'New User',
        referralCode,
        status: 'completed',
        signupDate: new Date(),
        isRewardClaimed: true,
        rewardClaimedAt: new Date(),
        rewardAmount: pointsSettings.referralPoints.referrer,
        rewardCurrency: 'POINTS',
      };

      const updatedReferrals = [referral, ...referrals];
      setReferrals(updatedReferrals);
      await saveReferrals(updatedReferrals);

      // Award points to referrer
      await earnPoints(
        pointsSettings.referralPoints.referrer,
        'referral',
        `Referral bonus for inviting ${referral.refereeName}`,
        { referralId: referral.id, referralCode }
      );

      // Update referral code usage count
      if (referralCode) {
        const updatedCode = {
          ...referralCode,
          usageCount: (referralCode.usageCount || 0) + 1,
        };
        setReferralCode(updatedCode);
        await AsyncStorage.setItem('user_referral_code', JSON.stringify(updatedCode));
      }
    } catch (error) {
      console.error('Error processing referral signup:', error);
      throw error;
    }
  };

  const calculateTierProgress = () => {
    if (!userPoints) {
      return { current: pointsTiers[0], next: pointsTiers[1], progress: 0 };
    }

    const currentTier = userPoints.currentTier;
    const nextTier = pointsTiers.find(tier => tier.minPoints > userPoints.totalPoints);

    if (!nextTier) {
      return { current: currentTier, next: null, progress: 100 };
    }

    const progress = ((userPoints.totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    return { current: currentTier, next: nextTier, progress: Math.min(progress, 100) };
  };

  const getExpiringPoints = (days: number): number => {
    if (!userPoints) return 0;

    const cutoffDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return userPoints.expiringPoints
      .filter(ep => ep.expiryDate <= cutoffDate)
      .reduce((sum, ep) => sum + ep.amount, 0);
  };

  const formatPoints = (points: number): string => {
    return points.toLocaleString();
  };

  const refreshData = async (): Promise<void> => {
    await initializePointsSystem();
  };

  const contextValue: PointsContextType = {
    userPoints,
    pointsTransactions,
    availableRewards,
    redemptions,
    pointsTiers,
    pointsSettings,
    referralCode,
    referrals,
    isLoading,
    earnPoints,
    redeemPoints,
    useRedemption,
    generateReferralCode,
    shareReferralCode,
    processReferralSignup,
    calculateTierProgress,
    getExpiringPoints,
    formatPoints,
    refreshData,
  };

  return (
    <PointsContext.Provider value={contextValue}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = (): PointsContextType => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);
