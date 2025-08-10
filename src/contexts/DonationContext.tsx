import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Donation, 
  DonationSettings, 
  ReferralCode, 
  Referral, 
  ReferralReward,
  AppSupport,
  ShareContent,
  ReferralStats
} from '../types';

export interface DonationContextType {
  donations: Donation[];
  donationSettings: DonationSettings;
  referralCode: ReferralCode | null;
  referrals: Referral[];
  referralStats: ReferralStats;
  appSupport: AppSupport;
  isLoading: boolean;
  
  // Donation operations
  calculateTransactionFee: (amount: number) => number;
  processDonation: (amount: number, type: Donation['type'], source: Donation['source'], metadata?: any) => Promise<void>;
  makeVoluntaryDonation: (amount: number) => Promise<void>;
  
  // Referral operations
  generateReferralCode: () => Promise<ReferralCode>;
  shareReferralLink: (method: 'sms' | 'email' | 'social' | 'copy') => Promise<ShareContent>;
  trackReferral: (referralCode: string, newUserId: string) => Promise<void>;
  claimReferralReward: (referralId: string) => Promise<void>;
  
  // Settings
  updateDonationSettings: (settings: Partial<DonationSettings>) => Promise<void>;
  
  // Utilities
  formatCurrency: (amount: number, currency?: string) => string;
  refreshData: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

interface DonationProviderProps {
  children: ReactNode;
}

export const DonationProvider: React.FC<DonationProviderProps> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [donationSettings, setDonationSettings] = useState<DonationSettings>({
    isEnabled: true,
    feePercentage: 2.5, // 2.5% fee
    minimumFee: 0.10,
    maximumFee: 5.00,
    showDonationHistory: true,
    allowVoluntaryDonations: true,
    notifyOnDonations: true,
    monthlyDonationCap: 50.00,
  });

  // Mock current user ID
  const currentUserId = 'current_user';

  // Mock referral rewards
  const referralRewards: ReferralReward[] = [
    {
      id: 'referrer_reward',
      type: 'referrer',
      amount: 5.00,
      currency: 'USD',
      description: '$5 for each successful referral',
      isActive: true,
      minimumPurchase: 10.00,
      validityDays: 30,
    },
    {
      id: 'referee_reward',
      type: 'referee',
      amount: 3.00,
      currency: 'USD',
      description: '$3 welcome bonus for new users',
      isActive: true,
      minimumPurchase: 10.00,
      validityDays: 7,
    },
  ];

