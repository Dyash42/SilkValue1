// SCREEN: Trip Sheet Summary — Vehicle-Level Aggregation
// REFERENCE: Reference_images/Collector App/07_trip_sheet_summary_updated/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Wire to WatermelonDB observables for live ticket aggregation

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  PrimaryButton,
  SecondaryButton,
  TicketSummaryCard,
  GradeBreakdownRow,
  BottomNavBar,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import type { AppStackParamList } from "../../navigation/types";
import { MOCK_TRIP_SUMMARY } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "TripSheetSummary">;

export const TripSheetSummaryScreen: React.FC<Props> = ({
  navigation,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const trip = MOCK_TRIP_SUMMARY;

  const handleEndTrip = (): void => {
    Alert.alert(
      "End Trip?",
      "This will finalize all tickets and lock the route. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Trip",
          style: "destructive",
          onPress: () => {
            // TODO: Wire to WatermelonDB — update route status to COMPLETED
            navigation.navigate("Home");
          },
        },
      ],
    );
  };

  const handleSyncAll = (): void => {
    // TODO: Wire to SyncService.pushAll()
    Alert.alert(
      "Sync Started",
      `Attempting to sync ${trip.unsyncedTickets} pending tickets...\n\n// STUB: SyncService.pushAll()`,
    );
  };

  const handleTabPress = (tab: TabName): void => {
    if (tab === "Home") navigation.navigate("Home");
    if (tab === "Map") navigation.navigate("RouteMap");
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
        <Text style={styles.topBarTitle}>Trip Sheet Summary</Text>
      </View>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid: Stops */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STOPS DONE</Text>
            <Text style={styles.statValueLarge}>
              {String(trip.completedStops).padStart(2, "0")}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STOPS REMAINING</Text>
            <Text style={styles.statValueLarge}>
              {String(trip.remainingStops).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {/* Stats Grid: Weight */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL GROSS</Text>
            <Text style={styles.statValue}>
              {trip.totalGrossWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL NET</Text>
            <Text style={styles.statValue}>
              {trip.totalNetWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
            </Text>
          </View>
        </View>

        {/* Expected Gate Weight — Hero Card */}
        <View style={styles.gateWeightCard}>
          <Text style={styles.gateWeightLabel}>EXPECTED GATE WEIGHT</Text>
          <Text style={styles.gateWeightValue}>
            {trip.totalNetWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
          </Text>
        </View>

        {/* Quality Breakdown Table */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>QUALITY BREAKDOWN</Text>
          <View style={styles.tableContainer}>
            <GradeBreakdownRow
              grade="Grade"
              count={"Tickets" as unknown as number}
              totalKg={"Weight" as unknown as number}
              totalAmount={0}
              isHeader
            />
            {trip.gradeBreakdown.map((row, index) => (
              <GradeBreakdownRow
                key={index}
                grade={row.grade}
                count={row.count}
                totalKg={row.totalKg}
                totalAmount={row.totalAmount}
              />
            ))}
          </View>
        </View>

        {/* Trip Tickets List */}
        <View style={styles.ticketsSection}>
          <Text style={styles.ticketsTitle}>TRIP TICKETS</Text>
          <View style={styles.ticketsList}>
            {trip.tickets.map((ticket, index) => (
              <TicketSummaryCard
                key={index}
                ticketNumber={ticket.ticketNumber}
                reelerName={ticket.reelerName}
                village={ticket.village}
                netWeightKg={ticket.netWeightKg}
                grade={ticket.grade}
                totalAmount={ticket.totalAmount}
                syncStatus={ticket.syncStatus}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <PrimaryButton
            label="🚛 END TRIP"
            onPress={handleEndTrip}
            testID="end-trip-btn"
          />
          <SecondaryButton
            label={`⟳ SYNC ALL DATA (${trip.unsyncedTickets} PENDING)`}
            onPress={handleSyncAll}
            testID="sync-all-btn"
          />
        </View>
      </ScrollView>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab="Home"
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
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
    gap: theme.spacing.md,
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
    letterSpacing: theme.typography.letterSpacingTight,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    padding: theme.spacing.md,
    paddingBottom: 80,
    gap: theme.spacing.sm + 4,
  },
  // ── Stats ───────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm + 4,
  },
  statCard: {
    flex: 1,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
  },
  statLabel: {
    fontSize: theme.typography.fontSizeXS + 1,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
    marginBottom: 4,
  },
  statValueLarge: {
    fontSize: 28,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  statValue: {
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  // ── Gate Weight ─────────────────────────────────────────────────
  gateWeightCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.xl,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  gateWeightLabel: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  gateWeightValue: {
    fontSize: 36,
    fontWeight: "900",
    color: theme.colors.primaryText,
  },
  // ── Table ───────────────────────────────────────────────────────
  tableSection: {
    gap: theme.spacing.sm + 4,
  },
  tableTitle: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  tableContainer: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    overflow: "hidden",
  },
  // ── Tickets ─────────────────────────────────────────────────────
  ticketsSection: {
    gap: theme.spacing.sm + 4,
    marginTop: theme.spacing.lg,
  },
  ticketsTitle: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  ticketsList: {
    gap: theme.spacing.sm + 4,
  },
  // ── Actions ─────────────────────────────────────────────────────
  actionsSection: {
    gap: theme.spacing.sm + 4,
    marginTop: theme.spacing.lg,
  },
});
