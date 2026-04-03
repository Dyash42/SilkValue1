// ─── Screen 6: Acceptance Breakdown — Reeler-wise table + rejected units ─────
// TODO: Replace with real acceptance data from WatermelonDB.

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MOCK_REELER_UNITS } from "../mock/gateMockData";

export const AcceptanceBreakdownScreen: React.FC<any> = ({ navigation }) => {
  const units = MOCK_REELER_UNITS;
  const accepted = units.filter((u) => u.status === "accepted");
  const rejected = units.filter((u) => u.status === "rejected");

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Acceptance Breakdown</Text>
        </View>
        <Text style={styles.moreIcon}>⋮</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Progress */}
        <View style={styles.stepNav}>
          {["Gate", "Unload", "QC Inspect", "Acceptance"].map((label, i) => {
            const isLast = i === 3;
            const isDone = i < 3;
            return (
              <React.Fragment key={label}>
                {i > 0 && <View style={styles.stepLine} />}
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, isDone ? styles.stepCircleFilled : styles.stepCircleOutline]}>
                    {isDone ? (
                      <Text style={styles.stepCheck}>✓</Text>
                    ) : (
                      <Text style={styles.stepNum}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, isLast ? styles.stepLabelBold : null]}>
                    {label.toUpperCase()}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Active Shipment Card */}
        <View style={styles.shipmentCard}>
          <View style={styles.shipmentTop}>
            <View>
              <Text style={styles.shipmentLabel}>ACTIVE SHIPMENT</Text>
              <Text style={styles.shipmentPlate}>MH-12-CQ-8842</Text>
              <Text style={styles.shipmentItem}>LINE ITEM: INDUSTRIAL KRAFT PAPER</Text>
            </View>
            <View style={styles.qcBadge}>
              <Text style={styles.qcBadgeIcon}>✓</Text>
              <Text style={styles.qcBadgeText}>QC PASSED</Text>
            </View>
          </View>
          <View style={styles.shipmentMeta}>
            <View>
              <Text style={styles.metaLabel}>TOTAL REELERS</Text>
              <Text style={styles.metaValue}>12 UNITS</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>DECLARED WT</Text>
              <Text style={styles.metaValue}>4,250 KG</Text>
            </View>
          </View>
        </View>

        {/* Reeler Acceptance Table */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableIcon}>☰</Text>
            <Text style={styles.tableSectionTitle}>REELER ACCEPTANCE BREAKDOWN</Text>
          </View>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHead}>
              <Text style={[styles.th, { flex: 1 }]}>ID</Text>
              <Text style={[styles.th, { flex: 1 }]}>SPEC</Text>
              <Text style={[styles.th, { flex: 1 }]}>WEIGHT</Text>
              <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
            </View>
            {/* Table Body */}
            {accepted.map((unit, index) => (
              <View
                key={unit.id}
                style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : null]}
              >
                <Text style={[styles.td, { flex: 1 }]}>{unit.reelerId}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{unit.spec}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{unit.weight} KG</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>ACCEPTED</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Variance Distribution Notice */}
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeIcon}>ℹ</Text>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>VARIANCE DISTRIBUTION</Text>
            <Text style={styles.noticeBody}>
              Weight variance of -1.2% detected. Adjusted totals will be
              reflected in the final manifest based on reeler-wise scanning.
            </Text>
          </View>
        </View>

        {/* Rejected Reelers */}
        {rejected.length > 0 && (
          <View style={styles.rejectedSection}>
            <View style={styles.rejectedHeaderRow}>
              <Text style={styles.rejectedIcon}>⊘</Text>
              <Text style={styles.rejectedTitle}>
                REJECTED REELER UNITS ({String(rejected.length).padStart(2, "0")})
              </Text>
            </View>
            {rejected.map((unit) => (
              <View key={unit.id} style={styles.rejectedCard}>
                <View>
                  <Text style={styles.rejectedId}>REELER ID: {unit.reelerId}</Text>
                  <Text style={styles.rejectedReason}>
                    {unit.rejectionReason}
                  </Text>
                </View>
                <Text style={styles.rejectedCancelIcon}>✕</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sticky Confirmation */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate?.("ProcessComplete", { vehicleId: "v-001", decision: "Accepted with Deduction" })}
        >
          <Text style={styles.confirmText}>CONFIRM FINAL BREAKDOWN</Text>
          <Text style={styles.confirmIcon}>☑</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  topBar: {
    height: 56, backgroundColor: "#FFFFFF",
    borderBottomWidth: 1, borderBottomColor: "#DDDDDD",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  backIcon: { fontSize: 24, color: "#000000" },
  topBarTitle: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5 },
  moreIcon: { fontSize: 24, color: "#000000" },
  content: { padding: 16, paddingBottom: 140, gap: 24 },

  // Step Progress
  stepNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 8, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", borderRadius: 4 },
  stepItem: { alignItems: "center", gap: 4 },
  stepLine: { flex: 1, height: 1, backgroundColor: "#C6C6C6", marginHorizontal: 4, marginBottom: 16 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  stepCircleFilled: { backgroundColor: "#000000" },
  stepCircleOutline: { borderWidth: 2, borderColor: "#000000", backgroundColor: "#FFFFFF" },
  stepCheck: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  stepNum: { fontSize: 12, fontWeight: "900", color: "#000000" },
  stepLabel: { fontSize: 9, fontWeight: "700", color: "#474747", letterSpacing: 0.5, textTransform: "uppercase" },
  stepLabelBold: { fontWeight: "900", color: "#000000" },

  // Shipment Card
  shipmentCard: { borderWidth: 1, borderColor: "#000000", borderRadius: 4, padding: 16, backgroundColor: "#FFFFFF" },
  shipmentTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  shipmentLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  shipmentPlate: { fontSize: 24, fontWeight: "900", color: "#000000", letterSpacing: -1 },
  shipmentItem: { fontSize: 12, fontWeight: "700", color: "#474747", marginTop: 4, textTransform: "uppercase" },
  qcBadge: { backgroundColor: "#000000", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2, flexDirection: "row", alignItems: "center", gap: 4 },
  qcBadgeIcon: { fontSize: 12, color: "#FFFFFF" },
  qcBadgeText: { fontSize: 10, fontWeight: "700", color: "#E2E2E2", textTransform: "uppercase" },
  shipmentMeta: { flexDirection: "row", gap: 32, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#C6C6C6", marginTop: 12 },
  metaLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  metaValue: { fontSize: 18, fontWeight: "900", color: "#000000", marginTop: 2 },

  // Table Section
  tableSection: { gap: 12 },
  tableHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tableIcon: { fontSize: 14, color: "#000000" },
  tableSectionTitle: { fontSize: 12, fontWeight: "900", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  table: { borderWidth: 1, borderColor: "#000000", borderRadius: 4, overflow: "hidden" },
  tableHead: { flexDirection: "row", backgroundColor: "#000000", paddingVertical: 12, paddingHorizontal: 16 },
  th: { fontSize: 10, fontWeight: "900", color: "#FFFFFF", letterSpacing: 0.5, textTransform: "uppercase" },
  tableRow: { flexDirection: "row", backgroundColor: "#FFFFFF", paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#C6C6C6" },
  tableRowAlt: { backgroundColor: "#F3F3F3" },
  td: { fontSize: 13, fontWeight: "700", color: "#000000" },
  statusBadge: { backgroundColor: "#EEEEEE", paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" },
  statusBadgeText: { fontSize: 10, fontWeight: "700", color: "#000000", textTransform: "uppercase" },

  // Notice Banner
  noticeBanner: { backgroundColor: "#EEEEEE", borderLeftWidth: 4, borderLeftColor: "#000000", padding: 16, flexDirection: "row", gap: 16, alignItems: "flex-start" },
  noticeIcon: { fontSize: 18, color: "#000000" },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  noticeBody: { fontSize: 13, color: "#474747", lineHeight: 20, marginTop: 4 },

  // Rejected Section
  rejectedSection: { gap: 12 },
  rejectedHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  rejectedIcon: { fontSize: 14, color: "#BA1A1A" },
  rejectedTitle: { fontSize: 12, fontWeight: "900", color: "#BA1A1A", letterSpacing: 1, textTransform: "uppercase" },
  rejectedCard: { borderWidth: 1, borderColor: "#BA1A1A", borderRadius: 4, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rejectedId: { fontSize: 10, fontWeight: "900", color: "#BA1A1A", textTransform: "uppercase" },
  rejectedReason: { fontSize: 13, fontWeight: "700", color: "#000000", marginTop: 4 },
  rejectedCancelIcon: { fontSize: 20, color: "#BA1A1A" },

  // Sticky Footer
  stickyFooter: { position: "absolute", bottom: 60, left: 0, right: 0, padding: 16, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#C6C6C6" },
  confirmButton: { height: 52, backgroundColor: "#000000", borderRadius: 2, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  confirmText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  confirmIcon: { fontSize: 14, color: "#FFFFFF" },
});
