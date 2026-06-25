import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTangaStore } from '../../../store/tangaStore';
import { useCreateListing } from '../../../hooks/useListings';
import Button from '../../../components/ui/Button';
import Heading from '../../../components/typography/Heading';
import Body from '../../../components/typography/Body';
import Price from '../../../components/typography/Price';

export default function Step5Review() {
  const router = useRouter();
  const tangaState = useTangaStore();
  const { photos, title, category, condition, description, format, price, district, reset } = tangaState;
  const createListing = useCreateListing();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      const newListing = await createListing.mutateAsync({
        title,
        category,
        condition,
        description,
        format,
        price: Number(price),
        district,
        photos,
      });
      Alert.alert('Success', 'Your listing has been published!', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            router.replace('/(tabs)/dashboard');
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1 p-4">
        <Heading level={2} className="mb-6">Review Listing</Heading>

        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {photos.map((uri, i) => (
              <Image key={i} source={{ uri }} className="w-24 h-24 rounded-xl mr-2" />
            ))}
          </ScrollView>
        </View>

        <View className="bg-white/50 p-4 rounded-xl border border-slate/10 mb-6">
          <Heading level={3} className="mb-2">{title}</Heading>
          <Price amount={Number(price)} size="lg" className="mb-4" />
          
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-slate/10 px-3 py-1 rounded-full">
              <Body className="text-midnight-ink text-sm">{category}</Body>
            </View>
            <View className="bg-slate/10 px-3 py-1 rounded-full">
              <Body className="text-midnight-ink text-sm">{condition}</Body>
            </View>
            <View className="bg-slate/10 px-3 py-1 rounded-full">
              <Body className="text-midnight-ink text-sm">{format}</Body>
            </View>
            <View className="bg-slate/10 px-3 py-1 rounded-full">
              <Body className="text-midnight-ink text-sm">{district}</Body>
            </View>
          </View>

          <Body className="text-midnight-ink mb-1 font-dm-sans-medium">Description</Body>
          <Body className="text-slate">{description}</Body>
        </View>
      </ScrollView>

      <View className="p-4 bg-warm-linen border-t border-slate/10 pb-8">
        <Button
          title={isSubmitting ? "Publishing..." : "Tanga"}
          onPress={handlePublish}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
