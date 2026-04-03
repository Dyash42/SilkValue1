// ─── GateBottomNavBar — Factory Gate 5-tab bottom navigation ─────────────────
// Tabs: Dashboard | Check-In | History | Reports | Settings
// Follows Industrial Brutalist system: no shadows, border-top only, active = top border accent.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type GateTabName = "Dashboard" | "CheckIn" | "History" | "Reports" | "Settings";

export interface GateBottomNavBarProps {
  activeTab: GateTabName;
  onTabPress: (tab: GateTabName) => void;
}

interface TabConfig {
  key: GateTabName;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { key: "Dashboard", label: "DASHBOARD", icon: "▦" },
  { key: "CheckIn", label: "CHECK-IN", icon: "→" },
  { key: "History", label: "HISTORY", icon: "↻" },
  { key: "Reports", label: "REPORTS", icon: "▤" },
  { key: "Settings", label: "SETTINGS", icon: "⚙" },
];

export const GateBottomNavBar: React.FC<GateBottomNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive ? styles.iconActive : styles.iconInactive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  tab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: "#000000",
  },
  icon: {
    fontSize: 20,
  },
  iconActive: {
    color: "#000000",
  },
  iconInactive: {
    color: "#888888",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  labelActive: {
    color: "#000000",
  },
  labelInactive: {
    color: "#888888",
  },
});
