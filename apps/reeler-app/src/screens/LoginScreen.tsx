// SCREEN: Login — Mobile Number Entry
// REFERENCE: Reference_images/Reeler App/login_mobile_number_entry/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSendOtp = () => {
    navigation.navigate("OtpVerify", { phoneNumber: phoneNumber || "+91 98765 43210" });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header with back arrow */}
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
          {/* Branding */}
          <View style={styles.brandingSection}>
            <View style={styles.iconBox}>
              <Text style={styles.iconGlyph}>🚜</Text>
            </View>
            <Text style={styles.welcomeTitle}>WELCOME</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter your mobile number to continue
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 (000) 000-0000"
              placeholderTextColor="#94A3B8"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.sendOtpButton}
              onPress={handleSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.sendOtpLabel}>SEND OTP</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms and Conditions
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  brandingSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  iconGlyph: {
    fontSize: 36,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    height: 64,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    letterSpacing: 1,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingVertical: 40,
  },
  sendOtpButton: {
    height: 64,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendOtpLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  termsText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
  },
});
