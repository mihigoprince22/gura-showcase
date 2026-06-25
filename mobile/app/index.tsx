import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import LogoMark from "@/components/brand/LogoMark";
import Wordmark from "@/components/brand/Wordmark";
import ImigongoPattern from "@/components/brand/ImigongoPattern";
import { Colors } from "@/constants/colors";
import { FontFamilies } from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";

export default function SplashScreenPage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 6,
        }),
      ]),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else if (isOnboarded) {
        router.replace("/(auth)/log-in");
      } else {
        router.replace("/onboarding");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOnboarded, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ImigongoPattern
        opacity={0.06}
        width={width}
        height={height}
      />

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <LogoMark size={100} />
        </Animated.View>

        <Animated.View
          style={[styles.wordmarkContainer, { opacity: wordmarkOpacity }]}
        >
          <Wordmark size={42} darkBackground />
        </Animated.View>

        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.tagline}>Tanga. Gura. Kura.</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnightInk,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmarkContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
  tagline: {
    fontFamily: FontFamilies.bodyLight,
    fontSize: 16,
    color: Colors.guraOrange,
    letterSpacing: 1,
    includeFontPadding: false,
  },
});
