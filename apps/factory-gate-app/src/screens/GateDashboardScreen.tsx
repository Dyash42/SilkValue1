// ─── Screen 2: Gate Dashboard — Main hub with stats & expected arrivals ──────
// TODO: Replace mock data with WatermelonDB observables.

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MOCK_DAILY_SUMMARY, MOCK_EXPECTED_VEHICLES, MOCK_OPERATOR } from "../mock/gateMockData";

export const GateDashboardScreen: React.FC<any> = ({ navigation }) => {
  const summary = MOCK_DAILY_SUMMARY;
  const vehicles = MOCK_EXPECTED_VEHICLES;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.topBarTitle}>SILK VALUE</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.operatorLabel}>
            OPERATOR: {MOCK_OPERATOR.name}
          </Text>
          <Text style={styles.avatarIcon}>●</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Late Vehicle Alert Banner */}
        <TouchableOpacity style={styles.alertBanner} activeOpacity={0.8}>
          <View style={styles.alertLeft}>
            <Text style={styles.alertIcon}>⚠</Text>
            <View>
              <Text style={styles.alertTitle}>LATE VEHICLE ALERT</Text>
              <Text style={styles.alertBody}>TX-9042 is 45 mins behind schedule</Text>
            </View>
          </View>
          <Text style={styles.alertChevron}>›</Text>
        </TouchableOpacity>

        {/* Stat Cards Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CHECKED IN</Text>
            <View>
              <Text style={styles.statValue}>{String(summary.checkedInToday).padStart(2, "0")}</Text>
              <Text style={styles.statSublabel}>VEHICLES TODAY</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PENDING ARRIVAL</Text>
            <View>
              <Text style={styles.statValue}>{String(summary.pendingArrival).padStart(2, "0")}</Text>
              <Text style={styles.statSublabel}>ESTIMATED REMAINING</Text>
            </View>
          </View>
        </View>

        {/* Total Weight Card */}
        <View style={styles.weightCard}>
          <View style={styles.weightHeader}>
            <Text style={styles.statLabel}>TOTAL WEIGHT DISPATCHED</Text>
            <Text style={styles.scaleIcon}>⚖</Text>
          </View>
          <View style={styles.weightValueRow}>
            <Text style={styles.weightValue}>{summary.totalWeightDispatched.toFixed(1)}</Text>
            <Text style={styles.weightUnit}>METRIC TONS</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${summary.dailyQuotaPercent}%` as any }]} />
          </View>
          <Text style={styles.progressLabel}>
            {summary.dailyQuotaPercent}% OF DAILY QUOTA REACHED
          </Text>
        </View>

        {/* Pending QC Card */}
        <TouchableOpacity style={styles.qcCard} activeOpacity={0.7}>
          <View style={styles.qcContent}>
            <Text style={styles.statLabel}>QUALITY CONTROL</Text>
            <Text style={styles.qcTitle}>{summary.pendingQCReviews} Pending QC Reviews</Text>
            <View style={styles.qcLink}>
              <Text style={styles.qcLinkText}>TAP TO REVIEW</Text>
              <Text style={styles.qcLinkArrow}>→</Text>
            </View>
          </View>
          <View style={styles.qcIconBox}>
            <Text style={styles.qcIconText}>☑</Text>
          </View>
        </TouchableOpacity>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expected Arrivals Today</Text>
          <Text style={styles.sectionSubtitle}>LIVE SCHEDULE MANIFEST</Text>
        </View>

        {/* Expected Arrivals List */}
        {vehicles.map((vehicle) => {
          const isLate = vehicle.status === "late";
          const isCheckedIn = vehicle.status === "checked_in";
          const statusLabel = isLate ? "LATE" : isCheckedIn ? "CHECKED IN" : "EXPECTED";

          return (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleRow,
                isCheckedIn && styles.vehicleRowInactive,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (!isCheckedIn) {
                  navigation?.navigate?.("VehicleCheckIn", { vehicleId: vehicle.id });
                }
              }}
            >
              <View style={[styles.vehicleIconBox, isCheckedIn && styles.vehicleIconBoxChecked]}>
                <Text style={styles.vehicleIcon}>
                  {isCheckedIn ? "✓" : isLate ? "🚚" : "◷"}
                </Text>
              </View>
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleTopRow}>
                  <Text style={[styles.vehiclePlate, isCheckedIn && styles.vehiclePlateMuted]}>
                    {vehicle.licensePlate}
                  </Text>
                  <View
                    style={[
                      styles.vehicleBadge,
                      isLate && styles.vehicleBadgeLate,
                      isCheckedIn && styles.vehicleBadgeCheckedIn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.vehicleBadgeText,
                        isLate && styles.vehicleBadgeTextLight,
                        isCheckedIn && styles.vehicleBadgeTextLight,
                      ]}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>
                <Text style={styles.vehicleCarrier}>
                  {vehicle.carrier} • {vehicle.eta} {isCheckedIn ? "Actual" : "ETA"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  topBar: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: { fontSize: 20, color: "#000000" },
  topBarTitle: { fontSize: 20, fontWeight: "900", color: "#000000", letterSpacing: -1, textTransform: "uppercase" },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  operatorLabel: { fontSize: 12, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  avatarIcon: { fontSize: 24, color: "#000000" },
  scrollView: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },

  // Alert Banner
  alertBanner: {
    backgroundColor: "#000000",
    borderRadius: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alertLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  alertIcon: { fontSize: 20, color: "#FFFFFF" },
  alertTitle: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
  alertBody: { fontSize: 13, color: "#E2E2E2", opacity: 0.9, marginTop: 2 },
  alertChevron: { fontSize: 24, color: "#FFFFFF" },

  // Stat Cards
  statGrid: { flexDirection: "row", gap: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    padding: 16,
    aspectRatio: 1,
    justifyContent: "space-between",
  },
  statLabel: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, textTransform: "uppercase" },
  statValue: { fontSize: 36, fontWeight: "900", color: "#000000" },
  statSublabel: { fontSize: 10, fontWeight: "700", color: "#474747", marginTop: 4, textTransform: "uppercase" },

  // Weight Card
  weightCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    padding: 20,
  },
  weightHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  scaleIcon: { fontSize: 20, color: "#474747" },
  weightValueRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  weightValue: { fontSize: 48, fontWeight: "900", color: "#000000", letterSpacing: -2 },
  weightUnit: { fontSize: 18, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  progressTrack: { height: 4, backgroundColor: "#EEEEEE", borderRadius: 2, marginTop: 16, overflow: "hidden" },
  progressFill: { height: 4, backgroundColor: "#000000", borderRadius: 2 },
  progressLabel: { fontSize: 10, fontWeight: "700", color: "#474747", marginTop: 8, textTransform: "uppercase" },

  // QC Card
  qcCard: {
    backgroundColor: "#EEEEEE",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qcContent: { flex: 1 },
  qcTitle: { fontSize: 18, fontWeight: "900", color: "#000000", marginTop: 4 },
  qcLink: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  qcLinkText: { fontSize: 10, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  qcLinkArrow: { fontSize: 14, color: "#000000" },
  qcIconBox: { width: 48, height: 48, backgroundColor: "#000000", borderRadius: 4, justifyContent: "center", alignItems: "center" },
  qcIconText: { fontSize: 24, color: "#FFFFFF" },

  // Section Header
  sectionHeader: { borderTopWidth: 1, borderTopColor: "#C6C6C6", paddingTop: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "#000000", letterSpacing: -0.5, textTransform: "uppercase" },
  sectionSubtitle: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 1, marginTop: 2, textTransform: "uppercase" },

  // Vehicle Row
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
  },
  vehicleRowInactive: { backgroundColor: "#EEEEEE", borderColor: "#C6C6C6", opacity: 0.75 },
  vehicleIconBox: {
    width: 48, height: 48,
    backgroundColor: "#F5F5F5",
    borderWidth: 1, borderColor: "#C6C6C6",
    borderRadius: 4,
    justifyContent: "center", alignItems: "center",
  },
  vehicleIconBoxChecked: { backgroundColor: "#FFFFFF" },
  vehicleIcon: { fontSize: 22 },
  vehicleContent: { flex: 1 },
  vehicleTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  vehiclePlate: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5 },
  vehiclePlateMuted: { color: "#474747" },
  vehicleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: "#000000", borderRadius: 2 },
  vehicleBadgeLate: { backgroundColor: "#000000", borderColor: "#000000" },
  vehicleBadgeCheckedIn: { backgroundColor: "#3A3C3C", borderColor: "#3A3C3C" },
  vehicleBadgeText: { fontSize: 9, fontWeight: "900", color: "#000000", letterSpacing: 1 },
  vehicleBadgeTextLight: { color: "#FFFFFF" },
  vehicleCarrier: { fontSize: 11, fontWeight: "700", color: "#474747", marginTop: 4, textTransform: "uppercase" },
});
