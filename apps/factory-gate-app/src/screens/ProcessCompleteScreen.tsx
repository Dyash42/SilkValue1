// ─── Screen 7: Process Complete — PROACTIVE: Success confirmation ────────────
// This screen does NOT exist in the reference designs.
// Created proactively because the flow needs a clear "done" state after
// the 4-step pipeline (Check-In → Weighment → QC → Acceptance).

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export const ProcessCompleteScreen: React.FC<any> = ({ navigation, route }) => {
  const decision = route?.params?.decision ?? "Accepted";
  const vehicleId = route?.params?.vehicleId ?? "V-001";

  const isAccepted = decision.toLowerCase().includes("accept");

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={[styles.iconCircle, !isAccepted && styles.iconCircleError]}>
          <Text style={styles.iconText}>{isAccepted ? "✓" : "✕"}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {isAccepted ? "PROCESS COMPLETE" : "SHIPMENT REJECTED"}
        </Text>
        <Text style={styles.subtitle}>
          Vehicle {vehicleId} has been processed successfully.
        </Text>

        {/* Decision Card */}
        <View style={styles.decisionCard}>
          <Text style={styles.decisionLabel}>QC DECISION</Text>
          <Text style={styles.decisionValue}>{decision.toUpperCase()}</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>NET WEIGHT</Text>
            <Text style={styles.summaryValue}>20,350 KG</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>REELERS</Text>
            <Text style={styles.summaryValue}>4 ACCEPTED</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DEDUCTIONS</Text>
            <Text style={styles.summaryValue}>510 KG</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>REJECTED</Text>
            <Text style={[styles.summaryValue, styles.summaryValueError]}>2 UNITS</Text>
          </View>
        </View>

        {/* Timestamp */}
        <View style={styles.timestampCard}>
          <Text style={styles.timestampLabel}>PROCESSED AT</Text>
          <Text style={styles.timestampValue}>
            {new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.timestampOperator}>OPERATOR: J. MILLER</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate?.("MainTabs")}
          >
            <Text style={styles.primaryButtonText}>RETURN TO DASHBOARD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate?.("VehicleCheckIn", {})}
          >
            <Text style={styles.secondaryButtonText}>PROCESS NEXT VEHICLE</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerNote}>
          RECEIPT WILL BE GENERATED AUTOMATICALLY AND SHARED WITH THE COLLECTOR.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, gap: 24 },

  // Icon Circle
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#000000",
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  iconCircleError: { backgroundColor: "#BA1A1A" },
  iconText: { fontSize: 48, color: "#FFFFFF", fontWeight: "700" },

  // Title
  title: { fontSize: 28, fontWeight: "900", color: "#000000", letterSpacing: -1, textTransform: "uppercase", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#474747", textAlign: "center" },

  // Decision Card
  decisionCard: { backgroundColor: "#000000", paddingHorizontal: 32, paddingVertical: 16, alignItems: "center" },
  decisionLabel: { fontSize: 10, fontWeight: "700", color: "#888888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  decisionValue: { fontSize: 20, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.5 },

  // Summary Grid
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 1, width: "100%", backgroundColor: "#C6C6C6", borderWidth: 1, borderColor: "#000000" },
  summaryItem: { width: "49.5%", backgroundColor: "#FFFFFF", padding: 16 },
  summaryLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 0.5, textTransform: "uppercase" },
  summaryValue: { fontSize: 16, fontWeight: "900", color: "#000000", marginTop: 4 },
  summaryValueError: { color: "#BA1A1A" },

  // Timestamp
  timestampCard: { backgroundColor: "#F5F5F5", padding: 16, width: "100%", alignItems: "center", borderWidth: 1, borderColor: "#C6C6C6" },
  timestampLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  timestampValue: { fontSize: 14, fontWeight: "700", color: "#000000", marginTop: 4 },
  timestampOperator: { fontSize: 10, fontWeight: "700", color: "#474747", marginTop: 4, textTransform: "uppercase" },

  // Actions
  actions: { width: "100%", gap: 12 },
  primaryButton: { height: 52, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" },
  primaryButtonText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  secondaryButton: { height: 52, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", justifyContent: "center", alignItems: "center" },
  secondaryButtonText: { fontSize: 12, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },

  // Footer
  footerNote: { fontSize: 10, fontWeight: "700", color: "#888888", letterSpacing: 0.5, textAlign: "center", textTransform: "uppercase" },
});
