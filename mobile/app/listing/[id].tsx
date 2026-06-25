import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useListing } from '../../hooks/useListings';
import { useWatchlistStore } from '../../store/watchlistStore';
import GuraButton from '@/components/brand/GuraButton';
import PriceIntelligenceWidget from '@/components/ui/PriceIntelligenceWidget';
import Button from '../../components/ui/Button';
import Heading from '../../components/typography/Heading';
import Body from '../../components/typography/Body';
import Price from '../../components/typography/Price';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isWatchlisted, toggleWatchlist } = useWatchlistStore();
  const watchlisted = isWatchlisted(id as string);
  const { data: listing, isLoading, error } = useListing(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-warm-linen items-center justify-center">
        <ActivityIndicator size="large" color="#FF5A1F" />
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View className="flex-1 bg-warm-linen items-center justify-center p-4">
        <Body className="text-danger text-center mb-4">Failed to load listing.</Body>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1" bounces={false}>
        <View className="relative">
          {/* Back Button */}
          <TouchableOpacity 
            className="absolute top-12 left-4 z-10 w-10 h-10 bg-midnight-ink/50 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#FAF6F1" />
          </TouchableOpacity>

          {/* Photo Carousel (Horizontal Scroll) */}
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {listing.photos.map((photo, index) => (
              <Image 
                key={index}
                source={{ uri: photo }} 
                style={{ width, height: width }}
                className="bg-slate/10"
              />
            ))}
            {listing.photos.length === 0 && (
              <View style={{ width, height: width }} className="bg-slate/10 items-center justify-center">
                <FontAwesome name="image" size={48} color="#6B7080" />
              </View>
            )}
          </ScrollView>
          <View className="absolute bottom-4 right-4 bg-midnight-ink/70 px-3 py-1 rounded-full">
            <Body className="text-warm-linen text-xs">1 / {Math.max(1, listing.photos.length)}</Body>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Heading level={2} className="flex-1 mr-4">{listing.title}</Heading>
            <TouchableOpacity 
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              onPress={() => toggleWatchlist(id as string)}
            >
              <FontAwesome name={watchlisted ? "heart" : "heart-o"} size={20} color={watchlisted ? "#FF5A1F" : "#0F0E17"} />
            </TouchableOpacity>
          </View>
          
          <Price amount={listing.price} size="xl" className="mb-4" />

          {listing.priceIntel && (
            <PriceIntelligenceWidget 
              insight={listing.priceIntel.insight} 
              message={listing.priceIntel.message} 
            />
          )}

          <View className="flex-row gap-2 mb-6 border-b border-slate/10 pb-6">
            <View className="bg-white px-3 py-1.5 rounded-full border border-slate/10">
              <Body className="text-sm text-midnight-ink">{listing.condition}</Body>
            </View>
            <View className="bg-white px-3 py-1.5 rounded-full border border-slate/10">
              <Body className="text-sm text-midnight-ink">{listing.format}</Body>
            </View>
            <View className="bg-white px-3 py-1.5 rounded-full border border-slate/10 flex-row items-center">
              <FontAwesome name="map-marker" size={12} color="#6B7080" style={{ marginRight: 4 }} />
              <Body className="text-sm text-midnight-ink">{listing.district}</Body>
            </View>
          </View>

          {/* Seller Card */}
          <View className="flex-row items-center bg-white p-4 rounded-xl border border-slate/10 mb-6">
            <View className="w-12 h-12 bg-gura-orange/20 rounded-full items-center justify-center mr-4">
              <Text className="font-plus-jakarta-sans-extrabold text-gura-orange text-lg">
                {listing.seller.name.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Body className="font-dm-sans-medium text-midnight-ink text-base">{listing.seller.name}</Body>
              <View className="flex-row items-center mt-1">
                <FontAwesome name="star" size={14} color="#F5A623" />
                <Body className="text-slate text-sm ml-1">{listing.seller.rating}</Body>
              </View>
            </View>
            <TouchableOpacity className="bg-slate/10 px-4 py-2 rounded-full">
              <Body className="text-midnight-ink font-dm-sans-medium">Message</Body>
            </TouchableOpacity>
          </View>

          <Heading level={3} className="mb-2">Description</Heading>
          <Body className="text-slate leading-relaxed mb-8">{listing.description}</Body>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View className="px-4 py-4 bg-white border-t border-slate/10 pb-8">
        <GuraButton 
          label={listing.listing_format === 'auction' ? "Place Bid" : "Buy Now"} 
          onPress={() => {
            if (listing.listing_format === 'auction') {
              router.push(`/listing/auction/${listing.id}` as any);
            } else {
              router.push(`/checkout/${listing.id}` as any);
            }
          }} 
        />
      </View>
    </View>
  );
}
