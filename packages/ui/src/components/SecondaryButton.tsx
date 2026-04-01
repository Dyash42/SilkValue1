// ─── SecondaryButton — Industrial Brutalist ──────────────────────────────────
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { theme } from "../theme";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  fullWidth = true,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.layout.buttonHeight,
    backgroundColor: theme.colors.secondary,
    borderWidth: theme.borders.widthThick,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusMD,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
