// ─── Silk Value — Factory Gate App Entry Point ───────────────────────────────
// UI Scaffolding Phase — No backend, no sync, no WatermelonDB.

import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GateRootNavigator } from "./src/navigation/GateRootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <GateRootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
