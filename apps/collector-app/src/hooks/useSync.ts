// ─── Silk Value — useSync Hook ───────────────────────────────────────────────
// Triggers the WatermelonDB sync service and exposes sync status to UI.
// This hook does NOT fetch data for rendering — it only manages sync lifecycle.
// It does NOT import from @silk-value/ui. It does NOT render anything.

import { useState, useEffect, useCallback } from "react";
import {
  performSync,
  getSyncStatus,
  getLastSyncedAt,
  getLastSyncError,
} from "../services/sync";
import type { SyncServiceStatus } from "../services/sync";
// SYNC DECISION: Reading userId from Supabase session in this hook rather
// than passing it as a prop so that any screen can use useSync without
// needing to manage auth state. The Supabase client is used here only to
// read the cached session — no network call is made to Supabase.
import { supabase } from "../services/auth";

interface UseSyncReturn {
  triggerSync: () => Promise<void>;
  syncStatus: SyncServiceStatus;
  lastSyncedAt: Date | null;
  syncError: string | null;
  isSyncing: boolean;
}

export default function useSync(): UseSyncReturn {
  const [syncStatus, setSyncStatus] =
    useState<SyncServiceStatus>(getSyncStatus());
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(
    getLastSyncedAt(),
  );
  const [syncError, setSyncError] = useState<string | null>(
    getLastSyncError(),
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const triggerSync = useCallback(async (): Promise<void> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn(
        "useSync: No authenticated session found, skipping sync",
      );
      return;
    }

    setIsSyncing(true);

    try {
      await performSync(userId);
    } catch (error) {
      // Error is already tracked in sync.ts module state.
      // Log here for developer visibility during development.
      console.error("useSync: Sync failed", error);
    } finally {
      // Read the authoritative state from the sync module
      setSyncStatus(getSyncStatus());
      setLastSyncedAt(getLastSyncedAt());
      setSyncError(getLastSyncError());
      setIsSyncing(false);
    }
  }, []);

  // On mount, trigger sync once automatically so the home screen
  // always has fresh data when it first loads after login.
  useEffect(() => {
    triggerSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSync]);

  return {
    triggerSync,
    syncStatus,
    lastSyncedAt,
    syncError,
    isSyncing,
  };
}
