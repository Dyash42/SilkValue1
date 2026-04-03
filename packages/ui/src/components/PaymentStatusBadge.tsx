// ─── PaymentStatusBadge — Pill badge for payment/collection status ───────────

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export type PaymentStatusType =
  | "successful"
  | "pending"
  | "failed"
  | "paid"
  | "processing"
  | "completed";

export interface PaymentStatusBadgeProps {
  status: PaymentStatusType;
}

const STATUS_STYLES: Record<
  PaymentStatusType,
  { bg: string; textColor: string; borderColor: string; label: string }
> = {
  successful: {
    bg: theme.colors.primary,
    textColor: theme.colors.primaryText,
    borderColor: theme.colors.primary,
    label: "PAID",
  },
  paid: {
    bg: theme.colors.primary,
    textColor: theme.colors.primaryText,
    borderColor: theme.colors.primary,
    label: "PAID",
  },
  completed: {
    bg: "#DCFCE7",
    textColor: "#15803D",
    borderColor: "#DCFCE7",
    label: "COMPLETED",
  },
  pending: {
    bg: "#E2E8F0",
    textColor: "#475569",
    borderColor: "#E2E8F0",
    label: "PENDING",
  },
  processing: {
    bg: theme.colors.background,
    textColor: theme.colors.textPrimary,
    borderColor: theme.colors.primary,
    label: "PROCESSING",
  },
  failed: {
    bg: theme.colors.background,
    textColor: theme.colors.textPrimary,
    borderColor: theme.colors.primary,
    label: "FAILED",
  },
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
}) => {
  const config = STATUS_STYLES[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: config.textColor,
            textDecorationLine: status === "failed" ? "line-through" : "none",
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
