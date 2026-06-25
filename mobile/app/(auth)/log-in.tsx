import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Wordmark from "@/components/brand/Wordmark";
import GuraButton from "@/components/brand/GuraButton";
import Input from "@/components/ui/Input";
import Body from "@/components/typography/Body";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { useLogin } from "@/hooks/useAuth";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LogIn() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed. Please check your credentials.";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Wordmark size={28} />
          </View>

          <Text style={styles.eyebrow}>WELCOME BACK</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={styles.forgotContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <GuraButton
              label="Log In"
              onPress={handleSubmit}
              loading={loginMutation.isPending}
            />
          </View>

          <View style={styles.footer}>
            <Body size="sm" color={Colors.slate}>
              New to Gura?{" "}
            </Body>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  eyebrow: {
    fontFamily: FontFamilies.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.guraOrange,
    marginBottom: 28,
    includeFontPadding: false,
  },
  form: {
    marginBottom: 4,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.sm,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
});
