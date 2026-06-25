import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';

function SearchIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H5H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function SavedSearchesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: searches, isLoading } = useQuery({
    queryKey: ['savedSearches'],
    queryFn: async () => {
      const res = await api.get<any[]>('/saved-searches');
      return res;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/saved-searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedSearches'] });
    }
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string, enabled: boolean }) => {
      return api.put(`/saved-searches/${id}/alert`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedSearches'] });
    }
  });

  const renderItem = ({ item }: { item: any }) => {
    let filterText = '';
    if (item.filters) {
      try {
        const filtersObj = JSON.parse(item.filters);
        const keys = Object.keys(filtersObj).filter(k => k !== 'query');
        if (keys.length > 0) {
          filterText = keys.join(', ');
        }
      } catch (e) {}
    }

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardInfo}
          onPress={() => router.push(`/search?q=${item.query}`)}
        >
          <Text style={styles.query}>"{item.query}"</Text>
          {filterText ? <Text style={styles.filters}>Filters: {filterText}</Text> : null}
        </TouchableOpacity>
        
        <View style={styles.actions}>
          <View style={styles.alertToggle}>
            <Text style={styles.alertText}>Alerts</Text>
            <Switch
              value={item.alert_enabled}
              onValueChange={(val) => toggleAlertMutation.mutate({ id: item.id, enabled: val })}
              trackColor={{ false: Colors.slateTint, true: Colors.guraOrange }}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
          >
            <TrashIcon color={Colors.slate} size={20} />
          </TouchableOpacity>
        </View>
      </View>
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
          title: 'Saved Searches',
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
        data={searches}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SearchIcon color={Colors.slateTint} size={64} />
            <Text style={styles.emptyTitle}>No saved searches</Text>
            <Text style={styles.emptyText}>Save searches to get notified when new items match what you're looking for.</Text>
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
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  cardInfo: {
    marginBottom: 16,
  },
  query: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.obsidian,
    marginBottom: 4,
  },
  filters: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
    paddingTop: 12,
  },
  alertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 4,
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
