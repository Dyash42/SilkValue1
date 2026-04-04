// ─── App Stack Navigator ─────────────────────────────────────────────────────
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";

// ── Screen Imports ────────────────────────────────────────────────────────────
import { HomeScreen } from "../screens/main/HomeScreen";
import { RouteMapScreen } from "../screens/main/RouteMapScreen";
import { NavigateToStopScreen } from "../screens/main/NavigateToStopScreen";
import { ArrivedAtStopScreen } from "../screens/main/ArrivedAtStopScreen";
import { QRScanScreen } from "../screens/main/QRScanScreen";
import { CollectionEntryScreen } from "../screens/main/CollectionEntryScreen";
import { CollectionTicketScreen } from "../screens/main/CollectionTicketScreen";
import { TripSheetSummaryScreen } from "../screens/main/TripSheetSummaryScreen";
import { BluetoothSetupScreen } from "../screens/main/BluetoothSetupScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = (): React.JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RouteMap" component={RouteMapScreen} />
      <Stack.Screen name="NavigateToStop" component={NavigateToStopScreen} />
      <Stack.Screen name="ArrivedAtStop" component={ArrivedAtStopScreen} />
      <Stack.Screen name="QRScan" component={QRScanScreen} />
      <Stack.Screen name="CollectionEntry" component={CollectionEntryScreen} />
      <Stack.Screen name="CollectionTicket" component={CollectionTicketScreen} />
      <Stack.Screen name="TripSheetSummary" component={TripSheetSummaryScreen} />
      <Stack.Screen name="BluetoothSetup" component={BluetoothSetupScreen} />
    </Stack.Navigator>
  );
};
