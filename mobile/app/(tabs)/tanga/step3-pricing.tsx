import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTangaStore } from '../../../store/tangaStore';
import Button from '../../../components/ui/Button';
import Heading from '../../../components/typography/Heading';
import Body from '../../../components/typography/Body';

export default function Step3Pricing() {
  const router = useRouter();
  const { format, setFormat, price, setPrice } = useTangaStore();

  const isValid = price.length > 0 && !isNaN(Number(price));

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1 p-4">
        <Heading level={2} className="mb-6">Pricing</Heading>

        <View className="mb-8">
          <Body className="text-midnight-ink mb-2 font-dm-sans-medium">Selling Format</Body>
          <View className="flex-row gap-4">
            {(['Fixed', 'Auction'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setFormat(f)}
                className={`flex-1 py-3 rounded-xl border items-center ${format === f ? 'bg-malachite border-malachite' : 'border-slate/30 bg-transparent'}`}
              >
                <Body className={`font-dm-sans-medium ${format === f ? 'text-warm-linen' : 'text-slate'}`}>{f}</Body>
              </TouchableOpacity>
            ))}
          </View>
          <Body className="text-slate text-sm mt-2">
            {format === 'Fixed' ? 'Sell at a fixed price.' : 'Let buyers bid on your item.'}
          </Body>
        </View>

        <View className="mb-6">
          <Body className="text-midnight-ink mb-2 font-dm-sans-medium">Price (RWF)</Body>
          <View className="flex-row items-center border border-slate/30 rounded-xl bg-white/50 px-4 py-3 focus:border-gura-orange">
            <Body className="text-slate mr-2 font-space-mono-bold">RWF</Body>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="0"
              className="flex-1 font-space-mono-bold text-gura-orange text-2xl"
              placeholderTextColor="#6B7080"
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-4 bg-warm-linen border-t border-slate/10 pb-8">
        <Button
          title="Next"
          onPress={() => router.push('/tanga/step4-shipping')}
          disabled={!isValid}
        />
      </View>
    </View>
  );
}
