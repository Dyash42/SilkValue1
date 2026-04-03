// SCREEN: Notifications
// REFERENCE: Reference_images/Reeler App/notifications_fixed_header/screen.png
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";
import { MOCK_NOTIFICATIONS } from "../mock/reelerMockData";
import { NotificationItem } from "../types";

type Props = NativeStackScreenProps<AppStackParamList, "Notifications">;

const ICON_MAP: Record<string, string> = {
  payment: "💰",
  collection: "📦",
  schedule: "📅",
  system: "✅",
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  const todayNotifications = MOCK_NOTIFICATIONS.filter(
    (n) => n.section === "today"
  );
  const yesterdayNotifications = MOCK_NOTIFICATIONS.filter(
    (n) => n.section === "yesterday"
  );

  const renderNotificationCard = (item: NotificationItem) => (
    <View key={item.id} style={styles.notifCard}>
      <View style={styles.notifIconBox}>
        <Text style={styles.notifIconText}>
          {ICON_MAP[item.type] || "📌"}
        </Text>
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifTopRow}>
          <Text style={styles.notifTitle}>{item.title.toUpperCase()}</Text>
          <Text style={styles.notifTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.notifMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.topBarRow}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>NOTIFICATIONS</Text>
          <View style={styles.backButton} />
        </View>
        <TouchableOpacity style={styles.markReadButton}>
          <Text style={styles.markReadText}>MARK ALL READ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <>
            <View style={styles.sectionBanner}>
              <Text style={styles.sectionBannerText}>TODAY</Text>
            </View>
            <View style={styles.notifList}>
              {todayNotifications.map(renderNotificationCard)}
            </View>
          </>
        )}

        {/* Yesterday Section */}
        {yesterdayNotifications.length > 0 && (
          <>
            <View style={styles.sectionBanner}>
              <Text style={styles.sectionBannerText}>YESTERDAY</Text>
            </View>
            <View style={styles.notifList}>
              {yesterdayNotifications.map(renderNotificationCard)}
            </View>
          </>
        )}

        {/* End of notifications */}
        <View style={styles.endSection}>
          <Text style={styles.endIcon}>🔕</Text>
          <Text style={styles.endText}>NO MORE NOTIFICATIONS</Text>
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
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 30,
    color: "#000000",
    fontWeight: "700",
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  markReadButton: {
    marginTop: 4,
  },
  markReadText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionBanner: {
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionBannerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  notifList: {
    gap: 0,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  notifIconBox: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  notifIconText: {
    fontSize: 18,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    flex: 1,
  },
  notifTime: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 8,
  },
  notifMessage: {
    fontSize: 12,
    color: "#000000",
    lineHeight: 18,
  },
  endSection: {
    alignItems: "center",
    paddingVertical: 48,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    marginTop: 16,
  },
  endIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  endText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});
