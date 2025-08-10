import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { Product, ProductCategory } from '../../types';
import PointsDisplay from '../../components/points/PointsDisplay';
import { RootStackParamList } from '../../navigation/MainNavigator';

const MarketplaceScreen: React.FC = () => {
  const { theme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    console.log('MarketplaceScreen mounted successfully!');
    console.log('Initial state:', { searchQuery, selectedCategory, cartCount });
  }, []);

  // Mock data for marketplace
  const mockCategories: ProductCategory[] = [
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait', subcategories: ['Phones', 'Laptops', 'Accessories'] },
    { id: 'fashion', name: 'Fashion', icon: 'shirt', subcategories: ['Clothing', 'Shoes', 'Accessories'] },
    { id: 'home', name: 'Home & Garden', icon: 'home', subcategories: ['Furniture', 'Decor', 'Garden'] },
    { id: 'sports', name: 'Sports', icon: 'fitness', subcategories: ['Equipment', 'Clothing', 'Outdoor'] },
    { id: 'books', name: 'Books', icon: 'book', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
    { id: 'automotive', name: 'Automotive', icon: 'car', subcategories: ['Parts', 'Accessories', 'Tools'] },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 1199,
      currency: 'USD',
      images: ['https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone'],
      category: mockCategories[0],
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
        methods: [{ id: '1', name: 'Express', cost: 0, estimatedDays: 2, trackingAvailable: true }],
      },
      tags: ['smartphone', 'apple', 'premium'],
      views: 1250,
      likes: 89,
      isPromoted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    },
    {
      id: '2',
      title: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Air Max technology',
      price: 150,
      currency: 'USD',
      images: ['https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Nike'],
      category: mockCategories[1],
      sellerId: 'seller2',
      sellerName: 'SportZone',
      sellerRating: 4.6,
      condition: 'new',
      availability: 'in_stock',
      quantity: 25,
      location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
      shipping: {
        freeShipping: false,
        shippingCost: 9.99,
        estimatedDays: 5,
        methods: [{ id: '2', name: 'Standard', cost: 9.99, estimatedDays: 5, trackingAvailable: true }],
      },
      tags: ['shoes', 'nike', 'running'],
      views: 890,
      likes: 67,
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    },
    {
      id: '3',
      title: 'MacBook Pro 16"',
      description: 'Powerful laptop for professionals with M3 Pro chip',
      price: 2499,
      currency: 'USD',
      images: ['https://via.placeholder.com/300x300/8E8E93/FFFFFF?text=MacBook'],
      category: mockCategories[0],
      sellerId: 'seller1',
      sellerName: 'TechStore Pro',
      sellerRating: 4.8,
      condition: 'new',
      availability: 'limited',
      quantity: 3,
      location: { city: 'New York', state: 'NY', country: 'USA' },
      shipping: {
        freeShipping: true,
        estimatedDays: 3,
        methods: [{ id: '1', name: 'Express', cost: 0, estimatedDays: 3, trackingAvailable: true }],
      },
      tags: ['laptop', 'apple', 'professional'],
      views: 2100,
      likes: 156,
      isPromoted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Debug logging
  console.log('Marketplace Debug:', {
    totalProducts: mockProducts.length,
    filteredProducts: filteredProducts.length,
    searchQuery,
    selectedCategory,
    cartCount
  });

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.title);
    Alert.alert(
      product.title,
      `Price: $${product.price}\nSeller: ${product.sellerName}\nCondition: ${product.condition}`,
      [
        { text: 'View Details', onPress: () => console.log('View product details') },
        {
          text: 'Add to Cart',
          onPress: () => {
            console.log('Adding to cart:', product.title);
            addToCart(product);
            Alert.alert('Added to Cart', `${product.title} added to your cart!`);
          }
        },
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
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sellButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    sellButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bold,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    cartButton: {
      position: 'relative',
      padding: theme.spacing.sm,
    },
    cartBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.full,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    cartBadgeText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    categoriesContainer: {
      paddingVertical: theme.spacing.sm,
    },
    categoryItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
      minWidth: 80,
    },
    activeCategoryItem: {
      backgroundColor: theme.colors.accent,
    },
    categoryIcon: {
      marginBottom: theme.spacing.xs,
    },
    categoryText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    activeCategoryText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    productGrid: {
      justifyContent: 'space-between',
    },
    productItem: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    productImage: {
      width: '100%',
      height: 120,
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
    },
    productInfo: {
      padding: theme.spacing.sm,
    },
    productTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    productPrice: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
      marginBottom: theme.spacing.xs,
    },
    productSeller: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    productMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    productRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    shippingBadge: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    shippingText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    promotedBadge: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.warning,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    promotedText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
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

  const renderCategoryItem = ({ item }: { item: ProductCategory | { id: string; name: string; icon: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.activeCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color={selectedCategory === item.id ? '#FFFFFF' : theme.colors.textSecondary}
        style={styles.categoryIcon}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.activeCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      {item.isPromoted && (
        <View style={styles.promotedBadge}>
          <Text style={styles.promotedText}>FEATURED</Text>
        </View>
      )}
      
      <Image
        source={{ uri: item.images[0] }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.productPrice}>
          ${item.price.toLocaleString()}
        </Text>
        
        <Text style={styles.productSeller}>
          by {item.sellerName}
        </Text>
        
        <View style={styles.productMeta}>
          <View style={styles.productRating}>
            <Ionicons
              name="star"
              size={12}
              color={theme.colors.warning}
            />
            <Text style={styles.ratingText}>
              {item.sellerRating}
            </Text>
          </View>
          
          {item.shipping.freeShipping && (
            <View style={styles.shippingBadge}>
              <Text style={styles.shippingText}>FREE SHIP</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const allCategories = [
    { id: 'all', name: 'All', icon: 'grid' },
    ...mockCategories,
  ];

  const handleCartPress = () => {
    console.log('Cart button pressed! Cart count:', cartCount);
    if (cartCount === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some products first!');
      return;
    }

    Alert.alert('Shopping Cart', `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`, [
      { text: 'Continue Shopping', style: 'cancel' },
      {
        text: 'View Cart',
        onPress: () => {
          console.log('View cart pressed');
          // For now, show cart contents
          Alert.alert('Cart Contents', 'Cart functionality will be implemented here');
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Marketplace</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.sellButton}
              onPress={() => {
                console.log('Sell button pressed!');
                Alert.alert('Start Selling', 'Choose an option', [
                  {
                    text: 'Add Product',
                    onPress: () => {
                      console.log('Navigating to AddProduct...');
                      try {
                        navigation.navigate('AddProduct');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        Alert.alert('Error', 'Could not navigate to Add Product screen');
                      }
                    }
                  },
                  {
                    text: 'Seller Dashboard',
                    onPress: () => {
                      console.log('Navigating to SellerDashboard...');
                      try {
                        navigation.navigate('SellerDashboard');
                      } catch (error) {
                        console.error('Navigation error:', error);
                        Alert.alert('Error', 'Could not navigate to Seller Dashboard screen');
                      }
                    }
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
              <Ionicons
                name="cart"
                size={24}
                color={theme.colors.text}
              />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartCount > 99 ? '99+' : cartCount.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {/* Points Display */}
        <PointsDisplay variant="compact" />

        <View style={styles.categoriesContainer}>
          <FlatList
            data={allCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Products' : mockCategories.find(c => c.id === selectedCategory)?.name}
        </Text>

        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productGrid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or browse different categories
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
