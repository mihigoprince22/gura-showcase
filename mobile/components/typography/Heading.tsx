import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { Colors } from "@/constants/colors";
import {
  FontFamilies,
  HeadingSizes,
  HeadingLetterSpacings,
  LineHeights,
} from "@/constants/typography";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
}

export default function Heading({
  level = 2,
  children,
  style,
  color = Colors.midnightInk,
}: HeadingProps) {
  const fontSize = HeadingSizes[level];
  const letterSpacing = HeadingLetterSpacings[level];

  return (
    <Text
      style={[
        styles.heading,
        {
          fontSize,
          letterSpacing,
          lineHeight: fontSize * LineHeights.heading,
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: FontFamilies.heading,
    includeFontPadding: false,
  },
});
