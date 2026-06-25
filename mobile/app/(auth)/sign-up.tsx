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
import DistrictSelector from "@/components/ui/DistrictSelector";
import Body from "@/components/typography/Body";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { useRegister } from "@/hooks/useAuth";

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  district?: string;
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function SignUp() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!district) {
      newErrors.district = "Please select a district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await registerMutation.mutateAsync({
        email: email.trim(),
        username: username.trim(),
        password,
        district,
      });
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      Alert.alert("Registration Failed", message);
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

          <Text style={styles.eyebrow}>CREATE ACCOUNT</Text>

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
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
              }}
              error={errors.username}
            />

            <Input
              label="Password"
              placeholder="At least 8 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              secureTextEntry
            />

            <DistrictSelector
              label="District"
              value={district}
              onSelect={(d) => {
                setDistrict(d);
                if (errors.district) setErrors((e) => ({ ...e, district: undefined }));
              }}
              error={errors.district}
            />
          </View>

          <Body
            size="xs"
            color={Colors.slate}
            style={styles.terms}
          >
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Body>

          <View style={styles.buttonContainer}>
            <GuraButton
              label="Create Account"
              onPress={handleSubmit}
              loading={registerMutation.isPending}
            />
          </View>

          <View style={styles.footer}>
            <Body size="sm" color={Colors.slate}>
              Already have an account?{" "}
            </Body>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/log-in")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.link}>Log in</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  eyebrow: {
    fontFamily: FontFamilies.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.guraOrange,
    marginBottom: 24,
    includeFontPadding: false,
  },
  form: {
    marginBottom: 8,
  },
  terms: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 24,
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
