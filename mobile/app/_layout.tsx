import "../global.css";

import React, { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DMSans_300Light, DMSans_400Regular } from "@expo-google-fonts/dm-sans";
import { SpaceMono_700Bold } from "@expo-google-fonts/space-mono";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_800ExtraBold,
    DMSans_300Light,
    DMSans_400Regular,
    SpaceMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF6F1', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E65100" />
      </View>
    );
  }

  return (
    <View style={Platform.OS === 'web' ? { flex: 1, alignItems: 'center', backgroundColor: '#e5e7eb' } : { flex: 1 }}>
      <View style={Platform.OS === 'web' ? { flex: 1, width: '100%', maxWidth: 430, backgroundColor: '#FAF6F1', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : { flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#FAF6F1" },
              animation: "fade",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </QueryClientProvider>
      </View>
    </View>
  );
}
