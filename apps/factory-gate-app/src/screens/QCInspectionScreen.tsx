// ─── Screen 5: QC Inspection — Quality parameters + decision buttons ─────────

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQCParameters, useWeighmentData } from "../hooks/useGateData";
import { supabase } from "../config/supabase";
import * as gateService from "../services/gateService";

type QCDecision = "accept" | "deduct" | "reject";

export const QCInspectionScreen: React.FC<any> = ({ navigation, route }) => {
  const gateEntryId: string = route?.params?.gateEntryId ?? "";
  const { data: qcParams, loading: paramsLoading } = useQCParameters(gateEntryId);
  const { data: weighment, loading: weighmentLoading } = useWeighmentData(gateEntryId);
  const [decision, setDecision] = useState<QCDecision | null>(null);
  const [saving, setSaving] = useState(false);

  const loading = paramsLoading || weighmentLoading;

  const handleConfirm = async () => {
    if (!decision) {
      Alert.alert("Select Decision", "Please select a QC decision before confirming.");
      return;
    }
    setSaving(true);
    try {
      await gateService.saveQCDecision(supabase, gateEntryId, decision, 0);
      navigation?.navigate?.("AcceptanceBreakdown", { gateEntryId, qcDecision: decision });
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Progress */}
        <View style={styles.stepRow}>
          <View style={styles.stepCol}>
            <View style={styles.circleDone}>
              <Text style={styles.circleCheck}>✓</Text>
            </View>
            <Text style={styles.stepLabelSmall}>ARRIVAL</Text>
          </View>
          <View style={styles.lineH} />
          <View style={styles.stepCol}>
            <View style={styles.circleDone}>
              <Text style={styles.circleCheck}>✓</Text>
            </View>
            <Text style={styles.stepLabelSmall}>WEIGHING</Text>
          </View>
          <View style={styles.lineH} />
          <View style={styles.stepCol}>
            <View style={styles.circleActive}>
              <Text style={styles.circleNum}>3</Text>
            </View>
            <Text style={styles.stepLabelBold}>INSPECTION</Text>
          </View>
        </View>

        {/* Active Vehicle Context Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextIcon}>
            <Text style={styles.contextIconText}>🚚</Text>
          </View>
          <View style={styles.contextInfo}>
            <Text style={styles.contextLabel}>ACTIVE CONSIGNMENT</Text>
            <Text style={styles.contextTitle}>{weighment?.vehiclePlate ?? "—"}</Text>
            <View style={styles.contextMeta}>
              <Text style={styles.contextMetaText}>
                Driver: <Text style={styles.contextMetaValue}>{weighment?.driverName ?? "—"}</Text>
              </Text>
              <Text style={styles.contextMetaText}>
                Weight: <Text style={styles.contextMetaValue}>{((weighment?.netWeight ?? 0) / 1000).toFixed(1)} MT</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Quality Parameters */}
        <View style={styles.paramSection}>
          <Text style={styles.paramSectionTitle}>Quality Parameters</Text>
          <View style={styles.paramGrid}>
            {(qcParams ?? []).map((param) => (
              <View key={param.id} style={styles.paramRow}>
                <View>
                  <Text style={styles.paramName}>{param.name}</Text>
                  {param.target !== "—" && (
                    <Text style={styles.paramTarget}>Target: {param.target}</Text>
                  )}
                </View>
                <View style={styles.paramValueRow}>
                  <Text style={[styles.paramValue, !param.passed && styles.paramValueError]}>
                    {param.value}
                  </Text>
                  <Text style={param.passed ? styles.passIcon : styles.failIcon}>
                    {param.passed ? "✓" : "⚠"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Final Accepted Weight Card */}
        <View style={styles.finalWeightBox}>
          <Text style={styles.finalWeightLabel}>FINAL NET WEIGHT</Text>
          <View style={styles.finalWeightRow}>
            <Text style={styles.finalWeightValue}>
              {(weighment?.netWeight ?? 0).toLocaleString()}
            </Text>
            <Text style={styles.finalWeightUnit}>KG</Text>
          </View>
        </View>

        {/* QC Decision Buttons */}
        <View style={styles.decisionSection}>
          <Text style={styles.decisionTitle}>FINAL DECISION</Text>

          <TouchableOpacity
            style={[styles.acceptButton, decision === "accept" && styles.acceptButtonSelected]}
            activeOpacity={0.8}
            onPress={() => setDecision("accept")}
          >
            <Text style={[styles.acceptIcon, decision === "accept" && { color: "#FFFFFF" }]}>✓</Text>
            <Text style={[styles.acceptText, decision === "accept" && { color: "#FFFFFF" }]}>ACCEPT MANIFEST</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deductButton, decision === "deduct" && styles.deductButtonSelected]}
            activeOpacity={0.8}
            onPress={() => setDecision("deduct")}
          >
            <Text style={styles.deductIcon}>⊖</Text>
            <Text style={styles.deductText}>ACCEPT WITH DEDUCTION</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectButton, decision === "reject" && styles.rejectButtonSelected]}
            activeOpacity={0.8}
            onPress={() => setDecision("reject")}
          >
            <Text style={[styles.rejectIcon, decision === "reject" && { color: "#FFFFFF" }]}>⊘</Text>
            <Text style={[styles.rejectText, decision === "reject" && { color: "#FFFFFF" }]}>REJECT SHIPMENT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Confirm Button — Flexbox pinned, no absolute */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={[styles.stickyButton, (!decision || saving) && { opacity: 0.5 }]}
          activeOpacity={0.8}
          disabled={!decision || saving}
          onPress={handleConfirm}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.stickyButtonText}>CONFIRM QC DECISION</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 16, gap: 24 },

  // Step Progress
  stepRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "relative" },
  stepCol: { alignItems: "center", gap: 4 },
  circleDone: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" },
  circleCheck: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  circleActive: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#000000", backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  circleNum: { fontSize: 12, fontWeight: "900", color: "#000000" },
  lineH: { flex: 1, height: 1, backgroundColor: "#C6C6C6", marginHorizontal: 4, marginBottom: 20 },
  stepLabelSmall: { fontSize: 9, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  stepLabelBold: { fontSize: 9, fontWeight: "700", color: "#000000", textTransform: "uppercase" },

  // Context Card
  contextCard: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, borderWidth: 1, borderColor: "#000000", backgroundColor: "#F3F3F3" },
  contextIcon: { width: 64, height: 64, backgroundColor: "#E2E2E2", borderWidth: 1, borderColor: "#C6C6C6", justifyContent: "center", alignItems: "center" },
  contextIconText: { fontSize: 28 },
  contextInfo: { flex: 1 },
  contextLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  contextTitle: { fontSize: 20, fontWeight: "900", color: "#000000", letterSpacing: -0.5, textTransform: "uppercase" },
  contextMeta: { flexDirection: "row", gap: 16, marginTop: 4 },
  contextMetaText: { fontSize: 11, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  contextMetaValue: { color: "#474747" },

  // Quality Parameters
  paramSection: { gap: 16 },
  paramSectionTitle: { fontSize: 11, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  paramGrid: { borderWidth: 1, borderColor: "#C6C6C6", overflow: "hidden" },
  paramRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#C6C6C6" },
  paramName: { fontSize: 12, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  paramTarget: { fontSize: 10, fontWeight: "400", color: "#888888", textTransform: "uppercase", marginTop: 2 },
  paramValueRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  paramValue: { fontSize: 18, fontWeight: "900", color: "#000000" },
  paramValueError: { color: "#BA1A1A" },
  passIcon: { fontSize: 20, color: "#2E7D32" },
  failIcon: { fontSize: 20, color: "#BA1A1A" },

  // Final Weight
  finalWeightBox: { borderWidth: 2, borderColor: "#000000", backgroundColor: "#FFFFFF", padding: 24, alignItems: "center" },
  finalWeightLabel: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 2, opacity: 0.6, marginBottom: 8, textTransform: "uppercase" },
  finalWeightRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  finalWeightValue: { fontSize: 52, fontWeight: "900", color: "#000000", letterSpacing: -2 },
  finalWeightUnit: { fontSize: 22, fontWeight: "900", color: "#000000", marginTop: 12 },

  // Decision Buttons
  decisionSection: { gap: 12 },
  decisionTitle: { fontSize: 11, fontWeight: "700", color: "#474747", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  acceptButton: { height: 52, borderWidth: 1, borderColor: "#000000", backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  acceptButtonSelected: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  acceptIcon: { fontSize: 18, color: "#000000" },
  acceptText: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  deductButton: { height: 52, backgroundColor: "#000000", borderWidth: 2, borderColor: "#000000", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  deductButtonSelected: { backgroundColor: "#474747", borderColor: "#474747" },
  deductIcon: { fontSize: 18, color: "#FFFFFF" },
  deductText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  rejectButton: { height: 52, borderWidth: 1, borderColor: "#BA1A1A", backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  rejectButtonSelected: { backgroundColor: "#BA1A1A", borderColor: "#BA1A1A" },
  rejectIcon: { fontSize: 18, color: "#BA1A1A" },
  rejectText: { fontSize: 11, fontWeight: "700", color: "#BA1A1A", letterSpacing: 1, textTransform: "uppercase" },

  // Sticky Bottom — Flexbox pinned, no absolute
  stickyBottom: { padding: 16, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#C6C6C6" },
  stickyButton: { height: 52, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" },
  stickyButtonText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
});
