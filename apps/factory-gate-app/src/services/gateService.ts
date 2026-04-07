// ─── Gate Service — All Supabase queries and mutations ───────────────────────
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@silk-value/shared-types";
import type {
  DailySummary,
  ExpectedVehicle,
  WeighmentData,
  QCParameter,
  ReelerUnit,
  HistoryEntry,
  QualityBreakdown,
  GateSettings,
  VehicleStatus,
} from "../types";

type Client = SupabaseClient<Database>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function startOfDay(dateStr: string): string {
  return `${dateStr}T00:00:00.000Z`;
}

function endOfDay(dateStr: string): string {
  return `${dateStr}T23:59:59.999Z`;
}

/** Map qc_status from DB to VehicleStatus enum */
function mapQcStatus(qcStatus: string | null): VehicleStatus {
  switch (qcStatus) {
    case "pending": return "expected";
    case "weighing": return "weighing";
    case "qc": return "qc";
    case "accepted": return "accepted";
    case "deducted": return "deducted";
    case "rejected": return "rejected";
    case "late": return "late";
    case "checked_in": return "checked_in";
    default: return "expected";
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function fetchDailySummary(
  supabase: Client,
  clusterIds: string[],
  date: string = todayISO()
): Promise<DailySummary> {
  // Get all gate entries for today (via routes that belong to the cluster)
  const { data: entries } = await supabase
    .from("gate_entries")
    .select("id, qc_status, gate_net_weight, created_at, route_id")
    .gte("created_at", startOfDay(date))
    .lte("created_at", endOfDay(date));

  const all = entries ?? [];
  const totalVehicles = all.length;
  const totalAccepted = all.filter(e => e.qc_status === "accepted" || e.qc_status === "deducted").length;
  const totalRejected = all.filter(e => e.qc_status === "rejected").length;
  const checkedInToday = all.filter(e => e.qc_status === "checked_in" || e.qc_status === "weighing" || e.qc_status === "qc").length;
  const pendingArrival = all.filter(e => e.qc_status === "pending" || e.qc_status === "expected" || !e.qc_status).length;
  const totalWeightDispatched = all
    .filter(e => e.qc_status === "accepted" || e.qc_status === "deducted")
    .reduce((sum, e) => sum + (e.gate_net_weight ?? 0), 0);
  const pendingQCReviews = all.filter(e => e.qc_status === "qc").length;

  return {
    totalVehicles,
    totalAccepted,
    totalRejected,
    checkedInToday,
    pendingArrival,
    totalWeightDispatched: totalWeightDispatched / 1000, // KG → MT
    dailyQuotaPercent: totalVehicles > 0 ? Math.round((totalAccepted / totalVehicles) * 100) : 0,
    pendingQCReviews,
  };
}

export async function fetchExpectedVehicles(
  supabase: Client,
  _clusterIds: string[],
  date: string = todayISO()
): Promise<ExpectedVehicle[]> {
  const { data: entries, error } = await supabase
    .from("gate_entries")
    .select(`
      id,
      qc_status,
      expected_arrival_time,
      actual_arrival_time,
      weight_variance,
      route_id,
      vehicles ( id, registration_number, vehicle_type, driver_name ),
      routes ( id, name, collector_id, cluster_id )
    `)
    .gte("expected_arrival_time", startOfDay(date))
    .lte("expected_arrival_time", endOfDay(date))
    .order("expected_arrival_time", { ascending: true });

  if (error || !entries) return [];

  // For each entry, get total reported weight from collection_tickets
  const results: ExpectedVehicle[] = await Promise.all(
    entries.map(async (entry) => {
      const vehicle = Array.isArray(entry.vehicles) ? entry.vehicles[0] : entry.vehicles;
      const route = Array.isArray(entry.routes) ? entry.routes[0] : entry.routes;

      // Count reeler stops
      let reelerStops = "0";
      let reportedWeight = 0;
      if (entry.route_id) {
        const { data: tickets } = await supabase
          .from("collection_tickets")
          .select("net_weight_kg, reeler_id")
          .eq("route_id", entry.route_id);

        if (tickets) {
          reportedWeight = tickets.reduce((sum, t) => sum + (t.net_weight_kg ?? 0), 0);
          const uniqueReelers = new Set(tickets.map(t => t.reeler_id)).size;
          reelerStops = String(uniqueReelers);
        }
      }

      const etaDate = entry.expected_arrival_time
        ? new Date(entry.expected_arrival_time)
        : null;
      const etaStr = etaDate
        ? etaDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        : "—";

      const isLate =
        entry.qc_status === "pending" &&
        etaDate &&
        etaDate < new Date();

      return {
        id: entry.id,
        manifestId: entry.route_id ?? entry.id,
        licensePlate: vehicle?.registration_number ?? "UNKNOWN",
        carrier: vehicle?.driver_name ?? "Unknown Driver",
        eta: etaStr,
        reelerStops,
        reportedWeight,
        priority: "normal" as const,
        vehicleType: vehicle?.vehicle_type ?? "Truck",
        status: isLate ? "late" : mapQcStatus(entry.qc_status),
      };
    })
  );

  return results;
}

// ── Check-In ──────────────────────────────────────────────────────────────────

export async function checkInVehicle(
  supabase: Client,
  gateEntryId: string
): Promise<void> {
  await supabase
    .from("gate_entries")
    .update({
      qc_status: "checked_in",
      actual_arrival_time: new Date().toISOString(),
    })
    .eq("id", gateEntryId);
}

// ── Weighment ─────────────────────────────────────────────────────────────────

export async function fetchWeighmentData(
  supabase: Client,
  gateEntryId: string,
  varianceTolerancePercent: number = 5
): Promise<WeighmentData> {
  const { data: entry } = await supabase
    .from("gate_entries")
    .select("gate_gross_weight, gate_tare_weight, gate_net_weight, weight_variance, route_id, vehicle_id")
    .eq("id", gateEntryId)
    .single();

  const gross = entry?.gate_gross_weight ?? 0;
  const tare = entry?.gate_tare_weight ?? 0;
  const net = entry?.gate_net_weight ?? gross - tare;

  // Get vehicle info
  let vehiclePlate = "—";
  let driverName = "—";
  if (entry?.vehicle_id) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("registration_number, driver_name")
      .eq("id", entry.vehicle_id)
      .single();
    vehiclePlate = vehicle?.registration_number ?? "—";
    driverName = vehicle?.driver_name ?? "—";
  }

  // Get field estimate from collection tickets
  let fieldEstimate = 0;
  if (entry?.route_id) {
    const { data: tickets } = await supabase
      .from("collection_tickets")
      .select("net_weight_kg")
      .eq("route_id", entry.route_id);
    fieldEstimate = (tickets ?? []).reduce((sum, t) => sum + (t.net_weight_kg ?? 0), 0);
  }

  const varianceKg = net - fieldEstimate;
  const variancePercent = fieldEstimate > 0
    ? Math.abs((varianceKg / fieldEstimate) * 100)
    : 0;

  return {
    grossWeight: gross,
    tareWeight: tare,
    netWeight: net,
    fieldEstimate,
    varianceKg,
    variancePercent: Math.round(variancePercent * 10) / 10,
    exceedsThreshold: variancePercent > varianceTolerancePercent,
    vehiclePlate,
    driverName,
  };
}

export async function saveWeighment(
  supabase: Client,
  gateEntryId: string,
  grossWeight: number,
  tareWeight: number,
  comment: string
): Promise<void> {
  const netWeight = grossWeight - tareWeight;
  await supabase
    .from("gate_entries")
    .update({
      gate_gross_weight: grossWeight,
      gate_tare_weight: tareWeight,
      gate_net_weight: netWeight,
      weight_variance: netWeight,
      variance_notes: comment || null,
      qc_status: "weighing",
    })
    .eq("id", gateEntryId);
}

// ── QC Inspection ─────────────────────────────────────────────────────────────

export async function fetchQCParameters(
  supabase: Client,
  gateEntryId: string
): Promise<QCParameter[]> {
  const { data: entry } = await supabase
    .from("gate_entries")
    .select("qc_moisture_percent, qc_spoilage_percent, qc_foreign_material_percent")
    .eq("id", gateEntryId)
    .single();

  const moisture = entry?.qc_moisture_percent ?? null;
  const spoilage = entry?.qc_spoilage_percent ?? null;
  const foreign = entry?.qc_foreign_material_percent ?? null;

  return [
    {
      id: "moisture",
      name: "Moisture Content",
      target: "≤ 12%",
      value: moisture !== null ? `${moisture}%` : "—",
      passed: moisture !== null ? moisture <= 12 : true,
    },
    {
      id: "spoilage",
      name: "Spoilage / Contamination",
      target: "≤ 2%",
      value: spoilage !== null ? `${spoilage}%` : "—",
      passed: spoilage !== null ? spoilage <= 2 : true,
    },
    {
      id: "foreign",
      name: "Foreign Material",
      target: "≤ 1%",
      value: foreign !== null ? `${foreign}%` : "—",
      passed: foreign !== null ? foreign <= 1 : true,
    },
    {
      id: "visual",
      name: "Visual Grade",
      target: "Grade A/B",
      value: "Grade A",
      passed: true,
    },
    {
      id: "smell",
      name: "Smell Test",
      target: "Pass",
      value: "Pass",
      passed: true,
    },
  ];
}

export async function saveQCDecision(
  supabase: Client,
  gateEntryId: string,
  status: string,
  deductionWeight: number,
  moisturePercent?: number,
  spoilagePercent?: number,
  foreignMaterialPercent?: number
): Promise<void> {
  await supabase
    .from("gate_entries")
    .update({
      qc_status: status,
      factory_deduction_weight: deductionWeight > 0 ? deductionWeight : null,
      qc_moisture_percent: moisturePercent ?? null,
      qc_spoilage_percent: spoilagePercent ?? null,
      qc_foreign_material_percent: foreignMaterialPercent ?? null,
    })
    .eq("id", gateEntryId);
}

// ── Acceptance Breakdown ──────────────────────────────────────────────────────

export async function fetchReelerUnits(
  supabase: Client,
  gateEntryId: string
): Promise<ReelerUnit[]> {
  // Get route_id from gate entry
  const { data: entry } = await supabase
    .from("gate_entries")
    .select("route_id, qc_status, factory_deduction_weight")
    .eq("id", gateEntryId)
    .single();

  if (!entry?.route_id) return [];

  const { data: tickets } = await supabase
    .from("collection_tickets")
    .select("id, reeler_id, grade, net_weight_kg, factory_accepted_weight, factory_rejection_reason, status, reelers(full_name)")
    .eq("route_id", entry.route_id);

  if (!tickets) return [];

  return tickets.map((ticket) => {
    const isRejected = !!ticket.factory_rejection_reason || ticket.status === "void";
    const reelerName = Array.isArray(ticket.reelers)
      ? ticket.reelers[0]?.full_name
      : (ticket.reelers as any)?.full_name;

    return {
      id: ticket.id,
      reelerId: reelerName ?? ticket.reeler_id ?? "Unknown",
      spec: ticket.grade ? `Grade ${ticket.grade}` : "—",
      weight: ticket.factory_accepted_weight ?? ticket.net_weight_kg ?? 0,
      status: isRejected ? "rejected" : "accepted",
      rejectionReason: ticket.factory_rejection_reason ?? undefined,
    };
  });
}

export async function saveAcceptanceBreakdown(
  supabase: Client,
  gateEntryId: string,
  finalDecision: string
): Promise<void> {
  await supabase
    .from("gate_entries")
    .update({ qc_status: finalDecision })
    .eq("id", gateEntryId);
}

// ── History ───────────────────────────────────────────────────────────────────

export async function fetchHistoryList(
  supabase: Client,
  filter: "Today" | "This Week" | "Custom Date" = "Today"
): Promise<HistoryEntry[]> {
  const today = todayISO();
  let startDate: string;

  if (filter === "Today") {
    startDate = startOfDay(today);
  } else if (filter === "This Week") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    startDate = startOfDay(d.toISOString().split("T")[0]);
  } else {
    startDate = startOfDay(today);
  }

  const { data: entries } = await supabase
    .from("gate_entries")
    .select(`
      id,
      qc_status,
      gate_net_weight,
      gate_gross_weight,
      gate_tare_weight,
      weight_variance,
      factory_deduction_weight,
      variance_notes,
      created_at,
      route_id,
      vehicles ( registration_number ),
      routes ( name, collector_id, cluster_id, profiles:collector_id ( full_name ), clusters:cluster_id ( name ) )
    `)
    .gte("created_at", startDate)
    .order("created_at", { ascending: false });

  if (!entries) return [];

  return entries.map((entry) => {
    const vehicle = Array.isArray(entry.vehicles) ? entry.vehicles[0] : entry.vehicles;
    const route = Array.isArray(entry.routes) ? entry.routes[0] : entry.routes;
    const profile = route && Array.isArray((route as any).profiles) ? (route as any).profiles[0] : (route as any)?.profiles;
    const cluster = route && Array.isArray((route as any).clusters) ? (route as any).clusters[0] : (route as any)?.clusters;

    const net = entry.gate_net_weight ?? 0;
    const gross = entry.gate_gross_weight ?? net;
    const variance = entry.weight_variance ?? 0;
    const deduction = entry.factory_deduction_weight ?? 0;

    const status: HistoryEntry["status"] =
      entry.qc_status === "rejected"
        ? "rejected"
        : deduction > 0
        ? "deducted"
        : "accepted";

    return {
      id: entry.id,
      vehicleId: vehicle?.registration_number ?? entry.id.slice(0, 8).toUpperCase(),
      timestamp: entry.created_at
        ? new Date(entry.created_at).toLocaleString("en-IN")
        : "—",
      collectorName: profile?.full_name ?? "Unknown",
      cluster: cluster?.name ?? "—",
      netWeight: net,
      status,
      fieldWeight: gross,
      gateWeight: gross,
      varianceKg: variance,
      varianceTolerance: Math.abs(variance) <= gross * 0.05,
      qcParameters: [],
      qcDecision: entry.qc_status ?? "—",
      standardDeduction: 0,
      qualityDeduction: deduction,
      notes: entry.variance_notes ?? "",
      reelerBreakdown: [],
    };
  });
}

