import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import GuraButton from '@/components/brand/GuraButton';

export default function ReviewScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/reviews', {
        order_id: orderId,
        rating,
        comment,
      });
      Alert.alert('Success', 'Thank you for your review!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave a Review</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.prompt}>How was your experience with this seller?</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating ? styles.starSelected : styles.starUnselected]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Detailed Feedback (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us what you loved or what could be improved..."
          placeholderTextColor={Colors.slate}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />

      </View>

      <View style={styles.footer}>
        <GuraButton 
          label="Submit Review" 
          onPress={handleSubmit} 
          loading={isSubmitting}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  backBtn: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: Colors.midnightInk,
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.midnightInk,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  prompt: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.midnightInk,
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  star: {
    fontSize: 48,
    marginHorizontal: 8,
  },
  starSelected: {
    color: Colors.savannaGold,
  },
  starUnselected: {
    color: Colors.slateTint,
  },
  label: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.midnightInk,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.slateTint,
    borderRadius: 8,
    padding: 16,
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.midnightInk,
    minHeight: 120,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
  }
});
