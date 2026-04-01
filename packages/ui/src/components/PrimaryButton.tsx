// ─── PrimaryButton — Industrial Brutalist ────────────────────────────────────
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { theme } from "../theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  testID,
}) => {
  const isInactive = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        isInactive && styles.disabled,
      ]}
      onPress={isInactive ? undefined : onPress}
      activeOpacity={0.8}
      disabled={isInactive}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primaryText}
        />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.layout.buttonHeight,
    backgroundColor: theme.colors.primary,
    borderWidth: theme.borders.widthDefault,
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
    color: theme.colors.primaryText,
    fontSize: theme.typography.fontSizeSM,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
