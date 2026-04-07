// ─── Factory Gate App Navigation Types ───────────────────────────────────────

export type GateAuthStackParamList = {
  GateLogin: undefined;
};

export type GateTabParamList = {
  GateDashboard: undefined;
  VehicleCheckInEntry: undefined;
  HistoryList: undefined;
  Reports: undefined;
  GateSettings: undefined;
};

export type GateAppStackParamList = {
  MainTabs: undefined;
  VehicleCheckIn: { gateEntryId?: string };
  GateWeighment: { gateEntryId: string };
  QCInspection: { gateEntryId: string };
  AcceptanceBreakdown: { gateEntryId: string; qcDecision: string };
  ProcessComplete: { gateEntryId: string; decision: string };
  HistoryDetail: { entryId: string };
};
