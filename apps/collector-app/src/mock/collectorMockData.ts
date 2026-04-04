// ─── Silk Value — Collector App Mock Data ────────────────────────────────────
// Single source of truth for all mock/placeholder data across Screens 03–08.
// No mock data is allowed in individual screen files.
// All data uses realistic Indian silk cocoon collection context.
//
// RULE: Every exported constant has an explicit TypeScript type annotation.

import {
  Grade,
  RouteStatus,
  StopStatus,
  SyncStatus,
  TicketStatus,
  KycStatus,
} from "@silk-value/shared-types";

// ── Helper: today's date in YYYY-MM-DD ───────────────────────────────────────
const today = new Date().toISOString().split("T")[0];

// ── Collector Profile ────────────────────────────────────────────────────────

export interface MockCollectorProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  clusterId: string;
  routeId: string;
  vehicleId: string;
  vehicleRegistration: string;
}

export const MOCK_COLLECTOR_PROFILE: MockCollectorProfile = {
  id: "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
  userId: "u9a8b7c6-d5e4-4f3a-2b1c-0d9e8f7a6b5c",
  fullName: "Rajesh Kumar Sharma",
  phone: "+91 98765 43210",
  clusterId: "cl-001-mysuru-south",
  routeId: "rt-2024-0412-north",
  vehicleId: "vh-ka09-ab1234",
  vehicleRegistration: "KA-09-AB-1234",
};

// ── Today's Route ────────────────────────────────────────────────────────────

export interface MockRoute {
  id: string;
  name: string;
  date: string;
  status: RouteStatus;
  totalStops: number;
  completedStops: number;
  vehicleId: string;
  collectorId: string;
}

export const MOCK_TODAY_ROUTE: MockRoute = {
  id: "rt-2024-0412-north",
  name: "Cluster B — North Loop",
  date: today,
  status: RouteStatus.IN_PROGRESS,
  totalStops: 6,
  completedStops: 2,
  vehicleId: "vh-ka09-ab1234",
  collectorId: "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
};

// ── Route Stops ──────────────────────────────────────────────────────────────

export interface MockRouteStop {
  id: string;
  routeId: string;
  reelerId: string;
  reelerName: string;
  villageName: string;
  stopOrder: number;
  status: StopStatus;
  expectedWeightKg: number;
  distanceFromPrevKm: number;
  estimatedArrivalTime: string;
}

export const MOCK_ROUTE_STOPS: MockRouteStop[] = [
  {
    id: "rs-001",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-001",
    reelerName: "Arun Kumar",
    villageName: "Kengeri Village",
    stopOrder: 1,
    status: StopStatus.COLLECTED,
    expectedWeightKg: 14.5,
    distanceFromPrevKm: 0,
    estimatedArrivalTime: "08:30",
  },
  {
    id: "rs-002",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-002",
    reelerName: "Suresh Patil",
    villageName: "Madanapalli",
    stopOrder: 2,
    status: StopStatus.COLLECTED,
    expectedWeightKg: 12.0,
    distanceFromPrevKm: 3.2,
    estimatedArrivalTime: "09:15",
  },
  {
    id: "rs-003",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-003",
    reelerName: "Venkatesh Gowda",
    villageName: "Hoskote Village",
    stopOrder: 3,
    status: StopStatus.ARRIVED,
    expectedWeightKg: 18.2,
    distanceFromPrevKm: 2.4,
    estimatedArrivalTime: "10:00",
  },
  {
    id: "rs-004",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-004",
    reelerName: "Lakshmi Devi",
    villageName: "Ramanagara",
    stopOrder: 4,
    status: StopStatus.PENDING,
    expectedWeightKg: 22.5,
    distanceFromPrevKm: 4.8,
    estimatedArrivalTime: "10:45",
  },
  {
    id: "rs-005",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-005",
    reelerName: "Manjunath Reddy",
    villageName: "Channapatna",
    stopOrder: 5,
    status: StopStatus.PENDING,
    expectedWeightKg: 9.8,
    distanceFromPrevKm: 6.1,
    estimatedArrivalTime: "11:30",
  },
  {
    id: "rs-006",
    routeId: "rt-2024-0412-north",
    reelerId: "rl-006",
    reelerName: "Nagaraj Shetty",
    villageName: "Sidlaghatta",
    stopOrder: 6,
    status: StopStatus.SKIPPED,
    expectedWeightKg: 15.0,
    distanceFromPrevKm: 5.5,
    estimatedArrivalTime: "12:15",
  },
];

