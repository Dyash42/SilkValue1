// STUB: Replace the placeholder View with a real QR
// component from 'react-native-qrcode-svg' in a
// future session when native dependencies are confirmed.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface QRCodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 200,
  label,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.qrBox,
          { width: size, height: size },
        ]}
      >
        {/* Placeholder QR pattern */}
        <View style={styles.patternContainer}>
          {/* Corner squares */}
          <View style={styles.topRow}>
            <View style={styles.cornerSquare} />
            <View style={styles.spacer} />
            <View style={styles.cornerSquare} />
          </View>
          <View style={styles.centerArea}>
            <Text style={styles.qrText}>[ QR CODE ]</Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.cornerSquare} />
            <View style={styles.spacer} />
            <View style={styles.smallSquare} />
          </View>
        </View>
      </View>
      {label ? (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      ) : null}
      <Text style={styles.dataText}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borders.radiusCard,
  },
  qrBox: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  patternContainer: {
    flex: 1,
    width: "100%",
    padding: 16,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  centerArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  cornerSquare: {
    width: 28,
    height: 28,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  smallSquare: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  spacer: {
    flex: 1,
  },
  qrText: {
    fontFamily: "monospace",
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textMuted,
    letterSpacing: theme.typography.letterSpacingWide,
  },
  label: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.colors.textMuted,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  dataText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizeXS,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.textMuted,
  },
});
