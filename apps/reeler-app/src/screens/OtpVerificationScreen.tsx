// SCREEN: OTP Verification
// REFERENCE: Reference_images/Reeler App/login_otp_verification/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OtpInputField } from "@silk-value/ui";
import { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "OtpVerify">;

export const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otpValue, setOtpValue] = useState<string>("");
  const [timer, setTimer] = useState<number>(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    // MOCK: Skip auth, navigate to KYC
    navigation.navigate("KycSubmission");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const maskedPhone = phoneNumber || "+91 98765 XXXXX";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Verify Mobile</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to{" "}
            <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
          </Text>

          {/* OTP Input */}
          <View style={styles.otpSection}>
            <OtpInputField
              length={4}
              value={otpValue}
              onChange={setOtpValue}
              autoFocus
            />
          </View>

          {/* Verify Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
              activeOpacity={0.8}
            >
              <Text style={styles.verifyLabel}>VERIFY & LOGIN</Text>
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={styles.timerSection}>
            <Text style={styles.timerText}>
              Resend code in{" "}
              <Text style={styles.timerBold}>
                0:{timer.toString().padStart(2, "0")}
              </Text>
            </Text>
          </View>
        </View>

        {/* Decorative bottom element */}
        <View style={styles.decorativeSection}>
          <View style={styles.decorativeLine} />
          <Text style={styles.decorativeIcon}>🚜</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  backArrow: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748B",
    marginTop: 16,
    lineHeight: 28,
  },
  phoneHighlight: {
    fontWeight: "600",
    color: "#1E293B",
  },
  otpSection: {
    marginTop: 48,
    marginBottom: 40,
  },
  buttonSection: {
    marginTop: 16,
  },
  verifyButton: {
    width: "100%",
    height: 64,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  timerSection: {
    marginTop: 32,
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    color: "#64748B",
  },
  timerBold: {
    fontWeight: "700",
    color: "#1E293B",
  },
  decorativeSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 32,
    opacity: 0.1,
  },
  decorativeLine: {
    width: "80%",
    height: 2,
    backgroundColor: "#CBD5E1",
    marginBottom: 16,
  },
  decorativeIcon: {
    fontSize: 64,
  },
});
