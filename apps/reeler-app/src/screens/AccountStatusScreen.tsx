// SCREEN: Account Status — Pending Approval
// REFERENCE: Reference_images/Reeler App/account_status_pending_approval/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "AccountStatus">;

export const AccountStatusScreen: React.FC<Props> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    // MOCK: No real action
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Account Status</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.centerBlock}>
          {/* Visual Centerpiece */}
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <View style={styles.dashedRing} />
          </View>

          {/* Text Content */}
          <Text style={styles.statusTitle}>Account Pending{"\n"}Approval</Text>
          <Text style={styles.statusMessage}>
            Your identity documents are currently being reviewed by an admin. We
            will notify you once your account is active.
          </Text>

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusBadgeText}>VERIFICATION IN PROGRESS</Text>
          </View>
        </View>
      </View>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={handleContactSupport}
          activeOpacity={0.8}
        >
          <Text style={styles.supportLabel}>CONTACT SUPPORT</Text>
        </TouchableOpacity>
        <Text style={styles.reviewTime}>
          ESTIMATED REVIEW TIME: 24-48 HOURS
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#F7F7F7",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  backArrow: {
    fontSize: 22,
    color: "#1E293B",
    fontWeight: "700",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centerBlock: {
    alignItems: "center",
    maxWidth: 400,
    gap: 24,
  },
  outerCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  shieldIcon: {
    fontSize: 48,
  },
  dashedRing: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.1)",
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  statusMessage: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000000",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  bottomBar: {
    padding: 24,
    backgroundColor: "#F7F7F7",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  supportButton: {
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  supportLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F7F7F7",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  reviewTime: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
