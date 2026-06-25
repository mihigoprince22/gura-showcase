import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies } from "@/constants/typography";

interface LogoMarkProps {
  size?: number;
}

export default function LogoMark({ size = 72 }: LogoMarkProps) {
  const fontSize = size * 0.52;
  const barWidth = size * 0.32;
  const barHeight = 2;
  const borderRadius = size * 0.25;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.letter,
          {
            fontSize,
            lineHeight: fontSize * 1.15,
          },
        ]}
      >
        G
      </Text>
      <View
        style={[
          styles.bar,
          {
            width: barWidth,
            height: barHeight,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.guraOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontFamily: FontFamilies.heading,
    color: "#FFFAF7",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  bar: {
    backgroundColor: "#FFFAF7",
    borderRadius: 1,
    marginTop: 1,
  },
});
