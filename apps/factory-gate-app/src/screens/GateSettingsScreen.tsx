// ─── Screen 11: Gate Settings — Operator, hardware, tolerances, alerts ────────
// TODO: Replace with real settings persistence via WatermelonDB/AsyncStorage.

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { MOCK_OPERATOR, MOCK_SETTINGS } from "../mock/gateMockData";

export const GateSettingsScreen: React.FC<any> = () => {
  const operator = MOCK_OPERATOR;
  const settings = MOCK_SETTINGS;
  const [lateWarning, setLateWarning] = useState(settings.lateShipmentWarning);
  const [varianceTrigger, setVarianceTrigger] = useState(settings.varianceThresholdTrigger);
  const [qcClearance, setQcClearance] = useState(settings.qcClearanceRequired);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.topBarTitle}>FACTORY LOGISTICS</Text>
        </View>
        <Text style={styles.settingsIcon}>⚙</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Screen Title */}
        <View style={styles.titleBar}>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        {/* Operator Profile */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>OPERATOR PROFILE</Text>
            <Text style={styles.cardHeaderIcon}>●</Text>
          </View>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>OPERATOR NAME</Text>
              <Text style={styles.profileValue}>{operator.name}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>EMPLOYEE ID</Text>
              <Text style={styles.profileValue}>{operator.employeeId}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>FACTORY UNIT</Text>
              <Text style={styles.profileValue}>{operator.factoryUnit}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>MOBILE CONTACT</Text>
              <Text style={styles.profileValue}>{operator.mobileContact}</Text>
            </View>
          </View>
        </View>

        {/* Hardware Interface */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>HARDWARE INTERFACE</Text>
            <Text style={styles.cardHeaderIcon}>📶</Text>
          </View>
          <View style={styles.scaleRow}>
            <View style={styles.scaleRowLeft}>
              <Text style={styles.scaleRowIcon}>⚖</Text>
              <View>
                <Text style={styles.scaleLabel}>SAVED DEVICE</Text>
                <Text style={styles.scaleDevice}>PRECISION-X-800</Text>
              </View>
            </View>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedBadgeText}>CONNECTED</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.manageButton} activeOpacity={0.7}>
            <Text style={styles.manageButtonText}>MANAGE SCALE CONNECTION</Text>
            <Text style={styles.manageButtonIcon}>📶</Text>
          </TouchableOpacity>
        </View>

        {/* Logistics Tolerance */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>LOGISTICS TOLERANCE</Text>
            <Text style={styles.cardHeaderIcon}>📏</Text>
          </View>
          <View style={styles.toleranceRow}>
            <View>
              <Text style={styles.toleranceLabel}>WEIGHT VARIANCE THRESHOLD</Text>
              <Text style={styles.toleranceValue}>± {settings.varianceThreshold.toFixed(1)}%</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert("MOCK", "Threshold editing not implemented.")}
            >
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.toleranceNote}>
            System will flag shipments exceeding this percentage from declared manifest weight.
          </Text>
        </View>

        {/* System Alerts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>SYSTEM ALERTS</Text>
            <Text style={styles.cardHeaderIcon}>🔔</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>LATE SHIPMENT WARNING</Text>
            <Switch
              value={lateWarning}
              onValueChange={setLateWarning}
              trackColor={{ false: "#E2E2E2", true: "#000000" }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>VARIANCE THRESHOLD TRIGGER</Text>
            <Switch
              value={varianceTrigger}
              onValueChange={setVarianceTrigger}
              trackColor={{ false: "#E2E2E2", true: "#000000" }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>QC CLEARANCE REQUIRED</Text>
            <Switch
              value={qcClearance}
              onValueChange={setQcClearance}
              trackColor={{ false: "#E2E2E2", true: "#000000" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>APPLICATION VERSION</Text>
              <Text style={styles.infoValue}>{settings.appVersion}</Text>
            </View>
            <View style={{ alignItems: "flex-end" as const }}>
              <Text style={styles.infoLabel}>LAST SYNC</Text>
              <Text style={[styles.infoValue, { fontStyle: "italic" }]}>{settings.lastSync}</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => Alert.alert("MOCK", "Logout not implemented.")}
        >
          <Text style={styles.logoutIcon}>↪</Text>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
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
  topBarTitle: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5, textTransform: "uppercase" },
  settingsIcon: { fontSize: 24, color: "#000000" },
  content: { padding: 16, paddingBottom: 40, gap: 24 },

  // Page Title
  titleBar: { borderLeftWidth: 4, borderLeftColor: "#000000", paddingLeft: 16, marginBottom: 8 },
  pageTitle: { fontSize: 24, fontWeight: "700", color: "#000000", textTransform: "uppercase", letterSpacing: -0.5 },

  // Card
  card: { borderWidth: 1, borderColor: "#000000", backgroundColor: "#F9F9F9", borderRadius: 4, padding: 16, gap: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#000000", letterSpacing: 0.5, textTransform: "uppercase" },
  cardHeaderIcon: { fontSize: 20, color: "#474747" },

  // Profile Grid
  profileGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  profileItem: { width: "46%" },
  profileLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  profileValue: { fontSize: 13, fontWeight: "700", color: "#000000", marginTop: 2 },

  // Scale Row
  scaleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#EEEEEE", padding: 12, borderWidth: 1, borderColor: "#C6C6C6" },
  scaleRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  scaleRowIcon: { fontSize: 24, color: "#000000" },
  scaleLabel: { fontSize: 10, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  scaleDevice: { fontSize: 13, fontWeight: "700", color: "#000000" },
  connectedBadge: { backgroundColor: "#000000", paddingHorizontal: 8, paddingVertical: 4 },
  connectedBadgeText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF", textTransform: "uppercase" },
  manageButton: { height: 52, borderWidth: 1, borderColor: "#000000", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  manageButtonText: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  manageButtonIcon: { fontSize: 14 },

  // Tolerance
  toleranceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toleranceLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  toleranceValue: { fontSize: 24, fontWeight: "900", color: "#000000", marginTop: 4 },
  editButton: { height: 40, paddingHorizontal: 16, borderWidth: 1, borderColor: "#000000", justifyContent: "center", alignItems: "center" },
  editButtonText: { fontSize: 10, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  toleranceNote: { fontSize: 10, color: "#474747", lineHeight: 16 },

  // Toggle
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  toggleLabel: { fontSize: 12, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  divider: { height: 1, backgroundColor: "#C6C6C6" },

  // Info Card
  infoCard: { backgroundColor: "#EEEEEE", borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 4, padding: 16 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  infoLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  infoValue: { fontSize: 13, fontWeight: "700", color: "#000000", marginTop: 2 },

  // Logout
  logoutButton: { height: 52, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  logoutIcon: { fontSize: 20, color: "#000000" },
  logoutText: { fontSize: 12, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
});