// ── Scanned Reeler (after QR scan success) ───────────────────────────────────

export interface MockScannedReeler {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  taluk: string;
  district: string;
  kycStatus: KycStatus;
  qrCodeHash: string;
  lastCollectionDate: string;
  lastCollectionWeightKg: number;
  totalCollectionsCount: number;
  profilePhotoInitials: string;
}

export const MOCK_SCANNED_REELER: MockScannedReeler = {
  id: "rl-003",
  fullName: "Venkatesh Gowda",
  phone: "+91 94823 67150",
  village: "Hoskote Village",
  taluk: "Hoskote",
  district: "Bangalore Rural",
  kycStatus: KycStatus.VERIFIED,
  qrCodeHash: "sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  lastCollectionDate: "2024-04-08",
  lastCollectionWeightKg: 16.8,
  totalCollectionsCount: 47,
  profilePhotoInitials: "VG",
};

// ── Collection Entry (pre-filled form state) ─────────────────────────────────

export interface MockCollectionEntry {
  reelerId: string;
  reelerName: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  crateCount: number;
  grade: Grade;
  pricePerKg: number;
  totalAmount: number;
  moisturePct: number | null;
  notes: string;
  scaleReadingKg: number;
  scaleConnected: boolean;
  scaleDeviceName: string;
}

export const MOCK_COLLECTION_ENTRY: MockCollectionEntry = {
  reelerId: "rl-003",
  reelerName: "Venkatesh Gowda",
  grossWeightKg: 18.4,
  tareWeightKg: 2.1,
  netWeightKg: 16.3,
  crateCount: 3,
  grade: Grade.A,
  pricePerKg: 185,
  totalAmount: 3015.5,
  moisturePct: 12.4,
  notes: "Good batch, slight moisture",
  scaleReadingKg: 18.4,
  scaleConnected: true,
  scaleDeviceName: "KERN PCB 600",
};

// ── Collection Ticket (generated receipt) ────────────────────────────────────

export interface MockCollectionTicket {
  ticketNumber: string;
  routeId: string;
  routeStopId: string;
  reelerId: string;
  reelerName: string;
  village: string;
  collectorId: string;
  collectorName: string;
  vehicleId: string;
  vehicleRegistration: string;
  grade: Grade;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  crateCount: number;
  pricePerKg: number;
  totalAmount: number;
  moisturePct: number | null;
  notes: string;
  gpsLat: number;
  gpsLng: number;
  collectedAt: string;
  syncStatus: SyncStatus;
  status: TicketStatus;
}

export const MOCK_COLLECTION_TICKET: MockCollectionTicket = {
  ticketNumber: "TKT-2024-0847",
  routeId: "rt-2024-0412-north",
  routeStopId: "rs-003",
  reelerId: "rl-003",
  reelerName: "Venkatesh Gowda",
  village: "Hoskote Village",
  collectorId: "c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
  collectorName: "Rajesh Kumar Sharma",
  vehicleId: "vh-ka09-ab1234",
  vehicleRegistration: "KA-09-AB-1234",
  grade: Grade.A,
  grossWeightKg: 18.4,
  tareWeightKg: 2.1,
  netWeightKg: 16.3,
  crateCount: 3,
  pricePerKg: 185,
  totalAmount: 3015.5,
  moisturePct: 12.4,
  notes: "Good batch, slight moisture",
  gpsLat: 13.0632,
  gpsLng: 77.7866,
  collectedAt: new Date().toISOString(),
  syncStatus: SyncStatus.CREATED,
  status: TicketStatus.CONFIRMED,
};

// ── Trip Summary (vehicle-level aggregation) ─────────────────────────────────

export interface MockTripTicket {
  ticketNumber: string;
  reelerName: string;
  village: string;
  netWeightKg: number;
  grade: Grade;
  totalAmount: number;
  syncStatus: SyncStatus;
}

export interface MockGradeSummary {
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  reject: number;
}

export interface MockGradeWeightSummary {
  grade: string;
  count: number;
  totalKg: number;
  totalAmount: number;
}

