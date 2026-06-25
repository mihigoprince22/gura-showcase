import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import GuraButton from '@/components/brand/GuraButton';
import Input from '@/components/ui/Input';
import DistrictSelector from '@/components/ui/DistrictSelector';
import Price from '@/components/typography/Price';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export default function CheckoutScreen() {
  const { listingId } = useLocalSearchParams();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // For MVP, we fetch listing to show summary
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: async () => {
      const res = await api.get(`/api/listings/${listingId}`);
      return res.data;
    }
  });

  const handleCheckout = async () => {
    if (!address || !district) {
      Alert.alert('Missing Details', 'Please enter shipping address and district.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.post('/orders/checkout', {
        listing_id: listingId,
        shipping_address: address,
        district,
      });

      const order = res.data;
      
      // MOCK: Pretend we passed the client_secret to Stripe/Mobile Money and it succeeded
      Alert.alert('Payment Successful', 'Your order has been placed!', [
        { text: 'View Order', onPress: () => router.replace(`/orders/${order.id}` as any) }
      ]);
    } catch (err: any) {
      Alert.alert('Checkout Failed', err.response?.data?.error || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </View>
    );
  }

  const itemPrice = listing?.current_price || 0;
  const shippingFee = 2500;
  const guraFee = Math.floor(itemPrice * 0.05);
  const total = itemPrice + shippingFee + guraFee;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Text style={{ fontSize: 24, color: Colors.midnightInk }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontFamily: FontFamilies.body, fontSize: 16, color: Colors.guraOrange }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Shipping Details</Text>
          <DistrictSelector
            label="District"
            value={district}
            onSelect={setDistrict}
          />
          <Input
            label="Street Address / Neighborhood"
            placeholder="e.g. KN 5 Rd, Remera"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{listing?.title}</Text>
              <Price amount={itemPrice} size={14} />
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping (Flat Rate)</Text>
              <Price amount={shippingFee} size={14} />
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gura Buyer Fee (5%)</Text>
              <Price amount={guraFee} size={14} />
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Price amount={total} size={20} color={Colors.guraOrange} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Payment Method</Text>
          <View style={styles.paymentCard}>
            <Text style={styles.momoText}>MTN Mobile Money / Airtel Money</Text>
            <Text style={styles.momoSub}>You will be prompted on your phone after clicking Pay.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GuraButton 
          label={`Pay ${total.toLocaleString()} RWF`} 
          onPress={handleCheckout} 
          loading={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.warmLinen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.midnightInk,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    flex: 1,
    marginRight: 16,
  },
  totalLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.slateTint,
    marginVertical: 12,
  },
  paymentCard: {
    backgroundColor: '#FFFBEB', // Subtle yellow/gold for MoMo feel
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.savannaGold,
  },
  momoText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.midnightInk,
    marginBottom: 4,
  },
  momoSub: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.slate,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
  }
});
