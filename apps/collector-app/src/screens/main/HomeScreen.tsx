// ─── HomeScreen — Silk Value Collector App Dashboard ─────────────────────────
// Main screen the collector lands on after login. Shows today's route,
// progress stats, and the list of stops.
//
// DATA ARCHITECTURE:
// All data is read reactively from the LOCAL WatermelonDB database using
// withObservables HOCs. The component hierarchy is:
//
//   HomeScreen (container — gets userId, triggers sync)
//     └─ EnhancedHomeContent (withObservables → profiles, routes)
//          └─ EnhancedRouteSection (withObservables → routeStops, tickets)
//               └─ EnhancedStopItem (withObservables → reeler relation)
//                    └─ StopCard (pure UI from @silk-value/ui)
//
// Layout: Flexbox only. Zero absolute positioning.
// All UI primitives imported from @silk-value/ui (RULE 03).

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/types";
import withObservables from "@nozbe/with-observables";
import {
  theme,
  AppWordmark,
  PrimaryButton,
  SyncStatusIndicator,
  RouteProgressBar,
  StopCard,
  BottomNavBar,
} from "@silk-value/ui";
import type { StopCardProps, TabName } from "@silk-value/ui";
import type { SyncStatusIndicatorProps } from "@silk-value/ui";
import { StopStatus } from "@silk-value/shared-types";
import type { SyncServiceStatus } from "../../services/sync";

import { Q } from "@nozbe/watermelondb";
import database from "../../data/database";
import type Profile from "../../data/models/Profile";
import type Route from "../../data/models/Route";
import type RouteStop from "../../data/models/RouteStop";
import type Reeler from "../../data/models/Reeler";
import type CollectionTicket from "../../data/models/CollectionTicket";
import {
  observeCollectorProfile,
  observeTodayRoute,
  observeRouteStops,
  observeReelerForStop,
  observeCollectionTickets,
} from "../../data/queries";
import useSync from "../../hooks/useSync";
import { supabase } from "../../services/auth";

// ── Status Mappers ───────────────────────────────────────────────────────────

/**
 * Maps WatermelonDB StopStatus enum values to the StopCard component's
 * expected status prop. The StopCard UI has three visual states:
 *   "Pending" — next stop, shows Navigate action
 *   "Done"    — collected, shows checkmark
 *   "Skipped" — bypassed, shows strikethrough + reason
 *
 * StopStatus.ARRIVED maps to "Pending" because the collector has arrived
 * but has not yet completed the collection at this stop.
 */
function mapStopStatus(status: StopStatus): StopCardProps["status"] {
  switch (status) {
    case StopStatus.COLLECTED:
      return "Done";
    case StopStatus.SKIPPED:
      return "Skipped";
    case StopStatus.PENDING:
    case StopStatus.ARRIVED:
    default:
      return "Pending";
  }
}

/**
 * Maps the sync service's internal status to the SyncStatusIndicator
 * component's expected prop. The indicator has three visual states:
 *   "synced"  — green dot, "SYNCED" label
 *   "pending" — primary dot, "SYNCING" label
 *   "failed"  — red dot, "OFFLINE" label
 */
