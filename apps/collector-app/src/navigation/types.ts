// ─── Navigation Type System ──────────────────────────────────────────────────
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";

// ── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
};

// ── App Stack ────────────────────────────────────────────────────────────────
export type AppStackParamList = {
  Home: undefined;
  RouteMap: undefined; // Screen 03 — Route Map View
  // TODO: Add QRScan screen params when QR screen is built
  // TODO: Add CollectionEntry screen params when entry screen is built
  // TODO: Add CollectionTicket screen params when ticket screen is built
  // TODO: Add TripSheet screen params when trip sheet screen is built
  // TODO: Add PastCollections screen params when history screen is built
  // TODO: Add BluetoothSetup screen params when BT screen is built
  // TODO: Add NavigateToStop screen params when nav screen is built
  // TODO: Add ArrivedAtStop screen params when arrival screen is built
};

// ── Root Stack ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

// ── Typed Hooks ──────────────────────────────────────────────────────────────
export function useAppNavigation(): NativeStackNavigationProp<AppStackParamList> {
  return useNavigation<NativeStackNavigationProp<AppStackParamList>>();
}

export function useAuthNavigation(): NativeStackNavigationProp<AuthStackParamList> {
  return useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
}

export function useAppRoute<T extends keyof AppStackParamList>(): RouteProp<AppStackParamList, T> {
  return useRoute<RouteProp<AppStackParamList, T>>();
}
