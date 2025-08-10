import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';

const ProductManagementScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { products } = useCart();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Mock seller products - in real app, filter by current user
  const sellerProducts = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      price: 1199,
      currency: 'USD',
      images: ['https://via.placeholder.com/100x100'],
      status: 'active',
      views: 245,
      favorites: 12,
      quantity: 5,
      sold: 3,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      price: 999,
      currency: 'USD',
      images: ['https://via.placeholder.com/100x100'],
      status: 'paused',
      views: 189,
      favorites: 8,
      quantity: 2,
      sold: 1,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'AirPods Pro',
      price: 249,
      currency: 'USD',
      images: ['https://via.placeholder.com/100x100'],
      status: 'sold_out',
      views: 156,
      favorites: 15,
      quantity: 0,
      sold: 10,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    addButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
    },
    filterBar: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activeFilter: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    filterText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    productItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedProduct: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
    },
    productDetails: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    productTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    productPrice: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      fontWeight: 'bold',
    },
    productStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    productFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      fontWeight: 'bold',
    },
    activeStatus: {
      backgroundColor: `${theme.colors.success}20`,
    },
    activeStatusText: {
      color: theme.colors.success,
    },
    pausedStatus: {
      backgroundColor: `${theme.colors.warning}20`,
    },
    pausedStatusText: {
      color: theme.colors.warning,
    },
    soldOutStatus: {
      backgroundColor: `${theme.colors.error}20`,
    },
    soldOutStatusText: {
      color: theme.colors.error,
    },
    productActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    createdDate: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontWeight: 'bold',
    },
    emptyStateText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    bulkActions: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bulkActionText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
    },
    bulkActionButtons: {
      flexDirection: 'row',
    },
    bulkActionButton: {
      marginLeft: theme.spacing.md,
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAddProduct = () => {
    // Navigate to AddProductScreen
    console.log('Navigate to Add Product');
  };

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Delete product:', productId)
        },
      ]
    );
  };

  const handleToggleStatus = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    console.log('Toggle status:', productId, newStatus);
  };

  const handleBulkAction = (action: 'delete' | 'activate' | 'pause') => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Products`,
      `Are you sure you want to ${action} ${selectedProducts.length} selected products?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm',
          onPress: () => {
            console.log(`Bulk ${action}:`, selectedProducts);
            setSelectedProducts([]);
          }
        },
      ]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { badge: styles.activeStatus, text: styles.activeStatusText };
      case 'paused':
        return { badge: styles.pausedStatus, text: styles.pausedStatusText };
      case 'sold_out':
        return { badge: styles.soldOutStatus, text: styles.soldOutStatusText };
      default:
        return { badge: styles.activeStatus, text: styles.activeStatusText };
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderProduct = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status);
    const isSelected = selectedProducts.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.productItem, isSelected && styles.selectedProduct]}
        onPress={() => handleProductSelect(item.id)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          <View style={styles.productHeader}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.productPrice}>
              ${item.price}
            </Text>
          </View>

          <View style={styles.productStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.views}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.favorites}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.quantity}</Text>
              <Text style={styles.statLabel}>Stock</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.sold}</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
          </View>

          <View style={styles.productFooter}>
            <View>
              <View style={[styles.statusBadge, statusStyle.badge]}>
                <Text style={[styles.statusText, statusStyle.text]}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.createdDate}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditProduct(item.id)}
              >
                <Ionicons name="create-outline" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleToggleStatus(item.id, item.status)}
              >
                <Ionicons 
                  name={item.status === 'active' ? 'pause-outline' : 'play-outline'} 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Products</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddProduct}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {['All', 'Active', 'Paused', 'Sold Out'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, filter === 'All' && styles.activeFilter]}
          >
            <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <View style={styles.bulkActions}>
          <Text style={styles.bulkActionText}>
            {selectedProducts.length} selected
          </Text>
          <View style={styles.bulkActionButtons}>
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('activate')}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('pause')}
            >
              <Ionicons name="pause" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => handleBulkAction('delete')}
            >
              <Ionicons name="trash" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Product List */}
      {sellerProducts.length > 0 ? (
        <FlatList
          data={sellerProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ paddingVertical: theme.spacing.sm }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons 
            name="cube-outline" 
            size={80} 
            color={theme.colors.textMuted} 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No Products Yet</Text>
          <Text style={styles.emptyStateText}>
            Start selling by adding your first product.{'\n'}
            Take photos, write descriptions, and reach thousands of buyers!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductManagementScreen;
