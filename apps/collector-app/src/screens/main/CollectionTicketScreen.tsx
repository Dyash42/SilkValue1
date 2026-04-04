// SCREEN: Collection Ticket — Digital Receipt
// REFERENCE: Reference_images/Collector App/06_ticket_updated/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Wire Share via WhatsApp (Linking), SMS, Print integrations

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
  BottomNavBar,
} from "@silk-value/ui";
import type { TabName } from "@silk-value/ui";
import type { AppStackParamList } from "../../navigation/types";
import { MOCK_COLLECTION_TICKET } from "../../mock/collectorMockData";

type Props = NativeStackScreenProps<AppStackParamList, "CollectionTicket">;

export const CollectionTicketScreen: React.FC<Props> = ({
  navigation,
}): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const ticket = MOCK_COLLECTION_TICKET;

  const formattedDate = new Date(ticket.collectedAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(ticket.collectedAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleShareWhatsApp = (): void => {
    // STUB: Linking.openURL with WhatsApp deep link
    Alert.alert("Share Stub", "WhatsApp share would open here.\n\n// STUB: WhatsApp Linking");
  };

  const handleShareSMS = (): void => {
    Alert.alert("SMS Stub", "SMS composer would open here.\n\n// STUB: SMS Linking");
  };

  const handlePrint = (): void => {
    Alert.alert("Print Stub", "Bluetooth print would start here.\n\n// STUB: BLE Printer");
  };

  const handleNextReeler = (): void => {
    // Go back to route map for next collection
    navigation.navigate("RouteMap");
  };

  const handleTabPress = (tab: TabName): void => {
    if (tab === "Home") navigation.navigate("Home");
    if (tab === "Map") navigation.navigate("RouteMap");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Collection Ticket</Text>
      </View>

      {/* ── Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.brandSection}>
              <Text style={styles.brandName}>SILK VALUE</Text>
              <Text style={styles.ticketId}>
                TICKET ID: #{ticket.ticketNumber}
              </Text>
            </View>

            {/* Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DATE & TIME</Text>
                <Text style={styles.detailValue}>
                  {formattedDate} | {formattedTime}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>REELER</Text>
                <View style={styles.detailRight}>
                  <Text style={styles.detailValue}>
                    {ticket.reelerName}
                  </Text>
                  <Text style={styles.detailSub}>
                    ID: {ticket.reelerId}
                  </Text>
                </View>
              </View>
            </View>

            {/* Weight Grid */}
            <View style={styles.weightGrid}>
              <View style={styles.weightCol}>
                <Text style={styles.weightLabel}>GROSS</Text>
                <Text style={styles.weightValue}>
                  {ticket.grossWeightKg} kg
                </Text>
              </View>
              <View style={[styles.weightCol, styles.weightColMiddle]}>
                <Text style={styles.weightLabel}>TARE</Text>
                <Text style={styles.weightValue}>
                  {ticket.tareWeightKg} kg
                </Text>
              </View>
              <View style={styles.weightCol}>
                <Text style={styles.weightLabel}>NET</Text>
                <Text style={styles.weightValue}>
                  {ticket.netWeightKg} kg
                </Text>
              </View>
            </View>

            {/* Grade Badge */}
            <View style={styles.gradeBadgeContainer}>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>
                  GRADE {ticket.grade.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Payable Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>PAYABLE AMOUNT</Text>
            <Text style={styles.amountValue}>
              ₹ {ticket.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Dashed divider + Digital Receipt text */}
          <View style={styles.receiptFooter}>
            <Text style={styles.receiptVerified}>
              DIGITAL RECEIPT VERIFIED
            </Text>
          </View>
        </View>

        {/* Share Actions */}
        <View style={styles.shareActions}>
          <PrimaryButton
            label="Share via WhatsApp"
            onPress={handleShareWhatsApp}
            testID="share-whatsapp-btn"
          />
          <View style={styles.shareRow}>
            <TouchableOpacity
              style={styles.shareSecondaryBtn}
              onPress={handleShareSMS}
              activeOpacity={0.8}
            >
              <Text style={styles.shareSecondaryText}>💬 SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareSecondaryBtn}
              onPress={handlePrint}
              activeOpacity={0.8}
            >
              <Text style={styles.shareSecondaryText}>🖨 Print</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Reeler Button */}
        <View style={styles.nextSection}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextReeler}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>NEXT REELER</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
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
    gap: theme.spacing.lg,
  },
  // ── Receipt Card ────────────────────────────────────────────────
  receiptCard: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    overflow: "hidden",
  },
  receiptHeader: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  brandSection: {
    alignItems: "center",
    gap: 4,
  },
  brandName: {
    fontSize: theme.typography.fontSizeXL,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letterSpacingWidest,
  },
  ticketId: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  detailsSection: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: theme.borders.widthDefault,
    borderBottomColor: theme.colors.borderLight,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  detailRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  detailSub: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  // ── Weight Grid ─────────────────────────────────────────────────
  weightGrid: {
    flexDirection: "row",
    paddingVertical: theme.spacing.sm,
  },
  weightCol: {
    flex: 1,
    alignItems: "center",
  },
  weightColMiddle: {
    borderLeftWidth: theme.borders.widthDefault,
    borderRightWidth: theme.borders.widthDefault,
    borderColor: theme.colors.borderLight,
  },
  weightLabel: {
    fontSize: theme.typography.fontSizeXS,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  weightValue: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  // ── Grade Badge ─────────────────────────────────────────────────
  gradeBadgeContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  gradeBadge: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusFull,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  gradeBadgeText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    textTransform: "uppercase",
  },
  // ── Amount ──────────────────────────────────────────────────────
  amountSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    gap: 4,
  },
  amountLabel: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  receiptFooter: {
    backgroundColor: "rgba(0,0,0,0.02)",
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    borderStyle: "dashed",
  },
  receiptVerified: {
    fontSize: theme.typography.fontSizeXS,
    color: theme.colors.textMuted,
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
  },
  // ── Share Actions ───────────────────────────────────────────────
  shareActions: {
    gap: theme.spacing.sm + 4,
  },
  shareRow: {
    flexDirection: "row",
    gap: theme.spacing.sm + 4,
  },
  shareSecondaryBtn: {
    flex: 1,
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusCard,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  shareSecondaryText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  // ── Next Reeler ─────────────────────────────────────────────────
  nextSection: {
    marginTop: theme.spacing.lg,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    height: 52,
    borderRadius: theme.borders.radiusCard,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primaryText,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
