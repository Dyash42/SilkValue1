// ─── Tab Navigator — Bottom tab bar for main app ─────────────────────────────
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { AppTabParamList } from "./types";
import { HomeDashboardScreen } from "../screens/HomeDashboardScreen";
import { CollectionHistoryScreen } from "../screens/CollectionHistoryScreen";
import { PaymentsScreen } from "../screens/PaymentsScreen";
import { ProfileSettingsScreen } from "../screens/ProfileSettingsScreen";
import { theme } from "@silk-value/ui";

const Tab = createBottomTabNavigator<AppTabParamList>();

interface TabIconProps {
  label: string;
  icon: string;
  activeIcon: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ label, icon, activeIcon, focused }) => (
  <View style={tabStyles.tabItem}>
    <Text style={[tabStyles.icon, { color: focused ? "#000000" : "#AAAAAA" }]}>
      {focused ? activeIcon : icon}
    </Text>
    <Text
      style={[
        tabStyles.label,
        {
          color: focused ? "#000000" : "#AAAAAA",
          fontWeight: focused ? "700" : "400",
        },
      ]}
    >
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 2,
          borderTopColor: "#000000",
          height: 64,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" icon="⌂" activeIcon="⌂" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CollectionsTab"
        component={CollectionHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Collections" icon="☐" activeIcon="☒" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Payments" icon="⊡" activeIcon="⊞" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileSettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" icon="○" activeIcon="●" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
