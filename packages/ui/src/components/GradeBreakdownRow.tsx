// ─── GradeBreakdownRow — One row in the trip sheet grade table ────────────────
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface GradeBreakdownRowProps {
  grade: string;
  count: number;
  totalKg: number;
  totalAmount: number;
  isHeader?: boolean;
}

export const GradeBreakdownRow: React.FC<GradeBreakdownRowProps> = ({
  grade,
  count,
  totalKg,
  totalAmount,
  isHeader = false,
}): React.JSX.Element => {
  const textStyle = isHeader ? styles.headerText : styles.cellText;
  const amountStyle = isHeader ? styles.headerText : styles.amountText;

  return (
    <View style={[styles.row, isHeader && styles.headerRow]}>
      <View style={[styles.cell, styles.gradeCell]}>
        <Text style={textStyle}>{grade}</Text>
      </View>
      <View style={[styles.cell, styles.weightCell]}>
        <Text style={[textStyle, styles.rightAlign]}>
          {isHeader ? totalKg : `${totalKg.toFixed(1)} kg`}
        </Text>
      </View>
      <View style={[styles.cell, styles.countCell]}>
        <Text style={[amountStyle, styles.rightAlign]}>
          {isHeader ? `${count}` : count}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
  },
  headerRow: {
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 0,
  },
  cell: {
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.md,
  },
  gradeCell: {
    flex: 2,
    borderRightWidth: theme.borders.widthDefault,
    borderRightColor: "rgba(255,255,255,0.15)",
  },
  weightCell: {
    flex: 2,
    borderRightWidth: theme.borders.widthDefault,
    borderRightColor: "rgba(255,255,255,0.15)",
  },
  countCell: {
    flex: 1,
  },
  headerText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
  },
  cellText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.textPrimary,
  },
  amountText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  rightAlign: {
    textAlign: "right",
  },
});
