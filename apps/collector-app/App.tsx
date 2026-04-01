// ─── Silk Value — Collector App Entry Point ──────────────────────────────────
// react-native-screens must be imported and enabled before anything else
import 'react-native-url-polyfill/auto';
import "react-native-screens";
import { enableScreens } from "react-native-screens";
enableScreens();

import React from "react";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/navigation/RootNavigator";

import { registerRootComponent } from 'expo';

export default function App(): React.JSX.Element {
  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}
