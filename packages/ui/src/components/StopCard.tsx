// ─── StopCard — Route Stop Display Card ──────────────────────────────────────
// Three visual states: Done, Pending, Skipped.
// Pending uses a nested-View double-border technique (no position: absolute).
// All colours derived from theme tokens — no hardcoded hex.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface StopCardProps {
  stopNumber: number;
  reelerName: string;
  villageName: string;
  expectedQuantity: string;
  status: "Pending" | "Done" | "Skipped";
  onPress: () => void;
  /** Reason shown on Skipped cards instead of expectedQuantity */
  skipReason?: string;
}

// ── Status-specific colour maps ──────────────────────────────────────────────

const BADGE_BG: Record<StopCardProps["status"], string> = {
  Done: theme.colors.surfaceMuted,
  Pending: theme.colors.primary,
  Skipped: theme.colors.progressTrack,
};

const BADGE_TEXT: Record<StopCardProps["status"], string> = {
  Done: theme.colors.textSecondary,
  Pending: theme.colors.primaryText,
  Skipped: theme.colors.textTertiary,
};

const CIRCLE_BG: Record<StopCardProps["status"], string> = {
  Done: theme.colors.primary,
  Pending: theme.colors.primary,
  Skipped: theme.colors.progressTrack,
};

const CIRCLE_TEXT: Record<StopCardProps["status"], string> = {
  Done: theme.colors.primaryText,
  Pending: theme.colors.primaryText,
  Skipped: theme.colors.textTertiary,
};

// ── Component ────────────────────────────────────────────────────────────────

export const StopCard: React.FC<StopCardProps> = ({
  stopNumber,
  reelerName,
  villageName,
  expectedQuantity,
  status,
  onPress,
  skipReason,
}): React.JSX.Element => {
  const isPending = status === "Pending";
  const isSkipped = status === "Skipped";

  const cardContent = (
    <View
      style={[
        styles.card,
        isPending && styles.cardPendingInner,
        isSkipped && styles.cardSkipped,
        !isPending && !isSkipped && styles.cardDefault,
      ]}
    >
      {/* ── Top Row: Badge + Name + Status ─────────────────────────────── */}
      <View style={styles.topRow}>
        <View style={styles.nameGroup}>
          {/* Stop Number Circle */}
          <View
            style={[
              styles.circle,
              { backgroundColor: CIRCLE_BG[status] },
            ]}
          >
            <Text
              style={[
                styles.circleText,
                { color: CIRCLE_TEXT[status] },
              ]}
            >
              {stopNumber}
            </Text>
          </View>

          {/* Name + Village */}
          <View style={styles.nameColumn}>
            <Text
              style={[
                styles.reelerName,
                isSkipped && styles.reelerNameSkipped,
              ]}
            >
              {reelerName}
            </Text>
            <Text
              style={[
                styles.villageName,
                isSkipped && styles.villageNameSkipped,
              ]}
            >
              {villageName}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: BADGE_BG[status] },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: BADGE_TEXT[status] },
            ]}
          >
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ── Bottom Row: Quantity / Reason + Action Icon ─────────────────── */}
      <View
        style={[
          styles.bottomRow,
          isSkipped && styles.bottomRowSkipped,
        ]}
      >
        {isSkipped && skipReason ? (
          <Text style={styles.skipReasonText}>{skipReason}</Text>
        ) : (
          <Text style={styles.expectedText}>
            Expected Qty:{" "}
            <Text style={styles.expectedValue}>{expectedQuantity}</Text>
          </Text>
        )}

        {/* Action indicator */}
        {status === "Done" ? (
          <Text style={styles.doneIcon}>✓</Text>
        ) : null}
        {status === "Pending" ? (
          <Text style={styles.navigateText}>◆ Navigate</Text>
        ) : null}
        {status === "Skipped" ? (
          <Text style={styles.blockedIcon}>⊘</Text>
        ) : null}
      </View>
    </View>
  );

  // Pending cards get a double-border wrapper (ring-2 ring-offset-2 equivalent)
  if (isPending) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.pendingWrapper}>{cardContent}</View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {cardContent}
    </TouchableOpacity>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Card Base ──────────────────────────────────────────────────────────
  card: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm + 4,
    backgroundColor: theme.colors.background,
  },
  cardDefault: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.primary,
    borderRadius: theme.borders.radiusCard,
  },
  cardSkipped: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.progressTrack,
    borderRadius: theme.borders.radiusCard,
    backgroundColor: theme.colors.surfaceAlt,
  },

  // ── Pending double-border ──────────────────────────────────────────────
  pendingWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borders.radiusCard + 4,
    padding: 2,
  },
  cardPendingInner: {
    borderWidth: theme.borders.widthDefault,
    borderColor: theme.colors.primary,
    borderRadius: theme.borders.radiusCard,
  },

  // ── Top Row ────────────────────────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + 4,
    flexShrink: 1,
  },
  circle: {
    width: theme.layout.stopBadgeSize,
    height: theme.layout.stopBadgeSize,
    borderRadius: theme.borders.radiusFull,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: theme.typography.fontSizeBase,
    fontWeight: theme.typography.fontWeightBold,
  },
  nameColumn: {
    flexShrink: 1,
    gap: 2,
  },
  reelerName: {
    fontSize: theme.typography.fontSizeMD,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  reelerNameSkipped: {
    color: theme.colors.textSecondary,
    textDecorationLine: "line-through",
  },
  villageName: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  villageNameSkipped: {
    color: theme.colors.textMuted,
  },

  // ── Status Badge ───────────────────────────────────────────────────────
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radiusSM,
  },
  statusBadgeText: {
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },

  // ── Bottom Row ─────────────────────────────────────────────────────────
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: theme.borders.widthThin,
    borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing.sm,
  },
  bottomRowSkipped: {
    borderTopColor: theme.colors.progressTrack,
  },
  expectedText: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
  },
  expectedValue: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textPrimary,
  },
  skipReasonText: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textMuted,
    fontStyle: "italic",
  },

  // ── Action Indicators ──────────────────────────────────────────────────
  doneIcon: {
    fontSize: theme.typography.fontSizeLG,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeightBold,
  },
  navigateText: {
    fontSize: theme.typography.fontSizeXS + 2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.primary,
  },
  blockedIcon: {
    fontSize: theme.typography.fontSizeMD,
    color: theme.colors.textMuted,
  },
});
