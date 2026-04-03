// ─── Gate App Navigator — Stack wrapping tabs + detail/modal screens ─────────

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GateAppStackParamList } from "./types";
import { GateTabNavigator } from "./GateTabNavigator";
import { VehicleCheckInScreen } from "../screens/VehicleCheckInScreen";
import { GateWeighmentScreen } from "../screens/GateWeighmentScreen";
import { QCInspectionScreen } from "../screens/QCInspectionScreen";
import { AcceptanceBreakdownScreen } from "../screens/AcceptanceBreakdownScreen";
import { ProcessCompleteScreen } from "../screens/ProcessCompleteScreen";
import { HistoryDetailScreen } from "../screens/HistoryDetailScreen";

const Stack = createNativeStackNavigator<GateAppStackParamList>();

export const GateAppNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#FFFFFF" },
    }}
  >
    <Stack.Screen name="MainTabs" component={GateTabNavigator} />
    <Stack.Screen name="VehicleCheckIn" component={VehicleCheckInScreen} />
    <Stack.Screen name="GateWeighment" component={GateWeighmentScreen} />
    <Stack.Screen name="QCInspection" component={QCInspectionScreen} />
    <Stack.Screen name="AcceptanceBreakdown" component={AcceptanceBreakdownScreen} />
    <Stack.Screen name="ProcessComplete" component={ProcessCompleteScreen} />
    <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
  </Stack.Navigator>
);
