// ─── Gate Data Hooks ──────────────────────────────────────────────────────────
// Generic hooks wrapping gateService functions with loading/error state.

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useGateAuth } from "../context/GateAuthContext";
import * as gateService from "../services/gateService";
import type {
  DailySummary,
  ExpectedVehicle,
  WeighmentData,
  QCParameter,
  ReelerUnit,
  HistoryEntry,
  GateSettings,
  QualityBreakdown,
} from "../types";

// ── Generic hook factory ──────────────────────────────────────────────────────

function useAsyncData<T>(
  fetcher: () => Promise<T | null>,
  deps: unknown[] = []
): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── Dashboard hooks ───────────────────────────────────────────────────────────

export function useDailySummary() {
  const { clusterIds } = useGateAuth();
  return useAsyncData<DailySummary>(
    () => gateService.fetchDailySummary(supabase, clusterIds),
    [clusterIds.join(",")]
  );
}

export function useExpectedVehicles() {
  const { clusterIds } = useGateAuth();
  return useAsyncData<ExpectedVehicle[]>(
    () => gateService.fetchExpectedVehicles(supabase, clusterIds),
    [clusterIds.join(",")]
  );
}

// ── Weighment hooks ───────────────────────────────────────────────────────────

export function useWeighmentData(gateEntryId: string) {
  return useAsyncData<WeighmentData>(
    () => gateService.fetchWeighmentData(supabase, gateEntryId),
    [gateEntryId]
  );
}

// ── QC hooks ─────────────────────────────────────────────────────────────────

export function useQCParameters(gateEntryId: string) {
  return useAsyncData<QCParameter[]>(
    () => gateService.fetchQCParameters(supabase, gateEntryId),
    [gateEntryId]
  );
}

// ── Acceptance hooks ──────────────────────────────────────────────────────────

export function useReelerUnits(gateEntryId: string) {
  return useAsyncData<ReelerUnit[]>(
    () => gateService.fetchReelerUnits(supabase, gateEntryId),
    [gateEntryId]
  );
}

// ── History hooks ─────────────────────────────────────────────────────────────

export function useHistoryList(filter: "Today" | "This Week" | "Custom Date") {
  return useAsyncData<HistoryEntry[]>(
    () => gateService.fetchHistoryList(supabase, filter),
    [filter]
  );
}

export function useHistoryDetail(gateEntryId: string) {
  return useAsyncData<HistoryEntry>(
    () => gateService.fetchHistoryDetail(supabase, gateEntryId),
    [gateEntryId]
  );
}

// ── Reports hooks ─────────────────────────────────────────────────────────────

export function useReports(range: "Today" | "Yesterday" | "7 Days" | "Custom Range") {
  return useAsyncData<{
    summary: DailySummary;
    breakdown: QualityBreakdown;
    entries: Array<{ id: string; vehicleId: string; vehicleType: string; time: string; grade: string; netWeight: number; status: string }>;
  }>(
    () => gateService.fetchReportsData(supabase, range),
    [range]
  );
}

// ── Settings hooks ────────────────────────────────────────────────────────────

export function useGateSettings() {
  const { operatorProfileId } = useGateAuth();
  return useAsyncData<GateSettings>(
    () =>
      operatorProfileId
        ? gateService.fetchGateSettings(supabase, operatorProfileId)
        : Promise.resolve(null),
    [operatorProfileId]
  );
}
