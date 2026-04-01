// ─── LoginScreen — Silk Value Collector App ──────────────────────────────────
// Industrial Brutalist login flow: Phone → OTP → Verify.
// All UI components imported from @silk-value/ui. No local visual definitions.
// Layout: Flexbox only. Zero absolute positioning.

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  theme,
  AppLogo,
  TextInputField,
  PrimaryButton,
  OtpInputField,
} from "@silk-value/ui";
import { SupabaseAuthService } from "../../services/auth";

// ── Validation helpers ───────────────────────────────────────────────────────

const PHONE_REGEX = /^\d{10}$/;
const OTP_LENGTH = 6;

function validatePhone(phone: string): string | undefined {
  if (phone.length === 0) return undefined;
  if (/[^0-9]/.test(phone)) return "Phone number must contain digits only";
  if (phone.length < 10) return "Phone number must be 10 digits";
  if (!PHONE_REGEX.test(phone)) return "Enter a valid 10 digit number";
  return undefined;
}

function validateOtp(otp: string): string | undefined {
  if (otp.length === 0) return undefined;
  if (otp.length < OTP_LENGTH) return "OTP must be 6 digits";
  return undefined;
}

// ── Component ────────────────────────────────────────────────────────────────

export const LoginScreen: React.FC = () => {
  // Local state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [otpError, setOtpError] = useState<string | undefined>(undefined);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePhoneChange = (text: string) => {
    // Strip non-digits as they type
    const digits = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(digits);
    if (phoneError) setPhoneError(undefined);
  };

  const handleGetOtp = async () => {
    const error = validatePhone(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    setIsLoadingOtp(true);
    setPhoneError(undefined);

    try {
      const result = await SupabaseAuthService.signInWithPhone(`+91${phoneNumber}`);

      if (!result.success) {
        setPhoneError(result.error || "Failed to send OTP. Try again.");
        return;
      }

      setIsOtpSent(true);
    } catch {
      setPhoneError("Failed to send OTP. Try again.");
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (otpError) setOtpError(undefined);
  };

  const handleVerifyLogin = async () => {
    const error = validateOtp(otp);
    if (error) {
      setOtpError(error);
      return;
    }

    setIsLoadingLogin(true);
    setOtpError(undefined);

    try {
      const result = await SupabaseAuthService.verifyOtp(
        `+91${phoneNumber}`,
        otp
      );

      if (!result.success) {
        setOtpError(result.error || "Invalid OTP. Please try again.");
        return;
      }

      // Session established — log for now, navigate to Home in next phase
      console.warn("✅ Login successful!", {
        userId: result.session?.userId,
        hasAccessToken: !!result.session?.accessToken,
      });

      // TODO: Navigate to Home/Dashboard screen
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsLoadingLogin(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Logo Area ──────────────────────────────────── */}
        <View style={styles.logoSection}>
          <AppLogo size="medium" subtitle="Collector App" />
        </View>

        {/* ── Section 2: Mobile Number Input ────────────────────────── */}
        <View style={styles.inputSection}>
          <TextInputField
            testID="login-phone-input"
            label="Mobile Number"
            placeholder="Enter 10 digit number"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            leftPrefix="+91"
            maxLength={10}
            error={phoneError}
          />
        </View>

        {/* ── Section 3: Get OTP Button ─────────────────────────────── */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            testID="login-get-otp-btn"
            label="Get OTP"
            onPress={handleGetOtp}
            loading={isLoadingOtp}
            disabled={phoneNumber.length < 10}
          />
        </View>

        {/* ── Section 4: OTP Input (conditional) ────────────────────── */}
        {isOtpSent ? (
          <View style={styles.otpSection}>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <OtpInputField
              testID="login-otp-input"
              length={6}
              value={otp}
              onChange={handleOtpChange}
              autoFocus
            />
            {otpError ? (
              <Text style={styles.otpError}>{otpError}</Text>
            ) : null}
          </View>
        ) : null}

        {/* ── Section 5: Verify & Login Button (conditional) ────────── */}
        {isOtpSent ? (
          <View style={styles.buttonSection}>
            <PrimaryButton
              testID="login-verify-btn"
              label="Verify & Login"
              onPress={handleVerifyLogin}
              loading={isLoadingLogin}
              disabled={otp.length < OTP_LENGTH}
            />
          </View>
        ) : null}

        {/* ── Spacer ────────────────────────────────────────────────── */}
        <View style={styles.spacer} />

        {/* ── Section 6: Info Card ──────────────────────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardContent}>
            <Text style={styles.infoIcon}>ℹ</Text>
            <Text style={styles.infoText}>
              If this is your first login, please ensure you have received your
              collector ID from the regional office. Your account will be
              activated after the first verification.
            </Text>
          </View>
        </View>

        {/* ── Section 7: Footer Caption ─────────────────────────────── */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Login persists until explicit logout or 30 days of inactivity
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenPaddingHorizontal,
    paddingVertical: theme.layout.screenPaddingVertical,
  },

  // Section 1 — Logo
  logoSection: {
    alignItems: "center",
    marginTop: theme.spacing.xxl * 2,
    marginBottom: theme.spacing.xl,
  },

  // Section 2 — Phone input
  inputSection: {
    marginBottom: theme.spacing.md,
  },

  // Section 3 & 5 — Buttons
  buttonSection: {
    marginBottom: theme.spacing.xl,
  },

  // Section 4 — OTP
  otpSection: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  otpLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  otpError: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing.xs,
  },

  // Spacer pushes info card and footer toward bottom
  spacer: {
    flexGrow: 1,
    minHeight: theme.spacing.xl,
  },

  // Section 6 — Info card
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusMD,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCardContent: {
    flexDirection: "row",
    gap: theme.spacing.sm + 4,
  },
  infoIcon: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeLG,
  },
  infoText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: theme.typography.fontSizeXS,
    lineHeight: theme.typography.fontSizeXS * 1.6,
    fontWeight: theme.typography.fontWeightRegular,
  },

  // Section 7 — Footer
  footerSection: {
    paddingBottom: theme.spacing.md,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWidest,
  },
});

export default LoginScreen;
