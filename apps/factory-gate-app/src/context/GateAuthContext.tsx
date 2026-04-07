// ─── Gate Auth Context ────────────────────────────────────────────────────────
// Provides the logged-in gate operator's profile to all screens.
// Auth session itself is managed by SuperRootNavigator in silk-value-app.

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import type { OperatorProfile, GateSettings } from "../types";

interface GateAuthContextValue {
  session: Session | null;
  operatorProfile: OperatorProfile | null;
  operatorProfileId: string | null;
  clusterIds: string[];
  isLoading: boolean;
}

const GateAuthContext = createContext<GateAuthContextValue>({
  session: null,
  operatorProfile: null,
  operatorProfileId: null,
  clusterIds: [],
  isLoading: true,
});

export const GateAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile | null>(null);
  const [operatorProfileId, setOperatorProfileId] = useState<string | null>(null);
  const [clusterIds, setClusterIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadProfile(data.session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadProfile(newSession.user.id);
      } else {
        setOperatorProfile(null);
        setOperatorProfileId(null);
        setClusterIds([]);
        setIsLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, employee_id, cluster_id, phone, push_alerts_enabled, sms_alerts_enabled")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setOperatorProfileId(data.id);
        setOperatorProfile({
          name: data.full_name ?? "Gate Operator",
          employeeId: data.employee_id ?? "—",
          factoryUnit: data.cluster_id ?? "—",
          mobileContact: data.phone ?? "—",
        });
        if (data.cluster_id) {
          setClusterIds([data.cluster_id]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GateAuthContext.Provider
      value={{ session, operatorProfile, operatorProfileId, clusterIds, isLoading }}
    >
      {children}
    </GateAuthContext.Provider>
  );
};

export const useGateAuth = () => useContext(GateAuthContext);
