import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export default function InboxScreen() {
  const router = useRouter();

  const { data: threads, isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: async () => {
      const res = await api.get<any>('/messages');
      return res.data?.data?.threads || res.data?.threads || [];
    },
    // Poll every 10s for new inbox items as a fallback
    refetchInterval: 10000,
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.threadItem}
      onPress={() => router.push(`/chat/${item.thread_id}` as any)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.other_user?.display_name?.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.threadContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.listing?.title}</Text>
        <Text style={[styles.lastMessage, item.unread_count > 0 && styles.unreadMessage]} numberOfLines={1}>
          {item.last_message}
        </Text>
      </View>
      {item.unread_count > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.guraOrange} />
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.thread_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: Colors.midnightInk,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    textAlign: 'center',
    marginTop: 40,
  },
  threadItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.warmLinen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontFamily: FontFamilies.heading,
    color: Colors.guraOrange,
    fontSize: 16,
  },
  threadContent: {
    flex: 1,
    marginRight: 8,
  },
  listingTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.midnightInk,
    marginBottom: 4,
  },
  lastMessage: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    fontSize: 14,
  },
  unreadMessage: {
    color: Colors.midnightInk,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: Colors.guraOrange,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontFamily: FontFamilies.heading,
    color: '#FFFFFF',
    fontSize: 12,
  }
});
