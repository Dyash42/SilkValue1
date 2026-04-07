// ─── Universal Login Screen — Phone OTP Authentication ───────────────────────
// Two-step flow: phone number entry → OTP verification.
// Uses only @silk-value/ui components. Does NOT navigate on success —
// SuperRootNavigator reacts to auth state changes automatically.

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  theme,
  AppLogo,
  TextInputField,
  OtpInputField,
  PrimaryButton,
} from "@silk-value/ui";
import { supabase } from "../config/supabaseClient";

type Step = "phone" | "otp";

export const UniversalLoginScreen: React.FC = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ── Derived ────────────────────────────────────────────────────────────────
  const fullPhone = `+91${phone}`;
  const isPhoneValid = /^\d{10}$/.test(phone);
  const isOtpValid = /^\d{6}$/.test(otp);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!isPhoneValid) return;
    setError("");
    setIsLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      });

      if (otpError) {
        setError(otpError.message);
      } else {
        setStep("otp");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send OTP";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpValid) return;
    setError("");
    setIsLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: "sms",
      });

      if (verifyError) {
        setError(verifyError.message);
      }
      // On success, the session is set automatically by the Supabase client.
      // SuperRootNavigator will detect this via onAuthStateChange and route
      // the user to their role-specific navigator. Do NOT navigate manually.
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <AppLogo size="large" subtitle="Unified Silk Platform" />
        </View>

        {step === "phone" ? (
          // ── Step 1: Phone Number Entry ──────────────────────────────────
          <View style={styles.formContainer}>
            <Text style={styles.heading}>SIGN IN</Text>
            <Text style={styles.description}>
              Enter your registered mobile number to receive a one-time
              verification code.
            </Text>

            <TextInputField
              label="MOBILE NUMBER"
              placeholder="9876543210"
              value={phone}
              onChangeText={(text) => {
                setPhone(text.replace(/[^0-9]/g, "").slice(0, 10));
                setError("");
              }}
              keyboardType="number-pad"
              leftPrefix="+91"
              maxLength={10}
              error={error || undefined}
              testID="phone-input"
            />

            <View style={styles.buttonSpacer} />

            <PrimaryButton
              label="GET OTP"
              onPress={handleSendOtp}
              disabled={!isPhoneValid}
              loading={isLoading}
              testID="send-otp-button"
            />
          </View>
        ) : (
          // ── Step 2: OTP Verification ───────────────────────────────────
          <View style={styles.formContainer}>
            <Text style={styles.heading}>VERIFY OTP</Text>
            <Text style={styles.description}>
              Enter the 6-digit code sent to {fullPhone}
            </Text>

            <OtpInputField
              length={6}
              value={otp}
              onChange={(text) => {
                setOtp(text);
                setError("");
              }}
              autoFocus
              testID="otp-input"
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <View style={styles.buttonSpacer} />

            <PrimaryButton
              label="VERIFY & CONTINUE"
              onPress={handleVerifyOtp}
              disabled={!isOtpValid}
              loading={isLoading}
              testID="verify-otp-button"
            />

            {/* Back to phone entry */}
            <View style={styles.backLinkContainer}>
              <Text
                style={styles.backLink}
                onPress={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
              >
                ← Change number
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SILK VALUE • SECURE OTP LOGIN
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenPaddingHorizontal,
    paddingTop: theme.layout.screenPaddingVertical,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  formContainer: {
    flex: 1,
  },
  heading: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: theme.typography.letterSpacingWide,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  buttonSpacer: {
    height: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  backLinkContainer: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  backLink: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
  },
  footer: {
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
});
