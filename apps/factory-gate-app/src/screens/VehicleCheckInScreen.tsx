// ─── Screen 3: Vehicle Check-In — Camera + Expected Vehicles List ────────────
// TODO: Replace camera mockup with real license plate scanner.

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useExpectedVehicles } from "../hooks/useGateData";
import { supabase } from "../config/supabase";
import * as gateService from "../services/gateService";

export const VehicleCheckInScreen: React.FC<any> = ({ navigation, route }) => {
  const preselectedId = route?.params?.gateEntryId ?? null;
  const { data: vehicleList, loading } = useExpectedVehicles();
  const vehicles = (vehicleList ?? []).filter((v) => v.status !== "checked_in");

  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(
    preselectedId
  );
  const [confirming, setConfirming] = React.useState(false);

  // Once vehicles load, default-select the first if nothing preselected
  React.useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles.length]);

  const handleConfirm = async () => {
    if (!selectedVehicleId) return;
    setConfirming(true);
    try {
      await gateService.checkInVehicle(supabase, selectedVehicleId);
      navigation?.navigate?.("GateWeighment", { gateEntryId: selectedVehicleId });
    } catch (err: any) {
      Alert.alert("Check-In Failed", err?.message ?? "An error occurred");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Step Progress */}
      <View style={styles.stepBar}>
        <View style={[styles.stepItem, styles.stepItemActive]}>
          <Text style={styles.stepNumActive}>STEP 1</Text>
          <Text style={styles.stepLabelActive}>CHECK-IN</Text>
        </View>
        <Text style={styles.stepChevron}>›</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>STEP 2</Text>
          <Text style={styles.stepLabel}>WEIGHMENT</Text>
        </View>
        <Text style={styles.stepChevron}>›</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>STEP 3</Text>
          <Text style={styles.stepLabel}>QC</Text>
        </View>
        <Text style={styles.stepChevron}>›</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>STEP 4</Text>
          <Text style={styles.stepLabel}>BREAKDOWN</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Camera Viewfinder Mockup */}
        <View style={styles.cameraView}>
          <View style={styles.cameraOverlay}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {/* Scan line */}
            <View style={styles.scanLine} />
          </View>
          <Text style={styles.cameraInstruction}>
            ALIGN LICENSE PLATE WITHIN FRAME
          </Text>
          {/* Flash toggle */}
          <TouchableOpacity style={styles.flashButton} activeOpacity={0.7}>
            <Text style={styles.flashIcon}>🔦</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR SELECT FROM LIST</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Expected Vehicles Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Today's Expected Vehicles</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{vehicles.length} TOTAL</Text>
          </View>
        </View>

        {vehicles.length === 0 && (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#474747" }}>
              NO PENDING VEHICLES
            </Text>
          </View>
        )}

        {/* Vehicle Cards */}
        {vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.manifestCard,
              selectedVehicleId === vehicle.id && styles.manifestCardSelected,
            ]}
            activeOpacity={0.7}
            onPress={() => setSelectedVehicleId(vehicle.id)}
          >
            <View style={styles.manifestTop}>
              <View>
                <Text style={styles.manifestId}>Manifest {vehicle.manifestId}</Text>
                <Text style={styles.manifestPlate}>{vehicle.licensePlate}</Text>
              </View>
              <View style={styles.etaBadge}>
                <Text style={styles.etaBadgeText}>ETA: {vehicle.eta}</Text>
              </View>
            </View>
            <View style={styles.manifestDetails}>
              <View style={styles.manifestCol}>
                <Text style={styles.manifestDetailLabel}>REELER STOPS</Text>
                <Text style={styles.manifestDetailValue}>{vehicle.reelerStops}</Text>
              </View>
              <View style={styles.manifestCol}>
                <Text style={styles.manifestDetailLabel}>REPORTED WEIGHT</Text>
                <Text style={styles.manifestDetailValue}>
                  {vehicle.reportedWeight.toLocaleString()} KG
                </Text>
              </View>
            </View>
            <View style={styles.manifestTags}>
              {vehicle.priority === "high" && (
                <View style={styles.tagPrimary}>
                  <Text style={styles.tagPrimaryText}>PRIORITY: HIGH</Text>
                </View>
              )}
              <View style={styles.tagSecondary}>
                <Text style={styles.tagSecondaryText}>{vehicle.vehicleType}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Action — pinned via Flexbox, no absolute positioning */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedVehicleId || confirming) && { opacity: 0.5 }]}
          activeOpacity={0.8}
          disabled={!selectedVehicleId || confirming}
          onPress={handleConfirm}
        >
          {confirming ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.confirmIcon}>☑</Text>
              <Text style={styles.confirmText}>CONFIRM & CHECK IN</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Step Bar
  stepBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#C6C6C6",
    paddingVertical: 0,
  },
  stepItem: { flex: 1, paddingVertical: 12, alignItems: "center" },
  stepItemActive: { borderBottomWidth: 2, borderBottomColor: "#000000" },
  stepNum: { fontSize: 9, fontWeight: "700", color: "#888888", letterSpacing: 1, textTransform: "uppercase" },
  stepNumActive: { fontSize: 9, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  stepLabel: { fontSize: 10, fontWeight: "700", color: "#888888", textTransform: "uppercase", marginTop: 2 },
  stepLabelActive: { fontSize: 10, fontWeight: "900", color: "#000000", textTransform: "uppercase", marginTop: 2 },
  stepChevron: { fontSize: 14, color: "#888888" },

  scrollContent: { paddingBottom: 16 },

  // Camera View
  cameraView: {
    height: 350, backgroundColor: "#000000",
    justifyContent: "center", alignItems: "center",
    position: "relative",
  },
  cameraOverlay: {
    width: 256, height: 160,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.3)",
    position: "relative",
  },
  corner: { position: "absolute", width: 24, height: 24 },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderColor: "#FFFFFF" },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderColor: "#FFFFFF" },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: "#FFFFFF" },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderColor: "#FFFFFF" },
  scanLine: { position: "absolute", top: "50%", width: "100%", height: 2, backgroundColor: "rgba(255,0,0,0.5)" } as any,
  cameraInstruction: { position: "absolute", bottom: 24, fontSize: 10, fontWeight: "700", color: "#FFFFFF", letterSpacing: 2, textTransform: "uppercase" },
  flashButton: { position: "absolute", top: 16, right: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  flashIcon: { fontSize: 20 },

  // Divider
  divider: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 24, paddingHorizontal: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#C6C6C6" },
  dividerText: { fontSize: 10, fontWeight: "900", color: "#888888", letterSpacing: 1, textTransform: "uppercase" },

  // List Header
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: "900", color: "#000000", letterSpacing: -0.5, fontStyle: "italic", textTransform: "uppercase" },
  totalBadge: { backgroundColor: "#000000", paddingHorizontal: 8, paddingVertical: 4 },
  totalBadgeText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF", textTransform: "uppercase" },

  // Manifest Card
  manifestCard: {
    marginHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: "#000000",
    borderRadius: 4, padding: 16, backgroundColor: "#FFFFFF",
  },
  manifestCardSelected: {
    borderWidth: 2, borderColor: "#000000", backgroundColor: "#F5F5F5",
  },
  manifestTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  manifestId: { fontSize: 10, fontWeight: "700", color: "#474747", letterSpacing: 0.5, textTransform: "uppercase" },
  manifestPlate: { fontSize: 20, fontWeight: "900", color: "#000000", letterSpacing: -1 },
  etaBadge: { backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#C6C6C6", paddingHorizontal: 8, paddingVertical: 4 },
  etaBadgeText: { fontSize: 10, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  manifestDetails: {
    flexDirection: "row", gap: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: "#C6C6C6",
  },
  manifestCol: { flex: 1 },
  manifestDetailLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  manifestDetailValue: { fontSize: 13, fontWeight: "700", color: "#000000", marginTop: 2 },
  manifestTags: { flexDirection: "row", gap: 8, marginTop: 12 },
  tagPrimary: { backgroundColor: "#000000", paddingHorizontal: 8, paddingVertical: 4 },
  tagPrimaryText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF", textTransform: "uppercase" },
  tagSecondary: { backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#000000", paddingHorizontal: 8, paddingVertical: 4 },
  tagSecondaryText: { fontSize: 10, fontWeight: "700", color: "#000000", textTransform: "uppercase" },

  // Bottom Action — Flexbox pinned, no absolute
  bottomAction: {
    padding: 16, backgroundColor: "#FFFFFF",
    borderTopWidth: 1, borderTopColor: "#C6C6C6",
  },
  confirmButton: {
    height: 52, backgroundColor: "#000000",
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
  },
  confirmIcon: { fontSize: 14, color: "#FFFFFF" },
  confirmText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1.5, textTransform: "uppercase" },
});
