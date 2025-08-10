export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: Date;
  isOnline: boolean;
  lastSeen: Date;
  status?: string;
  joinedDate: Date;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    privacy: {
      showPhone: boolean;
      showEmail: boolean;
      showLastSeen: boolean;
      allowMessages: 'everyone' | 'contacts' | 'nobody';
    };
  };
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId?: string;
  chatId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'file' | 'location' | 'money_transfer' | 'forwarded' | 'poll';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
  replyTo?: string; // Message ID this is replying to
  subThreads?: Message[]; // Sub-threading feature
  isScheduled?: boolean;
  scheduledFor?: Date;
  isAIGenerated?: boolean;
  isEncrypted?: boolean;
  encryptionData?: {
    encryptedContent: string;
    iv: string;
    signature: string;
    keyId: string;
  };
  isDisappearing?: boolean;
  expiresAt?: Date;
  isStarred?: boolean;
  isPinned?: boolean;
  pinnedBy?: string;
  pinnedAt?: Date;
  isEdited?: boolean;
  editedAt?: Date;
  originalText?: string;
  editHistory?: MessageEdit[];
  deliveryReceipts?: {
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    readBy?: string[]; // For group chats
  };
  linkPreviews?: LinkPreview[];
  pollData?: Poll;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number; // For voice messages
    voiceMessage?: {
      id: string;
      uri: string;
      duration: number;
      waveform: number[];
      createdAt: Date;
      size: number;
    };
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    amount?: number;
    note?: string;
    transferType?: 'sent' | 'received';
    forwardedFrom?: {
      originalSenderId: string;
      originalSenderName: string;
      originalTimestamp: Date;
      forwardCount: number;
    };
  };
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'space';
  name?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  description?: string;
  lastSeenBy?: { [userId: string]: Date };
  groupRoles?: { [userId: string]: GroupRole };
  subGroups?: SubGroup[];
  pinnedMessages?: string[]; // Message IDs
  activePolls?: Poll[];
  settings?: {
    allowInvites: boolean;
    isPublic: boolean;
    autoDeleteMessages?: number; // Days
    allowMemberInvites?: boolean;
    allowSubGroups?: boolean;
    allowPolls?: boolean;
    allowMessageEditing?: boolean;
    allowMessagePinning?: boolean;
  };
}

// Link Preview Types
export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  type?: 'website' | 'image' | 'video' | 'audio';
}

// User Presence Types
export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  isTyping?: boolean;
  customStatus?: string;
}

// Message Starring Types
export interface StarredMessage {
  messageId: string;
  chatId: string;
  starredAt: Date;
  starredBy: string;
}

// Group Management Types
export type GroupRole = 'admin' | 'moderator' | 'member';

export interface GroupPermissions {
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canEditGroupInfo: boolean;
  canDeleteMessages: boolean;
  canPinMessages: boolean;
  canCreatePolls: boolean;
  canCreateSubGroups: boolean;
  canManageRoles: boolean;
  canMuteMembers: boolean;
  canBanMembers: boolean;
}

export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: Date;
  invitedBy?: string;
  permissions?: Partial<GroupPermissions>;
  isMuted?: boolean;
  mutedUntil?: Date;
}

// Sub-Groups Types
export interface SubGroup {
  id: string;
  name: string;
  description?: string;
  parentGroupId: string;
  createdBy: string;
  createdAt: Date;
  members: string[];
  isPrivate: boolean;
  topic?: string;
  avatar?: string;
  messageCount: number;
  lastActivity: Date;
}

// Poll Types
export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs who voted for this option
  percentage?: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  isAnonymous: boolean;
  allowMultipleVotes: boolean;
  totalVotes: number;
  isActive: boolean;
  chatId: string;
  messageId?: string;
}

// Message Editing Types
export interface MessageEdit {
  id: string;
  editedAt: Date;
  editedBy: string;
  previousText: string;
  newText: string;
  reason?: string;
}

