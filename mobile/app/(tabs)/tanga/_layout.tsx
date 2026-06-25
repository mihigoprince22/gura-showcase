import { Stack } from 'expo-router';

export default function TangaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FAF6F1' },
        headerTintColor: '#0F0E17',
        headerTitleStyle: { fontFamily: 'PlusJakartaSans_800ExtraBold' },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="step1-photos" options={{ title: 'Photos (1/5)' }} />
      <Stack.Screen name="step2-details" options={{ title: 'Details (2/5)' }} />
      <Stack.Screen name="step3-pricing" options={{ title: 'Pricing (3/5)' }} />
      <Stack.Screen name="step4-shipping" options={{ title: 'Shipping (4/5)' }} />
      <Stack.Screen name="step5-review" options={{ title: 'Review (5/5)' }} />
    </Stack>
  );
}
