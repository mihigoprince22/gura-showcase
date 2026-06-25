import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  const buttonStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    ghost: styles.ghostButton,
  };

  const labelStyles = {
    primary: styles.primaryLabel,
    secondary: styles.secondaryLabel,
    ghost: styles.ghostLabel,
  };

  const spinnerColors = {
    primary: "#FFFAF7",
    secondary: Colors.guraOrange,
    ghost: Colors.guraOrange,
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[styles.button, buttonStyles[variant]]}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColors[variant]} size="small" />
        ) : (
          <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: Colors.guraOrange,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.guraOrange,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  label: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.base,
    includeFontPadding: false,
  },
  primaryLabel: {
    color: "#FFFAF7",
  },
  secondaryLabel: {
    color: Colors.guraOrange,
  },
  ghostLabel: {
    color: Colors.guraOrange,
  },
});