// Message Pinning Types
export interface PinnedMessage {
  messageId: string;
  chatId: string;
  pinnedBy: string;
  pinnedAt: Date;
  reason?: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  isPublic: boolean;
  memberCount: number;
  channels: Channel[];
  notes: Note[];
  calendar: CalendarEvent[];
  files: SharedFile[];
  goals: Goal[];
  createdBy: string;
  createdAt: Date;
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    allowFileSharing: boolean;
  };
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  spaceId: string;
  type: 'text' | 'voice' | 'announcement';
  isPrivate: boolean;
  members: string[];
  lastActivity: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  spaceId: string;
  isShared: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  spaceId: string;
  createdBy: string;
  attendees: string[];
  location?: string;
  isRecurring: boolean;
}

export interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  spaceId: string;
  uploadedAt: Date;
  tags: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  spaceId: string;
  createdBy: string;
  assignees: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface SmartInboxItem {
  id: string;
  type: 'important' | 'muted' | 'unread' | 'todo';
  chatId: string;
  messageId?: string;
  priority: number; // AI-determined priority score
  reason: string; // Why AI flagged this as important
  timestamp: Date;
}

export interface AIInsight {
  id: string;
  type: 'summary' | 'translation' | 'sentiment' | 'action_item';
  content: string;
  confidence: number;
  relatedMessageId: string;
  timestamp: Date;
}

export interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  parameters?: Record<string, any>;
  timestamp: Date;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  type: 'bot' | 'game' | 'tool' | 'integration';
  icon: string;
  isInstalled: boolean;
  permissions: string[];
  developer: string;
  rating: number;
  downloadCount: number;
}

export interface NavigationTab {
  id: string;
  name: string;
  icon: string;
  route: string;
  badge?: number;
  isActive: boolean;
}

// Marketplace Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  quantity: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  shipping: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDays: number;
    methods: ShippingMethod[];
  };
  specifications?: Record<string, string>;
  tags: string[];
  views: number;
  likes: number;
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'sold' | 'inactive' | 'pending_approval';
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDays: number;
  trackingAvailable: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  addedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: Record<string, string>;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'mobile_money' | 'crypto' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string; // e.g., 'visa', 'mastercard', 'mpesa', 'mtn_money', 'airtel_money'
  name: string;
  icon?: string;
  isDefault: boolean;
  isVerified: boolean;
  details?: {
    last4?: string; // Last 4 digits for cards
    bankName?: string;
    accountType?: string;
    phoneNumber?: string; // For mobile money
    email?: string; // For PayPal
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    walletAddress?: string; // For crypto
  };
  expiryDate?: Date;
  createdAt: Date;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: Date;
  sellerResponse?: {
    comment: string;
    createdAt: Date;
  };
}

export interface Seller {
  id: string;
  userId: string;
  businessName?: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  rating: number;
  totalReviews: number;
  totalSales: number;
  joinedAt: Date;
  location: {
    city: string;
    state: string;
    country: string;
  };
  policies: {
    returnPolicy: string;
    shippingPolicy: string;
    refundPolicy: string;
  };
  isVerified: boolean;
  badges: string[];
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface MarketplaceFilter {
  category?: string;
  subcategory?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  condition?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number; // in miles/km
  };
  shipping?: {
    freeShipping?: boolean;
    maxDays?: number;
  };
  rating?: number;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'newest' | 'rating' | 'distance';
}

// Status Types
export interface StatusPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'image' | 'video' | 'text';
  content: {
    mediaUrl?: string;
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    font?: string;
  };
  caption?: string;
  privacy: 'public' | 'contacts' | 'close_friends' | 'custom';
  allowedViewers?: string[]; // User IDs for custom privacy
  blockedViewers?: string[]; // User IDs blocked from viewing
  reactions: StatusReaction[];
  views: StatusView[];
  createdAt: Date;
  expiresAt: Date; // 24 hours from creation
  isActive: boolean;
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  music?: {
    title: string;
    artist: string;
    url?: string;
  };
}

