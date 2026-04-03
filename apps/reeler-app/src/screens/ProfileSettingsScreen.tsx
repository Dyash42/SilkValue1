// SCREEN: Profile & Settings
// REFERENCE: Reference_images/Reeler App/profile_settings_updated/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import { MOCK_REELER_PROFILE } from "../mock/reelerMockData";

export const ProfileSettingsScreen: React.FC = () => {
  const profile = MOCK_REELER_PROFILE;
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [pushAlerts, setPushAlerts] = useState<boolean>(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <View style={styles.backPlaceholder} />
          <Text style={styles.topBarTitle}>PROFILE & SETTINGS</Text>
          <View style={styles.backPlaceholder} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity & Cluster */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IDENTITY & CLUSTER</Text>
          <View style={styles.brutalistCard}>
            {/* Name */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>NAME</Text>
              <Text style={styles.cardValue}>{profile.name}</Text>
            </View>
            <View style={styles.cardDivider} />

            {/* Reeler ID + QR */}
            <View style={styles.cardRowBetween}>
              <View>
                <Text style={styles.cardLabel}>REELER ID</Text>
                <Text style={styles.cardValue}>{profile.reelerId}</Text>
              </View>
              <TouchableOpacity style={styles.qrButton}>
                <Text style={styles.qrButtonIcon}>⊞</Text>
                <Text style={styles.qrButtonText}>QR CODE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardDivider} />

            {/* DOB + Gender */}
            <View style={styles.cardGrid}>
              <View style={styles.cardGridCell}>
                <Text style={styles.cardLabel}>DATE OF BIRTH</Text>
                <Text style={styles.cardValue}>{profile.dateOfBirth}</Text>
              </View>
              <View style={styles.cardGridDivider} />
              <View style={styles.cardGridCell}>
                <Text style={styles.cardLabel}>GENDER</Text>
                <Text style={styles.cardValue}>{profile.gender}</Text>
              </View>
            </View>
            <View style={styles.cardDivider} />

            {/* Address */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>ADDRESS</Text>
              <Text style={styles.cardValue}>
                {profile.village}, {profile.district}
              </Text>
            </View>
            <View style={styles.cardDivider} />

            {/* Cluster Assignment */}
            <View style={styles.clusterRow}>
              <Text style={styles.clusterLabel}>CLUSTER ASSIGNMENT</Text>
              <Text style={styles.clusterValue}>
                {profile.clusterAssignment}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BANK DETAILS</Text>
          <View style={styles.bankCard}>
            <View>
              <Text style={styles.cardLabel}>ACCOUNT NUMBER</Text>
              <View style={styles.bankRow}>
                <Text style={styles.cardValue}>
                  **** {profile.bankAccountLast4}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>
            </View>
            <Text style={styles.bankIcon}>🏦</Text>
          </View>
          <TouchableOpacity style={styles.editBankButton} activeOpacity={0.8}>
            <Text style={styles.editBankLabel}>EDIT BANK DETAILS</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.brutalistCard}>
            {/* Language */}
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <Text style={styles.prefIcon}>🔤</Text>
                <Text style={styles.prefLabel}>LANGUAGE</Text>
              </View>
              <View style={styles.prefRight}>
                <Text style={styles.prefValue}>English</Text>
                <Text style={styles.prefArrow}>▾</Text>
              </View>
            </View>
            <View style={styles.cardDivider} />

            {/* SMS Alerts */}
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <Text style={styles.prefIcon}>💬</Text>
                <Text style={styles.prefLabel}>SMS ALERTS</Text>
              </View>
              <Switch
                value={smsAlerts}
                onValueChange={setSmsAlerts}
                trackColor={{ false: "#E2E8F0", true: "#000000" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.cardDivider} />

            {/* Push Alerts */}
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <Text style={styles.prefIcon}>🔔</Text>
                <Text style={styles.prefLabel}>APP PUSH ALERTS</Text>
              </View>
              <Switch
                value={pushAlerts}
                onValueChange={setPushAlerts}
                trackColor={{ false: "#E2E8F0", true: "#000000" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Support & Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT & ACCOUNT</Text>
          <View style={styles.brutalistCard}>
            <TouchableOpacity style={styles.supportRow}>
              <View style={styles.prefLeft}>
                <Text style={styles.prefIcon}>💬</Text>
                <Text style={styles.prefLabel}>
                  CONTACT SUPPORT{" "}
                  <Text style={styles.supportSub}>(WhatsApp)</Text>
                </Text>
              </View>
              <Text style={styles.externalIcon}>↗</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <Text style={styles.logoutIcon}>→</Text>
            <Text style={styles.logoutLabel}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>APP VERSION V1.0.2</Text>
          <Text style={styles.footerText}>LAST SYNCED: TODAY, 9:00 AM</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  topBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backPlaceholder: {
    width: 40,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  brutalistCard: {
    borderWidth: 2,
    borderColor: "#000000",
  },
  cardRow: {
    padding: 16,
    gap: 4,
  },
  cardRowBetween: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDivider: {
    height: 2,
    backgroundColor: "#000000",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qrButtonIcon: {
    fontSize: 14,
    color: "#000000",
  },
  qrButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
  cardGrid: {
    flexDirection: "row",
  },
  cardGridCell: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  cardGridDivider: {
    width: 2,
    backgroundColor: "#000000",
  },
  clusterRow: {
    padding: 16,
    backgroundColor: "#000000",
    gap: 4,
  },
  clusterLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  clusterValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bankCard: {
    borderWidth: 2,
    borderColor: "#000000",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  verifiedBadge: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#000000",
  },
  bankIcon: {
    fontSize: 24,
  },
  editBankButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  editBankLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  prefLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prefIcon: {
    fontSize: 18,
  },
  prefLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    textTransform: "uppercase",
  },
  prefRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prefValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  prefArrow: {
    fontSize: 16,
    color: "#000000",
  },
  supportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  supportSub: {
    fontSize: 10,
    fontWeight: "400",
    color: "#000000",
  },
  externalIcon: {
    fontSize: 18,
    color: "#000000",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#000000",
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
  },
  logoutIcon: {
    fontSize: 18,
    color: "#000000",
  },
  logoutLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
