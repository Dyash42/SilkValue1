// SCREEN: Route Map View
// REFERENCE: Reference_images/Collector App/03_route_map_fixed_nav/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Wire to WatermelonDB observables when data phase begins

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  MapPlaceholder,
  BottomNavBar,
  PrimaryButton,
  SecondaryButton,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import { StopStatus } from "@silk-value/shared-types";
import type { AppStackParamList } from "../../navigation/types";
import {
  MOCK_ROUTE_STOPS,
  MOCK_TODAY_ROUTE,
  SKIP_REASONS,
} from "../../mock/collectorMockData";
import type { MockRouteStop } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "RouteMap">;

// ── Stop status badge renderer ───────────────────────────────────────────────
function getStatusBadge(status: StopStatus): { label: string; bg: string; color: string } {
  switch (status) {
    case StopStatus.COLLECTED:
      return { label: "COLLECTED", bg: theme.colors.surfaceMuted, color: theme.colors.textTertiary };
    case StopStatus.SKIPPED:
      return { label: "SKIPPED", bg: theme.colors.surfaceMuted, color: theme.colors.textMuted };
    case StopStatus.ARRIVED:
      return { label: "NEXT UP", bg: theme.colors.primary, color: theme.colors.primaryText };
    case StopStatus.PENDING:
    default:
      return { label: "PENDING", bg: theme.colors.surface, color: theme.colors.textMuted };
  }
}

