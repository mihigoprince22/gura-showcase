import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTangaStore } from '../../../store/tangaStore';
import Button from '../../../components/ui/Button';
import Heading from '../../../components/typography/Heading';
import Body from '../../../components/typography/Body';

const MOCK_IMAGES = [
  'https://placehold.co/300x300/E65100/white?text=Electronics',
  'https://placehold.co/300x300/1565C0/white?text=Clothing',
  'https://placehold.co/300x300/2E7D32/white?text=Sneakers',
  'https://placehold.co/300x300/795548/white?text=Artisan',
  'https://placehold.co/300x300/9C27B0/white?text=Home+Decor',
  'https://placehold.co/300x300/FF6F00/white?text=Sports',
];

export default function Step1Photos() {
  const router = useRouter();
  const { photos, setPhotos } = useTangaStore();
  const [selectedMock, setSelectedMock] = useState<string | null>(null);

  const handleSelectMock = (uri: string) => {
    setSelectedMock(uri);
    setPhotos([uri]); // For demo, just set the selected one
  };

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1 p-4">
        <Heading level={2} className="mb-2">Choose Item Photo</Heading>
        <Body className="text-slate mb-6">For this demo, please select one of the mock photos below.</Body>

        <View className="flex-row flex-wrap gap-4 justify-between">
          {MOCK_IMAGES.map((uri, index) => {
            const isSelected = selectedMock === uri || photos.includes(uri);
            return (
              <TouchableOpacity
                key={index}
                className={`w-[47%] aspect-square rounded-xl overflow-hidden relative border-[3px] ${
                  isSelected ? 'border-gura-orange' : 'border-transparent'
                }`}
                onPress={() => handleSelectMock(uri)}
              >
                <Image source={{ uri }} className="w-full h-full" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-4 bg-warm-linen border-t border-slate/10 pb-8">
        <Button
          title="Next"
          onPress={() => router.push('/tanga/step2-details')}
          disabled={photos.length === 0}
        />
      </View>
    </View>
  );
}
