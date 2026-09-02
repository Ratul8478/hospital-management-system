/**
 * Hospital Referral Domain
 *
 * Handles inter-hospital patient referral creation and queries.
 */

import type { RepositoryState, HospitalReferralRecord } from './types';
import { TODAY_STR } from './seed-data';

export function getReferrals(
  state: RepositoryState,
  filter?: {
    referringDoctorId?: number;
    targetHospitalId?: number | string;
    uhid?: string;
  }
): HospitalReferralRecord[] {
  let list = [...state.referrals];
  if (filter?.referringDoctorId !== undefined) {
    list = list.filter((r) => r.referringDoctorId === filter.referringDoctorId);
  }
  if (filter?.targetHospitalId !== undefined) {
    list = list.filter(
      (r) => String(r.targetHospitalId).toLowerCase() === String(filter.targetHospitalId).toLowerCase()
    );
  }
  if (filter?.uhid) {
    list = list.filter((r) => r.uhid.toLowerCase() === filter.uhid!.toLowerCase());
  }
  return list;
}

export function createReferral(
  state: RepositoryState,
  data: Omit<HospitalReferralRecord, 'id' | 'createdAt' | 'status'> & {
    status?: HospitalReferralRecord['status'];
  }
): HospitalReferralRecord {
  const nextId = Math.max(...state.referrals.map((r) => r.id), 0) + 1;
  const refCode = data.referralId || `REF-OUT-${TODAY_STR.replace(/-/g, '')}-${1000 + nextId}`;

  const newRef: HospitalReferralRecord = {
    ...data,
    id: nextId,
    referralId: refCode,
    status: data.status || 'DISPATCHED',
    createdAt: new Date().toISOString(),
  };

  state.referrals.unshift(newRef);
  return newRef;
}
