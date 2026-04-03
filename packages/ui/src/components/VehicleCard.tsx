// ─── VehicleCard — Card showing vehicle info in manifests/lists ───────────────

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type VehicleCardStatus = "expected" | "late" | "checked_in";

export interface VehicleCardProps {
  licensePlate: string;
  carrier: string;
  eta: string;
  status: VehicleCardStatus;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<VehicleCardStatus, { label: string; bg: string; textColor: string; borderColor: string }> = {
  expected: { label: "EXPECTED", bg: "transparent", textColor: "#000000", borderColor: "#000000" },
  late: { label: "LATE", bg: "#000000", textColor: "#FFFFFF", borderColor: "#000000" },
  checked_in: { label: "CHECKED IN", bg: "#3A3C3C", textColor: "#E2E2E2", borderColor: "#3A3C3C" },
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  licensePlate,
  carrier,
  eta,
  status,
  onPress,
}) => {
  const config = STATUS_CONFIG[status];
  const isInactive = status === "checked_in";

  return (
    <TouchableOpacity
      style={[styles.card, isInactive && styles.cardInactive]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>
          {status === "checked_in" ? "✓" : status === "late" ? "⚠" : "◷"}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.plate, isInactive && styles.plateMuted]}>
            {licensePlate}
          </Text>
          <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.borderColor }]}>
            <Text style={[styles.badgeText, { color: config.textColor }]}>
              {config.label}
            </Text>
          </View>
        </View>
        <Text style={styles.carrier}>
          {carrier} • {eta} {status === "checked_in" ? "Actual" : "ETA"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
  },
  cardInactive: {
    backgroundColor: "#EEEEEE",
    borderColor: "#C6C6C6",
    opacity: 0.75,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#C6C6C6",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  plate: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: -0.5,
  },
  plateMuted: {
    color: "#474747",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  carrier: {
    fontSize: 11,
    fontWeight: "700",
    color: "#474747",
    marginTop: 4,
    textTransform: "uppercase",
  },
});
