import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GuraButton from '@/components/brand/GuraButton';

type DashboardTab = 'seller' | 'buyer';

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DashboardTab>('seller');

  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get<any>('/users/me');
      return res.data;
    }
  });

  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: ['myListings', userProfile?.id],
    queryFn: async () => {
      const res = await api.get<any>(`/listings?seller_id=${userProfile?.id}`);
      return res.data;
    },
    enabled: !!userProfile?.id,
  });

  const { data: sellerOrders, isLoading: isSellerOrdersLoading } = useQuery({
    queryKey: ['sellerOrders'],
    queryFn: async () => {
      const res = await api.get<any>('/orders?role=seller');
      return res.data;
    },
    enabled: !!userProfile?.id && activeTab === 'seller',
  });

  const { data: buyerOrders, isLoading: isBuyerOrdersLoading } = useQuery({
    queryKey: ['buyerOrders'],
    queryFn: async () => {
      const res = await api.get<any>('/orders?role=buyer');
      return res.data;
    },
    enabled: !!userProfile?.id && activeTab === 'buyer',
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/users/verify');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      Alert.alert('Success', 'You are now a GURA Certified Seller!');
    }
  });

  const isLoading = isUserLoading || (activeTab === 'seller' && (isListingsLoading || isSellerOrdersLoading)) || (activeTab === 'buyer' && isBuyerOrdersLoading);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </View>
    );
  }

  const isCertified = userProfile?.seller_tier === 'gura_certified' || userProfile?.seller_tier === 'super_seller';
  
  const orders = activeTab === 'seller' ? sellerOrders : buyerOrders;
  const activeListingsCount = listings?.listings?.filter((l: any) => l.status === 'active')?.length || 0;
  const pendingOrdersCount = (Array.isArray(sellerOrders) ? sellerOrders : [])?.filter((o: any) => ['pending_payment', 'paid', 'shipped'].includes(o.status))?.length || 0;
  const recentSales = (Array.isArray(sellerOrders) ? sellerOrders : [])?.filter((o: any) => !['pending_payment', 'failed', 'cancelled'].includes(o.status)).slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#FFF7ED', text: Colors.guraOrange, label: 'Paid' };
      case 'shipped':
        return { bg: '#EFF6FF', text: '#2563EB', label: 'Shipped' };
      case 'complete':
      case 'completed':
        return { bg: '#ECFDF5', text: Colors.malachite, label: 'Complete' };
      case 'pending_payment':
        return { bg: '#FFFBEB', text: Colors.savannaGold, label: 'Pending' };
      case 'cancelled':
      case 'failed':
        return { bg: '#FEF2F2', text: Colors.error, label: status === 'cancelled' ? 'Cancelled' : 'Failed' };
      default:
        return { bg: Colors.slateTint, text: Colors.slate, label: status };
    }
  };

  const renderSellerView = () => (
    <>
      {/* Profile Stats */}
      <View style={styles.profileCard}>
        <Text style={styles.userName}>{userProfile?.display_name}</Text>
        
        <View style={styles.tierContainer}>
          <Text style={styles.tierLabel}>Status:</Text>
          {isCertified ? (
            <View style={styles.badgeCertified}>
              <Text style={styles.badgeTextCertified}>★ Gura Certified</Text>
            </View>
          ) : (
            <View style={styles.badgeUnverified}>
              <Text style={styles.badgeTextUnverified}>Unverified</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>
            {Number(userProfile?.seller_rating || 0).toFixed(1)} 
            <Text style={styles.reviewCount}> ({userProfile?.review_count || 0} reviews)</Text>
          </Text>
        </View>
        
        {!isCertified && (
          <TouchableOpacity 
            style={styles.verifyBtn} 
            onPress={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending}
          >
            <Text style={styles.verifyBtnText}>
              {verifyMutation.isPending ? 'Verifying...' : 'Request Verification'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{activeListingsCount}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendingOrdersCount}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
      </View>

      {/* Recent Orders */}
      <Text style={styles.sectionTitle}>Recent Sales</Text>
      {recentSales.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You have no recent sales.</Text>
        </View>
      ) : (
        recentSales.map((sale: any) => (
          <View key={sale.id} style={styles.saleCard}>
            <View style={styles.saleInfo}>
              <Text style={styles.saleTitle} numberOfLines={1}>{sale.listing_title}</Text>
              <Text style={styles.saleStatus}>{sale.status}</Text>
            </View>
            <Text style={styles.saleAmount}>{Number(sale.amount).toLocaleString()} RWF</Text>
          </View>
        ))
      )}
    </>
  );

  const renderBuyerView = () => {
    const buyerOrdersList = Array.isArray(buyerOrders) ? buyerOrders : [];

    return (
      <>
        <Text style={styles.sectionTitle}>My Purchases</Text>
        {buyerOrdersList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>You haven't purchased anything yet.</Text>
          </View>
        ) : (
          buyerOrdersList.map((order: any) => {
            const badge = getStatusBadge(order.status);
            return (
              <View key={order.id} style={styles.saleCard}>
                <View style={styles.saleInfo}>
                  <Text style={styles.saleTitle} numberOfLines={1}>{order.listing_title || order.listing?.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>
                <Text style={styles.saleAmount}>{Number(order.amount).toLocaleString()} RWF</Text>
              </View>
            );
          })
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'seller' && styles.tabActive]}
          onPress={() => setActiveTab('seller')}
        >
          <Text style={[styles.tabText, activeTab === 'seller' && styles.tabTextActive]}>Kura Panel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'buyer' && styles.tabActive]}
          onPress={() => setActiveTab('buyer')}
        >
          <Text style={[styles.tabText, activeTab === 'buyer' && styles.tabTextActive]}>My Purchases</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'seller' ? renderSellerView() : renderBuyerView()}
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
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: Colors.midnightInk,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.slateTint,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: Colors.guraOrange,
  },
  tabText: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
  },
  tabTextActive: {
    fontFamily: FontFamilies.heading,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginBottom: 24,
  },
  userName: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.midnightInk,
    marginBottom: 12,
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    marginRight: 8,
  },
  badgeCertified: {
    backgroundColor: Colors.savannaGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextCertified: {
    fontFamily: FontFamilies.heading,
    color: '#FFFFFF',
    fontSize: 12,
  },
  badgeUnverified: {
    backgroundColor: Colors.slateTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTextUnverified: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starIcon: {
    color: Colors.savannaGold,
    fontSize: 18,
    marginRight: 4,
  },
  ratingText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.midnightInk,
  },
  reviewCount: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    fontWeight: 'normal',
  },
  verifyBtn: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: Colors.savannaGold,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyBtnText: {
    fontFamily: FontFamilies.heading,
    color: Colors.savannaGold,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontFamily: FontFamilies.mono,
    fontSize: 24,
    color: Colors.guraOrange,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.slate,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
  },
  saleCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleInfo: {
    flex: 1,
    marginRight: 16,
  },
  saleTitle: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.midnightInk,
    marginBottom: 4,
  },
  saleStatus: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.slate,
    textTransform: 'capitalize',
  },
  saleAmount: {
    fontFamily: FontFamilies.mono,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.guraOrange,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  statusBadgeText: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
  },
});
