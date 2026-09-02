/**
 * Marketing & PRO Domain
 *
 * Handles marketing representative management, join requests,
 * approval workflows, and email dispatch logs.
 */

import type { RepositoryState } from './types';
import type {
  MarketingJoinRequest,
  MarketingRepresentative,
  MarketingEmailDispatchLog,
} from '../data';

// ==========================================
// JOIN REQUESTS
// ==========================================

export function getMarketingRequests(
  state: RepositoryState,
  filter?: {
    branchId?: number;
    status?: string;
    pipeline?: string;
  }
): MarketingJoinRequest[] {
  let list = [...state.marketingRequests];

  if (filter?.pipeline === 'hq_direct') {
    return list.filter(
      (r) => r.targetBranchId === 1 && r.status === 'pending_super_admin_approval'
    );
  }
  if (filter?.pipeline === 'branch_forwarded') {
    return list.filter(
      (r) => r.targetBranchId !== 1 && r.status === 'pending_super_admin_approval'
    );
  }
  if (filter?.branchId !== undefined) {
    list = list.filter((r) => r.targetBranchId === filter.branchId);
  }
  if (filter?.status) {
    list = list.filter((r) => r.status === filter.status);
  }
  return list;
}

export function findMarketingRequestByEmail(
  state: RepositoryState,
  email: string
): MarketingJoinRequest | undefined {
  const clean = email.trim().toLowerCase();
  return state.marketingRequests.find((r) => r.email.toLowerCase() === clean);
}

export function findMarketingRepByReferenceId(
  state: RepositoryState,
  referenceId: string
): MarketingRepresentative | undefined {
  return state.marketingReps.find((r) => r.referenceId === referenceId);
}

export function addMarketingRequest(
  state: RepositoryState,
  data: MarketingJoinRequest
): MarketingJoinRequest {
  const nextId = Math.max(...state.marketingRequests.map((r) => r.id), 0) + 1;
  const record: MarketingJoinRequest = { ...data, id: nextId };
  state.marketingRequests = [record, ...state.marketingRequests];
  return record;
}

export function updateMarketingRequest(
  state: RepositoryState,
  id: number,
  updates: Partial<MarketingJoinRequest>
): MarketingJoinRequest | null {
  const target = state.marketingRequests.find((r) => r.id === id);
  if (!target) return null;
  Object.assign(target, updates);
  return target;
}

// ==========================================
// REPRESENTATIVES
// ==========================================

export function getMarketingRepresentatives(
  state: RepositoryState,
  filter?: {
    branchId?: number;
    status?: string;
  }
): MarketingRepresentative[] {
  let list = [...state.marketingReps];
  if (filter?.branchId !== undefined) {
    list = list.filter((r) => r.branchId === filter.branchId);
  }
  if (filter?.status) {
    list = list.filter((r) => r.status === filter.status);
  }
  return list;
}

export function addMarketingRepresentative(
  state: RepositoryState,
  data: Omit<MarketingRepresentative, 'id'>
): MarketingRepresentative {
  const nextId = Math.max(...state.marketingReps.map((r) => r.id), 0) + 1;
  const record: MarketingRepresentative = { ...data, id: nextId };
  state.marketingReps = [record, ...state.marketingReps];
  return record;
}

// ==========================================
// EMAIL DISPATCH LOGS
// ==========================================

export function getMarketingEmailLogs(
  state: RepositoryState,
  filter?: {
    referenceId?: string;
    branchId?: number;
  }
): MarketingEmailDispatchLog[] {
  let list = [...state.marketingEmailLogs];
  if (filter?.referenceId) {
    list = list.filter((l) => l.referenceId.toLowerCase() === filter.referenceId!.toLowerCase());
  }
  if (filter?.branchId !== undefined) {
    list = list.filter((l) => l.targetBranchId === filter.branchId);
  }
  return list;
}

export function addMarketingEmailLog(
  state: RepositoryState,
  log: MarketingEmailDispatchLog
): MarketingEmailDispatchLog {
  state.marketingEmailLogs = [log, ...state.marketingEmailLogs];
  return log;
}
