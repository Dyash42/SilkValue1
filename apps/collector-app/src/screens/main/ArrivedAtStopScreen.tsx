// SCREEN: Arrived at Stop
// REFERENCE: Reference_images/Collector App/arrived_at_stop/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Wire GPS validation and arrival timestamp

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  MapPlaceholder,
  PrimaryButton,
  SecondaryButton,
  BottomNavBar,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import type { AppStackParamList } from "../../navigation/types";
import { MOCK_SCANNED_REELER } from "../../mock/collectorMockData";
import database from "../../data/database";
import RouteStop from "../../data/models/RouteStop";
import { StopStatus, SyncStatus } from "@silk-value/shared-types";

type Props = NativeStackScreenProps<AppStackParamList, "ArrivedAtStop">;

export const ArrivedAtStopScreen: React.FC<Props> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { stopId, reelerName, villageName, expectedWeightKg } = route.params;

  const handleStartCollection = async (): Promise<void> => {
    try {
      // Write arrived_at timestamp and status to WatermelonDB
      const routeStopCollection = database.get<RouteStop>("route_stops");
      const stop = await routeStopCollection.find(stopId);
      await database.write(async () => {
        await stop.update((record) => {
          record.status = StopStatus.ARRIVED;
          record.arrivedAt = new Date();
          record.serverSyncStatus = SyncStatus.UPDATED;
        });
      });
    } catch (error) {
      // Stop not found in local DB — this can happen if sync hasn't
      // run yet. Log and proceed anyway so the collector isn't blocked.
      console.warn("ArrivedAtStop: Could not update stop status:", error);
    }
    // Navigate regardless of write result — never block the collector
    navigation.navigate("QRScan", { stopId });
  };

  const handleNotRightStop = (): void => {
    navigation.goBack();
  };

  const handleTabPress = (tab: TabName): void => {
    if (tab === "Home") navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Arrived at Stop</Text>
        <View style={styles.backButton} />
      </View>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <View style={styles.mainContent}>
        <View style={styles.spacerTop} />

        {/* Confirmation Card */}
        <View style={styles.confirmCard}>
          <Text style={styles.reelerName}>{reelerName}</Text>
          <Text style={styles.villageName}>{villageName}</Text>
          <Text style={styles.expectedWeight}>
            Expected: {expectedWeightKg} kg
          </Text>

          {/* Map Context */}
          <View style={styles.mapContainer}>
            <MapPlaceholder />
          </View>
        </View>

        <View style={styles.spacerBottom} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <PrimaryButton
            label="Start Collection"
            onPress={handleStartCollection}
            testID="start-collection-btn"
          />
          <SecondaryButton
            label="Not the right stop"
            onPress={handleNotRightStop}
            testID="not-right-stop-btn"
          />
        </View>
      </View>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab="Map"
        onTabPress={handleTabPress}
        bottomInset={insets.bottom}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 22,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
  },
  topBarTitle: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  spacerTop: {
    flex: 1,
  },
  confirmCard: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
    gap: 4,
  },
  reelerName: {
    fontSize: theme.typography.fontSizeXXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  villageName: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  expectedWeight: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  mapContainer: {
    height: 160,
    borderRadius: theme.borders.radiusCard,
    overflow: "hidden",
    borderWidth: theme.borders.widthDefault,
    borderColor: "rgba(0,0,0,0.05)",
    marginTop: theme.spacing.md,
  },
  spacerBottom: {
    flex: 1,
  },
  actionButtons: {
    gap: theme.spacing.sm + 4,
    paddingBottom: theme.spacing.md,
  },
});
