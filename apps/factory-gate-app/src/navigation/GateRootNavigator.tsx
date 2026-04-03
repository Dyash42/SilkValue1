// ─── Gate Root Navigator — Auth ↔ App toggle ─────────────────────────────────

import React, { useState } from "react";
import { GateAuthNavigator } from "./GateAuthNavigator";
import { GateAppNavigator } from "./GateAppNavigator";

export const GateRootNavigator: React.FC = () => {
  // MOCK: Toggle between auth and app.
  // Set to true to jump straight to main app for dashboard review.
  const [isAuthenticated] = useState<boolean>(false);

  if (isAuthenticated) {
    return <GateAppNavigator />;
  }

  return <GateAuthNavigator />;
};
