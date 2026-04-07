// SCREEN: Trip Sheet Summary — Vehicle-Level Aggregation
// REFERENCE: Reference_images/Collector App/07_trip_sheet_summary_updated/screen.png
// STATUS: Wired to WatermelonDB — shows live ticket + route data
// TODO: Wire reeler name resolution in ticket list (Phase 2)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import { RouteStatus, StopStatus, SyncStatus } from "@silk-value/shared-types";
import database from "../../data/database";
import type RouteModel from "../../data/models/Route";
import type RouteStopModel from "../../data/models/RouteStop";
import type CollectionTicketModel from "../../data/models/CollectionTicket";
import { supabase } from "../../services/auth";
import { getLocalDateString } from "../../services/sync";
import { Q } from "@nozbe/watermelondb";
import useSync from "../../hooks/useSync";

type Props = NativeStackScreenProps<AppStackParamList, "TripSheetSummary">;

export const TripSheetSummaryScreen: React.FC<Props> = ({
  navigation,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { triggerSync } = useSync();

  const [loading, setLoading] = useState(true);
  const [wmdbRoute, setWmdbRoute] = useState<RouteModel | null>(null);
  const [routeStops, setRouteStops] = useState<RouteStopModel[]>([]);
  const [collectionTickets, setCollectionTickets] = useState<CollectionTicketModel[]>([]);

  // Load data from WatermelonDB
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // Get auth user to find today's route
        const { data: sessionData } = await supabase.auth.getSession();
        const authUserId = sessionData.session?.user?.id;
        if (!authUserId) {
          setLoading(false);
          return;
        }

        // Look up the collector's profile to get profiles.id
        const profiles = await database
          .get("profiles")
          .query(Q.where("user_id", authUserId))
          .fetch();
        if (profiles.length === 0) {
          setLoading(false);
          return;
        }
        const profileId = profiles[0].id;

        // Query today's route
        const today = getLocalDateString();
        const routes = await database
          .get<RouteModel>("routes")
          .query(Q.where("collector_id", profileId), Q.where("date", today))
          .fetch();

        if (routes.length === 0) {
          if (!cancelled) setLoading(false);
          return;
        }

        const todayRoute = routes[0];

        // Load stops and tickets for this route
        const stops = await database
          .get<RouteStopModel>("route_stops")
          .query(Q.where("route_id", todayRoute.id), Q.sortBy("stop_order", Q.asc))
          .fetch();

        const tickets = await database
          .get<CollectionTicketModel>("collection_tickets")
          .query(Q.where("route_id", todayRoute.id))
          .fetch();

        if (!cancelled) {
          setWmdbRoute(todayRoute);
          setRouteStops(stops);
          setCollectionTickets(tickets);
          setLoading(false);
        }
      } catch (err) {
        console.error("TripSheetSummary: Load failed:", err);
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ── No route found ────────────────────────────────────────────
  if (!wmdbRoute) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          No route found for today.
        </Text>
      </View>
    );
  }

  // ── Derived values from live WMDB data ────────────────────────
  const completedStops = routeStops.filter(
    (s) => s.status === StopStatus.COLLECTED
  ).length;
  const remainingStops = routeStops.filter(
    (s) => s.status === StopStatus.PENDING || s.status === StopStatus.ARRIVED
  ).length;
  const totalGrossWeightKg = collectionTickets.reduce(
    (sum, t) => sum + t.grossWeightKg, 0
  );
  const totalNetWeightKg = collectionTickets.reduce(
    (sum, t) => sum + t.netWeightKg, 0
  );
  const unsyncedTickets = collectionTickets.filter(
    (t) => t.serverSyncStatus === SyncStatus.CREATED ||
           t.serverSyncStatus === SyncStatus.UPDATED
  ).length;

  // ── Grade breakdown ───────────────────────────────────────────
  const gradeBreakdown = Object.entries(
    collectionTickets.reduce((acc, ticket) => {
      const g = ticket.grade;
      if (!acc[g]) acc[g] = { grade: g, count: 0, totalKg: 0, totalAmount: 0 };
      acc[g].count += 1;
      acc[g].totalKg += ticket.netWeightKg;
      acc[g].totalAmount += ticket.totalAmount;
      return acc;
    }, {} as Record<string, { grade: string; count: number; totalKg: number; totalAmount: number }>)
  ).map(([, v]) => v);

  // ── Ticket list items ─────────────────────────────────────────
  const ticketListItems = collectionTickets.map((t) => ({
    ticketNumber: t.ticketNumber,
    reelerName: `RLR-${t.reelerId.slice(-6).toUpperCase()}`,   // TODO Phase 2: resolve full reeler name
    village: "",
    netWeightKg: t.netWeightKg,
    grade: t.grade,
    totalAmount: t.totalAmount,
    syncStatus: t.serverSyncStatus,
  }));

  // ── Handlers ──────────────────────────────────────────────────
  const handleEndTrip = (): void => {
    Alert.alert(
      "End Trip?",
      "This will finalize all tickets and lock the route. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Trip",
          style: "destructive",
          onPress: async () => {
            try {
              await database.write(async () => {
                await wmdbRoute.update((record) => {
                  record.status = RouteStatus.COMPLETED;
                  record.serverSyncStatus = SyncStatus.UPDATED;
                });
              });
            } catch (err) {
              console.error("EndTrip: Route update failed:", err);
            }
            navigation.navigate("Home");
          },
        },
      ],
    );
  };

  const handleSyncAll = async (): Promise<void> => {
    await triggerSync();
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
              {String(completedStops).padStart(2, "0")}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STOPS REMAINING</Text>
            <Text style={styles.statValueLarge}>
              {String(remainingStops).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {/* Stats Grid: Weight */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL GROSS</Text>
            <Text style={styles.statValue}>
              {totalGrossWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL NET</Text>
            <Text style={styles.statValue}>
              {totalNetWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
            </Text>
          </View>
        </View>

        {/* Expected Gate Weight — Hero Card */}
        <View style={styles.gateWeightCard}>
          <Text style={styles.gateWeightLabel}>EXPECTED GATE WEIGHT</Text>
          <Text style={styles.gateWeightValue}>
            {totalNetWeightKg.toLocaleString("en-IN", { minimumFractionDigits: 2 })} kg
          </Text>
        </View>

        {/* Quality Breakdown Table */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>QUALITY BREAKDOWN</Text>
          <View style={styles.tableContainer}>
            <GradeBreakdownRow
              grade="Grade"
              count={0}
              totalKg={0}
              totalAmount={0}
              isHeader
              countLabel="Tickets"
              weightLabel="Weight"
            />
            {gradeBreakdown.map((row, index) => (
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
            {ticketListItems.map((ticket, index) => (
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
            label={`⟳ SYNC ALL DATA (${unsyncedTickets} PENDING)`}
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
