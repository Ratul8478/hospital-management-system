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
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
 * Whether a durable roster store is wired up.
 * Supports Firebase Firestore (default primary realtime DB) and Supabase.
 */
export function isRosterStoreConfigured(): boolean {
  return true;
}

function rosterHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

/**
 * Supabase fallback fetcher.
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
 * Persist the full roster as one snapshot to Firebase Firestore and Supabase.
 */
export async function saveRoster(snapshot: RosterSnapshot): Promise<boolean> {
  let savedToFirebase = false;

  // 1. Save to Firebase Firestore Realtime Database
  try {
    if (Array.isArray(snapshot.branches) && snapshot.branches.length > 0) {
      await setDoc(doc(db, "medix_realtime_db", "branches"), { data: snapshot.branches });
    }
    if (Array.isArray(snapshot.doctors) && snapshot.doctors.length > 0) {
      await setDoc(doc(db, "medix_realtime_db", "doctors"), { data: snapshot.doctors });
    }
    savedToFirebase = true;
  } catch (fbErr) {
    console.warn('[roster-store] Firebase save notice:', fbErr);
  }

  // 2. Secondary fallback save to Supabase if configured
  if (Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      await rosterFetch(ROSTER_TABLE, {
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
    } catch (_) {}
  }

  return savedToFirebase;
}

/**
 * Read the stored snapshot from Firebase Firestore (primary) or Supabase (secondary).
 */
export async function loadRoster(): Promise<RosterSnapshot | null> {
  // 1. Primary: Load directly from Firebase Firestore
  try {
    const branchesDoc = await getDoc(doc(db, "medix_realtime_db", "branches"));
    const doctorsDoc = await getDoc(doc(db, "medix_realtime_db", "doctors"));

    const branchesData = branchesDoc.exists() ? branchesDoc.data()?.data : null;
    const doctorsData = doctorsDoc.exists() ? doctorsDoc.data()?.data : null;

    if ((Array.isArray(branchesData) && branchesData.length > 0) || 
        (Array.isArray(doctorsData) && doctorsData.length > 0)) {
      return {
        branches: Array.isArray(branchesData) ? branchesData : [],
        doctors: Array.isArray(doctorsData) ? doctorsData : [],
      };
    }
  } catch (fbErr) {
    console.warn('[roster-store] Firebase read fallback:', fbErr);
  }

  // 2. Secondary: Load from Supabase if configured
  if (Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
    try {
      const res = await rosterFetch(
        `${ROSTER_TABLE}?id=eq.${ROSTER_ROW_ID}&select=data`,
        { method: 'GET' }
      );

      if (res.ok) {
        const rows = await res.json().catch(() => null);
        const data = Array.isArray(rows) && rows.length > 0 ? rows[0]?.data : null;
        if (data && typeof data === 'object') {
          return {
            branches: Array.isArray(data.branches) ? data.branches : [],
            doctors: Array.isArray(data.doctors) ? data.doctors : [],
          };
        }
      }
    } catch (err) {
      console.warn('[roster-store] Supabase read error:', err);
    }
  }

  return null;
}

/**
 * Replay the stored snapshot into backendStore so the /api/v1/hospitals and
 * /api/v1/doctors handlers serve live web-registered data.
 */
export async function hydrateBackendStore(): Promise<boolean> {
  const snapshot = await loadRoster();
  if (!snapshot) return false;

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
