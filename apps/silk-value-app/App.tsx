// ─── Silk Value — Unified App Entry Point ────────────────────────────────────
// NavigationContainer + SafeAreaProvider wrap the SuperRootNavigator.
// This is the only top-level component — everything else is delegated.

import "react-native-url-polyfill/auto";
import "react-native-screens";
import { enableScreens } from "react-native-screens";
enableScreens();

import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SuperRootNavigator } from "./src/navigation/SuperRootNavigator";

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <SuperRootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
