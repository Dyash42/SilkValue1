// ─── WeightDisplay — Large scale reading display ─────────────────────────────
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface WeightDisplayProps {
  weightKg: number;
  isStable: boolean;
  isConnected: boolean;
  label?: string;
  size?: "small" | "large";
}

export const WeightDisplay: React.FC<WeightDisplayProps> = ({
  weightKg,
  isStable,
  isConnected,
  label = "LIVE WEIGHT READING",
  size = "large",
}): React.JSX.Element => {
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.container,
        isLarge ? styles.containerLarge : styles.containerSmall,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readingRow}>
        <Text style={[styles.value, isLarge ? styles.valueLarge : styles.valueSmall]}>
          {isConnected ? weightKg.toFixed(2) : "—"}
        </Text>
        <Text style={[styles.unit, isLarge ? styles.unitLarge : styles.unitSmall]}>
          kg
        </Text>
      </View>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isConnected
                ? (isStable ? theme.colors.success : theme.colors.warning)
                : theme.colors.danger },
          ]}
        />
        <Text style={styles.statusText}>
          {!isConnected
            ? "Disconnected"
            : isStable
              ? "Stable"
              : "Stabilizing..."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: theme.borders.widthActive,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  containerLarge: {
    padding: theme.spacing.xl,
  },
  containerSmall: {
    padding: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
    letterSpacing: theme.typography.letterSpacingWide,
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
  },
  readingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.sm,
  },
  value: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  valueLarge: {
    fontSize: 56,
  },
  valueSmall: {
    fontSize: theme.typography.fontSizeXXL,
  },
  unit: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
  },
  unitLarge: {
    fontSize: theme.typography.fontSizeXL,
  },
  unitSmall: {
    fontSize: theme.typography.fontSizeLG,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: theme.spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borders.radiusFull,
  },
  statusText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textMuted,
  },
});
