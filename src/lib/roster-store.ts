/**
 * ============================================================================
 * MEDIX SHARED ROSTER STORE — DURABLE HOSPITAL & DOCTOR SNAPSHOT
 * ----------------------------------------------------------------------------
 * The web app and the Medix Doctor Android app never share a localStorage
 * origin, and `backendStore` lives only in the memory of a single serverless
 * invocation. So a hospital or doctor added by a receptionist in the browser
 * could never reach the phone: the write landed in one lambda's RAM and the
 * app's poll was served by another.
 *
 * This module gives both clients one durable source of truth — a single-row
 * JSONB snapshot in Supabase:
 *
 *   Receptionist adds / removes a hospital or doctor
 *     -> store.tsx POSTs { branches, doctors } to /api/v1/database
 *     -> saveRoster() writes the snapshot
 *
 *   Android app polls /api/v1/hospitals and /api/v1/doctors every 4s
 *     -> hydrateBackendStore() replays the snapshot into backendStore
 *
 * Required table (see docs/ROSTER_SYNC_SETUP.md):
 *
 *   create table medix_roster (
 *     id         int primary key default 1,
 *     data       jsonb not null,
 *     updated_at timestamptz default now(),
 *     constraint medix_roster_single_row check (id = 1)
 *   );
 *
 * SUPABASE_SERVICE_ROLE_KEY stays server-side only. The Android app keeps
 * talking to this API with its existing x-api-key and never sees Supabase.
 *
 * Every function degrades to a no-op when the environment variables are
 * absent, so local development and the seeded demo data behave exactly as
 * they did before this module existed.
 * ============================================================================
 */

import { backendStore } from './backend-store';
import { Branch } from './data';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

const ROSTER_TABLE = 'medix_roster';
const ROSTER_ROW_ID = 1;
const REQUEST_TIMEOUT_MS = 8000;

export interface RosterSnapshot {
  branches: Branch[];
  doctors: any[];
}

/**
 * Whether a durable roster store is wired up. When false, the web app and the
 * Android app both fall back to the seeded roster from data.ts.
 */
export function isRosterStoreConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function rosterHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

/**
 * Supabase is a hard dependency for nothing here: a slow or unreachable store
 * must never stall an API response, so every call is bounded by a timeout.
 */
async function rosterFetch(path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...init,
      headers: { ...rosterHeaders(), ...(init.headers as Record<string, string> | undefined) },
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Persist the full roster as one snapshot. Writing the whole list (rather than
 * diffing) is what makes removal propagate: whatever is absent from the
 * snapshot is gone for every reader on the next poll.
 */
export async function saveRoster(snapshot: RosterSnapshot): Promise<boolean> {
  if (!isRosterStoreConfigured()) return false;

  try {
    const res = await rosterFetch(ROSTER_TABLE, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        id: ROSTER_ROW_ID,
        data: {
          branches: Array.isArray(snapshot.branches) ? snapshot.branches : [],
          doctors: Array.isArray(snapshot.doctors) ? snapshot.doctors : [],
        },
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[roster-store] save failed (${res.status}): ${detail}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[roster-store] save error:', err);
    return false;
  }
}

/**
 * Read the stored snapshot. Returns null when the store is unconfigured,
 * unreachable, empty, or holding something unusable — every one of which means
 * "keep serving what backendStore already has".
 */
export async function loadRoster(): Promise<RosterSnapshot | null> {
  if (!isRosterStoreConfigured()) return null;

  try {
    const res = await rosterFetch(
      `${ROSTER_TABLE}?id=eq.${ROSTER_ROW_ID}&select=data`,
      { method: 'GET' }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[roster-store] load failed (${res.status}): ${detail}`);
      return null;
    }

    const rows = await res.json().catch(() => null);
    const data = Array.isArray(rows) && rows.length > 0 ? rows[0]?.data : null;
    if (!data || typeof data !== 'object') return null;

    return {
      branches: Array.isArray(data.branches) ? data.branches : [],
      doctors: Array.isArray(data.doctors) ? data.doctors : [],
    };
  } catch (err) {
    console.error('[roster-store] load error:', err);
    return null;
  }
}

/**
 * Replay the stored snapshot into backendStore so the /api/v1/hospitals and
 * /api/v1/doctors handlers below serve live web-registered data instead of the
 * seeded demo roster.
 *
 * Branches are synced first on purpose: syncDoctorsFromWeb resolves each
 * doctor's branchCode and branchName against the current branch list, so
 * doctors synced before their branch would be attached to the wrong hospital.
 *
 * Returns true when live data was applied.
 */
export async function hydrateBackendStore(): Promise<boolean> {
  const snapshot = await loadRoster();
  if (!snapshot) return false;

  // Empty lists are treated as "nothing stored yet" rather than "delete
  // everything" — backendStore's own sync methods guard on this too, so a
  // failed or half-written snapshot can never wipe the roster.
  const applied =
    snapshot.branches.length > 0 || snapshot.doctors.length > 0;

  if (snapshot.branches.length > 0) {
    backendStore.syncBranchesFromWeb(snapshot.branches);
  }
  if (snapshot.doctors.length > 0) {
    backendStore.syncDoctorsFromWeb(snapshot.doctors);
  }

  return applied;
}
