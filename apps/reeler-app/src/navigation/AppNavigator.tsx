// ─── App Navigator — Main app with bottom tabs + stack screens ───────────────
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { CollectionDetailScreen } from "../screens/CollectionDetailScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
