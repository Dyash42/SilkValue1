// ─── Screen 9: History Detail — Full vehicle record ──────────────────────────
// TODO: Replace with WatermelonDB record observation.

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MOCK_HISTORY } from "../mock/gateMockData";

export const HistoryDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const entryId = route?.params?.entryId ?? "h-001";
  const entry = MOCK_HISTORY.find((h) => h.id === entryId) ?? MOCK_HISTORY[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>VEHICLE DETAIL</Text>
        </View>
        <Text style={styles.factoryIcon}>🏭</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.vehicleIdLarge}>{entry.vehicleId}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaItem}>📅 {entry.timestamp}</Text>
            <Text style={styles.headerMetaItem}>🔗 COLLECTOR: {entry.cluster.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.dividerThick} />

        {/* Weighment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WEIGHMENT DETAILS</Text>
          <View style={styles.weighGrid}>
            <View style={styles.weighCell}>
              <Text style={styles.weighCellLabel}>FIELD WEIGHT</Text>
              <Text style={styles.weighCellValue}>{entry.fieldWeight.toLocaleString()} KG</Text>
            </View>
            <View style={styles.weighCell}>
              <Text style={styles.weighCellLabel}>GATE WEIGHT</Text>
              <Text style={styles.weighCellValue}>{entry.gateWeight.toLocaleString()} KG</Text>
            </View>
            <View style={styles.weighCell}>
              <Text style={styles.weighCellLabel}>NET WEIGHT</Text>
              <Text style={styles.weighCellValue}>{entry.netWeight.toLocaleString()} KG</Text>
            </View>
            <View style={styles.weighCell}>
              <Text style={styles.weighCellLabel}>VARIANCE</Text>
              <View style={styles.varianceRow}>
                <Text style={styles.weighCellValue}>{entry.varianceKg} KG</Text>
                <View style={[styles.toleranceBadge, entry.varianceTolerance ? styles.toleranceBadgeOk : styles.toleranceBadgeError]}>
                  <Text style={styles.toleranceBadgeText}>
                    {entry.varianceTolerance ? "WITHIN TOLERANCE" : "EXCEEDS TOLERANCE"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dividerThick} />

        {/* QC Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QC PARAMETERS</Text>
          {entry.qcParameters.map((param) => (
            <View key={param.id} style={styles.qcRow}>
              <Text style={styles.qcName}>{param.name.toUpperCase()}</Text>
              <View style={styles.qcValueRow}>
                <Text style={styles.qcValue}>{param.value}</Text>
                <Text style={param.passed ? styles.qcPassIcon : styles.qcFailIcon}>
                  {param.passed ? "✓" : "⚠"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.dividerThick} />

        {/* QC Decision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QC DECISION</Text>
          <View style={styles.decisionRow}>
            <View style={styles.decisionCard}>
              <Text style={styles.decisionLabel}>STATUS</Text>
              <Text style={styles.decisionValue}>{entry.qcDecision.toUpperCase()}</Text>
            </View>
            <View style={styles.deductionCards}>
              <View style={styles.deductionCard}>
                <Text style={styles.deductionLabel}>STANDARD DEDUCTION</Text>
                <Text style={styles.deductionValue}>{entry.standardDeduction} KG</Text>
              </View>
              <View style={styles.deductionCard}>
                <Text style={styles.deductionLabel}>QUALITY DEDUCTION</Text>
                <Text style={styles.deductionValue}>{entry.qualityDeduction} KG</Text>
              </View>
            </View>
          </View>
          <Text style={styles.notesText}>
            Notes: {entry.notes}
          </Text>
        </View>

        <View style={styles.dividerThick} />

        {/* Reeler Breakdown */}
        {entry.reelerBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REELER BREAKDOWN</Text>
            <View style={styles.reelerTable}>
              {/* Header */}
              <View style={styles.reelerTableHead}>
                <Text style={[styles.reelerTh, { flex: 1.5 }]}>REELER NAME</Text>
                <Text style={[styles.reelerTh, { flex: 1 }]}>FIELD WT</Text>
                <Text style={[styles.reelerTh, { flex: 1 }]}>ACCEPTED WT</Text>
                <Text style={[styles.reelerTh, { flex: 0.8 }]}>DEDUCTION</Text>
                <Text style={[styles.reelerTh, { flex: 1 }]}>FINAL WT</Text>
              </View>
              {entry.reelerBreakdown.map((row, index) => (
                <View
                  key={row.reelerName}
                  style={[styles.reelerRow, index % 2 === 1 ? styles.reelerRowAlt : null]}
                >
                  <Text style={[styles.reelerTd, { flex: 1.5 }]}>{row.reelerName}</Text>
                  <Text style={[styles.reelerTd, { flex: 1 }]}>{row.fieldWeight.toLocaleString()} KG</Text>
                  <Text style={[styles.reelerTd, { flex: 1 }]}>{row.acceptedWeight.toLocaleString()} KG</Text>
                  <Text style={[styles.reelerTd, { flex: 0.8 }]}>{row.deduction} KG</Text>
                  <Text style={[styles.reelerTd, { flex: 1 }]}>{row.finalWeight.toLocaleString()} KG</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    height: 64, backgroundColor: "#FFFFFF",
    borderBottomWidth: 1, borderBottomColor: "#000000",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  backIcon: { fontSize: 24, color: "#000000" },
  topBarTitle: { fontSize: 22, fontWeight: "700", color: "#000000", letterSpacing: -1, textTransform: "uppercase" },
  factoryIcon: { fontSize: 24 },
  content: { padding: 16, paddingBottom: 32, gap: 32 },

  // Header
  headerSection: { gap: 4 },
  vehicleIdLarge: { fontSize: 40, fontWeight: "900", color: "#000000", letterSpacing: -2, textTransform: "uppercase" },
  headerMeta: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  headerMetaItem: { fontSize: 12, fontWeight: "700", color: "#474747", letterSpacing: 0.5, textTransform: "uppercase" },
  dividerThick: { height: 2, backgroundColor: "#000000" },

  // Weighment
  section: { gap: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: "#474747", letterSpacing: 2, textTransform: "uppercase" },
  weighGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  weighCell: { width: "47%", padding: 16, borderWidth: 1, borderColor: "#000000", backgroundColor: "#FFFFFF", borderRadius: 2 },
  weighCellLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase", marginBottom: 4 },
  weighCellValue: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5 },
  varianceRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  toleranceBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 24 },
  toleranceBadgeOk: { backgroundColor: "#2E7D32" },
  toleranceBadgeError: { backgroundColor: "#BA1A1A" },
  toleranceBadgeText: { fontSize: 9, fontWeight: "900", color: "#FFFFFF", textTransform: "uppercase" },

  // QC
  qcRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#C6C6C6" },
  qcName: { fontSize: 11, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  qcValueRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qcValue: { fontSize: 14, fontWeight: "700", color: "#000000" },
  qcPassIcon: { fontSize: 20, color: "#2E7D32" },
  qcFailIcon: { fontSize: 20, color: "#BA1A1A" },

  // Decision
  decisionRow: { flexDirection: "row", gap: 16 },
  decisionCard: { backgroundColor: "#000000", padding: 24, alignItems: "center", justifyContent: "center", borderRadius: 2, minWidth: 120 },
  decisionLabel: { fontSize: 10, fontWeight: "700", color: "#888888", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  decisionValue: { fontSize: 22, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1 },
  deductionCards: { flex: 1, gap: 8 },
  deductionCard: { backgroundColor: "#EEEEEE", padding: 16 },
  deductionLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase", marginBottom: 4 },
  deductionValue: { fontSize: 16, fontWeight: "700", color: "#000000" },
  notesText: { fontSize: 11, fontWeight: "700", color: "#474747", letterSpacing: -0.3, textTransform: "uppercase" },

  // Reeler Table
  reelerTable: { borderWidth: 1, borderColor: "#000000", borderRadius: 2, overflow: "hidden" },
  reelerTableHead: { flexDirection: "row", backgroundColor: "#000000", paddingVertical: 12, paddingHorizontal: 8 },
  reelerTh: { fontSize: 9, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.3, textTransform: "uppercase" },
  reelerRow: { flexDirection: "row", backgroundColor: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#C6C6C6" },
  reelerRowAlt: { backgroundColor: "#F5F5F5" },
  reelerTd: { fontSize: 11, fontWeight: "700", color: "#000000" },
});
