// ─── AppWordmark — Text-Only Brand Name ──────────────────────────────────────
// Used in the Top App Bar where only the "Silk Value" text is shown,
// without the icon container that AppLogo renders.

import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme } from "../theme";

interface AppWordmarkProps {
  size?: "small" | "medium" | "large";
}

const SIZES = {
  small: theme.typography.fontSizeMD,
  medium: theme.typography.fontSizeLG,
  large: theme.typography.fontSizeXL,
} as const;

export const AppWordmark: React.FC<AppWordmarkProps> = ({
  size = "medium",
}): React.JSX.Element => {
  return (
    <Text style={[styles.text, { fontSize: SIZES[size] }]}>Silk Value</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: theme.typography.letterSpacingTight,
  },
});
