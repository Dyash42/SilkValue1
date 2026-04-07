// ─── BottomNavBar — Fixed Bottom Tab Bar ─────────────────────────────────────
// 4 tabs: Home, Map, Collections, Settings.
// Active tab: black icon + bold label. Inactive: gray.
// The consumer passes bottomInset for safe-area padding.
// TODO: Replace unicode icons with @expo/vector-icons MaterialCommunityIcons
// when an icon library is integrated (home, map-outline, package-variant, cog)

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export type TabName = "Home" | "Map" | "Collections" | "Settings";

export interface BottomNavBarProps {
  activeTab: TabName | null;
  onTabPress: (tab: TabName) => void;
  /** Bottom safe-area inset from useSafeAreaInsets().bottom */
  bottomInset?: number;
}

const TABS: ReadonlyArray<{ name: TabName; icon: string }> = [
  { name: "Home", icon: "⌂" },
  { name: "Map", icon: "◇" },
  { name: "Collections", icon: "▣" },
  { name: "Settings", icon: "⚙" },
] as const;

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
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
              {tab.icon}
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
    borderTopWidth: theme.borders.widthDefault,
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
    fontSize: 24,
  },
  label: {
    fontSize: theme.typography.fontSizeXS,
    textTransform: "uppercase",
    letterSpacing: theme.typography.letterSpacingWide,
  },
});
