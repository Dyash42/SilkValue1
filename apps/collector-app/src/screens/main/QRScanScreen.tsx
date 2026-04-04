// SCREEN: QR Scan / Reeler Select
// REFERENCE: Reference_images/Collector App/04_qr_scan_updated/screen.png
// STATUS: UI Complete — Camera Stubbed
// TODO: Wire expo-camera for real QR scanning, wire WatermelonDB reeler lookup

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  theme,
  ScanSimulatorFrame,
  BottomNavBar,
  PrimaryButton,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import type { AppStackParamList } from "../../navigation/types";
import { MOCK_SCANNED_REELER } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "QRScan">;

export const QRScanScreen: React.FC<Props> = ({
  navigation,
  route,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { stopId } = route.params;
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<typeof MOCK_SCANNED_REELER | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSimulateScan = (): void => {
    setIsScanning(true);
    // Simulate 1.5s scan delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(MOCK_SCANNED_REELER);
    }, 1500);
  };

  const handleProceed = (): void => {
    if (!scanResult) return;
    navigation.navigate("CollectionEntry", {
      stopId,
      reelerId: scanResult.id,
      reelerName: scanResult.fullName,
      villageName: scanResult.village,
    });
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
        <Text style={styles.topBarTitle}>QR Scan / Reeler Select</Text>
      </View>

      {/* ── Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Viewfinder (Stubbed) */}
        <ScanSimulatorFrame
          onSimulateScan={handleSimulateScan}
          isScanning={isScanning}
        />

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search reeler by name or ID..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>

        {/* Scan Result / Recent Scans */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsHeading}>
            {scanResult ? "SCAN RESULT" : "RECENT REELER SCANS"}
          </Text>

          {/* Successful Scan Result Card */}
          {scanResult && (
            <View style={styles.reelerCard}>
              <View style={styles.reelerCardHeader}>
                {/* Avatar Circle */}
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {scanResult.profilePhotoInitials}
                  </Text>
                </View>
                <View style={styles.reelerCardInfo}>
                  <Text style={styles.reelerCardName}>
                    {scanResult.fullName}
                  </Text>
                  <Text style={styles.reelerCardDetail}>
                    ID: {scanResult.id} • {scanResult.village}
                  </Text>
                </View>
              </View>
              <PrimaryButton
                label="Yes, proceed"
                onPress={handleProceed}
                testID="proceed-scan-btn"
              />
            </View>
          )}

          {/* Placeholder recent scan items */}
          {!scanResult && (
            <>
              <TouchableOpacity style={styles.recentItem}>
                <View>
                  <Text style={styles.recentName}>Suresh G. Patil</Text>
                  <Text style={styles.recentDetail}>
                    ID: RL-102934 • Ramanagara
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recentItem}>
                <View>
                  <Text style={styles.recentName}>Ramesh Kumar</Text>
                  <Text style={styles.recentDetail}>
                    ID: RL-882931 • Sidlaghatta
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom Nav ───────────────────────────────────────────────── */}
      <BottomNavBar
        activeTab={null as unknown as TabName}
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
    flex: 1,
    letterSpacing: theme.typography.letterSpacingTight,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    paddingBottom: 80,
  },
  // ── OR Divider ──────────────────────────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  dividerText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textMuted,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  // ── Search ──────────────────────────────────────────────────────
  searchSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusSM,
    height: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizeSM,
    color: theme.colors.textPrimary,
  },
  searchIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  // ── Results ─────────────────────────────────────────────────────
  resultsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm + 4,
  },
  resultsHeading: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
  },
  reelerCard: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusSM,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  reelerCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
  },
  avatarText: {
    fontSize: theme.typography.fontSizeLG,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textSecondary,
  },
  reelerCardInfo: {
    flex: 1,
    gap: 2,
  },
  reelerCardName: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  reelerCardDetail: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  // ── Recent Items ────────────────────────────────────────────────
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm + 4,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
  },
  recentName: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  recentDetail: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.dragHandle,
  },
});
