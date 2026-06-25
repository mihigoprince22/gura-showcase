import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";

interface PriceProps {
  amount: number;
  currency?: string;
  size?: keyof typeof FontSizes;
  style?: StyleProp<TextStyle>;
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Price({
  amount,
  currency = "RWF",
  size = "lg",
  style,
}: PriceProps) {
  const fontSize = FontSizes[size];

  return (
    <Text
      style={[
        styles.price,
        {
          fontSize,
          lineHeight: fontSize * 1.3,
        },
        style,
      ]}
    >
      {currency} {formatNumber(amount)}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontFamily: FontFamilies.mono,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
});
