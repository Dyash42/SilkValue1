// ─── Factory Gate App Mock Data ──────────────────────────────────────────────
// Single source of truth. No fetch, no API, no Supabase.

import {
  ExpectedVehicle,
  WeighmentData,
  QCParameter,
  ReelerUnit,
  HistoryEntry,
  DailySummary,
  QualityBreakdown,
  OperatorProfile,
  GateSettings,
} from "../types";

// ── Operator ─────────────────────────────────────────────────────────────────

export const MOCK_OPERATOR: OperatorProfile = {
  name: "J. MILLER",
  employeeId: "#FL-99281",
  factoryUnit: "NORTH TERMINAL - 4",
  mobileContact: "+91 98765 01234",
};

// ── Gate Settings ────────────────────────────────────────────────────────────

export const MOCK_SETTINGS: GateSettings = {
  varianceThreshold: 2.0,
  scaleId: "#FL-GS-09",
  scaleConnected: true,
  lateShipmentWarning: true,
  varianceThresholdTrigger: true,
  qcClearanceRequired: false,
  appVersion: "v2.4.8-STABLE",
  lastSync: "02:14 PM TODAY",
};

// ── Daily Summary ────────────────────────────────────────────────────────────

export const MOCK_DAILY_SUMMARY: DailySummary = {
  totalVehicles: 142,
  totalAccepted: 128,
  totalRejected: 14,
  checkedInToday: 24,
  pendingArrival: 8,
  totalWeightDispatched: 412.5,
  dailyQuotaPercent: 72,
  pendingQCReviews: 12,
};

// ── Quality Breakdown ────────────────────────────────────────────────────────

export const MOCK_QUALITY_BREAKDOWN: QualityBreakdown = {
  gradeA: 84,
  gradeB: 32,
  gradeC: 12,
  rejected: 14,
};

// ── Expected Vehicles ────────────────────────────────────────────────────────

export const MOCK_EXPECTED_VEHICLES: ExpectedVehicle[] = [
  {
    id: "v-001",
    manifestId: "#44291",
    licensePlate: "LP-77-XK9",
    carrier: "LogiLink Freight",
    eta: "09:45",
    reelerStops: "Bay 04, Bay 09",
    reportedWeight: 18450,
    priority: "high",
    vehicleType: "Dry Van",
    status: "expected",
  },
  {
    id: "v-002",
    manifestId: "#44295",
    licensePlate: "TX-02-MM8",
    carrier: "Silver Line Ltd",
    eta: "10:15",
    reelerStops: "Bay 12",
    reportedWeight: 12200,
    priority: "normal",
    vehicleType: "Flatbed",
    status: "expected",
  },
  {
    id: "v-003",
    manifestId: "#44301",
    licensePlate: "TX-9042",
    carrier: "LogiLink Freight",
    eta: "14:30",
    reelerStops: "Bay 02, Bay 07",
    reportedWeight: 22100,
    priority: "high",
    vehicleType: "Container",
    status: "late",
  },
  {
    id: "v-004",
    manifestId: "#44310",
    licensePlate: "GB-1120",
    carrier: "Silver Line Ltd",
    eta: "15:15",
    reelerStops: "Bay 03",
    reportedWeight: 9800,
    priority: "normal",
    vehicleType: "Dry Van",
    status: "checked_in",
  },
  {
    id: "v-005",
    manifestId: "#44312",
    licensePlate: "PN-4431",
    carrier: "Rapid Transit",
    eta: "16:45",
    reelerStops: "Bay 01, Bay 06",
    reportedWeight: 15600,
    priority: "normal",
    vehicleType: "Container",
    status: "expected",
  },
  {
    id: "v-006",
    manifestId: "#44318",
    licensePlate: "KL-2209",
    carrier: "Global Supply Co",
    eta: "17:30",
    reelerStops: "Bay 05",
    reportedWeight: 11400,
    priority: "low",
    vehicleType: "Flatbed",
    status: "expected",
  },
];

// ── Active Weighment ─────────────────────────────────────────────────────────

export const MOCK_WEIGHMENT: WeighmentData = {
  grossWeight: 32450,
  tareWeight: 12100,
  netWeight: 20350,
  fieldEstimate: 18500,
  varianceKg: 1850,
  variancePercent: 10.0,
  exceedsThreshold: true,
};

// ── QC Parameters ────────────────────────────────────────────────────────────

export const MOCK_QC_PARAMETERS: QCParameter[] = [
  { id: "qc-1", name: "Moisture Content", target: "< 8.0%", value: "7.2%", passed: true },
  { id: "qc-2", name: "Chemical Purity", target: "> 94.0%", value: "96.8%", passed: true },
  { id: "qc-3", name: "Foreign Material", target: "Max 0.5%", value: "1.2%", passed: false },
  { id: "qc-4", name: "Visual Grade", target: "—", value: "Grade A", passed: true },
  { id: "qc-5", name: "Smell / Odor Test", target: "—", value: "Neutral", passed: true },
];

// ── Reeler Units for Acceptance ──────────────────────────────────────────────

export const MOCK_REELER_UNITS: ReelerUnit[] = [
  { id: "ru-1", reelerId: "R-801", spec: "120 GSM", weight: 342, status: "accepted" },
  { id: "ru-2", reelerId: "R-802", spec: "120 GSM", weight: 350, status: "accepted" },
  { id: "ru-3", reelerId: "R-803", spec: "125 GSM", weight: 348, status: "accepted" },
  { id: "ru-4", reelerId: "R-804", spec: "120 GSM", weight: 339, status: "accepted" },
  { id: "ru-5", reelerId: "R-811", spec: "120 GSM", weight: 0, status: "rejected", rejectionReason: "Edge Damage (Moisture)" },
  { id: "ru-6", reelerId: "R-812", spec: "125 GSM", weight: 0, status: "rejected", rejectionReason: "GSM Mismatch (>5% Variance)" },
];

