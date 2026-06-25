import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';

function HeartIcon({ color, size, filled }: { color: string; size: number, filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function WatchlistScreen() {
  const router = useRouter();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const res = await api.get<any[]>('/watchlist');
      return res.data || [];
    }
  });

  const renderItem = ({ item }: { item: any }) => {
    // If the price has dropped since added, we show an alert badge
    const priceDropped = Number(item.current_price) < Number(item.last_price_at_add);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => router.push(`/listing/${item.id}`)}
      >
        <Image 
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
        />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <HeartIcon color={Colors.guraOrange} size={20} filled={true} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>{Number(item.current_price).toLocaleString()} {item.currency}</Text>
          
          <View style={styles.footer}>
            <Text style={styles.status}>{item.status}</Text>
            {priceDropped && (
              <View style={styles.priceDropBadge}>
                <Text style={styles.priceDropText}>Price Dropped</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Watchlist',
          headerStyle: { backgroundColor: Colors.warmLinen },
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FontFamilies.heading, fontSize: 20 },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 16 }}>
              <Text style={{ fontSize: 22, color: Colors.obsidian }}>←</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <FlatList
        data={watchlist}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <HeartIcon color={Colors.slateTint} size={64} filled={false} />
            <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
            <Text style={styles.emptyText}>Save items you love to keep track of them.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerWrap}>
            <TouchableOpacity 
              style={styles.returnButton} 
              onPress={() => router.replace('/(tabs)/profile')}
            >
              <Text style={styles.returnButtonText}>Return to Profile</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: Colors.slateTint,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.obsidian,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontFamily: FontFamilies.mono,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.guraOrange,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.slate,
    textTransform: 'capitalize',
  },
  priceDropBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceDropText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#137333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.obsidian,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.slate,
    textAlign: 'center',
  },
  footerWrap: {
    marginTop: 24,
    marginBottom: 40,
  },
  returnButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.guraOrange,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  returnButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.guraOrange,
  },
});
