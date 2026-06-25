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
import { FontFamilies } from "@/constants/typography";

interface GuraButtonProps {
  label?: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function GuraButton({
  label = "Gura",
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: GuraButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

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
        style={[
          styles.button,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={isPrimary ? "#FFFAF7" : Colors.guraOrange}
            size="small"
          />
        ) : (
          <Text
            style={[
              styles.label,
              isPrimary ? styles.primaryLabel : styles.secondaryLabel,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
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
    borderWidth: 2,
    borderColor: Colors.guraOrange,
  },
  label: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    includeFontPadding: false,
  },
  primaryLabel: {
    color: "#FFFAF7",
  },
  secondaryLabel: {
    color: Colors.guraOrange,
  },
});
