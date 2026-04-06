// ─── Screen 4: Gate Weighment — Gross/Tare/Net weight with variance ──────────
// TODO: Connect to Bluetooth scale for live weight data.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MOCK_WEIGHMENT } from "../mock/gateMockData";

export const GateWeighmentScreen: React.FC<any> = ({ navigation }) => {
  const w = MOCK_WEIGHMENT;
  const [comment, setComment] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Progress */}
        <View style={styles.stepProgress}>
          {/* Step 1: Done */}
          <View style={styles.stepCircleDone}>
            <Text style={styles.stepCheckmark}>✓</Text>
          </View>
          <Text style={styles.stepLabelDone}>INBOUND</Text>
          <View style={styles.connectorDone} />

          {/* Step 2: Active */}
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepNumberActive}>02</Text>
          </View>
          <Text style={styles.stepLabelActive}>WEIGHING</Text>
          <View style={styles.connectorPending} />

          {/* Step 3: Pending */}
          <View style={styles.stepCirclePending}>
            <Text style={styles.stepNumberPending}>03</Text>
          </View>
          <Text style={styles.stepLabelPending}>OUTBOUND</Text>
        </View>

        {/* Scale Connection Pill */}
        <View style={styles.scalePill}>
          <View style={styles.scaleDot} />
          <Text style={styles.scaleText}>
            Scale ID: #FL-GS-09 | Connection: Stable
          </Text>
        </View>

        {/* Vehicle Context Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleIconBox}>
            <Text style={styles.vehicleIcon}>🚚</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleInfoRow}>
              <View>
                <Text style={styles.vehicleLabel}>VEHICLE PLATE</Text>
                <Text style={styles.vehiclePlate}>MH-12-DT-4421</Text>
              </View>
              <View style={{ alignItems: "flex-end" as const }}>
                <Text style={styles.vehicleLabel}>DRIVER</Text>
                <Text style={styles.vehicleValue}>Rajesh Kumar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weight Inputs */}
        <View style={styles.weightInputs}>
          <View style={styles.weightField}>
            <Text style={styles.weightFieldLabel}>GROSS WEIGHT (LOADED)</Text>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.weightInputLarge}
                value={w.grossWeight.toLocaleString()}
                editable={false}
              />
              <Text style={styles.weightUnit}>KG</Text>
            </View>
          </View>
          <View style={styles.weightField}>
            <Text style={styles.weightFieldLabel}>TARE WEIGHT (EMPTY)</Text>
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.weightInputSmall}
                value={w.tareWeight.toLocaleString()}
                editable={false}
              />
              <Text style={styles.weightUnitSmall}>KG</Text>
            </View>
          </View>
        </View>

        {/* Net Weight Hero Box */}
        <View style={styles.netWeightBox}>
          <Text style={styles.netWeightLabel}>CALCULATED NET WEIGHT</Text>
          <View style={styles.netWeightValueRow}>
            <Text style={styles.netWeightValue}>
              {w.netWeight.toLocaleString()}
            </Text>
            <Text style={styles.netWeightUnit}>KG</Text>
          </View>
        </View>

        {/* Field vs Gate Comparison */}
        <View style={styles.comparisonGrid}>
          <View style={[styles.comparisonCell, styles.comparisonCellLeft]}>
            <Text style={styles.comparisonLabel}>FIELD ESTIMATE</Text>
            <Text style={styles.comparisonValue}>
              {w.fieldEstimate.toLocaleString()} KG
            </Text>
          </View>
          <View style={styles.comparisonCell}>
            <Text style={styles.comparisonLabel}>VARIANCE</Text>
            <Text style={[styles.comparisonValue, styles.varianceError]}>
              + {w.varianceKg.toLocaleString()} KG
            </Text>
          </View>
        </View>

        {/* Threshold Warning */}
        {w.exceedsThreshold && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>EXCEEDS THRESHOLD</Text>
              <Text style={styles.warningBody}>
                Variance is {w.variancePercent}% above field estimate. Manager comment required.
              </Text>
            </View>
          </View>
        )}

        {/* Comment Field */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>
            VARIANCE COMMENT / DISCREPANCY NOTES
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Explain reason for weight variance..."
            placeholderTextColor="#888888"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
        </View>
      </ScrollView>

      {/* Bottom Actions — pinned via Flexbox, no absolute positioning */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.reweighButton} activeOpacity={0.8}>
          <Text style={styles.reweighText}>RE-WEIGH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmWeighmentButton}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate?.("QCInspection", { vehicleId: "v-001" })}
        >
          <Text style={styles.confirmWeighmentText}>CONFIRM WEIGHMENT</Text>
          <Text style={styles.confirmCheckIcon}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  content: { padding: 16, paddingBottom: 16, gap: 24 },

  // Step Progress
  stepProgress: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  stepCircleDone: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" },
  stepCheckmark: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  stepLabelDone: { fontSize: 9, fontWeight: "700", color: "#000000", letterSpacing: 0.5, marginLeft: 4, marginRight: 4, textTransform: "uppercase" },
  connectorDone: { flex: 1, height: 2, backgroundColor: "#000000", marginHorizontal: 4 },
  stepCircleActive: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#000000", backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  stepNumberActive: { fontSize: 12, fontWeight: "700", color: "#000000" },
  stepLabelActive: { fontSize: 9, fontWeight: "700", color: "#000000", letterSpacing: 0.5, marginLeft: 4, marginRight: 4, textTransform: "uppercase" },
  connectorPending: { flex: 1, height: 2, backgroundColor: "#DDDDDD", marginHorizontal: 4 },
  stepCirclePending: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#DDDDDD", backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  stepNumberPending: { fontSize: 12, fontWeight: "700", color: "#888888" },
  stepLabelPending: { fontSize: 9, fontWeight: "700", color: "#888888", letterSpacing: 0.5, marginLeft: 4, textTransform: "uppercase" },

  // Scale Pill
  scalePill: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "#000000", backgroundColor: "#EEEEEE", borderRadius: 4 },
  scaleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2E7D32" },
  scaleText: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: -0.3 },

  // Vehicle Card
  vehicleCard: { flexDirection: "row", alignItems: "flex-start", gap: 16, padding: 16, borderWidth: 1, borderColor: "#000000", backgroundColor: "#FFFFFF", borderRadius: 4 },
  vehicleIconBox: { width: 48, height: 48, backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 4, justifyContent: "center", alignItems: "center" },
  vehicleIcon: { fontSize: 24 },
  vehicleInfo: { flex: 1 },
  vehicleInfoRow: { flexDirection: "row", justifyContent: "space-between" },
  vehicleLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  vehiclePlate: { fontSize: 20, fontWeight: "900", color: "#000000", letterSpacing: -1 },
  vehicleValue: { fontSize: 14, fontWeight: "700", color: "#000000" },

  // Weight Inputs
  weightInputs: { gap: 16 },
  weightField: { gap: 8 },
  weightFieldLabel: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  weightInputContainer: { flexDirection: "row", alignItems: "center", position: "relative" },
  weightInputLarge: { flex: 1, height: 64, borderWidth: 2, borderColor: "#000000", borderRadius: 4, backgroundColor: "#FFFFFF", paddingHorizontal: 16, fontSize: 28, fontWeight: "900", color: "#000000", letterSpacing: -1 },
  weightUnit: { position: "absolute", right: 16, fontSize: 18, fontWeight: "700", color: "#000000" },
  weightInputSmall: { flex: 1, height: 64, borderWidth: 1, borderColor: "#000000", borderRadius: 4, backgroundColor: "#F3F3F3", paddingHorizontal: 16, fontSize: 20, fontWeight: "700", color: "#474747", letterSpacing: -0.5 },
  weightUnitSmall: { position: "absolute", right: 16, fontSize: 14, fontWeight: "700", color: "#474747" },

  // Net Weight Box
  netWeightBox: { borderWidth: 4, borderColor: "#000000", backgroundColor: "#FFFFFF", padding: 24, borderRadius: 4, alignItems: "center" },
  netWeightLabel: { fontSize: 12, fontWeight: "900", color: "#000000", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" },
  netWeightValueRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  netWeightValue: { fontSize: 56, fontWeight: "900", color: "#000000", letterSpacing: -2 },
  netWeightUnit: { fontSize: 24, fontWeight: "900", color: "#000000", marginTop: 16 },

  // Comparison
  comparisonGrid: { flexDirection: "row", borderWidth: 1, borderColor: "#000000", borderRadius: 4, overflow: "hidden" },
  comparisonCell: { flex: 1, padding: 16 },
  comparisonCellLeft: { backgroundColor: "#E2E2E2", borderRightWidth: 1, borderRightColor: "#000000" },
  comparisonLabel: { fontSize: 10, fontWeight: "700", color: "#474747", marginBottom: 4, textTransform: "uppercase" },
  comparisonValue: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5 },
  varianceError: { color: "#BA1A1A" },

  // Warning Banner
  warningBanner: { backgroundColor: "#000000", borderRadius: 4, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 },
  warningIcon: { fontSize: 20, color: "#FFFFFF" },
  warningContent: { flex: 1 },
  warningTitle: { fontSize: 12, fontWeight: "900", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  warningBody: { fontSize: 12, color: "#FFFFFF", opacity: 0.8, marginTop: 4 },

  // Comment
  commentSection: { gap: 8 },
  commentLabel: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  commentInput: { borderWidth: 1, borderColor: "#000000", borderRadius: 4, backgroundColor: "#FFFFFF", padding: 12, minHeight: 100, fontSize: 14, color: "#000000" },

  // Bottom Actions — Flexbox pinned, no absolute
  bottomActions: { backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#DDDDDD", padding: 16, flexDirection: "row", gap: 16 },
  reweighButton: { flex: 1, height: 52, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", justifyContent: "center", alignItems: "center" },
  reweighText: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  confirmWeighmentButton: { flex: 2, height: 52, backgroundColor: "#000000", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  confirmWeighmentText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  confirmCheckIcon: { fontSize: 16, color: "#FFFFFF" },
});