function mapSyncStatus(
  status: SyncServiceStatus,
): SyncStatusIndicatorProps["status"] {
  switch (status) {
    case "syncing":
      return "pending";
    case "failed":
      return "failed";
    case "success":
    case "idle":
    default:
      return "synced";
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// LEVEL 4 — EnhancedStopItem (resolves reeler relation for each RouteStop)
// ═════════════════════════════════════════════════════════════════════════════

interface StopItemInputProps {
  routeStop: RouteStop;
  onPress: (stopNumber: number) => void;
}

interface StopItemObservedProps {
  reeler: Reeler;
}

type StopItemProps = StopItemInputProps & StopItemObservedProps;

const StopItemView: React.FC<StopItemProps> = ({
  routeStop,
  reeler,
  onPress,
}): React.JSX.Element => (
  <StopCard
    stopNumber={routeStop.stopOrder}
    reelerName={reeler?.fullName ?? "—"}
    villageName={reeler?.village ?? ""}
    expectedQuantity="Est. — kg"
    status={mapStopStatus(routeStop.status)}
    onPress={() => onPress(routeStop.stopOrder)}
  />
);

const EnhancedStopItem = withObservables(
  ["routeStop"],
  ({ routeStop }: StopItemInputProps) => ({
    reeler: observeReelerForStop(routeStop),
  }),
)(StopItemView);

// ═════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — EnhancedRouteSection (observes stops + tickets for a route)
// ═════════════════════════════════════════════════════════════════════════════

interface RouteSectionInputProps {
  route: Route;
  onStopPress: (stopNumber: number) => void;
}

interface RouteSectionObservedProps {
  routeStops: RouteStop[];
  collectionTickets: CollectionTicket[];
}

type RouteSectionProps = RouteSectionInputProps & RouteSectionObservedProps;

const RouteSectionView: React.FC<RouteSectionProps> = ({
  route,
  routeStops,
  collectionTickets,
  onStopPress,
}): React.JSX.Element => {
  // ── Derived Values (computed reactively from observed data) ──────────
  const completedStops = routeStops.filter(
    (s) => s.status === StopStatus.COLLECTED,
  ).length;

  const totalWeightKg = collectionTickets.reduce(
    (sum, ticket) => sum + ticket.netWeightKg,
    0,
  );

  return (
    <>
      {/* ── Progress Stats Row ──────────────────────────────────────────── */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statsLabel}>Stops Completed</Text>
            <Text style={styles.statsValue}>
              {completedStops}{" "}
              <Text style={styles.statsUnit}>of {routeStops.length}</Text>
            </Text>
          </View>
          <View style={styles.statsRight}>
            <Text style={styles.statsLabel}>Total Weight</Text>
            <Text style={styles.statsValue}>
              {totalWeightKg.toFixed(1)}{" "}
              <Text style={styles.statsUnit}>kg</Text>
            </Text>
          </View>
        </View>

        <RouteProgressBar
          completed={completedStops}
          total={routeStops.length}
        />
      </View>

      {/* ── Today's Stops Heading ───────────────────────────────────────── */}
      <Text style={styles.sectionHeading}>TODAY&apos;S STOPS</Text>

      {/* ── Stop Cards List ─────────────────────────────────────────────── */}
      <View style={styles.stopsList}>
        {routeStops.length === 0 ? (
          <Text style={styles.emptyText}>
            No stops assigned to this route yet.
          </Text>
        ) : (
          routeStops.map((stop) => (
            <EnhancedStopItem
              key={stop.id}
              routeStop={stop}
              onPress={onStopPress}
            />
          ))
        )}
      </View>
    </>
  );
};

const EnhancedRouteSection = withObservables(
  ["route"],
  ({ route }: RouteSectionInputProps) => ({
    routeStops: observeRouteStops(database, route.id),
    collectionTickets: observeCollectionTickets(database, route.id),
  }),
)(RouteSectionView);

// ═════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — EnhancedHomeContent (observes profile + today's route)
// ═════════════════════════════════════════════════════════════════════════════

interface HomeContentInputProps {
  userId: string;
  // profiles.id (NOT the Supabase auth UUID) — routes.collector_id references this
  profileId: string;
  syncIndicatorStatus: SyncStatusIndicatorProps["status"];
}

interface HomeContentObservedProps {
  profiles: Profile[];
  routes: Route[];
}

type HomeContentProps = HomeContentInputProps & HomeContentObservedProps;

const HomeContentView: React.FC<HomeContentProps> = ({
  profiles,
  routes,
  syncIndicatorStatus,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();

  // ── Derived values from observed data ───────────────────────────────
  const profile = profiles[0] ?? null;
  const route = routes[0] ?? null;
  const collectorName = profile?.fullName ?? "Collector";
  const routeName = route?.name ?? "";

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // ── GPS state (placeholder — will be replaced with expo-location) ───
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(true);

  // ── Handlers ────────────────────────────────────────────────────────
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleStartRoute = (): void => {
    nav.navigate("RouteMap");
  };

  const handleStopPress = (stopNumber: number): void => {
    // Navigate to the route map where user can select the stop
    nav.navigate("RouteMap");
  };

  const handleTabPress = (tab: TabName): void => {
    if (tab === "Home") return; // already on this screen
    if (tab === "Map") nav.navigate("RouteMap");
    if (tab === "Settings") nav.navigate("BluetoothSetup");
    // TODO: Collections tab — navigate to PastCollections when built
  };

  const handleTurnOnGps = (): void => {
    console.log("Turn On GPS pressed");
    // TODO: Request GPS permission via expo-location when integrated
    setIsGpsEnabled(true);
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top App Bar ──────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <AppWordmark size="medium" />
        <View style={styles.topBarRight}>
          <Text style={styles.collectorName}>{collectorName}</Text>
          <SyncStatusIndicator status={syncIndicatorStatus} />
        </View>
      </View>

      {/* ── GPS Warning Banner (conditional) ─────────────────────────── */}
      {!isGpsEnabled ? (
        <View style={styles.gpsBanner}>
          <View style={styles.gpsBannerContent}>
            <Text style={styles.gpsIcon}>⊘</Text>
            <View style={styles.gpsTextGroup}>
              <Text style={styles.gpsTitle}>GPS is turned off</Text>
              <Text style={styles.gpsSubtitle}>
                Enable tracking for accurate route updates.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.gpsTurnOnBtn}
            onPress={handleTurnOnGps}
            activeOpacity={0.8}
          >
            <Text style={styles.gpsTurnOnText}>TURN ON</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ── Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Date & Route ──────────────────────────────────────────── */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
          {route ? (
            <Text style={styles.routeText}>{routeName}</Text>
          ) : (
            <Text style={styles.routeTextMuted}>No route assigned today</Text>
          )}
        </View>

        {/* ── Route-dependent content ───────────────────────────────── */}
        {route ? (
          <>
            {/* ── Start Route Button ────────────────────────────────── */}
            <View style={styles.buttonSection}>
              <PrimaryButton
                testID="home-start-route-btn"
                label="▶  Start Route"
                onPress={handleStartRoute}
              />
            </View>

            {/* ── Route Section (stops + stats) ─────────────────────── */}
            <EnhancedRouteSection
              route={route}
              onStopPress={handleStopPress}
            />
          </>
        ) : (
          /* ── Empty State — No Route Today ──────────────────────────── */
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>◇</Text>
            <Text style={styles.emptyStateTitle}>No Route Today</Text>
            <Text style={styles.emptyStateSubtitle}>
              You have no collection route scheduled for today.{"\n"}
              Check back tomorrow or contact your supervisor.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom Navigation Bar ────────────────────────────────────── */}
      <BottomNavBar
        activeTab="Home"
        onTabPress={handleTabPress}
        bottomInset={insets.bottom}
      />
    </View>
  );
};

const EnhancedHomeContent = withObservables(
  ["userId", "profileId"],
  ({ userId, profileId }: HomeContentInputProps) => ({
    profiles: observeCollectorProfile(database, userId),
    // routes.collector_id stores profiles.id — must use profileId, not the auth UUID
    routes: observeTodayRoute(database, profileId),
  }),
)(HomeContentView);

// ═════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — HomeScreen (exported container — gets userId, triggers sync)
// ═════════════════════════════════════════════════════════════════════════════

export const HomeScreen: React.FC = (): React.JSX.Element => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { syncStatus } = useSync();

  // Read auth user ID, then resolve profiles.id from WatermelonDB.
  // routes.collector_id stores profiles.id (not the auth UUID), so both
  // are needed: userId for observeCollectorProfile, profileId for observeTodayRoute.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const authUserId = data.session?.user?.id ?? null;
      setUserId(authUserId);
      if (authUserId) {
        const profiles = await database
          .get<Profile>("profiles")
          .query(Q.where("user_id", authUserId))
          .fetch();
        setProfileId(profiles[0]?.id ?? null);
      }
    });
  }, []);

  // ── Loading state while reading session + profile ─────────────────────
  if (!userId || !profileId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <EnhancedHomeContent
      userId={userId}
      profileId={profileId}
      syncIndicatorStatus={mapSyncStatus(syncStatus)}
    />
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ── Loading ───────────────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },

  // ── Top App Bar ──────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.layout.screenPaddingHorizontal,
    paddingVertical: theme.spacing.sm + 4,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  topBarRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  collectorName: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },

  // ── GPS Banner ───────────────────────────────────────────────────────────
  gpsBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.layout.screenPaddingHorizontal,
    paddingVertical: theme.spacing.sm + 4,
  },
  gpsBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + 4,
    flexShrink: 1,
  },
  gpsIcon: {
    fontSize: theme.typography.fontSizeLG,
    color: theme.colors.primaryText,
  },
  gpsTextGroup: {
    flexShrink: 1,
  },
  gpsTitle: {
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
  },
  gpsSubtitle: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.primaryText,
    opacity: 0.8,
  },
  gpsTurnOnBtn: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.primaryText,
    borderRadius: theme.borders.radiusSM,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs,
  },
  gpsTurnOnText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingTight,
  },

  // ── ScrollView ───────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPaddingHorizontal,
    paddingBottom: theme.spacing.xl,
  },

  // ── Date & Route ─────────────────────────────────────────────────────────
  dateSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  dateText: {
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  routeText: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  routeTextMuted: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    fontStyle: "italic",
  },

  // ── Start Route ──────────────────────────────────────────────────────────
  buttonSection: {
    marginBottom: theme.spacing.xl,
  },

  // ── Progress Stats ───────────────────────────────────────────────────────
  statsSection: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statsRight: {
    alignItems: "flex-end",
  },
  statsLabel: {
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  statsValue: {
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  statsUnit: {
    fontSize: theme.typography.fontSizeMD + 1,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.textMuted,
  },

  // ── Section Heading ──────────────────────────────────────────────────────
  sectionHeading: {
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWidest,
    marginBottom: theme.spacing.md,
  },

  // ── Stops List ───────────────────────────────────────────────────────────
  stopsList: {
    gap: theme.spacing.md,
  },

  // ── Empty States ─────────────────────────────────────────────────────────
  emptyText: {
    fontSize: theme.typography.fontSizeBase,
    color: theme.colors.textMuted,
    textAlign: "center",
    paddingVertical: theme.spacing.lg,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },
  emptyStateIcon: {
    fontSize: 48,
    color: theme.colors.textMuted,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSizeBase,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default HomeScreen;
