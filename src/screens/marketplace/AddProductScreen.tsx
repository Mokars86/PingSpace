import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../navigation/MainNavigator';

const AddProductScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // Product categories
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait' },
    { id: 'fashion', name: 'Fashion', icon: 'shirt' },
    { id: 'home', name: 'Home & Garden', icon: 'home' },
    { id: 'sports', name: 'Sports', icon: 'fitness' },
    { id: 'books', name: 'Books', icon: 'book' },
    { id: 'automotive', name: 'Automotive', icon: 'car' },
  ];
  
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    quantity: '1',
    location: '',
    shippingFree: true,
    shippingDays: '3',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: 'bold',
    },
    section: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      marginBottom: theme.spacing.md,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    imageSection: {
      marginBottom: theme.spacing.md,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      position: 'relative',
    },
    productImage: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.md,
    },
    removeImageButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.error,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addImageButton: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      width: '48%',
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedCategory: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    categoryIcon: {
      marginBottom: theme.spacing.xs,
    },
    categoryName: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
    },
    conditionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    conditionButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedCondition: {
      borderColor: theme.colors.accent,
      backgroundColor: `${theme.colors.accent}10`,
    },
    conditionText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencySymbol: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
      fontWeight: 'bold',
    },
    priceInput: {
      flex: 1,
    },
    shippingToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    shippingText: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    toggleButton: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.inputBackground,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.accent,
    },
    toggleCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleCircleActive: {
      alignSelf: 'flex-end',
    },
    publishButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    disabledButton: {
      backgroundColor: theme.colors.textMuted,
    },
    publishButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bold,
      marginLeft: theme.spacing.sm,
      fontWeight: 'bold',
    },
  });

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Maximum Images', 'You can only add up to 5 images per product.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handlePublish = async () => {
    if (!productData.title || !productData.description || !productData.price || !productData.category) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image of your product.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate donation fee (2.5% of product price)
      const price = Number(productData.price);
      const donationFee = Math.min(Math.max((price * 2.5) / 100, 0.10), 5.00);

      Alert.alert(
        'Product Published Successfully! 🎉',
        `Your product "${productData.title}" is now live for $${price}.\n\nWhen sold, a $${donationFee.toFixed(2)} fee will support PingSpace development.`,
        [
          {
            text: 'View My Products',
            onPress: () => navigation.navigate('SellerDashboard'),
          },
          {
            text: 'Add Another Product',
            onPress: () => {
              // Reset form for new product
              setProductData({
                title: '',
                description: '',
                price: '',
                category: '',
                condition: 'new',
                quantity: '1',
                location: '',
                shippingFree: true,
                shippingDays: '3',
              });
              setImages([]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to publish product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canPublish = () => {
    return productData.title && productData.description && productData.price && 
           productData.category && images.length > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView>
        {/* Product Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Images *</Text>
          <View style={styles.imageGrid}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Title *"
            placeholderTextColor={theme.colors.textMuted}
            value={productData.title}
            onChangeText={(text) => setProductData({...productData, title: text})}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Product Description *"
            placeholderTextColor={theme.colors.textMuted}
            value={productData.description}
            onChangeText={(text) => setProductData({...productData, description: text})}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  productData.category === category.id && styles.selectedCategory,
                ]}
                onPress={() => setProductData({...productData, category: category.id})}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={productData.category === category.id ? theme.colors.accent : theme.colors.textMuted}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.conditionRow}>
            {['new', 'like_new', 'good', 'fair'].map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.conditionButton,
                  productData.condition === condition && styles.selectedCondition,
                ]}
                onPress={() => setProductData({...productData, condition})}
              >
                <Text style={styles.conditionText}>
                  {condition.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price & Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price & Quantity</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textMuted}
              value={productData.price}
              onChangeText={(text) => setProductData({...productData, price: text})}
              keyboardType="numeric"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Quantity Available"
            placeholderTextColor={theme.colors.textMuted}
            value={productData.quantity}
            onChangeText={(text) => setProductData({...productData, quantity: text})}
            keyboardType="numeric"
          />
        </View>

        {/* Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping</Text>
          <TouchableOpacity
            style={styles.shippingToggle}
            onPress={() => setProductData({...productData, shippingFree: !productData.shippingFree})}
          >
            <Text style={styles.shippingText}>Free Shipping</Text>
            <View style={[styles.toggleButton, productData.shippingFree && styles.toggleButtonActive]}>
              <View style={[styles.toggleCircle, productData.shippingFree && styles.toggleCircleActive]} />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Estimated Delivery Days"
            placeholderTextColor={theme.colors.textMuted}
            value={productData.shippingDays}
            onChangeText={(text) => setProductData({...productData, shippingDays: text})}
            keyboardType="numeric"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City, State, Country"
            placeholderTextColor={theme.colors.textMuted}
            value={productData.location}
            onChangeText={(text) => setProductData({...productData, location: text})}
          />
        </View>
      </ScrollView>

      {/* Publish Button */}
      <TouchableOpacity
        style={[
          styles.publishButton,
          !canPublish() && styles.disabledButton,
        ]}
        onPress={handlePublish}
        disabled={!canPublish() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        )}
        <Text style={styles.publishButtonText}>
          {isLoading ? 'Publishing...' : 'Publish Product'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddProductScreen;
