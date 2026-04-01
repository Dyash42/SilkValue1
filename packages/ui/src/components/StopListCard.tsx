// ─── StopListCard — Route Map Bottom Sheet Stop Card ─────────────────────────
// Designed specifically for the RouteMapScreen bottom sheet.
// Supports three states: Pending, Active/Next Up, and Done/Collected.
// Active state displays Navigate and Skip action buttons.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface StopListCardProps {
  stopNumber: number;
  reelerName: string;
  villageName: string;
  expectedQuantity: string;
  status: "Pending" | "Done" | "Next Up";
  onNavigatePress: () => void;
  onSkipPress: () => void;
}

export const StopListCard: React.FC<StopListCardProps> = ({
  stopNumber,
  reelerName,
  villageName,
  expectedQuantity,
  status,
  onNavigatePress,
  onSkipPress,
}): React.JSX.Element => {
  const isDone = status === "Done";
  const isActive = status === "Next Up";
  const isPending = status === "Pending";

  return (
    <View
      style={[
        styles.card,
        isDone && styles.cardDone,
        isActive && styles.cardActive,
        isPending && styles.cardPending,
      ]}
    >
      {/* ── Stop Number Badge ────────────────────────────────────────────── */}
      <View
        style={[
          styles.badge,
          isDone && styles.badgeDone,
          isActive && styles.badgeActive,
          isPending && styles.badgePending,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isDone && styles.badgeTextDone,
            isActive && styles.badgeTextActive,
            isPending && styles.badgeTextPending,
          ]}
        >
          {stopNumber}
        </Text>
      </View>

      {/* ── Card Content ─────────────────────────────────────────────────── */}
      <View style={styles.content}>
        {/* Name and Status Label Row */}
        <View style={styles.headerRow}>
          <Text style={styles.reelerName}>{reelerName}</Text>
          <View
            style={[
              styles.statusLabel,
              isDone && styles.statusLabelDone,
              isActive && styles.statusLabelActive,
              isPending && styles.statusLabelPending,
            ]}
          >
            <Text
              style={[
                styles.statusLabelText,
                isDone && styles.statusLabelTextDone,
                isActive && styles.statusLabelTextActive,
                isPending && styles.statusLabelTextPending,
              ]}
            >
              {isDone ? "COLLECTED" : status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Details Row */}
        <Text style={styles.detailsText}>
          {villageName} • {expectedQuantity}
        </Text>

        {/* ── Action Buttons (Active State Only) ───────────────────────── */}
        {isActive ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={onNavigatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.navigateButtonIcon}>near_me</Text>
              <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkipPress}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Card Container ───────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: theme.spacing.sm + 4, // p-3 (~12px)
    borderRadius: theme.borders.radiusCard,
    gap: theme.spacing.md,
  },
  cardDone: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.surfaceMuted, // border-slate-100
    backgroundColor: theme.colors.background,
  },
  cardActive: {
    borderWidth: theme.borders.widthActive,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceAlt, // bg-slate-50
  },
  cardPending: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.surfaceMuted, // border-slate-100
    backgroundColor: theme.colors.background,
  },

  // ── Stop Number Badge ────────────────────────────────────────────────────
  badge: {
    width: theme.layout.stopBadgeSizeLG,
    height: theme.layout.stopBadgeSizeLG,
    borderRadius: theme.borders.radiusFull,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeText: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSizeBase,
  },
  badgeDone: {
    backgroundColor: theme.colors.primaryMuted, // primary/10
  },
  badgeTextDone: {
    color: theme.colors.primary,
  },
  badgeActive: {
    backgroundColor: theme.colors.primary,
  },
  badgeTextActive: {
    color: theme.colors.primaryText,
  },
  badgePending: {
    backgroundColor: theme.colors.background,
    borderWidth: theme.borders.widthActive,
    borderColor: theme.colors.dragHandle, // border-slate-300
  },
  badgeTextPending: {
    color: theme.colors.textMuted, // text-slate-400
  },

  // ── Content ──────────────────────────────────────────────────────────────
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reelerName: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSizeBase, // text-sm (~14px)
    color: theme.colors.textPrimary,
  },
  detailsText: {
    fontSize: theme.typography.fontSizeXS + 2, // text-xs (~12px)
    color: theme.colors.textSecondary, // text-slate-500
    marginTop: 2, // From design spacing
  },

  // ── Status Label ─────────────────────────────────────────────────────────
  statusLabel: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2, // py-0.5
    borderRadius: theme.borders.radiusSM, // rounded
  },
  statusLabelText: {
    fontSize: theme.typography.fontSizeXS, // text-[10px]
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
  statusLabelDone: {
    backgroundColor: theme.colors.surfaceMuted, // bg-slate-100
  },
  statusLabelTextDone: {
    color: theme.colors.textTertiary, // text-slate-600 pattern
  },
  statusLabelActive: {
    backgroundColor: theme.colors.primary,
  },
  statusLabelTextActive: {
    color: theme.colors.primaryText,
  },
  statusLabelPending: {
    backgroundColor: theme.colors.surfaceAlt, // bg-slate-50
  },
  statusLabelTextPending: {
    color: theme.colors.textMuted,
  },

  // ── Action Buttons (Active State) ────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm, // gap-2
    marginTop: theme.spacing.sm, // mt-2
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md, // px-4
    paddingVertical: theme.spacing.sm, // py-2
    borderRadius: theme.borders.radiusCard, // rounded-lg
    gap: 4, // gap-1
  },
  navigateButtonIcon: {
    // Note: Assuming Material Icons are loaded; fallback to text if not
    fontFamily: "Material Icons",
    fontSize: 14,
    color: theme.colors.primaryText,
  },
  navigateButtonText: {
    color: theme.colors.primaryText,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSizeXS + 2, // text-xs
  },
  skipButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radiusCard,
  },
  skipButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSizeXS + 2,
  },
});
