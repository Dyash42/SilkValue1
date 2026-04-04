// ─── GradeSelector — Quality grade pill selection ────────────────────────────
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface GradeSelectorProps {
  selectedGrade: string | null;
  onSelect: (grade: string) => void;
  disabled?: boolean;
}

const GRADES: { value: string; label: string }[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "reject", label: "Reject" },
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onSelect,
  disabled = false,
}): React.JSX.Element => {
  return (
    <View style={styles.container}>
      {GRADES.map((grade) => {
        const isSelected = selectedGrade === grade.value;
        const isReject = grade.value === "reject";

        return (
          <TouchableOpacity
            key={grade.value}
            style={[
              styles.pill,
              isSelected && styles.pillSelected,
              isReject && isSelected && styles.pillRejectSelected,
              isReject && !isSelected && styles.pillReject,
              disabled && styles.pillDisabled,
            ]}
            onPress={() => !disabled && onSelect(grade.value)}
            activeOpacity={disabled ? 1 : 0.7}
          >
            <Text
              style={[
                styles.pillText,
                isSelected && styles.pillTextSelected,
                isReject && isSelected && styles.pillTextRejectSelected,
              ]}
            >
              {grade.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  pill: {
    flex: 1,
    height: 40,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusFull,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  pillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillReject: {
    borderColor: theme.colors.border,
  },
  pillRejectSelected: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  pillDisabled: {
    opacity: 0.5,
  },
  pillText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  pillTextSelected: {
    color: theme.colors.primaryText,
  },
  pillTextRejectSelected: {
    color: theme.colors.primaryText,
  },
});
