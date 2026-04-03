// ─── Screen 10: Reports — Daily summary, quality breakdown, exports ──────────
// TODO: Replace with real analytics from WatermelonDB/backend.

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { MOCK_DAILY_SUMMARY, MOCK_QUALITY_BREAKDOWN } from "../mock/gateMockData";

export const ReportsScreen: React.FC<any> = () => {
  const [activeRange, setActiveRange] = useState("Today");
  const summary = MOCK_DAILY_SUMMARY;
  const quality = MOCK_QUALITY_BREAKDOWN;
  const totalUnits = quality.gradeA + quality.gradeB + quality.gradeC + quality.rejected;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.topBarTitle}>FACTORY LOGISTICS</Text>
        </View>
        <Text style={styles.topBarRight}>REPORTS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Range Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {["Today", "Yesterday", "7 Days", "Custom Range"].map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.pill, activeRange === range ? styles.pillActive : styles.pillInactive]}
              onPress={() => setActiveRange(range)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, activeRange === range ? styles.pillTextActive : null]}>
                {range.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Summary */}
        <Text style={styles.sectionHeading}>DAILY SUMMARY</Text>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL VEHICLES</Text>
              <Text style={styles.summaryValue}>{summary.totalVehicles}</Text>
            </View>
            <Text style={styles.summaryIconFaded}>🚚</Text>
          </View>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL ACCEPTED</Text>
              <Text style={styles.summaryValue}>{summary.totalAccepted}</Text>
            </View>
            <Text style={styles.summaryIconFaded}>✓</Text>
          </View>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL REJECTED</Text>
              <Text style={[styles.summaryValue, styles.summaryValueError]}>{summary.totalRejected}</Text>
            </View>
            <Text style={[styles.summaryIconFaded, { color: "#BA1A1A" }]}>✕</Text>
          </View>
        </View>

        {/* Quality Breakdown */}
        <View style={styles.qualityCard}>
          <Text style={styles.qualityHeading}>QUALITY BREAKDOWN</Text>
          
          {/* Grade A */}
          <View style={styles.gradeRow}>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeLabel}>GRADE A — PREMIUM</Text>
              <Text style={styles.gradeCount}>{quality.gradeA} Units</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(quality.gradeA / totalUnits) * 100}%` as any }]} />
            </View>
          </View>

          {/* Grade B */}
          <View style={styles.gradeRow}>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeLabel}>GRADE B — STANDARD</Text>
              <Text style={styles.gradeCount}>{quality.gradeB} Units</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, styles.progressFill70, { width: `${(quality.gradeB / totalUnits) * 100}%` as any }]} />
            </View>
          </View>

          {/* Grade C */}
          <View style={styles.gradeRow}>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeLabel}>GRADE C — ECONOMY</Text>
              <Text style={styles.gradeCount}>{quality.gradeC} Units</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, styles.progressFill40, { width: `${(quality.gradeC / totalUnits) * 100}%` as any }]} />
            </View>
          </View>

          {/* Rejected */}
          <View style={[styles.gradeRow, styles.gradeRowRejected]}>
            <View style={styles.gradeInfo}>
              <Text style={[styles.gradeLabel, styles.gradeLabelError]}>REJECTED / DEFECTIVE</Text>
              <Text style={[styles.gradeCount, styles.gradeCountError]}>{quality.rejected} Units</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFillError, { width: `${(quality.rejected / totalUnits) * 100}%` as any }]} />
            </View>
          </View>
        </View>

        {/* Export Buttons */}
        <View style={styles.exportRow}>
          <TouchableOpacity
            style={styles.exportButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert("MOCK", "PDF export not implemented.")}
          >
            <Text style={styles.exportIcon}>📄</Text>
            <Text style={styles.exportText}>EXPORT PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert("MOCK", "CSV export not implemented.")}
          >
            <Text style={styles.exportIcon}>📊</Text>
            <Text style={styles.exportText}>EXPORT CSV</Text>
          </TouchableOpacity>
        </View>

        {/* Individual Reports */}
        <View style={styles.individualSection}>
          <View style={styles.individualHeader}>
            <Text style={styles.sectionHeading}>INDIVIDUAL REPORTS</Text>
            <Text style={styles.individualSub}>RECENT 24H</Text>
          </View>

          {[
            { id: "VH-99201-A", vehicle: "Scania R450 • 09:42 AM", grade: "GRADE A", load: "24,000kg", status: "Cleared", gradeColor: "#000000" },
            { id: "VH-88124-C", vehicle: "Volvo FH16 • 08:15 AM", grade: "REJECTED", load: "18,500kg", status: "Error: Weight Limit", gradeColor: "#BA1A1A" },
            { id: "VH-77293-B", vehicle: "MAN TGX • 07:30 AM", grade: "GRADE B", load: "22,100kg", status: "Cleared", gradeColor: "#474747" },
          ].map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportTop}>
                <View>
                  <Text style={styles.reportId}>{report.id}</Text>
                  <Text style={styles.reportVehicle}>{report.vehicle}</Text>
                </View>
                <View style={[styles.gradeBadge, { backgroundColor: report.gradeColor }]}>
                  <Text style={styles.gradeBadgeText}>{report.grade}</Text>
                </View>
              </View>
              <View style={styles.reportTags}>
                <View style={styles.reportTag}>
                  <Text style={styles.reportTagText}>Load: {report.load}</Text>
                </View>
                <View style={styles.reportTag}>
                  <Text style={styles.reportTagText}>Status: {report.status}</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.7}>
            <Text style={styles.loadMoreText}>LOAD MORE ARCHIVE DATA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: { fontSize: 20, color: "#000000" },
  topBarTitle: { fontSize: 16, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  topBarRight: { fontSize: 16, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  content: { padding: 16, paddingBottom: 32, gap: 24 },

  // Pills
  pillRow: { flexGrow: 0 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, marginRight: 8 },
  pillActive: { backgroundColor: "#000000" },
  pillInactive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C6C6C6" },
  pillText: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  pillTextActive: { color: "#FFFFFF" },

  sectionHeading: { fontSize: 18, fontWeight: "700", color: "#000000", letterSpacing: -0.5, textTransform: "uppercase" },

  // Summary Cards
  summaryCards: { gap: 12 },
  summaryCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 16, borderWidth: 1, borderColor: "#000000", backgroundColor: "#FFFFFF", borderRadius: 4,
  },
  summaryLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  summaryValue: { fontSize: 32, fontWeight: "900", color: "#000000", marginTop: 4 },
  summaryValueError: { color: "#BA1A1A" },
  summaryIconFaded: { fontSize: 40, opacity: 0.15 },

  // Quality Card
  qualityCard: { borderWidth: 1, borderColor: "#000000", borderRadius: 4, backgroundColor: "#FFFFFF", padding: 16, gap: 16 },
  qualityHeading: { fontSize: 16, fontWeight: "700", color: "#000000", letterSpacing: -0.5, textTransform: "uppercase" },
  gradeRow: { gap: 4 },
  gradeInfo: { flexDirection: "row", justifyContent: "space-between" },
  gradeLabel: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  gradeCount: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  gradeLabelError: { color: "#BA1A1A" },
  gradeCountError: { color: "#BA1A1A" },
  gradeRowRejected: { borderTopWidth: 1, borderTopColor: "#C6C6C6", paddingTop: 12 },
  progressTrack: { height: 16, backgroundColor: "#EEEEEE", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: 16, backgroundColor: "#000000", borderRadius: 2 },
  progressFill70: { opacity: 0.7 },
  progressFill40: { opacity: 0.4 },
  progressFillError: { height: 16, backgroundColor: "#BA1A1A", borderRadius: 2 },

  // Export
  exportRow: { flexDirection: "row", gap: 12 },
  exportButton: { flex: 1, height: 52, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", borderRadius: 4, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  exportIcon: { fontSize: 18 },
  exportText: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },

  // Individual
  individualSection: { gap: 16 },
  individualHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  individualSub: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase", paddingBottom: 2 },
  reportCard: { borderWidth: 1, borderColor: "#000000", borderRadius: 4, backgroundColor: "#FFFFFF", padding: 16, gap: 12 },
  reportTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  reportId: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -1 },
  reportVehicle: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, marginTop: 4, textTransform: "uppercase" },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 4 },
  gradeBadgeText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF", textTransform: "uppercase" },
  reportTags: { flexDirection: "row", gap: 8 },
  reportTag: { backgroundColor: "#EEEEEE", borderRadius: 2, paddingHorizontal: 8, paddingVertical: 6 },
  reportTagText: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  loadMoreButton: { paddingVertical: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "#C6C6C6", borderRadius: 4, alignItems: "center" },
  loadMoreText: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
});
