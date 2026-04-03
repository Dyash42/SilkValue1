// ─── Gate Auth Navigator — Login flow ────────────────────────────────────────

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GateAuthStackParamList } from "./types";
import { GateLoginScreen } from "../screens/GateLoginScreen";

const Stack = createNativeStackNavigator<GateAuthStackParamList>();

export const GateAuthNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#F9F9F9" },
    }}
  >
    <Stack.Screen name="GateLogin" component={GateLoginScreen} />
  </Stack.Navigator>
);
