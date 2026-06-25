import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes, LineHeights } from "@/constants/typography";

interface BodyProps {
  weight?: "light" | "regular";
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  size?: keyof typeof FontSizes;
}

export default function Body({
  weight = "regular",
  children,
  style,
  color = Colors.midnightInk,
  size = "base",
}: BodyProps) {
  const fontFamily =
    weight === "light" ? FontFamilies.bodyLight : FontFamilies.body;
  const fontSize = FontSizes[size];

  return (
    <Text
      style={[
        styles.body,
        {
          fontFamily,
          fontSize,
          lineHeight: fontSize * LineHeights.paragraph,
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
  body: {
    includeFontPadding: false,
  },
});
