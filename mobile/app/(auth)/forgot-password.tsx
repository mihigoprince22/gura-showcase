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
import Heading from "@/components/typography/Heading";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPassword() {
  const router = useRouter();
  const forgotMutation = useForgotPassword();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await forgotMutation.mutateAsync(email.trim());
      setIsSuccess(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      Alert.alert("Error", message);
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

          <Text style={styles.eyebrow}>RESET PASSWORD</Text>

          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successBadge}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Heading level={3} style={styles.successTitle}>
                Check your email
              </Heading>
              <Body
                color={Colors.slate}
                style={styles.successBody}
              >
                We've sent a password reset link to{" "}
                <Body weight="regular" color={Colors.midnightInk}>
                  {email}
                </Body>
                . Please check your inbox and follow the instructions to reset your password.
              </Body>

              <View style={styles.buttonContainer}>
                <GuraButton
                  label="Back to Log In"
                  onPress={() => router.push("/(auth)/log-in")}
                  variant="secondary"
                />
              </View>
            </View>
          ) : (
            <>
              <Body
                color={Colors.slate}
                style={styles.description}
              >
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </Body>

              <View style={styles.form}>
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError("");
                  }}
                  error={emailError}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.buttonContainer}>
                <GuraButton
                  label="Send Reset Link"
                  onPress={handleSubmit}
                  loading={forgotMutation.isPending}
                />
              </View>
            </>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/log-in")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>← Back to Log In</Text>
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
    marginBottom: 16,
    includeFontPadding: false,
  },
  description: {
    marginBottom: 28,
    lineHeight: 24,
  },
  form: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  footer: {
    alignItems: "center",
  },
  link: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
  successContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.malachiteTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontFamily: FontFamilies.heading,
    fontSize: 28,
    color: Colors.malachite,
    includeFontPadding: false,
  },
  successTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  successBody: {
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
});
