import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ListingCard from '@/components/ui/ListingCard';
import Wordmark from '@/components/brand/Wordmark';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api'; // Assume api has a search method configured

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Vehicles', 'Home & Living', 'Art & Crafts', 'Sports'];

export default function HomeFeed() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch feed
  const { data, isLoading } = useQuery({
    queryKey: ['feed', activeCategory],
    queryFn: async () => {
      const catId = `cat_${activeCategory.toLowerCase().split(' ')[0]}`;
      const endpoint = activeCategory === 'All' ? '/listings/feed' : `/listings?category_id=${catId}`;
      try {
        const res = await api.get<any>(endpoint);
        return res.data?.listings || [];
      } catch (err) {
        return [];
      }
    }
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Wordmark size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/search' as any)} style={styles.searchButton}>
        <Text style={styles.searchText}>Search Gura...</Text>
      </TouchableOpacity>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.chip, activeCategory === cat && styles.chipActive]}
            onPress={() => {
              setActiveCategory(cat);
              if (cat !== 'All') {
                router.push(`/search?category=${encodeURIComponent(cat)}` as any);
              }
            }}
          >
            <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.guraOrange} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={5}
          maxToRenderPerBatch={8}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <ListingCard
              id={item.id}
              title={item.title}
              price={item.price}
              condition={item.condition}
              sellerTier={item.seller_tier}
              imageUrl={item.images?.[0]}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.warmLinen,
    zIndex: 10,
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  searchText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
  },
  chipScroll: {
    marginTop: 16,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.guraOrange,
    borderColor: Colors.guraOrange,
  },
  chipText: {
    fontFamily: FontFamilies.body,
    color: Colors.midnightInk,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
