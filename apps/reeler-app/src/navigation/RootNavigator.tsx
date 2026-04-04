// ─── Root Navigator — Switches between Auth and Main App ─────────────────────
// MOCK: Uses a simple state toggle. In production, this would observe
// an auth session from WatermelonDB/Supabase.

import React, { useState } from "react";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";

export const RootNavigator: React.FC = () => {
  // MOCK: Toggle between auth and app.
  // For UI review, default to showing auth flow.
  const [isAuthenticated] = useState<boolean>(true);

  if (isAuthenticated) {
    return <AppNavigator />;
  }

  return <AuthNavigator />;
};
