import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { usePoints } from '../../contexts/PointsContext';
import { PaymentMethod } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const PaymentScreen: React.FC = () => {
  const { theme } = useTheme();
  const { cartTotal, cartCount, clearCart } = useCart();
  const { earnPoints, pointsSettings } = usePoints();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card_1',
      type: 'credit_card',
      name: 'Visa ending in 4242',
      icon: 'card',
      isDefault: true,
      details: {
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
      },
    },
    {
      id: 'paypal_1',
      type: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
      isDefault: false,
      details: {
        email: 'user@example.com',
      },
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      name: 'Apple Pay',
      icon: 'logo-apple',
      isDefault: false,
    },
    {
      id: 'google_pay',
      type: 'google_pay',
      name: 'Google Pay',
      icon: 'logo-google',
      isDefault: false,
    },
  ];

  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method to continue.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Calculate points to award (1 point per dollar spent on the cart total)
        const pointsToAward = Math.floor(cartTotal * pointsSettings.pointsPerDollarSpent);

        // Award points for the purchase
        await earnPoints(
          pointsToAward,
          'purchase',
          `Purchase reward: ${pointsToAward} points for $${cartTotal.toFixed(2)} purchase`,
          {
            purchaseAmount: cartTotal,
            orderTotal: cartTotal + 9.99 + cartTotal * 0.08,
            referenceId: `ORDER_${Date.now()}`
          }
        );

        setIsProcessing(false);

        Alert.alert(
          'Payment Successful! 🎉',
          `Your order has been placed successfully.\nTotal: $${(cartTotal + 9.99 + cartTotal * 0.08).toFixed(2)}\n\n🎁 You earned ${pointsToAward} points for this purchase!`,
          [
            {
              text: 'View Order',
              onPress: () => {
                clearCart();
                console.log('Navigate to order details');
              },
            },
          ]
        );
      } catch (error) {
        setIsProcessing(false);
        console.error('Error awarding points:', error);

        // Still show success for payment, but mention points issue
        Alert.alert(
          'Payment Successful!',
          `Your order has been placed successfully.\nTotal: $${(cartTotal + 9.99 + cartTotal * 0.08).toFixed(2)}\n\nNote: There was an issue awarding points, but your order is confirmed.`,
          [
            {
              text: 'View Order',
              onPress: () => {
                clearCart();
                console.log('Navigate to order details');
              },
            },
          ]
        );
      }
    }, 3000);
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'credit_card':
      case 'debit_card':
        return 'card';
      case 'paypal':
        return 'logo-paypal';
      case 'apple_pay':
        return 'logo-apple';
      case 'google_pay':
        return 'logo-google';
      case 'bank_transfer':
        return 'business';
      case 'crypto':
        return 'logo-bitcoin';
      default:
        return 'card';
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
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    paymentMethodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedPaymentMethod: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '10',
    },
    paymentMethodIcon: {
      marginRight: theme.spacing.md,
    },
    paymentMethodInfo: {
      flex: 1,
    },
    paymentMethodName: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    paymentMethodDetails: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    defaultBadge: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      marginLeft: theme.spacing.sm,
    },
    defaultBadgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.bold,
      color: '#FFFFFF',
    },
    addCardForm: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    orderSummary: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.accent,
    },
    footer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.success + '20',
      borderRadius: theme.borderRadius.sm,
    },
    securityText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.success,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
  });

  const subtotal = cartTotal;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <Ionicons
                name={getPaymentMethodIcon(method) as any}
                size={24}
                color={theme.colors.accent}
                style={styles.paymentMethodIcon}
              />
              
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                {method.details && (
                  <Text style={styles.paymentMethodDetails}>
                    {method.type === 'credit_card' && method.details.last4 && 
                      `•••• •••• •••• ${method.details.last4}`}
                    {method.type === 'paypal' && method.details.email}
                  </Text>
                )}
              </View>
              
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              )}
              
              {selectedPaymentMethod === method.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.colors.accent}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* Add New Card Form */}
          <View style={styles.addCardForm}>
            <Text style={styles.sectionTitle}>Add New Card</Text>
            
            <Input
              label="Card Number"
              value={newCardData.cardNumber}
              onChangeText={(text) => setNewCardData(prev => ({ ...prev, cardNumber: text }))}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              leftIcon="card"
            />
            
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Expiry Date"
                  value={newCardData.expiryDate}
                  onChangeText={(text) => setNewCardData(prev => ({ ...prev, expiryDate: text }))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="CVV"
                  value={newCardData.cvv}
                  onChangeText={(text) => setNewCardData(prev => ({ ...prev, cvv: text }))}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
            
            <Input
              label="Cardholder Name"
              value={newCardData.cardholderName}
              onChangeText={(text) => setNewCardData(prev => ({ ...prev, cardholderName: text }))}
              placeholder="John Doe"
              leftIcon="person"
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cartCount})</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.securityNote}>
          <Ionicons
            name="shield-checkmark"
            size={20}
            color={theme.colors.success}
          />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
        
        <Button
          title={isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
          onPress={handlePayment}
          loading={isProcessing}
          disabled={!selectedPaymentMethod}
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
