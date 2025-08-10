import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Product, Order } from '../../types';
import { Button } from '../../components/ui/Button';

const SellerDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview');

  // Mock seller data
  const sellerStats = {
    totalSales: 15420.50,
    totalOrders: 89,
    activeProducts: 12,
    rating: 4.8,
    totalReviews: 156,
    thisMonthSales: 3240.75,
    thisMonthOrders: 18,
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with advanced camera system',
      price: 1199,
      currency: 'USD',
      images: ['https://via.placeholder.com/100x100'],
      category: { id: 'electronics', name: 'Electronics', icon: 'phone-portrait', subcategories: [] },
      sellerId: 'seller1',
      sellerName: 'TechStore Pro',
      sellerRating: 4.8,
      condition: 'new',
      availability: 'in_stock',
      quantity: 15,
      location: { city: 'New York', state: 'NY', country: 'USA' },
      shipping: {
        freeShipping: true,
        estimatedDays: 2,
        methods: [],
      },
      tags: ['smartphone'],
      views: 1250,
      likes: 89,
      isPromoted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    },
  ];

  const mockOrders: Order[] = [
    {
      id: 'order_1',
      buyerId: 'buyer1',
      sellerId: 'seller1',
      items: [],
      subtotal: 1199,
      shippingCost: 0,
      tax: 95.92,
      total: 1294.92,
      currency: 'USD',
      status: 'shipped',
      paymentStatus: 'completed',
      shippingAddress: {
        id: '1',
        type: 'shipping',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'Boston',
        state: 'MA',
        postalCode: '02101',
        country: 'USA',
        isDefault: true,
      },
      billingAddress: {
        id: '1',
        type: 'billing',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'Boston',
        state: 'MA',
        postalCode: '02101',
        country: 'USA',
        isDefault: true,
      },
      shippingMethod: {
        id: '1',
        name: 'Express',
        cost: 0,
        estimatedDays: 2,
        trackingAvailable: true,
      },
      estimatedDelivery: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Navigate to add product screen');
  };

  const handleEditProduct = (product: Product) => {
    Alert.alert('Edit Product', `Edit ${product.title}`);
  };

  const handleViewOrder = (order: Order) => {
    Alert.alert('Order Details', `Order #${order.id}\nTotal: $${order.total}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'shipped': return theme.colors.info;
      case 'delivered': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textMuted;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.colors.accent,
    },
    tabText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.accent,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.xs,
    },
    productItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    productTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.md,
    },
    productPrice: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
    },
    productMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    statusBadge: {
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    orderItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    orderId: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    orderTotal: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
    },
    orderMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderDate: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
  });

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${sellerStats.totalSales.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sellerStats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sellerStats.activeProducts}</Text>
          <Text style={styles.statLabel}>Active Products</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sellerStats.rating} ⭐</Text>
          <Text style={styles.statLabel}>Rating ({sellerStats.totalReviews} reviews)</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This Month</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${sellerStats.thisMonthSales.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sellerStats.thisMonthOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderProducts = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => handleEditProduct(item)}
          >
            <View style={styles.productHeader}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            
            <View style={styles.productMeta}>
              <View style={styles.productStats}>
                <View style={styles.statItem}>
                  <Ionicons name="eye" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.statText}>{item.views}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.statText}>{item.likes}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="cube" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.statText}>{item.quantity}</Text>
                </View>
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderOrders = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
      </View>

      <FlatList
        data={mockOrders}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleViewOrder(item)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderTotal}>${item.total}</Text>
            </View>
            
            <View style={styles.orderMeta}>
              <Text style={styles.orderDate}>
                {item.createdAt.toLocaleDateString()}
              </Text>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Analytics Coming Soon</Text>
      <Text style={styles.subtitle}>
        Detailed analytics and insights about your sales performance will be available here.
      </Text>
    </View>
  );

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'products' as const, label: 'Products' },
    { key: 'orders' as const, label: 'Orders' },
    { key: 'analytics' as const, label: 'Analytics' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seller Dashboard</Text>
        <Text style={styles.subtitle}>Manage your products and sales</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'analytics' && renderAnalytics()}
      </View>
    </SafeAreaView>
  );
};

export default SellerDashboardScreen;
