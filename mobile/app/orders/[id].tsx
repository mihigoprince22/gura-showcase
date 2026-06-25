import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import Price from '@/components/typography/Price';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const STATUS_STEPS = ['pending', 'paid', 'shipped', 'delivered'];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get(`/api/orders/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontFamily: FontFamilies.body }}>Order not found.</Text>
      </View>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.itemTitle}>{order.listing_title}</Text>
          <Text style={styles.orderId}>Order #{order.id.split('-')[0].toUpperCase()}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.totalText}>Total Paid:</Text>
            <Price amount={order.total_amount} size={18} color={Colors.guraOrange} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tracking Status</Text>
        <View style={styles.timeline}>
          {STATUS_STEPS.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isLast = index === STATUS_STEPS.length - 1;

            return (
              <View key={step} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.node, isActive && styles.nodeActive]} />
                  {!isLast && <View style={[styles.line, isActive && styles.lineActive]} />}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[styles.stepText, isActive && styles.stepTextActive]}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </Text>
                  {index === currentStepIndex && (
                    <Text style={styles.stepSubText}>Current Status</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginBottom: 32,
  },
  itemTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    marginBottom: 4,
  },
  orderId: {
    fontFamily: FontFamilies.mono,
    fontSize: 12,
    color: Colors.slate,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
    paddingTop: 16,
  },
  totalText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.slateTint,
    zIndex: 2,
  },
  nodeActive: {
    backgroundColor: Colors.guraOrange,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.slateTint,
    marginTop: -8,
    marginBottom: -8,
    zIndex: 1,
  },
  lineActive: {
    backgroundColor: Colors.guraOrange,
  },
  timelineRight: {
    paddingBottom: 24,
    flex: 1,
  },
  stepText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.slate,
  },
  stepTextActive: {
    color: Colors.midnightInk,
  },
  stepSubText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.malachite,
    marginTop: 4,
  }
});
