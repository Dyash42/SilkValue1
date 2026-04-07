// ─── Universal Auth Navigator — Login-only stack ─────────────────────────────
// Contains only the UniversalLoginScreen.
// Rendered by SuperRootNavigator when no session is active.

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UniversalLoginScreen } from "../screens/UniversalLoginScreen";

type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const UniversalAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={UniversalLoginScreen} />
    </Stack.Navigator>
  );
};
