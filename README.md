# PingSpace - Messaging meets intelligent flow

A modern React Native messaging app built with Expo, featuring AI-powered smart inbox, collaborative spaces, and innovative UI/UX design.

## 🚀 Features

### Core Innovations
- **Bottom Tab Navigation** - Clean and intuitive tab-based navigation
- **Smart Inbox** - AI-prioritized messages with intelligent categorization
- **Message Rooms** - Group chats with sub-threading and topic organization
- **Built-in Productivity Tools** - Reminders, polls, file sharing, and task management
- **Mood Themes** - Dynamic themes that adapt to time, weather, or user preference
- **Voice-first Interface** - Voice commands for hands-free operation
- **Pin Dashboard** - Quick access to important notes, files, and chats

### Main Sections
1. **Chat** 💬 - Enhanced messaging with reactions, voice notes, and smart tools
2. **Spaces** 🧩 - Team collaboration with channels, notes, calendar, and goals
3. **Smart Inbox** 🧠 - AI-powered message prioritization and organization
4. **Marketplace** 🛒 - Buy and sell products with integrated payment system
5. **Discover** 🔍 - Find public spaces, extensions, and nearby friends
6. **Profile** 👤 - Theme customization, settings, and account management

### 🛒 **Marketplace Features**

#### **Product Management**
- **Product Browsing**: Browse products by categories with advanced search and filters
- **Product Details**: High-quality images, detailed descriptions, seller information
- **Categories**: Electronics, Fashion, Home & Garden, Sports, Books, Automotive
- **Condition Tracking**: New, Like New, Good, Fair, Poor condition options

#### **Shopping Experience**
- **Shopping Cart**: Add products with quantity management and option selection
- **Wishlist**: Save products for later purchase
- **Product Reviews**: Read and write reviews with ratings and photos
- **Price Tracking**: Monitor price changes and get alerts

#### **Payment & Checkout**
- **Multiple Payment Methods**: Credit/Debit cards, PayPal, Apple Pay, Google Pay, Bank Transfer, Crypto
- **Secure Processing**: Encrypted payment processing with fraud protection
- **Order Summary**: Detailed breakdown of costs including tax and shipping
- **Address Management**: Multiple shipping and billing addresses

#### **Order Management**
- **Order Tracking**: Real-time tracking from purchase to delivery
- **Order History**: Complete purchase history with reorder options
- **Status Updates**: Notifications for order status changes
- **Return/Refund**: Easy return process with refund tracking

#### **Seller Dashboard**
- **Product Listings**: Add, edit, and manage product inventory
- **Sales Analytics**: Revenue tracking, order statistics, performance metrics
- **Order Management**: Process orders, update shipping, handle customer inquiries
- **Seller Profile**: Business information, policies, and customer reviews

## 🛠 Tech Stack

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Vector Icons** for iconography
- **React Native Reanimated** for smooth animations
- **AsyncStorage** for local data persistence

## 📱 Design System

- **Primary Color**: Midnight Blue (#1E2A38)
- **Accent Color**: Aqua Blue (#00D1FF)
- **Typography**: Inter font family
- **Dark Mode Default** with light mode support
- **Rounded UI** with soft shadows and subtle animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PingSpace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

### Demo Login
Use any email and password (minimum 6 characters) to login to the demo app.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── chat/           # Chat-specific components
│   └── navigation/     # Navigation components
├── contexts/           # React contexts for state management
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   └── ...            # Main app screens
├── theme/             # Theme configuration and styling
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🎨 Key Components

### Chat Features
- **Message Bubbles** with reactions and sub-threading
- **Smart Input** with AI assistance, voice recording, and scheduling
- **Chat List** with search, filtering, and priority indicators

### Smart Inbox
- **AI Prioritization** with confidence scores and reasoning
- **Category Filtering** (Important, Muted, Unread, To-Do)
- **Action Items** with task conversion capabilities

### Spaces Collaboration
- **Channels** for organized team communication
- **Shared Notes** with tagging and collaboration
- **Goals Tracking** with progress indicators
- **File Sharing** and calendar integration

### Theme System
- **Mood-based Themes** that change accent colors
- **Dynamic Theming** with real-time updates
- **Persistent Preferences** saved locally

## 🔮 Advanced Features (Planned)

- **Voice Commands** - "Hey PingSpace, send message to Alice"
- **Message Translation** - Real-time translation on hover/tap
- **Scheduled Messages** - Send messages at specific times
- **Audio Rooms** - Voice chat integration
- **Message Expiry** - Burn-after-read functionality
- **AI Insights** - Weekly conversation summaries and analytics

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📦 Building

```bash
# Build for production
npm run build

# Build for specific platform
npm run build:ios
npm run build:android
```

## 🎨 Design System

### Typography
- **Primary Font**: **Poppins** - Modern, geometric sans-serif font
  - `Poppins-Regular` (400) - Body text and regular content
  - `Poppins-Medium` (500) - Slightly emphasized text
  - `Poppins-SemiBold` (600) - Headings and important labels
  - `Poppins-Bold` (700) - Titles and strong emphasis

### Font Sizes
- **xs**: 12px - Small labels, captions
- **sm**: 14px - Secondary text, descriptions
- **base**: 16px - Body text, default size
- **lg**: 18px - Section headings
- **xl**: 20px - Large headings
- **2xl**: 24px - Page titles
- **3xl**: 30px - Hero text

### Theme Support
- **Light Mode** (Day Mode) - Clean, bright interface
- **Dark Mode** (Night Mode) - Easy on the eyes for low-light usage
- **Dynamic Theme Switching** - Seamless transition between modes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern messaging platforms with a focus on productivity
- Built with love using React Native and Expo
- Icons provided by Expo Vector Icons
- Design system inspired by Material Design and iOS Human Interface Guidelines

---

**PingSpace** - Where messaging meets intelligent flow. 🚀
