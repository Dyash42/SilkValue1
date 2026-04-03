// ─── Gate Tab Navigator — 5-tab bottom navigation ───────────────────────────

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { GateTabParamList } from "./types";
import { GateDashboardScreen } from "../screens/GateDashboardScreen";
import { VehicleCheckInScreen } from "../screens/VehicleCheckInScreen";
import { HistoryListScreen } from "../screens/HistoryListScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import { GateSettingsScreen } from "../screens/GateSettingsScreen";

const Tab = createBottomTabNavigator<GateTabParamList>();

const tabIcons: Record<string, string> = {
  GateDashboard: "▦",
  VehicleCheckInEntry: "→",
  HistoryList: "↻",
  Reports: "▤",
  GateSettings: "⚙",
};

const tabLabels: Record<string, string> = {
  GateDashboard: "DASHBOARD",
  VehicleCheckInEntry: "CHECK-IN",
  HistoryList: "HISTORY",
  Reports: "REPORTS",
  GateSettings: "SETTINGS",
};

export const GateTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarIconStyle: { marginBottom: 0 },
      tabBarIcon: ({ focused }) => (
        <Text style={[styles.icon, focused ? styles.iconActive : styles.iconInactive]}>
          {tabIcons[route.name]}
        </Text>
      ),
      tabBarLabel: ({ focused }) => (
        <Text style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}>
          {tabLabels[route.name]}
        </Text>
      ),
      tabBarActiveTintColor: "#000000",
      tabBarInactiveTintColor: "#888888",
    })}
  >
    <Tab.Screen name="GateDashboard" component={GateDashboardScreen} />
    <Tab.Screen name="VehicleCheckInEntry" component={VehicleCheckInScreen} />
    <Tab.Screen name="HistoryList" component={HistoryListScreen} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="GateSettings" component={GateSettingsScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
    elevation: 0,
    shadowOpacity: 0,
  },
  icon: {
    fontSize: 22,
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
    letterSpacing: 0.8,
  },
  labelActive: {
    color: "#000000",
  },
  labelInactive: {
    color: "#888888",
  },
});
