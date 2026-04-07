// ─── SuperRootNavigator — The Security Core ──────────────────────────────────
// This is the entire security model for Silk Value.
//
// 1. Listens to Supabase auth state (getSession + onAuthStateChange)
// 2. When a session exists, queries profiles.role to determine user type
// 3. Uses React.lazy + Suspense for code-splitting: a farmer's device
//    never evaluates the factory gate JavaScript bundle
// 4. Renders a full-screen loader while determining state
// 5. Signs out if role is unrecognised or query fails

import React, { useEffect, useState, Suspense } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import type { Session } from "@supabase/supabase-js";
import { Role } from "@silk-value/shared-types";
import { theme } from "@silk-value/ui";
import { supabase } from "../config/supabaseClient";
import { UniversalAuthNavigator } from "./UniversalAuthNavigator";

// ── Lazy-loaded role-specific navigators ──────────────────────────────────────
// React.lazy ensures each app's bundle is only evaluated when actually needed.
// This provides physical memory isolation: a reeler's device never loads gate code.

const ReelerAppNavigator = React.lazy(
  () =>
    import("@silk-value/reeler-app/src/navigation/AppNavigator").then(
      (mod) => ({ default: mod.AppNavigator })
    )
);

const CollectorAppNavigator = React.lazy(
  () =>
    import("@silk-value/collector-app/src/navigation/AppNavigator").then(
      (mod) => ({ default: mod.AppNavigator })
    )
);

const GateAppNavigator = React.lazy(
  () =>
    import(
      "@silk-value/factory-gate-app/src/navigation/GateAppNavigator"
    ).then((mod) => ({ default: mod.GateAppNavigator }))
);

// ── Recognised roles that map to a navigator ─────────────────────────────────
const VALID_ROLES = new Set<string>([
  Role.REELER,
  Role.COLLECTOR,
  Role.GATE_OPERATOR,
]);

// ── Loading fallback used by Suspense ────────────────────────────────────────
const LoadingFallback: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

// ─── Component ───────────────────────────────────────────────────────────────
export const SuperRootNavigator: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── Fetch role from profiles table ───────────────────────────────────────
  const fetchUserRole = async (userId: string): Promise<Role | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (error || !data?.role) {
        console.error("Profile role fetch failed:", error?.message);
        return null;
      }

      const role = data.role as string;
      if (!VALID_ROLES.has(role)) {
        console.error("Unrecognised role:", role);
        return null;
      }

      return role as Role;
    } catch (err) {
      console.error("Profile query exception:", err);
      return null;
    }
  };

  // ── Auth state management ────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    // 1. Retrieve any persisted session on cold start
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!isMounted) return;

      if (currentSession) {
        setSession(currentSession);
        const role = await fetchUserRole(currentSession.user.id);

        if (!isMounted) return;

        if (role) {
          setUserRole(role);
        } else {
          // Unrecognised or missing role — sign out for safety
          await supabase.auth.signOut();
          setSession(null);
          setUserRole(null);
        }
      }

      setIsLoading(false);
    };

    initSession();

    // 2. Subscribe to auth state changes (login, logout, token refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!isMounted) return;

        if (newSession) {
          setSession(newSession);
          setIsLoading(true);

          const role = await fetchUserRole(newSession.user.id);

          if (!isMounted) return;

          if (role) {
            setUserRole(role);
          } else {
            // Unrecognised or missing role — force sign out
            await supabase.auth.signOut();
            setSession(null);
            setUserRole(null);
          }

          setIsLoading(false);
        } else {
          // Logged out
          setSession(null);
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    // 3. Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ── Loading State — prevents flash of wrong content ──────────────────────
  if (isLoading) {
    return <LoadingFallback />;
  }

  // ── No session or no role → Auth flow ────────────────────────────────────
  if (!session || !userRole) {
    return <UniversalAuthNavigator />;
  }

  // ── Role-based navigator mount ──────────────────────────────────────────
  return (
    <Suspense fallback={<LoadingFallback />}>
      {userRole === Role.REELER && <ReelerAppNavigator />}
      {userRole === Role.COLLECTOR && <CollectorAppNavigator />}
      {userRole === Role.GATE_OPERATOR && <GateAppNavigator />}
    </Suspense>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