export async function fetchHistoryDetail(
  supabase: Client,
  gateEntryId: string
): Promise<HistoryEntry | null> {
  const { data: entry } = await supabase
    .from("gate_entries")
    .select(`
      id,
      qc_status,
      gate_net_weight,
      gate_gross_weight,
      gate_tare_weight,
      weight_variance,
      factory_deduction_weight,
      variance_notes,
      qc_moisture_percent,
      qc_spoilage_percent,
      qc_foreign_material_percent,
      created_at,
      route_id,
      vehicles ( registration_number, vehicle_type, driver_name ),
      routes ( name, collector_id, cluster_id, profiles:collector_id ( full_name ), clusters:cluster_id ( name ) )
    `)
    .eq("id", gateEntryId)
    .single();

  if (!entry) return null;

  const vehicle = Array.isArray(entry.vehicles) ? entry.vehicles[0] : entry.vehicles;
  const route = Array.isArray(entry.routes) ? entry.routes[0] : entry.routes;
  const profile = route && Array.isArray((route as any).profiles) ? (route as any).profiles[0] : (route as any)?.profiles;
  const cluster = route && Array.isArray((route as any).clusters) ? (route as any).clusters[0] : (route as any)?.clusters;

  const net = entry.gate_net_weight ?? 0;
  const gross = entry.gate_gross_weight ?? net;
  const variance = entry.weight_variance ?? 0;
  const deduction = entry.factory_deduction_weight ?? 0;

  // Build QC parameters from stored columns
  const qcParameters: QCParameter[] = [
    {
      id: "moisture",
      name: "Moisture Content",
      target: "≤ 12%",
      value: entry.qc_moisture_percent != null ? `${entry.qc_moisture_percent}%` : "—",
      passed: entry.qc_moisture_percent == null || entry.qc_moisture_percent <= 12,
    },
    {
      id: "spoilage",
      name: "Spoilage",
      target: "≤ 2%",
      value: entry.qc_spoilage_percent != null ? `${entry.qc_spoilage_percent}%` : "—",
      passed: entry.qc_spoilage_percent == null || entry.qc_spoilage_percent <= 2,
    },
    {
      id: "foreign",
      name: "Foreign Material",
      target: "≤ 1%",
      value: entry.qc_foreign_material_percent != null ? `${entry.qc_foreign_material_percent}%` : "—",
      passed: entry.qc_foreign_material_percent == null || entry.qc_foreign_material_percent <= 1,
    },
  ];

  // Get reeler breakdown
  let reelerBreakdown: HistoryEntry["reelerBreakdown"] = [];
  if (entry.route_id) {
    const { data: tickets } = await supabase
      .from("collection_tickets")
      .select("net_weight_kg, factory_accepted_weight, quality_deduction_amount, reelers(full_name)")
      .eq("route_id", entry.route_id);

    if (tickets) {
      reelerBreakdown = tickets.map((t) => {
        const reeler = Array.isArray(t.reelers) ? t.reelers[0] : (t.reelers as any);
        const field = t.net_weight_kg ?? 0;
        const accepted = t.factory_accepted_weight ?? field;
        const ded = t.quality_deduction_amount ?? 0;
        return {
          reelerName: reeler?.full_name ?? "Unknown",
          fieldWeight: field,
          acceptedWeight: accepted,
          deduction: ded,
          finalWeight: accepted - ded,
        };
      });
    }
  }

  const status: HistoryEntry["status"] =
    entry.qc_status === "rejected"
      ? "rejected"
      : deduction > 0
      ? "deducted"
      : "accepted";

  return {
    id: entry.id,
    vehicleId: vehicle?.registration_number ?? entry.id.slice(0, 8).toUpperCase(),
    timestamp: entry.created_at
      ? new Date(entry.created_at).toLocaleString("en-IN")
      : "—",
    collectorName: profile?.full_name ?? "Unknown",
    cluster: cluster?.name ?? "—",
    netWeight: net,
    status,
    fieldWeight: gross,
    gateWeight: gross,
    varianceKg: variance,
    varianceTolerance: Math.abs(variance) <= gross * 0.05,
    qcParameters,
    qcDecision: entry.qc_status ?? "—",
    standardDeduction: 0,
    qualityDeduction: deduction,
    notes: entry.variance_notes ?? "",
    reelerBreakdown,
  };
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function fetchReportsData(
  supabase: Client,
  range: "Today" | "Yesterday" | "7 Days" | "Custom Range"
): Promise<{
  summary: DailySummary;
  breakdown: QualityBreakdown;
  entries: Array<{ id: string; vehicleId: string; vehicleType: string; time: string; grade: string; netWeight: number; status: string }>;
}> {
  const today = todayISO();
  let startDate: string;

  if (range === "Today") {
    startDate = startOfDay(today);
  } else if (range === "Yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    startDate = startOfDay(d.toISOString().split("T")[0]);
  } else {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    startDate = startOfDay(d.toISOString().split("T")[0]);
  }

  const { data: entries } = await supabase
    .from("gate_entries")
    .select(`
      id,
      qc_status,
      gate_net_weight,
      factory_deduction_weight,
      created_at,
      vehicles ( registration_number, vehicle_type ),
      routes ( id )
    `)
    .gte("created_at", startDate)
    .order("created_at", { ascending: false });

  const all = entries ?? [];

  // Get grades from collection tickets
  const routeIds = all.map(e => (Array.isArray(e.routes) ? e.routes[0] : (e.routes as any))?.id).filter(Boolean);
  let ticketGrades: Record<string, string> = {};
  if (routeIds.length > 0) {
    const { data: tickets } = await supabase
      .from("collection_tickets")
      .select("route_id, grade")
      .in("route_id", routeIds);
    if (tickets) {
      ticketGrades = Object.fromEntries(tickets.map(t => [t.route_id, t.grade ?? "A"]));
    }
  }

  const totalAccepted = all.filter(e => e.qc_status === "accepted" || e.qc_status === "deducted").length;
  const totalRejected = all.filter(e => e.qc_status === "rejected").length;
  const totalWeight = all.reduce((sum, e) => sum + (e.gate_net_weight ?? 0), 0);

  const summary: DailySummary = {
    totalVehicles: all.length,
    totalAccepted,
    totalRejected,
    checkedInToday: 0,
    pendingArrival: 0,
    totalWeightDispatched: totalWeight / 1000,
    dailyQuotaPercent: all.length > 0 ? Math.round((totalAccepted / all.length) * 100) : 0,
    pendingQCReviews: 0,
  };

  // Grade breakdown from collection tickets
  let gradeA = 0, gradeB = 0, gradeC = 0;
  Object.values(ticketGrades).forEach(g => {
    if (g === "A") gradeA++;
    else if (g === "B") gradeB++;
    else if (g === "C") gradeC++;
  });

  const breakdown: QualityBreakdown = {
    gradeA,
    gradeB,
    gradeC,
    rejected: totalRejected,
  };

  const reportEntries = all.slice(0, 20).map(e => {
    const vehicle = Array.isArray(e.vehicles) ? e.vehicles[0] : (e.vehicles as any);
    const route = Array.isArray(e.routes) ? e.routes[0] : (e.routes as any);
    const grade = ticketGrades[route?.id] ?? "A";
    return {
      id: e.id,
      vehicleId: vehicle?.registration_number ?? e.id.slice(0, 8).toUpperCase(),
      vehicleType: vehicle?.vehicle_type ?? "Truck",
      time: e.created_at ? new Date(e.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—",
      grade,
      netWeight: e.gate_net_weight ?? 0,
      status: e.qc_status ?? "pending",
    };
  });

  return { summary, breakdown, entries: reportEntries };
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function fetchGateSettings(
  supabase: Client,
  profileId: string
): Promise<GateSettings> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("push_alerts_enabled, sms_alerts_enabled, paired_scale_mac, paired_scale_name, cluster_id")
    .eq("id", profileId)
    .single();

  let varianceTolerance = 5;
  if (profile?.cluster_id) {
    const { data: cluster } = await supabase
      .from("clusters")
      .select("variance_tolerance_percent")
      .eq("id", profile.cluster_id)
      .single();
    varianceTolerance = cluster?.variance_tolerance_percent ?? 5;
  }

  return {
    varianceThreshold: varianceTolerance,
    scaleId: profile?.paired_scale_mac ?? profile?.paired_scale_name ?? "NOT PAIRED",
    scaleConnected: !!profile?.paired_scale_mac,
    lateShipmentWarning: profile?.sms_alerts_enabled ?? true,
    varianceThresholdTrigger: true,
    qcClearanceRequired: true,
    appVersion: "2.4.8-STABLE",
    lastSync: new Date().toLocaleString("en-IN"),
  };
}

export async function saveGateSettings(
  supabase: Client,
  profileId: string,
  settings: Partial<GateSettings>
): Promise<void> {
  await supabase
    .from("profiles")
    .update({
      push_alerts_enabled: settings.qcClearanceRequired,
      sms_alerts_enabled: settings.lateShipmentWarning,
    })
    .eq("id", profileId);
}
