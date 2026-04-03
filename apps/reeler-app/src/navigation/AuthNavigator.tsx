// ─── Auth Navigator — Login / OTP / KYC flow ────────────────────────────────
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { LanguageSelectionScreen } from "../screens/LanguageSelectionScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { OtpVerificationScreen } from "../screens/OtpVerificationScreen";
import { KycSubmissionScreen } from "../screens/KycSubmissionScreen";
import { AccountStatusScreen } from "../screens/AccountStatusScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LanguageSelection"
    >
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerificationScreen} />
      <Stack.Screen name="KycSubmission" component={KycSubmissionScreen} />
      <Stack.Screen name="AccountStatus" component={AccountStatusScreen} />
    </Stack.Navigator>
  );
};
