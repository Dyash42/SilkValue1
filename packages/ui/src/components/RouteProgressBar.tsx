// ─── RouteProgressBar — Flex-Based Route Progress ────────────────────────────
// Renders a horizontal progress bar. The fill width is calculated as a
// flex ratio (completed / total) — no absolute width values are used.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface RouteProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export const RouteProgressBar: React.FC<RouteProgressBarProps> = ({
  completed,
  total,
  label,
}): React.JSX.Element => {
  const safeTotal = Math.max(total, 1);
  const fillFlex = Math.min(completed / safeTotal, 1);
  const emptyFlex = 1 - fillFlex;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        {fillFlex > 0 ? (
          <View style={[styles.fill, { flex: fillFlex }]} />
        ) : null}
        {emptyFlex > 0 ? (
          <View style={{ flex: emptyFlex }} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  track: {
    height: theme.layout.progressBarHeight,
    borderRadius: theme.borders.radiusFull,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: theme.colors.progressTrack,
  },
  fill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radiusFull,
  },
});
