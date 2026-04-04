// ─── BluetoothDeviceRow — One discovered BLE device ──────────────────────────
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface BluetoothDeviceRowProps {
  name: string;
  macAddress: string;
  signalStrength: number;
  isPaired: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}

function getSignalBars(dbm: number): string {
  if (dbm > -50) return "▉▉▉▉";
  if (dbm > -60) return "▉▉▉░";
  if (dbm > -70) return "▉▉░░";
  return "▉░░░";
}

export const BluetoothDeviceRow: React.FC<BluetoothDeviceRowProps> = ({
  name,
  macAddress,
  isPaired,
  isConnecting,
  signalStrength,
  onConnect,
}): React.JSX.Element => {
  return (
    <View style={[styles.container, isPaired && styles.containerPaired]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isPaired ? "⚖" : "⚡"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.mac}>{macAddress}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.signal}>{getSignalBars(signalStrength)}</Text>
        {isPaired ? (
          <View style={styles.pairedBadge}>
            <Text style={styles.pairedBadgeText}>PAIRED</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={onConnect}
            activeOpacity={0.8}
            disabled={isConnecting}
          >
            <Text style={styles.connectButtonText}>
              {isConnecting ? "..." : "Pair"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    gap: theme.spacing.sm + 4,
  },
  containerPaired: {
    borderColor: theme.colors.borderLight,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  mac: {
    fontSize: theme.typography.fontSizeXS + 1,
    color: theme.colors.textMuted,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  signal: {
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
  connectButton: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  connectButtonText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  pairedBadge: {
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borders.radiusSM,
  },
  pairedBadgeText: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textTertiary,
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
