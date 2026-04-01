// ─── AppLogo — Silk Value Wordmark ───────────────────────────────────────────
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
  subtitle?: string;
}

const ICON_SIZES = {
  small: 40,
  medium: 64,
  large: 80,
} as const;

const TITLE_SIZES = {
  small: theme.typography.fontSizeLG,
  medium: theme.typography.fontSizeXL,
  large: theme.typography.fontSizeXXL,
} as const;

export const AppLogo: React.FC<AppLogoProps> = ({
  size = "medium",
  subtitle,
}) => {
  const iconSize = ICON_SIZES[size];
  const titleSize = TITLE_SIZES[size];

  return (
    <View style={styles.container}>
      {/* Icon container — black rounded square with leaf symbol */}
      <View
        style={[
          styles.iconContainer,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: theme.borders.radiusLG,
          },
        ]}
      >
        {/* Leaf/eco symbol rendered as styled text glyph */}
        <Text
          style={[
            styles.iconGlyph,
            { fontSize: iconSize * 0.5 },
          ]}
        >
          🍃
        </Text>
      </View>

      {/* App name */}
      <Text
        style={[
          styles.title,
          { fontSize: titleSize },
        ]}
      >
        Silk Value
      </Text>

      {/* Optional subtitle */}
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  iconContainer: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconGlyph: {
    color: theme.colors.primaryText,
  },
  title: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: theme.typography.letterSpacingTight,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing.xs,
  },
});
