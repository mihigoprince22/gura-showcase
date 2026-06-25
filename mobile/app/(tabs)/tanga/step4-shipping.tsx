import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTangaStore } from '../../../store/tangaStore';
import Button from '../../../components/ui/Button';
import DistrictSelector from '../../../components/ui/DistrictSelector';
import Heading from '../../../components/typography/Heading';
import Body from '../../../components/typography/Body';

export default function Step4Shipping() {
  const router = useRouter();
  const { district, setDistrict } = useTangaStore();

  const isValid = district.length > 0;

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1 p-4">
        <Heading level={2} className="mb-6">Shipping & Location</Heading>
        
        <Body className="text-slate mb-6">Where is this item located? Buyers nearby can filter and pick up.</Body>

        <DistrictSelector
          value={district}
          onSelect={setDistrict}
          label="District"
        />
      </ScrollView>

      <View className="p-4 bg-warm-linen border-t border-slate/10 pb-8">
        <Button
          title="Next"
          onPress={() => router.push('/tanga/step5-review')}
          disabled={!isValid}
        />
      </View>
    </View>
  );
}
