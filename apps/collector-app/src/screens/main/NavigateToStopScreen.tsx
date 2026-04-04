// SCREEN: Navigate to Stop
// REFERENCE: Reference_images/Collector App/navigate_to_stop_updated_arrow/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Wire GPS + Linking for real Google Maps navigation

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
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
import { MOCK_TODAY_ROUTE } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "NavigateToStop">;

export const NavigateToStopScreen: React.FC<Props> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const {
    stopId,
    stopOrder,
    reelerName,
    villageName,
    expectedWeightKg,
    distanceKm,
  } = route.params;

  const handleStartNavigation = (): void => {
    // STUB: In production, open Google Maps via Linking with lat/lng
    Alert.alert(
      "Navigation Started",
      `Opening Google Maps to navigate to ${villageName}...\n\n// STUB: Linking.openURL(googleMapsDeepLink)`,
    );
  };

  const handleReached = (): void => {
    navigation.navigate("ArrivedAtStop", {
      stopId,
      reelerName,
      villageName,
      expectedWeightKg,
    });
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
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Navigate to Stop</Text>
      </View>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <View style={styles.mainContent}>
        {/* Stop Details Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.stopNumberBadge}>
              <Text style={styles.stopNumberText}>{stopOrder}</Text>
            </View>
            <View style={styles.reelerInfo}>
              <Text style={styles.reelerName}>{reelerName}</Text>
              <Text style={styles.villageName}>{villageName}</Text>
              <Text style={styles.expectedWeight}>
                Expected: {expectedWeightKg} kg
              </Text>
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.mapPreview}>
            <MapPlaceholder />
          </View>

          {/* Distance & Time */}
          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>📍 {distanceKm} km away</Text>
            <Text style={styles.distanceText}>
              🕐 Approx. {Math.ceil(distanceKm * 3.5)} min
            </Text>
          </View>
        </View>

        {/* Route Progress Text */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Stop {stopOrder} of {MOCK_TODAY_ROUTE.totalStops} on today's route
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <PrimaryButton
            label="Start Navigation"
            onPress={handleStartNavigation}
            testID="start-navigation-btn"
          />
          <SecondaryButton
            label="I Have Reached"
            onPress={handleReached}
            testID="i-have-reached-btn"
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 28,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
  },
  topBarTitle: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  mainContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  detailCard: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + 4,
  },
  stopNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  stopNumberText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
  },
  reelerInfo: {
    flex: 1,
    gap: 2,
  },
  reelerName: {
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  villageName: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  expectedWeight: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  mapPreview: {
    height: 180,
    borderRadius: theme.borders.radiusCard,
    overflow: "hidden",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
  },
  distanceRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  distanceText: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  progressText: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  actionButtons: {
    gap: theme.spacing.sm + 4,
    marginBottom: theme.spacing.md,
  },
});
