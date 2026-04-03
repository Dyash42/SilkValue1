// ─── StepProgressBar — Horizontal step indicator for gate pipeline ────────────
// Used in Check-In → Weighment → QC → Acceptance flow.

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface StepConfig {
  label: string;
  status: "done" | "active" | "pending";
}

export interface StepProgressBarProps {
  steps: StepConfig[];
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isDone = step.status === "done";
        const isActive = step.status === "active";
        const isFirst = index === 0;

        return (
          <React.Fragment key={step.label}>
            {/* Connector line */}
            {!isFirst && (
              <View
                style={[
                  styles.connector,
                  { backgroundColor: isDone || isActive ? "#000000" : "#DDDDDD" },
                ]}
              />
            )}
            {/* Step circle + label */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isDone && styles.circleDone,
                  isActive && styles.circleActive,
                ]}
              >
                {isDone ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      (isDone || isActive) && styles.stepNumberActive,
                    ]}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (isDone || isActive) ? styles.labelActive : styles.labelPending,
                ]}
              >
                {step.label.toUpperCase()}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  stepItem: {
    alignItems: "center",
    gap: 6,
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 20,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  circleDone: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  circleActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 2,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888888",
  },
  stepNumberActive: {
    color: "#000000",
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  labelActive: {
    color: "#000000",
  },
  labelPending: {
    color: "#888888",
  },
});
