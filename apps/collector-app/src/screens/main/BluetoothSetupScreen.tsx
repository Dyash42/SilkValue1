// SCREEN: Bluetooth Scale Setup
// REFERENCE: Reference_images/Collector App/08_bluetooth_setup_updated/screen.png
// STATUS: UI Complete — BLE Logic Fully Stubbed
// TODO: Wire react-native-ble-plx for real Bluetooth connectivity

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  WeightDisplay,
  BluetoothDeviceRow,
  PrimaryButton,
  BottomNavBar,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import type { AppStackParamList } from "../../navigation/types";
import {
  MOCK_SCALE_STATE,
  MOCK_BLUETOOTH_DEVICES,
} from "../../mock/collectorMockData";
import type { MockBluetoothDevice } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "BluetoothSetup">;

export const BluetoothSetupScreen: React.FC<Props> = ({
  navigation,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [scale, setScale] = useState(MOCK_SCALE_STATE);
  const [devices, setDevices] = useState<MockBluetoothDevice[]>(MOCK_BLUETOOTH_DEVICES);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleTareZero = useCallback((): void => {
    // STUB: In production, send tare command via BLE
    setScale((prev) => ({ ...prev, lastReadingKg: 0, isTared: true }));
    Alert.alert("Tare/Zero", "Scale zeroed. Place items to weigh.\n\n// STUB: BLE tare command");
  }, []);

  const handleForgetDevice = useCallback((): void => {
    Alert.alert(
      "Forget Device?",
      `Remove ${scale.deviceName} from saved devices?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Forget",
          style: "destructive",
          onPress: () => {
            // STUB: Clear saved BLE device from AsyncStorage
            setScale((prev) => ({ ...prev, isConnected: false }));
          },
        },
      ],
    );
  }, [scale.deviceName]);

  const handleScanDevices = useCallback((): void => {
    setIsScanning(true);
    // STUB: Simulate 2s BLE scan
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  }, []);

  const handlePairDevice = useCallback((device: MockBluetoothDevice): void => {
    setConnectingId(device.id);
    // STUB: Simulate 1.5s BLE pairing
    setTimeout(() => {
      setConnectingId(null);
      setScale({
        deviceName: device.name,
        macAddress: device.macAddress,
        isConnected: true,
        batteryPercent: 82,
        lastReadingKg: 0,
        isStable: true,
        isTared: false,
      });
      setDevices((prev) =>
        prev.map((d) =>
          d.id === device.id ? { ...d, isPaired: true } : d,
        ),
      );
      Alert.alert("Connected", `${device.name} paired successfully.`);
    }, 1500);
  }, []);

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
        <Text style={styles.topBarTitle}>Bluetooth Scale Setup</Text>
      </View>

      {/* ── Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Device Card */}
        {scale.isConnected && (
          <View style={styles.savedDeviceCard}>
            <View style={styles.savedDeviceHeader}>
              <View>
                <Text style={styles.savedDeviceLabel}>SAVED DEVICE</Text>
                <Text style={styles.savedDeviceName}>
                  {scale.deviceName}
                </Text>
                <View style={styles.connectedRow}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleForgetDevice}>
                <Text style={styles.forgetLink}>Forget Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Live Weight Display */}
        <View style={styles.weightSection}>
          <WeightDisplay
            weightKg={scale.lastReadingKg}
            isStable={scale.isStable}
            isConnected={scale.isConnected}
            size="large"
          />
          <PrimaryButton
            label="⟳ Tare / Zero"
            onPress={handleTareZero}
            testID="tare-zero-btn"
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Nearby Devices Section */}
        <View style={styles.devicesSection}>
          <View style={styles.devicesHeader}>
            <Text style={styles.devicesTitle}>Nearby Devices</Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanDevices}
              activeOpacity={0.8}
              disabled={isScanning}
            >
              <Text style={styles.scanButtonText}>
                {isScanning ? "Scanning..." : "⟳ Scan"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.devicesList}>
            {devices.map((device) => (
              <BluetoothDeviceRow
                key={device.id}
                name={device.name}
                macAddress={device.macAddress}
                signalStrength={device.signalStrength}
                isPaired={device.isPaired}
                isConnecting={connectingId === device.id}
                onConnect={() => handlePairDevice(device)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab="Settings"
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
    fontSize: 22,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
  },
  topBarTitle: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    letterSpacing: theme.typography.letterSpacingTight,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    paddingBottom: 80,
  },
  // ── Saved Device ────────────────────────────────────────────────
  savedDeviceCard: {
    margin: theme.spacing.md,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
    padding: theme.spacing.md,
  },
  savedDeviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  savedDeviceLabel: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
  savedDeviceName: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.success,
  },
  connectedText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
  },
  forgetLink: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
    textDecorationLine: "underline",
  },
  // ── Weight Section ──────────────────────────────────────────────
  weightSection: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  // ── Divider ─────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  // ── Devices Section ─────────────────────────────────────────────
  devicesSection: {
    paddingHorizontal: theme.spacing.md,
  },
  devicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  devicesTitle: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.dragHandle,
    borderRadius: theme.borders.radiusCard,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  scanButtonText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  devicesList: {
    gap: theme.spacing.sm,
  },
});
