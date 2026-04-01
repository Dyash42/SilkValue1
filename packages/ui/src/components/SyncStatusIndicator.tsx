// ─── SyncStatusIndicator — Sync State Display ───────────────────────────────
// Renders a small status label ("SYNCED", "SYNCING", "OFFLINE") with a
// colour-coded dot indicator. Used in the Home screen Top App Bar.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface SyncStatusIndicatorProps {
  status: "synced" | "pending" | "failed";
  count?: number;
}

const STATUS_LABELS: Record<SyncStatusIndicatorProps["status"], string> = {
  synced: "SYNCED",
  pending: "SYNCING",
  failed: "OFFLINE",
} as const;

const STATUS_COLORS: Record<SyncStatusIndicatorProps["status"], string> = {
  synced: theme.colors.success,
  pending: theme.colors.primary,
  failed: theme.colors.danger,
} as const;

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  count,
}): React.JSX.Element => {
  const label = STATUS_LABELS[status];
  const dotColor = STATUS_COLORS[status];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {count !== undefined && count > 0 ? ` (${count})` : ""}
      </Text>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.borders.radiusFull,
  },
});
