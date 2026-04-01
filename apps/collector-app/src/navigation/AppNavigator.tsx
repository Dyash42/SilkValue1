// ─── App Stack Navigator ─────────────────────────────────────────────────────
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";
import { HomeScreen } from "../screens/main/HomeScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = (): React.JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
