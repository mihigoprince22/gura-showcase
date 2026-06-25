import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Price from '../typography/Price';
import Body from '../typography/Body';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  imageUrl?: string;
  sellerTier?: string;
}

const ListingCard = ({ id, title, price, condition, imageUrl, sellerTier }: ListingCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => router.push(`/listing/${id}` as any)}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        {sellerTier === 'gura_certified' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Price amount={price} size={16} style={styles.price} />
        <Body size="xs" color={Colors.slate} style={styles.condition}>{condition.replace('_', ' ')}</Body>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ListingCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.warmLinen,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%', // For 2-column layout
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.slateTint,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.slateTint,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.malachite,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 14,
    color: Colors.midnightInk,
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    marginBottom: 4,
  },
  condition: {
    textTransform: 'capitalize',
  },
});
