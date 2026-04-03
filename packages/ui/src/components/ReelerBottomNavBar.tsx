// ─── ReelerBottomNavBar — Reeler App Bottom Tab Bar ──────────────────────────
// 4 tabs: Home, Collections, Payments, Profile.
// Active tab: black icon + bold label. Inactive: gray.
// Uses unicode glyphs as placeholder icons (replace with @expo/vector-icons later).

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export type ReelerTabName = "Home" | "Collections" | "Payments" | "Profile";

export interface ReelerBottomNavBarProps {
  activeTab: ReelerTabName;
  onTabPress: (tab: ReelerTabName) => void;
  /** Bottom safe-area inset from useSafeAreaInsets().bottom */
  bottomInset?: number;
}

const TABS: ReadonlyArray<{ name: ReelerTabName; icon: string; activeIcon: string }> = [
  { name: "Home", icon: "⌂", activeIcon: "⌂" },
  { name: "Collections", icon: "☐", activeIcon: "☒" },
  { name: "Payments", icon: "⊡", activeIcon: "⊞" },
  { name: "Profile", icon: "○", activeIcon: "●" },
] as const;

export const ReelerBottomNavBar: React.FC<ReelerBottomNavBarProps> = ({
  activeTab,
  onTabPress,
  bottomInset = 0,
}): React.JSX.Element => {
  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      {TABS.map((tab) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.icon,
                { color: isActive ? theme.colors.primary : theme.colors.navInactive },
              ]}
            >
              {isActive ? tab.activeIcon : tab.icon}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? theme.colors.primary : theme.colors.navInactive,
                  fontWeight: isActive
                    ? theme.typography.fontWeightBold
                    : theme.typography.fontWeightRegular,
                },
              ]}
            >
              {tab.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.layout.bottomNavHeight,
    backgroundColor: theme.colors.background,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