export interface StatusReaction {
  id: string;
  statusId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | 'fire' | 'heart_eyes';
  emoji: string;
  createdAt: Date;
}

export interface StatusView {
  id: string;
  statusId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  viewedAt: Date;
  viewDuration?: number; // in milliseconds
}

export interface StatusRing {
  userId: string;
  userName: string;
  userAvatar?: string;
  hasUnseenStatus: boolean;
  lastStatusTime: Date;
  statusCount: number;
  isMyStatus: boolean;
  ringColor: string; // Color of the status ring
}

export interface StatusUploadData {
  type: 'image' | 'video' | 'text';
  mediaUri?: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  font?: string;
  caption?: string;
  privacy: 'public' | 'contacts' | 'close_friends' | 'custom';
  allowedViewers?: string[];
  blockedViewers?: string[];
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  music?: {
    title: string;
    artist: string;
    url?: string;
  };
}

export interface StatusSettings {
  autoSaveToGallery: boolean;
  allowReplies: boolean;
  showViewers: boolean;
  allowForwarding: boolean;
  defaultPrivacy: 'public' | 'contacts' | 'close_friends';
  muteStatusFrom: string[]; // User IDs
  closeFreindsList: string[]; // User IDs for close friends
}

// Wallet and Payment Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  dailyLimit: number;
  monthlyLimit: number;
  isVerified: boolean;
  pin?: string; // Encrypted wallet PIN
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  category: 'top_up' | 'payment' | 'request' | 'transfer' | 'refund' | 'fee';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  fromUserId?: string;
  toUserId?: string;
  fromUserName?: string;
  toUserName?: string;
  reference: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

export interface PaymentRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  fromUserAvatar?: string;
  toUserAvatar?: string;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  dueDate?: Date;
  createdAt: Date;
  respondedAt?: Date;
  transactionId?: string;
  note?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
}



export interface TopUpOption {
  id: string;
  amount: number;
  currency: string;
  bonus?: number; // Bonus amount for top-up
  description?: string;
  isPopular?: boolean;
  paymentMethods: PaymentMethod['type'][];
}

export interface PaymentSettings {
  requirePinForPayments: boolean;
  requirePinForTopUp: boolean;
  dailySpendingLimit: number;
  monthlySpendingLimit: number;
  allowPaymentRequests: boolean;
  autoAcceptFromContacts: boolean;
  notifyOnPayments: boolean;
  notifyOnRequests: boolean;
  defaultCurrency: string;
  preferredPaymentMethod?: string;
}

