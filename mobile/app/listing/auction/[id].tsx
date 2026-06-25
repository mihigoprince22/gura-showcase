import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import GuraButton from '@/components/brand/GuraButton';
import Price from '@/components/typography/Price';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

// For MVP, assuming backend runs locally
const SOCKET_URL = 'http://10.0.2.2:3000'; // Android emulator to local host

export default function LiveAuctionScreen() {
  const { id } = useLocalSearchParams();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [winningBidder, setWinningBidder] = useState<string | null>(null);
  const [proxyBid, setProxyBid] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await api.get(`/api/listings/${id}`);
      return res.data;
    }
  });

  useEffect(() => {
    if (listing) {
      setCurrentPrice(listing.current_price || 0);
    }
  }, [listing]);

  useEffect(() => {
    // Initialize Socket.io
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_auction', id);
    });

    newSocket.on('bidUpdate', (data: { listingId: string, currentPrice: number, winningBidderId: string }) => {
      if (data.listingId === id) {
        setCurrentPrice(data.currentPrice);
        setWinningBidder(data.winningBidderId);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const handlePlaceBid = async () => {
    const amount = parseInt(proxyBid.replace(/[^0-9]/g, ''), 10);
    if (isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    try {
      const res = await api.post('/api/auctions/bid', {
        listing_id: id,
        bid_amount: amount,
      });
      Alert.alert('Success', 'Your proxy bid was placed successfully!');
      setProxyBid('');
      // Socket will update the UI via event
    } catch (err: any) {
      Alert.alert('Bid Failed', err.response?.data?.error || err.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.liveBadge}>● LIVE AUCTION</Text>
          <Text style={styles.title}>{listing?.title || 'Loading...'}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Current Highest Bid</Text>
          <Price amount={currentPrice} size={32} style={styles.currentPrice} />
          {winningBidder && (
            <Text style={styles.winningBidderText}>
              Current Winner: <Text style={{fontWeight: 'bold'}}>{winningBidder.substring(0, 8)}...</Text>
            </Text>
          )}
        </View>

        <View style={styles.bidSection}>
          <Text style={styles.sectionTitle}>Place Proxy Bid</Text>
          <Text style={styles.helperText}>
            Enter your maximum amount. We will automatically bid on your behalf up to this amount to keep you winning.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currency}>RWF</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50000"
              keyboardType="numeric"
              value={proxyBid}
              onChangeText={setProxyBid}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <GuraButton 
          label="Place Bid" 
          onPress={handlePlaceBid} 
          disabled={!proxyBid}
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
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  liveBadge: {
    color: '#E02424',
    fontFamily: FontFamilies.heading,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: Colors.midnightInk,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginBottom: 24,
  },
  priceLabel: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    marginBottom: 8,
  },
  currentPrice: {
    marginBottom: 16,
  },
  winningBidderText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.malachite,
  },
  bidSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    marginBottom: 8,
  },
  helperText: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.slateTint,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  currency: {
    fontFamily: FontFamilies.mono,
    color: Colors.slate,
    marginRight: 12,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontFamily: FontFamilies.mono,
    fontSize: 20,
    color: Colors.midnightInk,
    height: '100%',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
  }
});
