import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Wallet,
  Transaction,
  PaymentRequest,
  PaymentMethod,
  TopUpOption,
  PaymentSettings,
  MobileMoneyProvider
} from '../types';

export interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  paymentRequests: PaymentRequest[];
  paymentMethods: PaymentMethod[];
  topUpOptions: TopUpOption[];
  mobileMoneyProviders: MobileMoneyProvider[];
  paymentSettings: PaymentSettings;
  isLoading: boolean;

  // Wallet operations
  loadWallet: () => Promise<void>;
  topUpWallet: (amount: number, paymentMethodId: string) => Promise<void>;

  // Payment operations
  sendPayment: (toUserId: string, amount: number, description: string) => Promise<void>;
  requestPayment: (fromUserId: string, amount: number, description: string) => Promise<void>;
  respondToPaymentRequest: (requestId: string, action: 'accept' | 'decline') => Promise<void>;

  // Marketplace operations
  processMarketplacePurchase: (sellerId: string, amount: number, productId: string, description: string) => Promise<void>;
  processMarketplaceSale: (buyerId: string, amount: number, productId: string, description: string) => Promise<void>;

  // Payment methods
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;

  // Settings
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => Promise<void>;

  // Utilities
  formatCurrency: (amount: number, currency?: string) => string;
  refreshData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    requirePinForPayments: true,
    requirePinForTopUp: false,
    dailySpendingLimit: 1000,
    monthlySpendingLimit: 10000,
    allowPaymentRequests: true,
    autoAcceptFromContacts: false,
    notifyOnPayments: true,
    notifyOnRequests: true,
    defaultCurrency: 'USD',
  });

  // Mock current user ID
  const currentUserId = 'current_user';

  // Top-up options
  const topUpOptions: TopUpOption[] = [
    { id: '1', amount: 10, currency: 'USD', paymentMethods: ['card', 'mobile_money'] },
    { id: '2', amount: 25, currency: 'USD', bonus: 2, description: '+$2 bonus', paymentMethods: ['card', 'mobile_money'] },
    { id: '3', amount: 50, currency: 'USD', bonus: 5, description: '+$5 bonus', isPopular: true, paymentMethods: ['card', 'mobile_money', 'bank_account'] },
    { id: '4', amount: 100, currency: 'USD', bonus: 15, description: '+$15 bonus', paymentMethods: ['card', 'mobile_money', 'bank_account'] },
    { id: '5', amount: 200, currency: 'USD', bonus: 35, description: '+$35 bonus', paymentMethods: ['card', 'mobile_money', 'bank_account'] },
  ];

  // Mobile money providers
  const mobileMoneyProviders: MobileMoneyProvider[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      code: 'MPESA',
      country: 'Kenya',
      currency: 'KES',
      logo: 'https://via.placeholder.com/40x40',
      isActive: true,
      fees: { topUp: 0, withdrawal: 1.5, transfer: 1 },
      limits: { minTopUp: 10, maxTopUp: 70000, dailyLimit: 150000, monthlyLimit: 300000 }
    },
    {
      id: 'mtn_money',
      name: 'MTN Mobile Money',
      code: 'MTN',
      country: 'Uganda',
      currency: 'UGX',
      logo: 'https://via.placeholder.com/40x40',
      isActive: true,
      fees: { topUp: 0.5, withdrawal: 2, transfer: 1.5 },
      limits: { minTopUp: 500, maxTopUp: 2000000, dailyLimit: 5000000, monthlyLimit: 20000000 }
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      code: 'AIRTEL',
      country: 'Tanzania',
      currency: 'TZS',
      logo: 'https://via.placeholder.com/40x40',
      isActive: true,
      fees: { topUp: 0, withdrawal: 1.8, transfer: 1.2 },
      limits: { minTopUp: 1000, maxTopUp: 1500000, dailyLimit: 3000000, monthlyLimit: 15000000 }
    },
  ];

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    setIsLoading(true);
    try {
      await loadWallet();
      await loadTransactions();
      await loadPaymentRequests();
      await loadPaymentMethods();
      await loadPaymentSettings();
    } catch (error) {
      console.error('Error initializing wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      const savedWallet = await AsyncStorage.getItem('user_wallet');
      if (savedWallet) {
        const parsedWallet = JSON.parse(savedWallet);
        setWallet({
          ...parsedWallet,
          createdAt: new Date(parsedWallet.createdAt),
          updatedAt: new Date(parsedWallet.updatedAt),
        });
      } else {
        // Create default wallet
        const newWallet: Wallet = {
          id: `wallet_${currentUserId}`,
          userId: currentUserId,
          balance: 0,
          currency: 'USD',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          dailyLimit: 1000,
          monthlyLimit: 10000,
          isVerified: false,
        };
        setWallet(newWallet);
        await AsyncStorage.setItem('user_wallet', JSON.stringify(newWallet));
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('wallet_transactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          completedAt: tx.completedAt ? new Date(tx.completedAt) : undefined,
        }));
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadPaymentRequests = async () => {
    try {
      const savedRequests = await AsyncStorage.getItem('payment_requests');
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests).map((req: any) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          respondedAt: req.respondedAt ? new Date(req.respondedAt) : undefined,
          dueDate: req.dueDate ? new Date(req.dueDate) : undefined,
        }));
        setPaymentRequests(parsedRequests);
      }
    } catch (error) {
      console.error('Error loading payment requests:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const savedMethods = await AsyncStorage.getItem('payment_methods');
      if (savedMethods) {
        const parsedMethods = JSON.parse(savedMethods).map((method: any) => ({
          ...method,
          createdAt: new Date(method.createdAt),
          expiryDate: method.expiryDate ? new Date(method.expiryDate) : undefined,
        }));
        setPaymentMethods(parsedMethods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadPaymentSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('payment_settings');
      if (savedSettings) {
        setPaymentSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const saveWallet = async (walletData: Wallet) => {
    try {
      await AsyncStorage.setItem('user_wallet', JSON.stringify(walletData));
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  const saveTransactions = async (transactionData: Transaction[]) => {
    try {
      await AsyncStorage.setItem('wallet_transactions', JSON.stringify(transactionData));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const savePaymentRequests = async (requestData: PaymentRequest[]) => {
    try {
      await AsyncStorage.setItem('payment_requests', JSON.stringify(requestData));
    } catch (error) {
      console.error('Error saving payment requests:', error);
    }
  };

  const savePaymentMethods = async (methodData: PaymentMethod[]) => {
    try {
      await AsyncStorage.setItem('payment_methods', JSON.stringify(methodData));
    } catch (error) {
      console.error('Error saving payment methods:', error);
    }
  };

  const topUpWallet = async (amount: number, paymentMethodId: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not found');
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        walletId: wallet.id,
        type: 'credit',
        category: 'top_up',
        amount,
        currency: wallet.currency,
        description: `Wallet top-up via ${paymentMethodId}`,
        status: 'completed',
        reference: `REF${Date.now()}`,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance + amount,
        updatedAt: new Date(),
      };

      const updatedTransactions = [transaction, ...transactions];

      setWallet(updatedWallet);
      setTransactions(updatedTransactions);
      
      await saveWallet(updatedWallet);
      await saveTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error topping up wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPayment = async (toUserId: string, amount: number, description: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        walletId: wallet.id,
        type: 'debit',
        category: 'payment',
        amount,
        currency: wallet.currency,
        description,
        status: 'completed',
        fromUserId: currentUserId,
        toUserId,
        toUserName: 'Contact User', // In real app, fetch from contacts
        reference: `PAY${Date.now()}`,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date(),
      };

      const updatedTransactions = [transaction, ...transactions];

      setWallet(updatedWallet);
      setTransactions(updatedTransactions);
      
      await saveWallet(updatedWallet);
      await saveTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPayment = async (fromUserId: string, amount: number, description: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const request: PaymentRequest = {
        id: `req_${Date.now()}`,
        fromUserId: currentUserId,
        toUserId: fromUserId,
        fromUserName: 'You',
        toUserName: 'Contact User', // In real app, fetch from contacts
        amount,
        currency: wallet?.currency || 'USD',
        description,
        status: 'pending',
        createdAt: new Date(),
      };

      const updatedRequests = [request, ...paymentRequests];
      setPaymentRequests(updatedRequests);
      await savePaymentRequests(updatedRequests);
    } catch (error) {
      console.error('Error requesting payment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const respondToPaymentRequest = async (requestId: string, action: 'accept' | 'decline'): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequests = paymentRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: action === 'accept' ? 'accepted' : 'declined' as any,
            respondedAt: new Date(),
          };
        }
        return req;
      });

      setPaymentRequests(updatedRequests);
      await savePaymentRequests(updatedRequests);

      // If accepted, process the payment
      if (action === 'accept') {
        const request = paymentRequests.find(req => req.id === requestId);
        if (request && wallet) {
          await sendPayment(request.fromUserId, request.amount, request.description);
        }
      }
    } catch (error) {
      console.error('Error responding to payment request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<void> => {
    try {
      const newMethod: PaymentMethod = {
        ...method,
        id: `pm_${Date.now()}`,
        createdAt: new Date(),
      };

      const updatedMethods = [...paymentMethods, newMethod];
      setPaymentMethods(updatedMethods);
      await savePaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };

  const removePaymentMethod = async (methodId: string): Promise<void> => {
    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
      setPaymentMethods(updatedMethods);
      await savePaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  };

  const setDefaultPaymentMethod = async (methodId: string): Promise<void> => {
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }));
      setPaymentMethods(updatedMethods);
      await savePaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  };

  const updatePaymentSettings = async (settings: Partial<PaymentSettings>): Promise<void> => {
    try {
      const updatedSettings = { ...paymentSettings, ...settings };
      setPaymentSettings(updatedSettings);
      await AsyncStorage.setItem('payment_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating payment settings:', error);
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

  const processMarketplacePurchase = async (sellerId: string, amount: number, productId: string, description: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not found');

    // Calculate donation fee (2.5% of transaction)
    const donationFee = Math.min(Math.max((amount * 2.5) / 100, 0.10), 5.00);
    const totalAmount = amount + donationFee;

    if (wallet.balance < totalAmount) throw new Error('Insufficient balance');

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create purchase transaction
      const purchaseTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        walletId: wallet.id,
        type: 'debit',
        category: 'payment',
        amount: totalAmount,
        currency: wallet.currency,
        description: `${description} (includes $${donationFee.toFixed(2)} app support)`,
        status: 'completed',
        fromUserId: wallet.userId,
        toUserId: sellerId,
        toUserName: 'Seller',
        reference: `PURCHASE${Date.now()}`,
        metadata: {
          productId,
          originalAmount: amount,
          donationFee,
          transactionType: 'marketplace_purchase',
        },
        createdAt: new Date(),
        completedAt: new Date(),
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance - totalAmount,
        updatedAt: new Date(),
      };

      const updatedTransactions = [purchaseTransaction, ...transactions];

      setWallet(updatedWallet);
      setTransactions(updatedTransactions);

      await saveWallet(updatedWallet);
      await saveTransactions(updatedTransactions);

      // Award points for purchase (this will be handled by the component using this context)
      // Points are awarded based on the original purchase amount (excluding donation fee)
      console.log(`Marketplace purchase: $${amount} + $${donationFee} donation`);
      console.log(`Points should be awarded: ${Math.floor(amount)} points for $${amount} purchase`);
    } catch (error) {
      console.error('Error processing marketplace purchase:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const processMarketplaceSale = async (buyerId: string, amount: number, productId: string, description: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not found');

    // Calculate donation fee (2.5% of transaction)
    const donationFee = Math.min(Math.max((amount * 2.5) / 100, 0.10), 5.00);
    const netAmount = amount - donationFee;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create sale transaction
      const saleTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        walletId: wallet.id,
        type: 'credit',
        category: 'payment',
        amount: netAmount,
        currency: wallet.currency,
        description: `${description} (after $${donationFee.toFixed(2)} app support fee)`,
        status: 'completed',
        fromUserId: buyerId,
        toUserId: wallet.userId,
        fromUserName: 'Buyer',
        reference: `SALE${Date.now()}`,
        metadata: {
          productId,
          originalAmount: amount,
          donationFee,
          transactionType: 'marketplace_sale',
        },
        createdAt: new Date(),
        completedAt: new Date(),
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance + netAmount,
        updatedAt: new Date(),
      };

      const updatedTransactions = [saleTransaction, ...transactions];

      setWallet(updatedWallet);
      setTransactions(updatedTransactions);

      await saveWallet(updatedWallet);
      await saveTransactions(updatedTransactions);

      console.log(`Marketplace sale: $${amount} - $${donationFee} donation = $${netAmount} received`);
    } catch (error) {
      console.error('Error processing marketplace sale:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async (): Promise<void> => {
    await initializeWallet();
  };

  const contextValue: WalletContextType = {
    wallet,
    transactions,
    paymentRequests,
    paymentMethods,
    topUpOptions,
    mobileMoneyProviders,
    paymentSettings,
    isLoading,
    loadWallet,
    topUpWallet,
    sendPayment,
    requestPayment,
    respondToPaymentRequest,
    processMarketplacePurchase,
    processMarketplaceSale,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentSettings,
    formatCurrency,
    refreshData,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
