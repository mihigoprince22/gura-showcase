import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, LetterSpacings } from "@/constants/typography";

interface WordmarkProps {
  size?: number;
  darkBackground?: boolean;
}

export default function Wordmark({ size = 32, darkBackground = false }: WordmarkProps) {
  const uraColor = darkBackground ? Colors.warmLinen : Colors.midnightInk;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            lineHeight: size * 1.2,
            color: Colors.guraOrange,
          },
        ]}
      >
        G
      </Text>
      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            lineHeight: size * 1.2,
            color: uraColor,
          },
        ]}
      >
        ura
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  text: {
    fontFamily: FontFamilies.heading,
    letterSpacing: LetterSpacings.wordmark,
    includeFontPadding: false,
  },
});
