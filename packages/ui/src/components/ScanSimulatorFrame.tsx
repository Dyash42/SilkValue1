// ─── ScanSimulatorFrame — Camera viewfinder placeholder ──────────────────────
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export interface ScanSimulatorFrameProps {
  onSimulateScan: () => void;
  isScanning: boolean;
  label?: string;
}

export const ScanSimulatorFrame: React.FC<ScanSimulatorFrameProps> = ({
  onSimulateScan,
  isScanning,
  label = "Point camera at reeler's QR code",
}): React.JSX.Element => {
  return (
    <View style={styles.container}>
      {/* Dark camera background */}
      <View style={styles.viewfinder}>
        {/* Corner brackets */}
        <View style={styles.bracketContainer}>
          {/* Top-left */}
          <View style={[styles.corner, styles.cornerTL]} />
          {/* Top-right */}
          <View style={[styles.corner, styles.cornerTR]} />
          {/* Bottom-left */}
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Bottom-right */}
          <View style={[styles.corner, styles.cornerBR]} />
          {/* Scan line */}
          <View style={styles.scanLine} />
        </View>

        {/* Simulate Scan Button overlay */}
        <TouchableOpacity
          style={styles.simulateButton}
          onPress={onSimulateScan}
          activeOpacity={0.8}
          disabled={isScanning}
        >
          <Text style={styles.simulateButtonText}>
            {isScanning ? "SCANNING..." : "SIMULATE SCAN"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instruction label */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{label}</Text>
        <Text style={styles.gpsNote}>
          Your GPS location and time are being recorded...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  viewfinder: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  bracketContainer: {
    width: 240,
    height: 240,
  },
  corner: {
    width: 32,
    height: 32,
    borderColor: "#FFFFFF",
  },
  cornerTL: {
    borderTopWidth: 4,
    borderLeftWidth: 4,
    position: "absolute",
    top: 0,
    left: 0,
  },
  cornerTR: {
    borderTopWidth: 4,
    borderRightWidth: 4,
    position: "absolute",
    top: 0,
    right: 0,
  },
  cornerBL: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  cornerBR: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  scanLine: {
    height: 2,
    backgroundColor: "rgba(34,197,94,0.5)",
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
  },
  simulateButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: theme.borders.radiusSM,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 4,
  },
  simulateButtonText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    color: "#FFFFFF",
    letterSpacing: theme.typography.letterSpacingWidest,
    textTransform: "uppercase",
  },
  instructionContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
  },
  instructionText: {
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.textPrimary,
  },
  gpsNote: {
    fontSize: theme.typography.fontSizeXS + 2,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    marginTop: theme.spacing.sm,
  },
});
