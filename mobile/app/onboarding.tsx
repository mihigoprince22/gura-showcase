import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Rect, Circle, Polygon } from "react-native-svg";
import GuraButton from "@/components/brand/GuraButton";
import Heading from "@/components/typography/Heading";
import Body from "@/components/typography/Body";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  title: string;
  body: string;
  icon: React.ReactNode;
}

function GuraIcon() {
  return (
    <Svg width={140} height={140} viewBox="0 0 140 140">
      <Rect x="10" y="10" width="120" height="120" rx="24" fill={Colors.orangeTint} />
      <Circle cx="70" cy="58" r="30" fill={Colors.guraOrange} />
      <Rect x="50" y="95" width="40" height="8" rx="4" fill={Colors.savannaGold} />
      <Rect x="40" y="108" width="60" height="6" rx="3" fill={Colors.slateTint} />
    </Svg>
  );
}

function TangaIcon() {
  return (
    <Svg width={140} height={140} viewBox="0 0 140 140">
      <Rect x="10" y="10" width="120" height="120" rx="24" fill={Colors.goldTint} />
      <Rect x="35" y="35" width="70" height="50" rx="8" fill={Colors.savannaGold} />
      <Rect x="45" y="45" width="50" height="6" rx="3" fill="#FFFAF7" />
      <Rect x="45" y="57" width="35" height="6" rx="3" fill="#FFFAF7" />
      <Polygon points="70,95 55,115 85,115" fill={Colors.guraOrange} />
    </Svg>
  );
}

function KuraIcon() {
  return (
    <Svg width={140} height={140} viewBox="0 0 140 140">
      <Rect x="10" y="10" width="120" height="120" rx="24" fill={Colors.malachiteTint} />
      <Circle cx="70" cy="60" r="25" fill={Colors.malachite} />
      <Rect x="55" y="50" width="30" height="20" rx="4" fill="#FFFAF7" />
      <Polygon points="70,52 62,62 78,62" fill={Colors.malachite} />
      <Rect x="45" y="95" width="50" height="8" rx="4" fill={Colors.malachite} opacity={0.4} />
      <Rect x="50" y="108" width="40" height="6" rx="3" fill={Colors.slateTint} />
    </Svg>
  );
}

const SLIDES: Slide[] = [
  {
    title: "Gura",
    body: "Find unique items from sellers across East Africa. From handcrafted goods to everyday essentials — discover it all.",
    icon: <GuraIcon />,
  },
  {
    title: "Tanga",
    body: "List your items in minutes. Set your price or start an auction. Reach thousands of buyers across the region.",
    icon: <TangaIcon />,
  },
  {
    title: "Kura",
    body: "Build your reputation. Grow your business. Every successful transaction helps you stand out in the marketplace.",
    icon: <KuraIcon />,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleGetStarted = () => {
    setOnboarded(true);
    router.replace("/(auth)/sign-up");
  };

  const handleSkip = () => {
    setOnboarded(true);
    router.replace("/(auth)/log-in");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 50 }} />
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={styles.iconArea}>{slide.icon}</View>
            <View style={styles.textArea}>
              <Heading level={1}>{slide.title}</Heading>
              <Body
                color={Colors.slate}
                style={styles.slideBody}
              >
                {slide.body}
              </Body>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {activeIndex === SLIDES.length - 1 ? (
          <GuraButton label="Get Started" onPress={handleGetStarted} />
        ) : (
          <GuraButton
            label="Next"
            onPress={() => {
              const nextIndex = activeIndex + 1;
              scrollViewRef.current?.scrollTo({
                x: nextIndex * SCREEN_WIDTH,
                animated: true,
              });
            }}
            variant="secondary"
          />
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.slate,
    includeFontPadding: false,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.guraOrange,
    width: 24,
  },
  dotInactive: {
    backgroundColor: Colors.slateTint,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconArea: {
    marginBottom: 48,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: Colors.warmLinen,
  },
  textArea: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  slideBody: {
    marginTop: 12,
    textAlign: "center",
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
