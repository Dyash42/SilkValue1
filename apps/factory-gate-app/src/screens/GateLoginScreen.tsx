// ─── Screen 1: Gate Login — Combined Mobile + OTP ────────────────────────────
// TODO: Replace with real auth via Supabase OTP flow.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

export const GateLoginScreen: React.FC<any> = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert("Invalid", "Enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
  };

  const handleVerify = () => {
    // MOCK: Always succeeds
    Alert.alert("MOCK", "OTP Verified. In production, this would authenticate.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Identity */}
        <View style={styles.brandSection}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>🏭</Text>
          </View>
          <Text style={styles.title}>SILK VALUE</Text>
          <Text style={styles.subtitle}>FACTORY GATE APP</Text>
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="00000 00000"
              placeholderTextColor="#888888"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSendOtp}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>GET OTP</Text>
          </TouchableOpacity>
        </View>

        {/* OTP Input */}
        {otpSent && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ONE-TIME PASSWORD</Text>
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpBox}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(val) => {
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerify}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>VERIFY & LOGIN</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Security Note */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>SECURITY NOTE</Text>
            <Text style={styles.infoBody}>
              Ensure you are using an authorized device for gate operations.
              OTP is valid for 10 minutes.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            LOGIN PERSISTS UNTIL EXPLICIT LOGOUT.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 40,
  },
  brandSection: {
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: -2,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#474747",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  phoneRow: {
    flexDirection: "row",
    gap: 8,
  },
  countryCode: {
    width: 72,
    height: 52,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  primaryButton: {
    height: 52,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  infoCard: {
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#C6C6C6",
    borderRadius: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
    color: "#000000",
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  infoBody: {
    fontSize: 13,
    color: "#474747",
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#C6C6C6",
    paddingTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#474747",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
