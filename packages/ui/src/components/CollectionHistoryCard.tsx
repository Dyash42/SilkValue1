// ─── CollectionHistoryCard — Tappable card showing one collection event ──────

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";
import { PaymentStatusBadge, PaymentStatusType } from "./PaymentStatusBadge";

export interface CollectionHistoryCardProps {
  date: string;
  qualityGrade: string;
  netWeight: number;
  paymentStatus: PaymentStatusType;
  onPress: () => void;
}

export const CollectionHistoryCard: React.FC<CollectionHistoryCardProps> = ({
  date,
  qualityGrade,
  netWeight,
  paymentStatus,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.dateText}>{date}</Text>
          <PaymentStatusBadge status={paymentStatus} />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.gradeText}>
            Grade: <Text style={styles.gradeValue}>{qualityGrade}</Text>
          </Text>
          <View style={styles.weightContainer}>
            <Text style={styles.weightValue}>{netWeight}</Text>
            <Text style={styles.weightUnit}> KG</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  gradeText: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  gradeValue: {
    color: theme.colors.textBody,
    fontWeight: theme.typography.fontWeightMedium,
  },
  weightValue: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  weightUnit: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  weightContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
