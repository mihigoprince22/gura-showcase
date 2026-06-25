import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTangaStore } from '../../../store/tangaStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Heading from '../../../components/typography/Heading';
import Body from '../../../components/typography/Body';

const CATEGORIES = ['Electronics', 'Clothing', 'Art & Craft', 'Home', 'Vehicles'];
const CONDITIONS = ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'];

export default function Step2Details() {
  const router = useRouter();
  const { title, setTitle, category, setCategory, condition, setCondition, description, setDescription } = useTangaStore();

  const isValid = title.length > 0 && category.length > 0 && condition.length > 0 && description.length > 0;

  return (
    <View className="flex-1 bg-warm-linen">
      <ScrollView className="flex-1 p-4">
        <Heading level={2} className="mb-6">Item Details</Heading>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What are you selling?"
          className="mb-6"
        />

        <View className="mb-6">
          <Body className="text-midnight-ink mb-2 font-dm-sans-medium">Category</Body>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-gura-orange border-gura-orange' : 'border-slate/30 bg-transparent'}`}
              >
                <Body className={category === cat ? 'text-warm-linen' : 'text-slate'}>{cat}</Body>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Body className="text-midnight-ink mb-2 font-dm-sans-medium">Condition</Body>
          <View className="flex-row flex-wrap gap-2">
            {CONDITIONS.map(cond => (
              <TouchableOpacity
                key={cond}
                onPress={() => setCondition(cond)}
                className={`px-4 py-2 rounded-full border ${condition === cond ? 'bg-midnight-ink border-midnight-ink' : 'border-slate/30 bg-transparent'}`}
              >
                <Body className={condition === cond ? 'text-warm-linen' : 'text-slate'}>{cond}</Body>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your item..."
          multiline
          numberOfLines={4}
          className="mb-6"
        />
      </ScrollView>

      <View className="p-4 bg-warm-linen border-t border-slate/10 pb-8">
        <Button
          title="Next"
          onPress={() => router.push('/tanga/step3-pricing')}
          disabled={!isValid}
        />
      </View>
    </View>
  );
}
