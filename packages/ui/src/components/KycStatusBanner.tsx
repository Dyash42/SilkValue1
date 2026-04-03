// ─── KycStatusBanner — Full-width banner showing KYC verification status ─────

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export type KycStatus = "approved" | "pending" | "rejected";

export interface KycStatusBannerProps {
  status: KycStatus;
}

const STATUS_CONFIG: Record<
  KycStatus,
  {
    label: string;
    borderStyle: "solid" | "dashed";
    borderWidth: number;
    bg: string;
    textColor: string;
  }
> = {
  approved: {
    label: "KYC Verified ✓",
    borderStyle: "solid",
    borderWidth: 1,
    bg: theme.colors.background,
    textColor: theme.colors.textPrimary,
  },
  pending: {
    label: "KYC Under Review",
    borderStyle: "dashed",
    borderWidth: 1,
    bg: theme.colors.background,
    textColor: theme.colors.textPrimary,
  },
  rejected: {
    label: "KYC Rejected — Action Required",
    borderStyle: "solid",
    borderWidth: 2,
    bg: theme.colors.background,
    textColor: theme.colors.textPrimary,
  },
};

export const KycStatusBanner: React.FC<KycStatusBannerProps> = ({
  status,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.banner,
        {
          borderWidth: config.borderWidth,
          borderStyle: config.borderStyle,
          backgroundColor: config.bg,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: config.textColor },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
  },
  label: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
