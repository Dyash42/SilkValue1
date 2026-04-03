// SCREEN: Home Dashboard
// REFERENCE: Reference_images/Reeler App/4._home_dashboard/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QRCodeDisplay } from "@silk-value/ui";
import { AppStackParamList } from "../navigation/types";
import { MOCK_REELER_PROFILE } from "../mock/reelerMockData";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const HomeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const profile = MOCK_REELER_PROFILE;

  const handleNotifications = () => {
    navigation.navigate("Notifications");
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>DASHBOARD</Text>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={handleNotifications}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>
              Welcome, {profile.name.split(" ")[0]}
            </Text>
            <Text style={styles.idText}>ID: {profile.reelerId}</Text>
          </View>
        </View>

        {/* Pending Badge */}
        <View style={styles.badgeSection}>
          <View style={styles.pendingBadge}>
            <Text style={styles.badgeIcon}>ℹ</Text>
            <Text style={styles.badgeText}>PENDING PAYMENT</Text>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <QRCodeDisplay
            data={profile.qrCodeData}
            size={200}
            label="Scan to Collect"
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statLabel}>TODAY</Text>
              <Text style={styles.statValue}>
                {formatCurrency(profile.totalEarningsToday)}
              </Text>
            </View>
            <Text style={styles.statIcon}>📅</Text>
          </View>
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statLabel}>THIS MONTH</Text>
              <Text style={styles.statValue}>
                {formatCurrency(profile.totalEarningsThisMonth)}
              </Text>
            </View>
            <Text style={styles.statIcon}>🗓️</Text>
          </View>
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statLabel}>LIFETIME</Text>
              <Text style={styles.statValue}>
                {formatCurrency(profile.totalEarningsLifetime)}
              </Text>
            </View>
            <Text style={styles.statIcon}>⏰</Text>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  notifButton: {
    padding: 8,
    borderRadius: 20,
  },
  notifIcon: {
    fontSize: 22,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DC2626",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatarIcon: {
    fontSize: 28,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  idText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  badgeSection: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeIcon: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  qrSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  statsGrid: {
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginTop: 4,
  },
  statIcon: {
    fontSize: 22,
    opacity: 0.3,
  },
});