// ── History Entries ──────────────────────────────────────────────────────────

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "h-001",
    vehicleId: "VH-9021-TX",
    timestamp: "14:20 • OCT 24",
    collectorName: "Suresh Babu",
    cluster: "North Cluster",
    netWeight: 12450,
    status: "accepted",
    fieldWeight: 12450,
    gateWeight: 12415,
    varianceKg: -35,
    varianceTolerance: true,
    qcParameters: [
      { id: "q1", name: "Moisture Content", target: "< 15%", value: "12.4%", passed: true },
      { id: "q2", name: "Purity Grade", target: "A+", value: "Grade A", passed: true },
      { id: "q3", name: "Foreign Material", target: "< 1%", value: "0.5%", passed: true },
      { id: "q4", name: "Visual Assessment", target: "Optimal", value: "Optimal", passed: true },
      { id: "q5", name: "Spoilage Check", target: "< 0.1%", value: "0.02%", passed: false },
    ],
    qcDecision: "Accepted",
    standardDeduction: 120,
    qualityDeduction: 45,
    notes: "Minor spoilage detected in upper layer of reeler #04. Deducted from overall weight per protocol 4.2.",
    reelerBreakdown: [
      { reelerName: "REELER_01", fieldWeight: 3100, acceptedWeight: 3085, deduction: 15, finalWeight: 3070 },
      { reelerName: "REELER_02", fieldWeight: 3150, acceptedWeight: 3140, deduction: 10, finalWeight: 3130 },
      { reelerName: "REELER_03", fieldWeight: 3050, acceptedWeight: 3040, deduction: 10, finalWeight: 3030 },
      { reelerName: "REELER_04", fieldWeight: 3150, acceptedWeight: 3120, deduction: 30, finalWeight: 3090 },
    ],
  },
  {
    id: "h-002",
    vehicleId: "VH-4482-BR",
    timestamp: "13:45 • OCT 24",
    collectorName: "Venkatesh M",
    cluster: "Central-2 Gate",
    netWeight: 8200,
    status: "deducted",
    fieldWeight: 8500,
    gateWeight: 8200,
    varianceKg: -300,
    varianceTolerance: false,
    qcParameters: [
      { id: "q1", name: "Moisture Content", target: "< 15%", value: "14.8%", passed: true },
      { id: "q2", name: "Purity Grade", target: "A+", value: "Grade B", passed: true },
      { id: "q3", name: "Foreign Material", target: "< 1%", value: "0.8%", passed: true },
      { id: "q4", name: "Visual Assessment", target: "Optimal", value: "Acceptable", passed: true },
    ],
    qcDecision: "Accepted with Deduction",
    standardDeduction: 200,
    qualityDeduction: 100,
    notes: "Moisture slightly elevated. Weight deduction applied.",
    reelerBreakdown: [
      { reelerName: "REELER_05", fieldWeight: 4300, acceptedWeight: 4100, deduction: 200, finalWeight: 3900 },
      { reelerName: "REELER_06", fieldWeight: 4200, acceptedWeight: 4100, deduction: 100, finalWeight: 4000 },
    ],
  },
  {
    id: "h-003",
    vehicleId: "VH-1109-KA",
    timestamp: "12:10 • OCT 24",
    collectorName: "Mahesh H",
    cluster: "East-Highlands",
    netWeight: 0,
    status: "rejected",
    fieldWeight: 5200,
    gateWeight: 0,
    varianceKg: 0,
    varianceTolerance: false,
    qcParameters: [
      { id: "q1", name: "Moisture Content", target: "< 15%", value: "22.1%", passed: false },
      { id: "q2", name: "Foreign Material", target: "< 1%", value: "3.8%", passed: false },
    ],
    qcDecision: "Rejected",
    standardDeduction: 0,
    qualityDeduction: 0,
    notes: "Excessive moisture and foreign material contamination. Full shipment rejected.",
    reelerBreakdown: [],
  },
  {
    id: "h-004",
    vehicleId: "VH-8821-PL",
    timestamp: "11:30 • OCT 24",
    collectorName: "Rajesh Kumar",
    cluster: "South-Dock",
    netWeight: 15670,
    status: "accepted",
    fieldWeight: 15700,
    gateWeight: 15670,
    varianceKg: -30,
    varianceTolerance: true,
    qcParameters: [
      { id: "q1", name: "Moisture Content", target: "< 15%", value: "11.2%", passed: true },
      { id: "q2", name: "Purity Grade", target: "A+", value: "Grade A", passed: true },
      { id: "q3", name: "Foreign Material", target: "< 1%", value: "0.2%", passed: true },
    ],
    qcDecision: "Accepted",
    standardDeduction: 30,
    qualityDeduction: 0,
    notes: "Clean shipment. Minimal variance within tolerance.",
    reelerBreakdown: [
      { reelerName: "REELER_07", fieldWeight: 5300, acceptedWeight: 5290, deduction: 10, finalWeight: 5280 },
      { reelerName: "REELER_08", fieldWeight: 5200, acceptedWeight: 5190, deduction: 10, finalWeight: 5180 },
      { reelerName: "REELER_09", fieldWeight: 5200, acceptedWeight: 5190, deduction: 10, finalWeight: 5180 },
    ],
  },
];
