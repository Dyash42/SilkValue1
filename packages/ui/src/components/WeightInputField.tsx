// ─── WeightInputField — Numeric weight input with FILL FROM SCALE ────────────
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface WeightInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFillFromScale?: () => void;
  scaleConnected?: boolean;
  suffix?: string;
  editable?: boolean;
}

export const WeightInputField: React.FC<WeightInputFieldProps> = ({
  label,
  value,
  onChangeText,
  onFillFromScale,
  scaleConnected = false,
  suffix = "kg",
  editable = true,
}): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.colors.textMuted}
          editable={editable}
        />
        <Text style={styles.suffix}>{suffix}</Text>
      </View>
      {scaleConnected && onFillFromScale && (
        <TouchableOpacity
          style={styles.fillButton}
          onPress={onFillFromScale}
          activeOpacity={0.8}
        >
          <Text style={styles.fillButtonText}>⚖ FILL FROM SCALE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    backgroundColor: theme.colors.background,
    height: theme.layout.inputHeight,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textMuted,
  },
  suffix: {
    paddingRight: theme.spacing.md,
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  fillButton: {
    alignSelf: "flex-start",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusSM,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs + 2,
  },
  fillButtonText: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWide,
    textTransform: "uppercase",
  },
});
