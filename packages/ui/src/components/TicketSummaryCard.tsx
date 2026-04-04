// ─── TicketSummaryCard — Compact receipt card for trip sheet ──────────────────
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface TicketSummaryCardProps {
  ticketNumber: string;
  reelerName: string;
  village: string;
  netWeightKg: number;
  grade: string;
  totalAmount: number;
  syncStatus: string;
  onPress?: () => void;
}

export const TicketSummaryCard: React.FC<TicketSummaryCardProps> = ({
  reelerName,
  netWeightKg,
  grade,
  totalAmount,
  syncStatus,
  onPress,
}): React.JSX.Element => {
  const isSynced = syncStatus === "synced";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        <Text style={styles.reelerName}>{reelerName}</Text>
        <Text style={styles.detail}>Net: {netWeightKg.toFixed(2)} kg</Text>
      </View>
      <View style={styles.rightSection}>
        <View
          style={[
            styles.gradeBadge,
            grade === "A"
              ? styles.gradeBadgePrimary
              : styles.gradeBadgeSecondary,
          ]}
        >
          <Text
            style={[
              styles.gradeBadgeText,
              grade === "A"
                ? styles.gradeBadgeTextPrimary
                : styles.gradeBadgeTextSecondary,
            ]}
          >
            GRADE {grade.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.amount}>₹ {totalAmount.toLocaleString("en-IN")}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
  },
  leftSection: {
    flex: 1,
    gap: 2,
  },
  reelerName: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  detail: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 4,
  },
  gradeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borders.radiusSM,
  },
  gradeBadgePrimary: {
    backgroundColor: theme.colors.primary,
  },
  gradeBadgeSecondary: {
    backgroundColor: theme.colors.progressTrack,
  },
  gradeBadgeText: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  gradeBadgeTextPrimary: {
    color: theme.colors.primaryText,
  },
  gradeBadgeTextSecondary: {
    color: theme.colors.textPrimary,
  },
  amount: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
});
