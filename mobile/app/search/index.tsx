import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ListingCard from '@/components/ui/ListingCard';
import FilterDrawer from '@/components/ui/FilterDrawer';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [filterVisible, setFilterVisible] = useState(false);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: async () => {
      if (!debouncedQuery && Object.keys(filters).length === 0) return [];
      
      const params = new URLSearchParams({
        q: debouncedQuery || '*',
        ...filters
      });

      try {
        const res = await api.get(`/api/search?${params.toString()}`);
        return res.data?.hits || [];
      } catch (err) {
        // Mock fallback if API not running
        return [
          { id: '1', title: 'Mocked Result for ' + debouncedQuery, price: 50000, condition: 'good' }
        ];
      }
    },
    enabled: debouncedQuery.length > 0 || Object.keys(filters).length > 0,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search Gura..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterBtn}>
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

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
          ListEmptyComponent={
            (debouncedQuery || Object.keys(filters).length > 0) ? (
              <Text style={styles.emptyText}>No results found.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <ListingCard
              id={item.id}
              title={item.title}
              price={item.price}
              condition={item.condition}
              sellerTier={item.seller_tier}
            />
          )}
        />
      )}

      <FilterDrawer 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onApply={(f) => setFilters(f)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 24,
    color: Colors.midnightInk,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: FontFamilies.body,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  filterBtn: {
    padding: 12,
    marginLeft: 8,
  },
  filterText: {
    fontFamily: FontFamilies.heading,
    color: Colors.guraOrange,
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
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    marginTop: 40,
  }
});
