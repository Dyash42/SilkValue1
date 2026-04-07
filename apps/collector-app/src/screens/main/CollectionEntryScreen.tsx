// SCREEN: Collection Entry — THE CRITICAL FORM
// REFERENCE: Reference_images/Collector App/05_collection_entry_updated/screen.png
// STATUS: UI Complete — Mock Data Only
// CONSTRAINTS: Grade enum = A, B, C, D, REJECT (no A+)
// TODO: Wire WatermelonDB write action, BLE scale readings, photo capture

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  WeightInputField,
  GradeSelector,
  PrimaryButton,
  BottomNavBar,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import { Grade, TicketStatus, SyncStatus, StopStatus } from "@silk-value/shared-types";
import type { AppStackParamList } from "../../navigation/types";
import { MOCK_COLLECTION_ENTRY } from "../../mock/collectorMockData";
import database from "../../data/database";
import CollectionTicket from "../../data/models/CollectionTicket";
import RouteStop from "../../data/models/RouteStop";
import { Q } from "@nozbe/watermelondb";
import { supabase } from "../../services/auth";

type Props = NativeStackScreenProps<AppStackParamList, "CollectionEntry">;

export const CollectionEntryScreen: React.FC<Props> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { stopId, reelerId, reelerName, villageName } = route.params;

  // ── Form State ──────────────────────────────────────────────────
  const [grossWeight, setGrossWeight] = useState<string>("");
  const [tareWeight, setTareWeight] = useState<string>("");
  const [crateCount, setCrateCount] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // ── Derived Values ──────────────────────────────────────────────
  const netWeight = useMemo(() => {
    const g = parseFloat(grossWeight) || 0;
    const t = parseFloat(tareWeight) || 0;
    return Math.max(0, g - t);
  }, [grossWeight, tareWeight]);

  const pricePerKg = MOCK_COLLECTION_ENTRY.pricePerKg;
  const estimatedAmount = useMemo(() => netWeight * pricePerKg, [netWeight, pricePerKg]);

  // ── Handlers ────────────────────────────────────────────────────
  const handleFillGross = useCallback((): void => {
    setGrossWeight(MOCK_COLLECTION_ENTRY.scaleReadingKg.toFixed(2));
  }, []);

  const handleFillTare = useCallback((): void => {
    setTareWeight(MOCK_COLLECTION_ENTRY.tareWeightKg.toFixed(2));
  }, []);

  const handleAddPhoto = (): void => {
    // STUB: In production, launch expo-image-picker
    Alert.alert("Camera Stub", "expo-image-picker would open here.\n\n// STUB: Camera launch");
  };

  // Ticket number format: SV-YYYYMMDD-XXXX (4 random hex digits)
  const generateTicketNumber = (): string => {
    const now = new Date();
    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");
    const suffix = Math.floor(Math.random() * 0xFFFF)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
    return `SV-${datePart}-${suffix}`;
  };

  const handleConfirmTicket = async (): Promise<void> => {
    // ── Validation ────────────────────────────────────────────────
    if (!selectedGrade) {
      Alert.alert(
        "Missing Grade",
        "Please select a quality grade before continuing.",
      );
      return;
    }
    if (netWeight <= 0) {
      Alert.alert(
        "Invalid Weight",
        "Net weight must be greater than zero.",
      );
      return;
    }
    const grossKg = parseFloat(grossWeight) || 0;
    const tareKg = parseFloat(tareWeight) || 0;
    if (grossKg <= 0) {
      Alert.alert("Invalid Weight", "Gross weight must be greater than zero.");
      return;
    }
    if (tareKg < 0) {
      Alert.alert("Invalid Weight", "Tare weight cannot be negative.");
      return;
    }

    // ── Get collector ID from session ─────────────────────────────
    // We need the profiles.id (not auth UUID) to store as collector_id.
    // This matches what was synced into WatermelonDB profiles table.
    let collectorProfileId: string;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const authUserId = sessionData.session?.user?.id;
      if (!authUserId) {
        Alert.alert("Session Error", "No active session. Please log in again.");
        return;
      }
      // Look up profile by user_id to get the profiles.id
      const profiles = await database
        .get("profiles")
        .query(
          Q.where("user_id", authUserId)
        )
        .fetch();
      if (profiles.length === 0) {
        Alert.alert(
          "Profile Error",
          "Your profile is not synced. Please return home and sync first.",
        );
        return;
      }
      collectorProfileId = profiles[0].id;
    } catch (err) {
      Alert.alert("Error", "Could not read your profile. Please try again.");
      return;
    }

    // ── Get routeId from the RouteStop ────────────────────────────
    let routeId: string;
    try {
      const stop = await database
        .get<RouteStop>("route_stops")
        .find(stopId);
      routeId = stop.routeId;
    } catch (err) {
      Alert.alert(
        "Stop Error",
        "Could not find this route stop. Please go back and try again.",
      );
      return;
    }

    // ── Compute financials ────────────────────────────────────────
    const totalAmount = netWeight * pricePerKg;

    // ── Write to WatermelonDB (atomic) ────────────────────────────
    let createdTicketId: string;
    try {
      await database.write(async () => {
        // 1. Create the collection ticket
        const ticketsCollection = database.get<CollectionTicket>(
          "collection_tickets",
        );
        const newTicket = await ticketsCollection.create((record) => {
          record.routeStopId = stopId;
          record.routeId = routeId;
          record.reelerId = reelerId;
          record.collectorId = collectorProfileId;
          record.grade = selectedGrade as Grade;
          record.grossWeightKg = grossKg;
          record.tareWeightKg = tareKg;
          record.netWeightKg = netWeight;
          record.moisturePct = null;
          record.pricePerKg = pricePerKg;
          record.totalAmount = totalAmount;
          record.ticketNumber = generateTicketNumber();
          record.status = TicketStatus.CONFIRMED;
          record.notes = notes.trim() || null;
          record.serverId = null;
          record.serverSyncStatus = SyncStatus.CREATED;
        });
        createdTicketId = newTicket.id;

        // 2. Mark the RouteStop as COLLECTED and set departed_at
        const stop = await database
          .get<RouteStop>("route_stops")
          .find(stopId);
        await stop.update((record) => {
          record.status = StopStatus.COLLECTED;
          record.departedAt = new Date();
          record.serverSyncStatus = SyncStatus.UPDATED;
        });
      });
    } catch (err) {
      console.error("CollectionEntry: Write failed:", err);
      Alert.alert(
        "Save Failed",
        "Could not save the collection ticket. Please check your data and try again.",
      );
      return;
    }

    // ── Navigate to ticket receipt ────────────────────────────────
    // Pass the real WatermelonDB ticket ID — screen reads from DB
    navigation.navigate("CollectionTicket", { ticketId: createdTicketId! });
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
        <View style={styles.topBarInfo}>
          <Text style={styles.topBarTitle}>{reelerName}</Text>
          <Text style={styles.topBarSubtitle}>ID: {reelerId}</Text>
        </View>
      </View>

      {/* ── Scrollable Form ──────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Warning Alert */}
        <View style={styles.alertCard}>
          <Text style={styles.alertIcon}>⚠</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              Weight entry must require confirmation...
            </Text>
            <Text style={styles.alertBody}>
              Please ensure all measurements are accurate before proceeding.
            </Text>
          </View>
        </View>

        {/* Weight Entry Section */}
        <Text style={styles.sectionTitle}>WEIGHT ENTRY</Text>

        <View style={styles.weightInputRow}>
          <View style={styles.weightInputCol}>
            <WeightInputField
              label="Gross Weight (kg)"
              value={grossWeight}
              onChangeText={setGrossWeight}
              scaleConnected={MOCK_COLLECTION_ENTRY.scaleConnected}
              onFillFromScale={handleFillGross}
            />
          </View>
          <View style={styles.weightInputCol}>
            <WeightInputField
              label="Tare Weight (kg)"
              value={tareWeight}
              onChangeText={setTareWeight}
              scaleConnected={MOCK_COLLECTION_ENTRY.scaleConnected}
              onFillFromScale={handleFillTare}
            />
          </View>
        </View>

        {/* Calculated Net Weight Display */}
        <View style={styles.netWeightBox}>
          <Text style={styles.netWeightLabel}>CALCULATED NET WEIGHT</Text>
          <Text style={styles.netWeightValue}>{netWeight.toFixed(2)} kg</Text>
        </View>

        {/* Crate Count */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Crate Count</Text>
          <TextInput
            style={styles.textInput}
            value={crateCount}
            onChangeText={setCrateCount}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {/* Quality Grade */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Quality Grade</Text>
          <GradeSelector
            selectedGrade={selectedGrade}
            onSelect={setSelectedGrade}
          />
        </View>

        {/* Media & Notes */}
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handleAddPhoto}
          activeOpacity={0.7}
        >
          <Text style={styles.photoButtonIcon}>📷</Text>
          <Text style={styles.photoButtonText}>Add Photo</Text>
        </TouchableOpacity>

        <View style={styles.notesContainer}>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes here..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.micIcon}>🎤</Text>
        </View>

        {/* Payment Estimation */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentLabel}>Payment Estimation</Text>
            <Text style={styles.paymentInfo}>ⓘ</Text>
          </View>
          <Text style={styles.paymentCalc}>
            ₹{pricePerKg}/kg × {netWeight.toFixed(2)} kg ={" "}
            <Text style={styles.paymentBold}>
              ₹ {estimatedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky Footer ────────────────────────────────────────────── */}
      <View style={[styles.stickyFooter, { paddingBottom: insets.bottom > 0 ? insets.bottom : theme.spacing.md }]}>
        <PrimaryButton
          label="CONFIRM & GENERATE TICKET"
          onPress={handleConfirmTicket}
          testID="confirm-ticket-btn"
        />
      </View>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab={null}
        onTabPress={handleTabPress}
        bottomInset={0}
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
  topBarInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    gap: 2,
  },
  topBarTitle: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  topBarSubtitle: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textMuted,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    padding: theme.spacing.md,
    paddingBottom: 180,
    gap: theme.spacing.lg,
  },
  // ── Alert Card ──────────────────────────────────────────────────
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + 4,
    borderRadius: theme.borders.radiusCard,
    backgroundColor: "#FFF9C4",
    padding: theme.spacing.md,
  },
  alertIcon: {
    fontSize: 20,
    color: "#78350F",
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: "#78350F",
  },
  alertBody: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: "#92400E",
  },
  // ── Sections ────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
  },
  weightInputRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  weightInputCol: {
    flex: 1,
  },
  netWeightBox: {
    borderWidth: theme.borders.widthActive,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusXL,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  netWeightLabel: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  netWeightValue: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  textInput: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    height: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    paddingVertical: theme.spacing.sm + 4,
  },
  photoButtonIcon: {
    fontSize: 20,
  },
  photoButtonText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  notesContainer: {
    flexDirection: "row",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.sm + 4,
    minHeight: 80,
  },
  notesInput: {
    flex: 1,
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textPrimary,
  },
  micIcon: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },
  // ── Payment ─────────────────────────────────────────────────────
  paymentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  paymentInfo: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  paymentCalc: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  paymentBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  // ── Sticky Footer ──────────────────────────────────────────────
  stickyFooter: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: theme.borders.widthDefault,
    borderTopColor: theme.colors.borderLight,
  },
});
