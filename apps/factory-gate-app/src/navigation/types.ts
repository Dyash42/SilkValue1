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
  VehicleCheckIn: { vehicleId?: string };
  GateWeighment: { vehicleId: string };
  QCInspection: { vehicleId: string };
  AcceptanceBreakdown: { vehicleId: string };
  ProcessComplete: { vehicleId: string; decision: string };
  HistoryDetail: { entryId: string };
};
