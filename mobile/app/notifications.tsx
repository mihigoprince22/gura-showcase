import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'You won an auction!',
    message: 'Congratulations! You won "Vintage Kamera" for 45,000 RWF.',
    time: '2 hours ago',
    read: false,
    type: 'auction',
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: '"Used iPhone 12" dropped from 350,000 RWF to 320,000 RWF.',
    time: '5 hours ago',
    read: true,
    type: 'price',
  },
  {
    id: '3',
    title: 'Order Shipped',
    message: 'Your order for "Handmade Basket" has been shipped.',
    time: '1 day ago',
    read: true,
    type: 'order',
  },
];

function BellIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={styles.iconContainer}>
        <BellIcon color={item.read ? Colors.slate : Colors.guraOrange} size={24} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerStyle: { backgroundColor: Colors.warmLinen },
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FontFamilies.heading, fontSize: 20 },
        }} 
      />
      
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellIcon color={Colors.slateTint} size={64} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>You're all caught up!</Text>
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
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    alignItems: 'flex-start',
  },
  unreadCard: {
    borderColor: Colors.guraOrange,
    backgroundColor: '#FFF5F0', // Very light orange tint
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.obsidian,
    marginBottom: 4,
  },
  unreadText: {
    color: Colors.guraOrange,
  },
  message: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.slate,
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.guraOrange,
    marginTop: 6,
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
  },
});