  // Mock app support data
  const appSupport: AppSupport = {
    totalDonationsReceived: 12450.75,
    totalDonors: 1247,
    thisMonthDonations: 2340.50,
    averageDonation: 1.85,
    topDonors: [
      { userId: 'user1', userName: 'Alice Johnson', totalDonated: 125.50, rank: 1 },
      { userId: 'user2', userName: 'Bob Smith', totalDonated: 98.25, rank: 2 },
      { userId: 'user3', userName: 'Carol Davis', totalDonated: 87.75, rank: 3 },
    ],
    developmentGoals: [
      {
        id: 'goal1',
        title: 'Enhanced Security Features',
        description: 'Implement advanced encryption and security measures',
        targetAmount: 5000,
        currentAmount: 3250,
        isCompleted: false,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        id: 'goal2',
        title: 'AI-Powered Chat Features',
        description: 'Add intelligent chat suggestions and translations',
        targetAmount: 8000,
        currentAmount: 1200,
        isCompleted: false,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    ],
  };

  // Calculate referral stats
  const referralStats: ReferralStats = {
    totalReferrals: referrals.length,
    successfulReferrals: referrals.filter(r => r.status === 'completed').length,
    totalRewardsEarned: referrals.filter(r => r.isRewardClaimed).reduce((sum, r) => sum + (r.rewardAmount || 0), 0),
    pendingRewards: referrals.filter(r => r.status === 'completed' && !r.isRewardClaimed).length,
    thisMonthReferrals: referrals.filter(r => {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      return r.signupDate >= thisMonth;
    }).length,
    conversionRate: referrals.length > 0 ? (referrals.filter(r => r.status === 'completed').length / referrals.length) * 100 : 0,
    topReferralMethods: [
      { method: 'WhatsApp', count: 15, successRate: 85 },
      { method: 'SMS', count: 12, successRate: 75 },
      { method: 'Social Media', count: 8, successRate: 60 },
    ],
  };

  useEffect(() => {
    initializeDonationSystem();
  }, []);

  const initializeDonationSystem = async () => {
    setIsLoading(true);
    try {
      await loadDonations();
      await loadReferrals();
      await loadReferralCode();
      await loadDonationSettings();
    } catch (error) {
      console.error('Error initializing donation system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      const savedDonations = await AsyncStorage.getItem('user_donations');
      if (savedDonations) {
        const parsedDonations = JSON.parse(savedDonations).map((donation: any) => ({
          ...donation,
          createdAt: new Date(donation.createdAt),
          completedAt: donation.completedAt ? new Date(donation.completedAt) : undefined,
        }));
        setDonations(parsedDonations);
      }
    } catch (error) {
      console.error('Error loading donations:', error);
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

  const loadDonationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('donation_settings');
      if (savedSettings) {
        setDonationSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading donation settings:', error);
    }
  };

  const saveDonations = async (donationData: Donation[]) => {
    try {
      await AsyncStorage.setItem('user_donations', JSON.stringify(donationData));
    } catch (error) {
      console.error('Error saving donations:', error);
    }
  };

  const saveReferrals = async (referralData: Referral[]) => {
    try {
      await AsyncStorage.setItem('user_referrals', JSON.stringify(referralData));
    } catch (error) {
      console.error('Error saving referrals:', error);
    }
  };

  const calculateTransactionFee = (amount: number): number => {
    if (!donationSettings.isEnabled) return 0;
    
    const feeAmount = (amount * donationSettings.feePercentage) / 100;
    return Math.min(Math.max(feeAmount, donationSettings.minimumFee), donationSettings.maximumFee);
  };

  const processDonation = async (
    amount: number, 
    type: Donation['type'], 
    source: Donation['source'], 
    metadata?: any
  ): Promise<void> => {
    if (!donationSettings.isEnabled && type === 'transaction_fee') return;
    
    setIsLoading(true);
    try {
      const donation: Donation = {
        id: `donation_${Date.now()}`,
        userId: currentUserId,
        amount,
        currency: 'USD',
        type,
        source,
        transactionId: metadata?.transactionId,
        referralId: metadata?.referralId,
        description: `${type.replace('_', ' ')} donation from ${source}`,
        status: 'completed',
        createdAt: new Date(),
        completedAt: new Date(),
        metadata,
      };

      const updatedDonations = [donation, ...donations];
      setDonations(updatedDonations);
      await saveDonations(updatedDonations);
      
      console.log(`Donation processed: $${amount} from ${source}`);
    } catch (error) {
      console.error('Error processing donation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeVoluntaryDonation = async (amount: number): Promise<void> => {
    await processDonation(amount, 'voluntary', 'manual', {
      originalAmount: amount,
      isVoluntary: true,
    });
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
        description: 'Personal referral code',
      };

      setReferralCode(newReferralCode);
      await AsyncStorage.setItem('user_referral_code', JSON.stringify(newReferralCode));
      
      return newReferralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  };

  const shareReferralLink = async (method: 'sms' | 'email' | 'social' | 'copy'): Promise<ShareContent> => {
    if (!referralCode) {
      throw new Error('No referral code available');
    }

    const shareContent: ShareContent = {
      title: 'Join PingSpace - Get $3 Welcome Bonus!',
      message: `Hey! I'm using PingSpace for messaging, shopping, and payments. Join with my referral code ${referralCode.code} and get $3 welcome bonus! ${referralCode.shareLink}`,
      url: referralCode.shareLink,
      hashtags: ['PingSpace', 'Messaging', 'Shopping', 'Payments'],
    };

    return shareContent;
  };

  const trackReferral = async (referralCode: string, newUserId: string): Promise<void> => {
    try {
      const referral: Referral = {
        id: `referral_${Date.now()}`,
        referrerId: currentUserId,
        refereeId: newUserId,
        referrerName: 'Current User',
        refereeName: 'New User',
        referralCode,
        status: 'pending',
        signupDate: new Date(),
        isRewardClaimed: false,
      };

      const updatedReferrals = [referral, ...referrals];
      setReferrals(updatedReferrals);
      await saveReferrals(updatedReferrals);
    } catch (error) {
      console.error('Error tracking referral:', error);
      throw error;
    }
  };

  const claimReferralReward = async (referralId: string): Promise<void> => {
    try {
      const updatedReferrals = referrals.map(referral => {
        if (referral.id === referralId && referral.status === 'completed' && !referral.isRewardClaimed) {
          return {
            ...referral,
            isRewardClaimed: true,
            rewardClaimedAt: new Date(),
            rewardAmount: 5.00,
            rewardCurrency: 'USD',
          };
        }
        return referral;
      });

      setReferrals(updatedReferrals);
      await saveReferrals(updatedReferrals);
    } catch (error) {
      console.error('Error claiming referral reward:', error);
      throw error;
    }
  };

  const updateDonationSettings = async (settings: Partial<DonationSettings>): Promise<void> => {
    try {
      const updatedSettings = { ...donationSettings, ...settings };
      setDonationSettings(updatedSettings);
      await AsyncStorage.setItem('donation_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating donation settings:', error);
      throw error;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const refreshData = async (): Promise<void> => {
    await initializeDonationSystem();
  };

  const contextValue: DonationContextType = {
    donations,
    donationSettings,
    referralCode,
    referrals,
    referralStats,
    appSupport,
    isLoading,
    calculateTransactionFee,
    processDonation,
    makeVoluntaryDonation,
    generateReferralCode,
    shareReferralLink,
    trackReferral,
    claimReferralReward,
    updateDonationSettings,
    formatCurrency,
    refreshData,
  };

  return (
    <DonationContext.Provider value={contextValue}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = (): DonationContextType => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};