export const RouteMapScreen: React.FC<Props> = ({ navigation }): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [skipModalVisible, setSkipModalVisible] = useState<boolean>(false);
  const [skipStopId, setSkipStopId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleNavigateToStop = (stop: MockRouteStop): void => {
    navigation.navigate("NavigateToStop", {
      stopId: stop.id,
      stopOrder: stop.stopOrder,
      reelerName: stop.reelerName,
      villageName: stop.villageName,
      expectedWeightKg: stop.expectedWeightKg,
      distanceKm: stop.distanceFromPrevKm,
    });
  };

  const handleViewTicket = (): void => {
    navigation.navigate("CollectionTicket", { ticketData: "mock" });
  };

  const handleSkipPress = (stopId: string): void => {
    setSkipStopId(stopId);
    setSelectedReason(null);
    setSkipModalVisible(true);
  };

  const handleConfirmSkip = (): void => {
    // TODO: Wire to WatermelonDB — update route_stop status to skipped
    setSkipModalVisible(false);
    setSkipStopId(null);
  };

  const handleTabPress = (tab: TabName): void => {
    if (tab === "Home") navigation.navigate("Home");
    if (tab === "Settings") navigation.navigate("BluetoothSetup");
    // TODO: Wire Collections tab when PastCollections screen is built
  };

  const handleTripSheet = (): void => {
    navigation.navigate("TripSheetSummary");
  };

  // ── Determine which stop is "active" (first non-collected, non-skipped)
  const activeStop = MOCK_ROUTE_STOPS.find(
    (s) => s.status === StopStatus.ARRIVED || s.status === StopStatus.PENDING,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Route Map View</Text>
      </View>

      {/* ── Map Area ─────────────────────────────────────────────────── */}
      <View style={styles.mapSection}>
        <MapPlaceholder />
      </View>

      {/* ── Bottom Sheet ─────────────────────────────────────────────── */}
      <View style={styles.bottomSheet}>
        {/* Drag handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
          <Text style={styles.sectionHeading}>ROUTE STOPS</Text>
        </View>

        <ScrollView
          style={styles.stopsList}
          contentContainerStyle={styles.stopsListContent}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_ROUTE_STOPS.map((stop) => {
            const badge = getStatusBadge(stop.status);
            const isActive = stop.id === activeStop?.id;
            const isPending = stop.status === StopStatus.PENDING || stop.status === StopStatus.ARRIVED;
            const isCollected = stop.status === StopStatus.COLLECTED;

            return (
              <View
                key={stop.id}
                style={[
                  styles.stopCard,
                  isActive && styles.stopCardActive,
                ]}
              >
                {/* Stop Number Badge */}
                <View
                  style={[
                    styles.stopBadge,
                    isActive && styles.stopBadgeActive,
                    isCollected && styles.stopBadgeCollected,
                    stop.status === StopStatus.SKIPPED && styles.stopBadgeSkipped,
                  ]}
                >
                  <Text
                    style={[
                      styles.stopBadgeText,
                      (isActive || isCollected) && styles.stopBadgeTextWhite,
                    ]}
                  >
                    {isCollected ? "✓" : stop.stopOrder}
                  </Text>
                </View>

                {/* Stop Info */}
                <View style={styles.stopInfo}>
                  <View style={styles.stopHeader}>
                    <Text style={styles.stopName}>{stop.reelerName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.stopDetail}>
                    {stop.villageName} • {stop.expectedWeightKg}kg
                  </Text>

                  {/* Action buttons for pending/arrived stops */}
                  {isPending && (
                    <View style={styles.stopActions}>
                      <TouchableOpacity
                        style={styles.navigateButton}
                        onPress={() => handleNavigateToStop(stop)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.navigateButtonText}>◆ Navigate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleSkipPress(stop.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.skipButtonText}>Skip</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* View ticket for completed stops */}
                  {isCollected && (
                    <TouchableOpacity onPress={handleViewTicket}>
                      <Text style={styles.viewTicketLink}>View Ticket →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {/* End Route / Trip Sheet button */}
          <View style={styles.endRouteSection}>
            <TouchableOpacity
              style={styles.tripSheetButton}
              onPress={handleTripSheet}
              activeOpacity={0.8}
            >
              <Text style={styles.tripSheetButtonText}>VIEW TRIP SHEET</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab="Map"
        onTabPress={handleTabPress}
        bottomInset={insets.bottom}
      />

      {/* ── Skip Confirmation Modal ──────────────────────────────────── */}
      <Modal visible={skipModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>SKIP THIS STOP?</Text>
            <Text style={styles.modalSubtitle}>Select a reason:</Text>

            {SKIP_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonPill,
                  selectedReason === reason && styles.reasonPillSelected,
                ]}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.reasonPillText,
                    selectedReason === reason && styles.reasonPillTextSelected,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActions}>
              <PrimaryButton
                label="CONFIRM SKIP"
                onPress={handleConfirmSkip}
                testID="confirm-skip-btn"
              />
              <SecondaryButton
                label="CANCEL"
                onPress={() => setSkipModalVisible(false)}
                testID="cancel-skip-btn"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

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
    backgroundColor: theme.colors.background,
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
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    letterSpacing: theme.typography.letterSpacingTight,
  },
  mapSection: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borders.radiusXL,
    borderTopRightRadius: theme.borders.radiusXL,
    borderTopWidth: theme.borders.widthDefault,
    borderTopColor: theme.colors.borderLight,
    maxHeight: "45%",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm + 4,
  },
  handle: {
    width: theme.layout.dragHandleWidth,
    height: theme.layout.dragHandleHeight,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.dragHandle,
  },
  sectionHeading: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
  },
  stopsList: {
    flex: 1,
  },
  stopsListContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm + 4,
  },
  stopCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: theme.spacing.sm + 4,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    gap: theme.spacing.md,
  },
  stopCardActive: {
    borderWidth: theme.borders.widthActive,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  stopBadge: {
    width: theme.layout.stopBadgeSizeLG,
    height: theme.layout.stopBadgeSizeLG,
    borderRadius: theme.borders.radiusFull,
    borderWidth: 2,
    borderColor: theme.colors.dragHandle,
    justifyContent: "center",
    alignItems: "center",
  },
  stopBadgeActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stopBadgeCollected: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: "transparent",
  },
  stopBadgeSkipped: {
    borderColor: theme.colors.dragHandle,
    opacity: 0.6,
  },
  stopBadgeText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textMuted,
  },
  stopBadgeTextWhite: {
    color: theme.colors.primaryText,
  },
  stopInfo: {
    flex: 1,
    gap: 2,
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stopName: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borders.radiusSM,
  },
  statusBadgeText: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
  },
  stopDetail: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  stopActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  navigateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radiusCard,
  },
  navigateButtonText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
  },
  skipButton: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radiusCard,
  },
  skipButtonText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  viewTicketLink: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  endRouteSection: {
    marginTop: theme.spacing.sm,
  },
  tripSheetButton: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm + 4,
    alignItems: "center",
    borderRadius: theme.borders.radiusSM,
  },
  tripSheetButtonText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  // ── Modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWide,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textSecondary,
  },
  reasonPill: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borders.radiusSM,
  },
  reasonPillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  reasonPillText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  reasonPillTextSelected: {
    color: theme.colors.primaryText,
  },
  modalActions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});
