/**
 * Hospital & Branch Management Domain
 *
 * Handles branch CRUD, doctor roster synchronization from web frontend.
 */

import type { RepositoryState, DoctorUser } from './types';
import { ROLE_PERMISSIONS } from './types';
import { DEFAULT_DOCTOR_PERMISSIONS, DEFAULT_DOCTOR_PASSWORD_HASH } from './seed-data';
import type { Branch } from '../data';
import { INITIAL_BRANCHES } from '../data';

// ==========================================
// BRANCH METHODS
// ==========================================

export function getBranches(state: RepositoryState): Branch[] {
  return state.branches;
}

export function getBranchById(state: RepositoryState, id: number): Branch | undefined {
  return state.branches.find((b) => b.id === id);
}

export function getBranchByCode(state: RepositoryState, code: string): Branch | undefined {
  return state.branches.find((b) => b.code.toLowerCase() === code.toLowerCase());
}

export function addBranch(
  state: RepositoryState,
  branchData: Omit<Branch, 'id' | 'revenue' | 'patientCount' | 'bedOccupancy' | 'status'> & {
    revenue?: number;
    patientCount?: number;
    bedOccupancy?: string;
    status?: 'active' | 'inactive';
  }
): Branch {
  const nextId = Math.max(...state.branches.map((b) => b.id), 0) + 1;
  const newBranch: Branch = {
    ...branchData,
    id: nextId,
    status: branchData.status || 'active',
    revenue: branchData.revenue || 0,
    patientCount: branchData.patientCount || 0,
    bedOccupancy: branchData.bedOccupancy || '0 / 50 Beds',
  };
  state.branches.push(newBranch);
  return newBranch;
}

export function syncBranchesFromWeb(state: RepositoryState, branchesList: Branch[]): void {
  if (Array.isArray(branchesList) && branchesList.length > 0) {
    state.branches = [...branchesList];
  }
}

// ==========================================
// DOCTOR SYNC (Web -> Backend)
// ==========================================

export function syncDoctorsFromWeb(state: RepositoryState, doctorsList: any[]): void {
  if (Array.isArray(doctorsList) && doctorsList.length > 0) {
    state.doctors = doctorsList.map((doc, idx) => {
      const docId = doc.id || (idx + 1);
      const existing = state.doctors.find((d) => d.id === docId || d.email === doc.email);
      const branch = state.branches.find((b) => b.id === doc.branchId) || state.branches[0];

      // Ensure default emails for key doctors
      let defaultEmail = doc.email || existing?.email;
      if (!defaultEmail) {
        if (docId === 101) defaultEmail = 'sabyachi.mondal@ariyan.hospital';
        else if (docId === 102) defaultEmail = 'ariyanhospital9@gmail.com';
        else defaultEmail = `doctor${docId}@medix.local`;
      }

      return {
        id: docId,
        branchId: doc.branchId || branch?.id || 1,
        branchCode: branch?.code || 'ARIYAN-HQ',
        branchName: branch?.name || 'ARIYAN HOSPITAL MULTISPECIALITY',
        name: doc.name,
        email: defaultEmail,
        phone: doc.contact || doc.phone || existing?.phone || '+91 91443 76971',
        passwordHash: existing?.passwordHash || doc.passwordHash || DEFAULT_DOCTOR_PASSWORD_HASH,
        specialty: doc.specialty || 'General Medicine',
        department: doc.department || (doc.specialty ? doc.specialty.split('&')[0].trim() : 'General'),
        qualification: doc.qualification || 'MD, MBBS',
        registrationNumber: doc.registrationNumber || `WB-MED-${docId}-2026`,
        fee: typeof doc.fee === 'number' ? doc.fee : parseFloat(doc.fee) || 800,
        status: doc.status || 'available',
        role: 'doctor' as const,
        permissions: [...DEFAULT_DOCTOR_PERMISSIONS],
        avatarUrl: doc.avatarUrl || doc.image || doc.photo || existing?.avatarUrl || '',
        scheduleTime: doc.scheduleTime || doc.schedule || existing?.scheduleTime || '09:00 AM - 05:00 PM',
        chamberRoom: doc.chamberRoom || existing?.chamberRoom || `OPD-${200 + docId}`,
        experienceYears: doc.experienceYears || existing?.experienceYears || 8,
        rating: doc.rating ? parseFloat(doc.rating) : existing?.rating || 4.9,
        totalPatientsTreated: doc.totalPatientsTreated || existing?.totalPatientsTreated || 1250,
        availableDays: doc.availableDays || existing?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        shiftTiming: doc.shiftTiming || existing?.shiftTiming || '09:00 AM - 05:00 PM',
      };
    });
  }
}
