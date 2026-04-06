// ─── Gate App Navigator — Stack wrapping tabs + detail/modal screens ─────────
// Global header with brutalist back button for all stack screens.

import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { GateAppStackParamList } from "./types";
import { GateTabNavigator } from "./GateTabNavigator";
import { VehicleCheckInScreen } from "../screens/VehicleCheckInScreen";
import { GateWeighmentScreen } from "../screens/GateWeighmentScreen";
import { QCInspectionScreen } from "../screens/QCInspectionScreen";
import { AcceptanceBreakdownScreen } from "../screens/AcceptanceBreakdownScreen";
import { ProcessCompleteScreen } from "../screens/ProcessCompleteScreen";
import { HistoryDetailScreen } from "../screens/HistoryDetailScreen";

const Stack = createNativeStackNavigator<GateAppStackParamList>();

// ── Brutalist header style ──────────────────────────────────────────────────
const screenTitles: Record<string, string> = {
  VehicleCheckIn: "VEHICLE CHECK-IN",
  GateWeighment: "GATE WEIGHMENT",
  QCInspection: "QC INSPECTION",
  AcceptanceBreakdown: "ACCEPTANCE BREAKDOWN",
  ProcessComplete: "PROCESS COMPLETE",
  HistoryDetail: "VEHICLE DETAIL",
};

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000000",
  },
  headerTintColor: "#000000",
  headerBackVisible: false, // We use custom headerLeft
  headerLeft: ({ canGoBack }) =>
    canGoBack ? (
      <TouchableOpacity
        onPress={() => {
          // This gets replaced per-screen by navigation prop
        }}
        activeOpacity={0.7}
        style={styles.backButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
    ) : null,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: "#FFFFFF" },
};

export const GateAppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="MainTabs"
      component={GateTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="VehicleCheckIn"
      component={VehicleCheckInScreen}
      options={({ navigation }) => ({
        title: screenTitles.VehicleCheckIn,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="GateWeighment"
      component={GateWeighmentScreen}
      options={({ navigation }) => ({
        title: screenTitles.GateWeighment,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={styles.liveBadge}>● LIVE SCALE</Text>
        ),
      })}
    />
    <Stack.Screen
      name="QCInspection"
      component={QCInspectionScreen}
      options={({ navigation }) => ({
        title: screenTitles.QCInspection,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="AcceptanceBreakdown"
      component={AcceptanceBreakdownScreen}
      options={({ navigation }) => ({
        title: screenTitles.AcceptanceBreakdown,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="ProcessComplete"
      component={ProcessCompleteScreen}
      options={{
        title: screenTitles.ProcessComplete,
        headerLeft: () => null, // No back on completion — use the CTA buttons
      }}
    />
    <Stack.Screen
      name="HistoryDetail"
      component={HistoryDetailScreen}
      options={({ navigation }) => ({
        title: screenTitles.HistoryDetail,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ),
      })}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "700",
  },
  liveBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
