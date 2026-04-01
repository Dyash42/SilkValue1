// ─── TextInputField — Industrial Brutalist ───────────────────────────────────
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import { theme } from "../theme";

interface TextInputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  maxLength?: number;
  leftPrefix?: string;
  rightElement?: React.ReactNode;
  error?: string;
  testID?: string;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  autoFocus = false,
  editable = true,
  maxLength,
  leftPrefix,
  rightElement,
  error,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  const borderWidth = isFocused && !error
    ? theme.borders.widthThick + 1
    : theme.borders.widthDefault;

  return (
    <View style={styles.wrapper}>
      {/* Label above input */}
      <Text style={styles.label}>{label}</Text>

      {/* Input container — row layout for prefix + input + right element */}
      <View
        style={[
          styles.inputContainer,
          { borderColor, borderWidth },
        ]}
      >
        {/* Left prefix (e.g. +91) */}
        {leftPrefix ? (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{leftPrefix}</Text>
            <View style={styles.prefixDivider} />
          </View>
        ) : null}

        {/* Text input */}
        <TextInput
          testID={testID}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoFocus={autoFocus}
          editable={editable}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Right element (e.g. icon) */}
        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </View>

      {/* Error message below input */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
  inputContainer: {
    height: theme.layout.inputHeight,
    backgroundColor: "transparent",
    borderRadius: theme.borders.radiusMD,
    flexDirection: "row",
    alignItems: "center",
  },
  prefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.spacing.md,
  },
  prefixText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightMedium,
    paddingRight: theme.spacing.sm + 4,
  },
  prefixDivider: {
    width: theme.borders.widthDefault,
    height: 24,
    backgroundColor: theme.colors.borderMuted,
    marginRight: theme.spacing.sm + 4,
  },
  input: {
    flex: 1,
    height: "100%",
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightMedium,
    paddingHorizontal: theme.spacing.md,
  },
  rightElement: {
    paddingRight: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
  },
});
