import React, { useState, useRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";

interface InputProps extends Omit<RNTextInputProps, "style"> {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.danger : Colors.slateTint,
      error ? Colors.danger : Colors.guraOrange,
    ],
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.slate}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          autoCapitalize="none"
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.toggleButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.toggleText}>
              {isSecureVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.midnightInk,
    marginBottom: 8,
    includeFontPadding: false,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warmLinen,
    borderWidth: 1.5,
    borderRadius: 10,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.base,
    color: Colors.midnightInk,
    paddingHorizontal: 16,
    paddingVertical: 14,
    includeFontPadding: false,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  toggleText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
  errorText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.danger,
    marginTop: 6,
    includeFontPadding: false,
  },
});