export interface MobileMoneyProvider {
  id: string;
  name: string;
  code: string; // e.g., 'MPESA', 'MTN', 'AIRTEL'
  country: string;
  currency: string;
  logo: string;
  isActive: boolean;
  fees: {
    topUp: number; // Percentage or fixed amount
    withdrawal: number;
    transfer: number;
  };
  limits: {
    minTopUp: number;
    maxTopUp: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
}

export interface PaymentNotification {
  id: string;
  userId: string;
  type: 'payment_received' | 'payment_sent' | 'request_received' | 'request_accepted' | 'top_up_completed';
  title: string;
  message: string;
  amount?: number;
  currency?: string;
  fromUser?: string;
  toUser?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Donation and Referral Types
export interface Donation {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'transaction_fee' | 'voluntary' | 'referral_bonus';
  source: 'purchase' | 'sale' | 'manual' | 'referral';
  transactionId?: string;
  referralId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  metadata?: {
    originalAmount?: number;
    feePercentage?: number;
    productId?: string;
    sellerId?: string;
    buyerId?: string;
  };
}

export interface DonationSettings {
  isEnabled: boolean;
  feePercentage: number; // Default 2.5%
  minimumFee: number; // Minimum $0.10
  maximumFee: number; // Maximum $5.00
  showDonationHistory: boolean;
  allowVoluntaryDonations: boolean;
  notifyOnDonations: boolean;
  monthlyDonationCap?: number;
}

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  shareLink: string;
  qrCodeUrl?: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
  usageCount: number;
  maxUsage?: number;
  description?: string;
}

export interface ReferralReward {
  id: string;
  type: 'referrer' | 'referee';
  amount: number;
  currency: string;
  description: string;
  isActive: boolean;
  minimumPurchase?: number;
  validityDays?: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  referrerName: string;
  refereeName: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'rewarded' | 'expired';
  signupDate: Date;
  firstPurchaseDate?: Date;
  rewardAmount?: number;
  rewardCurrency?: string;
  isRewardClaimed: boolean;
  rewardClaimedAt?: Date;
  metadata?: {
    signupSource?: string;
    firstPurchaseAmount?: number;
    totalPurchases?: number;
  };
}

export interface AppSupport {
  totalDonationsReceived: number;
  totalDonors: number;
  thisMonthDonations: number;
  averageDonation: number;
  topDonors: {
    userId: string;
    userName: string;
    totalDonated: number;
    rank: number;
  }[];
  developmentGoals: {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    isCompleted: boolean;
    deadline?: Date;
  }[];
}

export interface ShareContent {
  title: string;
  message: string;
  url: string;
  imageUrl?: string;
  hashtags?: string[];
}

// Typing Indicator Types
export interface TypingUser {
  userId: string;
  userName: string;
  chatId: string;
  timestamp: Date;
}

export interface TypingIndicatorState {
  [chatId: string]: TypingUser[];
}

// Device Management Types
export interface LinkedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'web' | 'desktop' | 'tablet';
  platform: string;
  lastActive: Date;
  isCurrentDevice: boolean;
  location?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  linkedAt: Date;
  lastSyncAt?: Date;
}

export interface DeviceLinkRequest {
  code: string;
  deviceInfo: {
    name: string;
    type: string;
    platform: string;
    userAgent?: string;
    fingerprint: string;
  };
  location?: {
    city: string;
    country: string;
    ip: string;
  };
}

export interface DeviceSession {
  id: string;
  deviceId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
  lastActivityAt: Date;
  createdAt: Date;
}

// Security & Encryption Types
export interface EncryptionKeys {
  publicKey: string;
  privateKey: string;
  sharedSecret?: string;
}

export interface EncryptedMessage {
  encryptedContent: string;
  iv: string;
  signature: string;
  timestamp: number;
  keyId: string;
}

export interface SecuritySettings {
  encryptionEnabled: boolean;
  disappearingMessagesEnabled: boolean;
  screenshotDetectionEnabled: boolean;
  screenshotPreventionEnabled: boolean;
  keyVerificationRequired: boolean;
}

// Call & Video Types
export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'failed';

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export interface CallSession {
  id: string;
  type: CallType;
  status: CallStatus;
  participants: CallParticipant[];
  initiator: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  isRecording: boolean;
  recordingPath?: string;
  chatId?: string;
  isGroupCall: boolean;
  transcription?: string;
}

export interface CallSettings {
  autoAnswer: boolean;
  videoQuality: 'low' | 'medium' | 'high';
  audioQuality: 'low' | 'medium' | 'high';
  enableNoiseCancellation: boolean;
  enableEchoCancellation: boolean;
  defaultCamera: 'front' | 'back';
  enableCallRecording: boolean;
  enableScreenSharing: boolean;
  enableTranscription: boolean;
}

export interface CallHistory {
  id: string;
  type: CallType;
  participants: string[];
  duration: number;
  timestamp: Date;
  status: 'completed' | 'missed' | 'declined';
  recordingPath?: string;
  transcription?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  thisMonthReferrals: number;
  conversionRate: number;
  topReferralMethods: {
    method: string;
    count: number;
    successRate: number;
  }[];
}
