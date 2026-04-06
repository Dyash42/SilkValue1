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
  RouteMap: undefined;
  NavigateToStop: { stopId: string; stopOrder: number; reelerName: string; villageName: string; expectedWeightKg: number; distanceKm: number };
  ArrivedAtStop: { stopId: string; reelerName: string; villageName: string; expectedWeightKg: number };
  QRScan: { stopId: string };
  CollectionEntry: { stopId: string; reelerId: string; reelerName: string; villageName: string };
  CollectionTicket: { ticketId: string };
  TripSheetSummary: undefined;
  BluetoothSetup: undefined;
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
