// ─── Factory Gate App Types ──────────────────────────────────────────────────

export type VehicleStatus = "expected" | "late" | "checked_in" | "weighing" | "qc" | "accepted" | "deducted" | "rejected";

export interface ExpectedVehicle {
  id: string;
  manifestId: string;
  licensePlate: string;
  carrier: string;
  eta: string;
  reelerStops: string;
  reportedWeight: number;
  priority: "high" | "normal" | "low";
  vehicleType: string;
  status: VehicleStatus;
}

export interface WeighmentData {
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  fieldEstimate: number;
  varianceKg: number;
  variancePercent: number;
  exceedsThreshold: boolean;
  vehiclePlate: string;
  driverName: string;
}

export interface QCParameter {
  id: string;
  name: string;
  target: string;
  value: string;
  passed: boolean;
}

export interface ReelerUnit {
  id: string;
  reelerId: string;
  spec: string;
  weight: number;
  status: "accepted" | "rejected";
  rejectionReason?: string;
}

export interface HistoryEntry {
  id: string;
  vehicleId: string;
  timestamp: string;
  collectorName: string;
  cluster: string;
  netWeight: number;
  status: "accepted" | "deducted" | "rejected";
  fieldWeight: number;
  gateWeight: number;
  varianceKg: number;
  varianceTolerance: boolean;
  qcParameters: QCParameter[];
  qcDecision: string;
  standardDeduction: number;
  qualityDeduction: number;
  notes: string;
  reelerBreakdown: ReelerBreakdownRow[];
}

export interface ReelerBreakdownRow {
  reelerName: string;
  fieldWeight: number;
  acceptedWeight: number;
  deduction: number;
  finalWeight: number;
}

export interface DailySummary {
  totalVehicles: number;
  totalAccepted: number;
  totalRejected: number;
  checkedInToday: number;
  pendingArrival: number;
  totalWeightDispatched: number;
  dailyQuotaPercent: number;
  pendingQCReviews: number;
}

export interface QualityBreakdown {
  gradeA: number;
  gradeB: number;
  gradeC: number;
  rejected: number;
}

export interface OperatorProfile {
  name: string;
  employeeId: string;
  factoryUnit: string;
  mobileContact: string;
}

export interface GateSettings {
  varianceThreshold: number;
  scaleId: string;
  scaleConnected: boolean;
  lateShipmentWarning: boolean;
  varianceThresholdTrigger: boolean;
  qcClearanceRequired: boolean;
  appVersion: string;
  lastSync: string;
}
