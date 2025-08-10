import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Order, OrderStatus } from '../../types';

const OrdersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'all' | OrderStatus>('all');

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      buyerId: 'buyer1',
      sellerId: 'seller1',
      items: [
        {
          id: 'item1',
          productId: 'prod1',
          productTitle: 'iPhone 15 Pro Max',
          productImage: 'https://via.placeholder.com/60x60',
          quantity: 1,
          unitPrice: 1199,
          totalPrice: 1199,
        },
      ],
      subtotal: 1199,
      shippingCost: 0,
      tax: 95.92,
      total: 1294.92,
      currency: 'USD',
      status: 'delivered',
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
        name: 'Express Shipping',
        cost: 0,
        estimatedDays: 2,
        trackingAvailable: true,
      },
      trackingNumber: 'TRK123456789',
      estimatedDelivery: new Date('2024-01-15'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-13'),
    },
    {
      id: 'ORD-002',
      buyerId: 'buyer2',
      sellerId: 'seller1',
      items: [
        {
          id: 'item2',
          productId: 'prod2',
          productTitle: 'Nike Air Max 270',
          productImage: 'https://via.placeholder.com/60x60',
          quantity: 2,
          unitPrice: 150,
          totalPrice: 300,
        },
      ],
      subtotal: 300,
      shippingCost: 9.99,
      tax: 24.80,
      total: 334.79,
      currency: 'USD',
      status: 'shipped',
      paymentStatus: 'completed',
      shippingAddress: {
        id: '2',
        type: 'shipping',
        firstName: 'Jane',
        lastName: 'Smith',
        addressLine1: '456 Oak Ave',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA',
        isDefault: true,
      },
      billingAddress: {
        id: '2',
        type: 'billing',
        firstName: 'Jane',
        lastName: 'Smith',
        addressLine1: '456 Oak Ave',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA',
        isDefault: true,
      },
      shippingMethod: {
        id: '2',
        name: 'Standard Shipping',
        cost: 9.99,
        estimatedDays: 5,
        trackingAvailable: true,
      },
      trackingNumber: 'TRK987654321',
      estimatedDelivery: new Date('2024-01-20'),
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-14'),
    },
    {
      id: 'ORD-003',
      buyerId: 'buyer3',
      sellerId: 'seller1',
      items: [
        {
          id: 'item3',
          productId: 'prod3',
          productTitle: 'MacBook Pro 16"',
          productImage: 'https://via.placeholder.com/60x60',
          quantity: 1,
          unitPrice: 2499,
          totalPrice: 2499,
        },
      ],
      subtotal: 2499,
      shippingCost: 0,
      tax: 199.92,
      total: 2698.92,
      currency: 'USD',
      status: 'processing',
      paymentStatus: 'completed',
      shippingAddress: {
        id: '3',
        type: 'shipping',
        firstName: 'Mike',
        lastName: 'Johnson',
        addressLine1: '789 Pine St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'USA',
        isDefault: true,
      },
      billingAddress: {
        id: '3',
        type: 'billing',
        firstName: 'Mike',
        lastName: 'Johnson',
        addressLine1: '789 Pine St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'USA',
        isDefault: true,
      },
      shippingMethod: {
        id: '1',
        name: 'Express Shipping',
        cost: 0,
        estimatedDays: 3,
        trackingAvailable: true,
      },
      estimatedDelivery: new Date('2024-01-18'),
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
    },
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return theme.colors.warning;
      case 'confirmed': return theme.colors.info;
      case 'processing': return theme.colors.accent;
      case 'shipped': return theme.colors.info;
      case 'delivered': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      case 'refunded': return theme.colors.error;
      default: return theme.colors.textMuted;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'time';
      case 'confirmed': return 'checkmark-circle';
      case 'processing': return 'cog';
      case 'shipped': return 'airplane';
      case 'delivered': return 'checkmark-done-circle';
      case 'cancelled': return 'close-circle';
      case 'refunded': return 'return-up-back';
      default: return 'help-circle';
    }
  };

  const handleOrderPress = (order: Order) => {
    Alert.alert(
      `Order #${order.id}`,
      `Status: ${order.status}\nTotal: $${order.total}\nCustomer: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      [
        { text: 'View Details', onPress: () => console.log('View order details') },
        { text: 'Track Package', onPress: () => console.log('Track package') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
      marginBottom: theme.spacing.md,
    },
    filtersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    filterButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.accent,
    },
    filterText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    orderItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    orderInfo: {
      flex: 1,
    },
    orderId: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    orderDate: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.xs,
      textTransform: 'capitalize',
    },
    orderDetails: {
      marginBottom: theme.spacing.sm,
    },
    customerInfo: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    itemsInfo: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    shippingInfo: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalAmount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
    },
    trackingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trackingText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.info,
      marginLeft: theme.spacing.xs,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyStateSubtext: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  const filters: { key: 'all' | OrderStatus; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {item.createdAt.toLocaleDateString()}
          </Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.customerInfo}>
          Customer: {item.shippingAddress.firstName} {item.shippingAddress.lastName}
        </Text>
        
        <Text style={styles.itemsInfo}>
          {item.items.length} item(s) • {item.items.reduce((sum, item) => sum + item.quantity, 0)} total quantity
        </Text>
        
        <Text style={styles.shippingInfo}>
          Shipping: {item.shippingMethod.name} • {item.shippingAddress.city}, {item.shippingAddress.state}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          ${item.total.toFixed(2)}
        </Text>
        
        {item.trackingNumber && (
          <View style={styles.trackingInfo}>
            <Ionicons
              name="location"
              size={16}
              color={theme.colors.info}
            />
            <Text style={styles.trackingText}>
              Track: {item.trackingNumber}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {selectedFilter === 'all' ? '' : selectedFilter} orders found
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Your orders will appear here when you make purchases
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;
