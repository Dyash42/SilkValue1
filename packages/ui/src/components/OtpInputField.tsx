// ─── OtpInputField — Industrial Brutalist ────────────────────────────────────
import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { theme } from "../theme";

interface OtpInputFieldProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  autoFocus?: boolean;
  testID?: string;
}

export const OtpInputField: React.FC<OtpInputFieldProps> = ({
  length = 6,
  value,
  onChange,
  autoFocus = false,
  testID,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    // Only allow digits, cap at length
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(cleaned);
  };

  // Calculate box width to fit screen without overflow
  const screenWidth = Dimensions.get("window").width;
  const availableWidth =
    screenWidth - theme.layout.screenPaddingHorizontal * 2;
  const totalGaps = (length - 1) * theme.spacing.sm;
  const boxSize = Math.min(
    theme.layout.otpBoxSize,
    Math.floor((availableWidth - totalGaps) / length)
  );

  return (
    <View style={styles.wrapper}>
      {/* Hidden input captures all keyboard events */}
      <TextInput
        ref={inputRef}
        testID={testID}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        style={styles.hiddenInput}
        caretHidden
      />

      {/* Visible OTP boxes */}
      <Pressable onPress={handlePress} style={styles.boxRow}>
        {Array.from({ length }, (_, index) => {
          const digit = value[index] || "";
          const isActive = index === value.length;
          const isFilled = index < value.length;

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  width: boxSize,
                  height: boxSize + 4,
                  borderColor: isActive
                    ? theme.colors.primary
                    : theme.colors.border,
                  borderWidth: isActive
                    ? theme.borders.widthThick + 1
                    : theme.borders.widthDefault,
                },
                isFilled && styles.boxFilled,
              ]}
            >
              <Text style={styles.digit}>{digit}</Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  hiddenInput: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  box: {
    backgroundColor: "transparent",
    borderRadius: theme.borders.radiusMD,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  boxFilled: {
    backgroundColor: theme.colors.surface,
  },
  digit: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeOtp,
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
  },
});