export interface MockTripSummary {
  routeId: string;
  routeName: string;
  vehicleRegistration: string;
  date: string;
  totalStops: number;
  completedStops: number;
  skippedStops: number;
  remainingStops: number;
  totalGrossWeightKg: number;
  totalTareWeightKg: number;
  totalNetWeightKg: number;
  totalCrates: number;
  totalAmount: number;
  tickets: MockTripTicket[];
  gradeSummary: MockGradeSummary;
  gradeBreakdown: MockGradeWeightSummary[];
  syncedTickets: number;
  unsyncedTickets: number;
}

export const MOCK_TRIP_SUMMARY: MockTripSummary = {
  routeId: "rt-2024-0412-north",
  routeName: "Cluster B — North Loop",
  vehicleRegistration: "KA-09-AB-1234",
  date: today,
  totalStops: 6,
  completedStops: 4,
  skippedStops: 1,
  remainingStops: 1,
  totalGrossWeightKg: 72.6,
  totalTareWeightKg: 8.4,
  totalNetWeightKg: 64.2,
  totalCrates: 12,
  totalAmount: 11877.0,
  tickets: [
    {
      ticketNumber: "TKT-2024-0845",
      reelerName: "Arun Kumar",
      village: "Kengeri Village",
      netWeightKg: 12.5,
      grade: Grade.A,
      totalAmount: 2312.5,
      syncStatus: SyncStatus.SYNCED,
    },
    {
      ticketNumber: "TKT-2024-0846",
      reelerName: "Suresh Patil",
      village: "Madanapalli",
      netWeightKg: 10.8,
      grade: Grade.B,
      totalAmount: 1620.0,
      syncStatus: SyncStatus.SYNCED,
    },
    {
      ticketNumber: "TKT-2024-0847",
      reelerName: "Venkatesh Gowda",
      village: "Hoskote Village",
      netWeightKg: 16.3,
      grade: Grade.A,
      totalAmount: 3015.5,
      syncStatus: SyncStatus.CREATED,
    },
    {
      ticketNumber: "TKT-2024-0848",
      reelerName: "Lakshmi Devi",
      village: "Ramanagara",
      netWeightKg: 24.6,
      grade: Grade.C,
      totalAmount: 4929.0,
      syncStatus: SyncStatus.CREATED,
    },
  ],
  gradeSummary: {
    gradeA: 2,
    gradeB: 1,
    gradeC: 1,
    gradeD: 0,
    reject: 0,
  },
  gradeBreakdown: [
    { grade: "Grade A", count: 2, totalKg: 28.8, totalAmount: 5328.0 },
    { grade: "Grade B", count: 1, totalKg: 10.8, totalAmount: 1620.0 },
    { grade: "Grade C", count: 1, totalKg: 24.6, totalAmount: 4929.0 },
  ],
  syncedTickets: 2,
  unsyncedTickets: 2,
};

// ── Bluetooth Devices ────────────────────────────────────────────────────────

export interface MockBluetoothDevice {
  id: string;
  name: string;
  macAddress: string;
  signalStrength: number;
  isPaired: boolean;
}

export const MOCK_BLUETOOTH_DEVICES: MockBluetoothDevice[] = [
  {
    id: "bt-001",
    name: "KERN PCB 600",
    macAddress: "A4:C1:38:9B:22:01",
    signalStrength: -42,
    isPaired: true,
  },
  {
    id: "bt-002",
    name: "OHAUS Scout STX",
    macAddress: "B8:27:EB:4D:11:F3",
    signalStrength: -65,
    isPaired: false,
  },
  {
    id: "bt-003",
    name: "CAS SW-1S",
    macAddress: "C0:E4:34:7A:88:DE",
    signalStrength: -78,
    isPaired: false,
  },
];

// ── Scale State ──────────────────────────────────────────────────────────────

export interface MockScaleState {
  deviceName: string;
  macAddress: string;
  isConnected: boolean;
  batteryPercent: number;
  lastReadingKg: number;
  isStable: boolean;
  isTared: boolean;
}

export const MOCK_SCALE_STATE: MockScaleState = {
  deviceName: "KERN PCB 600",
  macAddress: "A4:C1:38:9B:22:01",
  isConnected: true,
  batteryPercent: 82,
  lastReadingKg: 18.4,
  isStable: true,
  isTared: false,
};

// ── Skip Reasons ─────────────────────────────────────────────────────────────

export const SKIP_REASONS: string[] = [
  "Reeler absent",
  "No stock available",
  "Road inaccessible",
  "Other",
];
