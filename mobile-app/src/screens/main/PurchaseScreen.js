import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useQuery, useMutation} from 'react-query';
import {stripeAPI} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PurchaseScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const {data: pricingData, isLoading: pricingLoading} = useQuery(
    'pricing',
    stripeAPI.getPricing,
  );

  const confirmPaymentMutation = useMutation(stripeAPI.confirmPayment);

  const pricing = pricingData?.data;

  const initializePayment = async () => {
    try {
      setLoading(true);

      // Create payment intent
      const response = await stripeAPI.createPaymentIntent();
      const {clientSecret, amount, originalAmount, discountPercentage} = response.data;

      // Initialize payment sheet
      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Solaris Waterpolo Club',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: 'Customer', // You can get this from user context
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Present payment sheet
      const {error: paymentError} = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Payment Failed', paymentError.message);
      } else {
        // Payment successful - confirm on backend
        const paymentIntentId = clientSecret.split('_secret_')[0];
        await confirmPaymentMutation.mutateAsync(paymentIntentId);
        
        Alert.alert(
          'Payment Successful!',
          'Your season ticket has been purchased successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('HomeMain'),
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (pricingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading pricing information...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="local-activity" size={64} color="#1976d2" />
          <Text style={styles.title}>Season Ticket 2024</Text>
          <Text style={styles.subtitle}>
            Access to all home games and exclusive member benefits
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Pricing Details</Text>
          
          {pricing?.discountPercentage > 0 && (
            <>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Original Price:</Text>
                <Text style={[styles.priceValue, styles.originalPrice]}>
                  ${pricing.originalPrice.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  Discount ({pricing.discountPercentage}%):
                </Text>
                <Text style={[styles.priceValue, styles.discountValue]}>
                  -${pricing.discountAmount.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.divider} />
            </>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.finalPriceLabel}>Final Price:</Text>
            <Text style={styles.finalPriceValue}>
              ${pricing?.finalPrice?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What's Included</Text>
          
          <View style={styles.benefitItem}>
            <Icon name="sports" size={20} color="#4caf50" />
            <Text style={styles.benefitText}>
              Access to all home games during the 2024 season
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Icon name="star" size={20} color="#4caf50" />
            <Text style={styles.benefitText}>
              Exclusive member benefits and merchandise discounts
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Icon name="account-balance-wallet" size={20} color="#4caf50" />
            <Text style={styles.benefitText}>
              Digital wallet integration for easy access
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Icon name="group" size={20} color="#4caf50" />
            <Text style={styles.benefitText}>
              Priority seating and VIP club access
            </Text>
          </View>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.buttonDisabled]}
          onPress={initializePayment}
          disabled={loading || confirmPaymentMutation.isLoading}>
          {loading || confirmPaymentMutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="payment" size={24} color="#fff" />
              <Text style={styles.purchaseButtonText}>
                Purchase Season Ticket
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Icon name="security" size={16} color="#666" />
          <Text style={styles.securityText}>
            Payments are processed securely through Stripe
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    color: '#333',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountValue: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  finalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  finalPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  benefitsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
});

export default PurchaseScreen;