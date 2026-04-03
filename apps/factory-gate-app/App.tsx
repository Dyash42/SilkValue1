// ─── Silk Value — Factory Gate App Entry Point ───────────────────────────────
// UI Scaffolding Phase — No backend, no sync, no WatermelonDB.

import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { GateRootNavigator } from "./src/navigation/GateRootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <GateRootNavigator />
    </NavigationContainer>
  );
}
