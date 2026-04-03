// ─── Silk Value — Reeler App Entry Point ─────────────────────────────────────
// UI Scaffolding Phase — No backend, no sync, no WatermelonDB.
// All data is hardcoded via reelerMockData.ts.

import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}
