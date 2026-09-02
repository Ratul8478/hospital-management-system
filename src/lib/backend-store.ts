/**
 * Backend Repository — Thin Facade
 *
 * This file composes the BackendRepository from domain modules.
 * All types, seed data, and business logic live in ./domains/*.
 * API routes import { backendStore } from '@/lib/backend-store' unchanged.
 */

import {
  Branch,
  INITIAL_BRANCHES,
  MarketingJoinRequest,
  MarketingRepresentative,
  MarketingEmailDispatchLog,
  INITIAL_MARKETING_JOIN_REQUESTS,
  INITIAL_MARKETING_REPRESENTATIVES,
  INITIAL_MARKETING_EMAIL_LOGS,
} from './data';

// Re-export all types for backward compatibility
export type {
  HospitalReferralRecord,
  DoctorUser,
  UserRole,
  UserAccount,
  AuthSession,
  PatientRecord,
  PatientVitalsRecord,
  LabOrderRequest,
  DoctorAppointment,
  PrescriptionItem,
  Prescription,
  DiagnosticParameter,
  DiagnosticReport,
  IPDAdmission,
  FollowUpSchedule,
  LeaveRequest,
  FCMRegistration,
  RepositoryState,
} from './domains/types';

export { ROLE_PERMISSIONS } from './domains/types';

// Import seed data
import {
  SEED_USER_ACCOUNTS,
  SEED_DOCTOR_USERS,
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_PRESCRIPTIONS,
  SEED_REPORTS,
  SEED_ADMISSIONS,
  SEED_FOLLOWUPS,
  SEED_LEAVE_REQUESTS,
  SEED_SESSIONS,
  SEED_FCM_TOKENS,
} from './domains/seed-data';

// Import domain modules
import * as authDomain from './domains/auth';
import * as hospitalDomain from './domains/hospital';
import * as doctorDomain from './domains/doctor';
import * as appointmentDomain from './domains/appointment';
import * as clinicalDomain from './domains/clinical';
import * as patientDomain from './domains/patient';
import * as notificationDomain from './domains/notification';
import * as referralDomain from './domains/referral';
import * as marketingDomain from './domains/marketing';

// Import types for internal use
import type {
  UserAccount,
  AuthSession,
  DoctorUser,
  PatientRecord,
  DoctorAppointment,
  Prescription,
  DiagnosticReport,
  IPDAdmission,
  FollowUpSchedule,
  LeaveRequest,
  FCMRegistration,
  PatientVitalsRecord,
  LabOrderRequest,
  HospitalReferralRecord,
  UserRole,
  RepositoryState,
} from './domains/types';


// ==========================================
// BACKEND REPOSITORY SINGLETON (Server-side)
// ==========================================

class BackendRepository implements RepositoryState {
  // ---- Shared State (implements RepositoryState) ----
  users: UserAccount[] = [...SEED_USER_ACCOUNTS];
  doctors: DoctorUser[] = [...SEED_DOCTOR_USERS];
  patients: PatientRecord[] = [...SEED_PATIENTS];
  appointments: DoctorAppointment[] = [...SEED_APPOINTMENTS];
  prescriptions: Prescription[] = [...SEED_PRESCRIPTIONS];
  reports: DiagnosticReport[] = [...SEED_REPORTS];
  admissions: IPDAdmission[] = [...SEED_ADMISSIONS];
  followups: FollowUpSchedule[] = [...SEED_FOLLOWUPS];
  leaveRequests: LeaveRequest[] = [...SEED_LEAVE_REQUESTS];
  sessions: Map<string, AuthSession> = new Map(
    SEED_SESSIONS.map((s) => [s.token, s])
  );
  branches: Branch[] = [...INITIAL_BRANCHES];
  referrals: HospitalReferralRecord[] = [];
  fcmTokens: FCMRegistration[] = [...SEED_FCM_TOKENS];
  marketingRequests: MarketingJoinRequest[] = [...INITIAL_MARKETING_JOIN_REQUESTS];
  marketingReps: MarketingRepresentative[] = [...INITIAL_MARKETING_REPRESENTATIVES];
  marketingEmailLogs: MarketingEmailDispatchLog[] = [...INITIAL_MARKETING_EMAIL_LOGS];
  patientVitals: PatientVitalsRecord[] = [];
  labOrders: LabOrderRequest[] = [];

  // ==========================================
  // AUTH & USER METHODS
  // ==========================================
  getUserAccounts() { return authDomain.getUserAccounts(this); }
  getUserById(id: number) { return authDomain.getUserById(this, id); }
  getUserByEmail(email: string) { return authDomain.getUserByEmail(this, email); }
  getUserByToken(token: string) { return authDomain.getUserByToken(this, token); }
  registerUserAccount(data: Parameters<typeof authDomain.registerUserAccount>[1]) {
    return authDomain.registerUserAccount(this, data);
  }
  verifyEmailToken(token: string, email?: string) { return authDomain.verifyEmailToken(this, token, email); }
  resendVerificationToken(email: string, appBaseUrl?: string) {
    return authDomain.resendVerificationToken(this, email, appBaseUrl);
  }
  authenticateUserAccount(identifier: string, password?: string, requestedRole?: string) {
    return authDomain.authenticateUserAccount(this, identifier, password, requestedRole);
  }
  authenticateDoctor(emailOrPhone: string, password?: string) {
    return authDomain.authenticateDoctor(this, emailOrPhone, password);
  }
  refreshSession(refreshTokenOrToken: string) { return authDomain.refreshSession(this, refreshTokenOrToken); }
  revokeUserSession(tokenOrRefreshToken: string) { return authDomain.revokeUserSession(this, tokenOrRefreshToken); }
  invalidateSession(token: string) { return authDomain.invalidateSession(this, token); }
  getSession(token: string) { return authDomain.getSession(this, token); }
  deleteUserAccount(userIdOrEmail: number | string) { return authDomain.deleteUserAccount(this, userIdOrEmail); }

  // ==========================================
  // HOSPITAL & BRANCH METHODS
  // ==========================================
  getBranches() { return hospitalDomain.getBranches(this); }
  getBranchById(id: number) { return hospitalDomain.getBranchById(this, id); }
  getBranchByCode(code: string) { return hospitalDomain.getBranchByCode(this, code); }
  addBranch(branchData: Parameters<typeof hospitalDomain.addBranch>[1]) {
    return hospitalDomain.addBranch(this, branchData);
  }
  syncBranchesFromWeb(branchesList: Branch[]) { return hospitalDomain.syncBranchesFromWeb(this, branchesList); }
  syncDoctorsFromWeb(doctorsList: any[]) { return hospitalDomain.syncDoctorsFromWeb(this, doctorsList); }

  // ==========================================
  // DOCTOR METHODS
  // ==========================================
  getDoctorById(id: number) { return doctorDomain.getDoctorById(this, id); }
  getAllDoctors(branchId?: number) { return doctorDomain.getAllDoctors(this, branchId); }
  getDoctorsByBranch(branchId: number) { return doctorDomain.getDoctorsByBranch(this, branchId); }
  getDoctorProfile(doctorId: number) { return doctorDomain.getDoctorProfile(this, doctorId); }
  updateDoctorStatus(doctorId: number, status: string, reason?: string) {
    return doctorDomain.updateDoctorStatus(this, doctorId, status, reason);
  }
  registerDoctor(data: Parameters<typeof doctorDomain.registerDoctor>[1]) {
    return doctorDomain.registerDoctor(this, data);
  }
  getDoctorEarnings(doctorId: number) { return doctorDomain.getDoctorEarnings(this, doctorId); }
  getDoctorLeave(doctorId?: number) { return doctorDomain.getDoctorLeave(this, doctorId); }
  createLeaveRequest(data: Parameters<typeof doctorDomain.createLeaveRequest>[1]) {
    return doctorDomain.createLeaveRequest(this, data);
  }

  // ==========================================
  // APPOINTMENT METHODS
  // ==========================================
  getAppointments(filter?: Parameters<typeof appointmentDomain.getAppointments>[1]) {
    return appointmentDomain.getAppointments(this, filter);
  }
  getTodayAppointments(doctorId?: number, branchId?: number, status?: string) {
    return appointmentDomain.getTodayAppointments(this, doctorId, branchId, status);
  }
  getAppointmentById(id: number) { return appointmentDomain.getAppointmentById(this, id); }
  addAppointment(data: Parameters<typeof appointmentDomain.addAppointment>[1]) {
    return appointmentDomain.addAppointment(this, data);
  }
  updateAppointmentStatus(id: number, status: DoctorAppointment['status'], notes?: string) {
    return appointmentDomain.updateAppointmentStatus(this, id, status, notes);
  }
  callPatient(appointmentId: number) { return appointmentDomain.callPatient(this, appointmentId); }

  // ==========================================
  // CLINICAL METHODS
  // ==========================================
  getPrescriptions(filter?: Parameters<typeof clinicalDomain.getPrescriptions>[1]) {
    return clinicalDomain.getPrescriptions(this, filter);
  }
  createPrescription(data: Parameters<typeof clinicalDomain.createPrescription>[1]) {
    return clinicalDomain.createPrescription(this, data);
  }
  getReports(filter?: Parameters<typeof clinicalDomain.getReports>[1]) {
    return clinicalDomain.getReports(this, filter);
  }
  createLabOrder(data: Parameters<typeof clinicalDomain.createLabOrder>[1]) {
    return clinicalDomain.createLabOrder(this, data);
  }
  getAdmissions(filter?: Parameters<typeof clinicalDomain.getAdmissions>[1]) {
    return clinicalDomain.getAdmissions(this, filter);
  }
  getFollowUps(filter?: Parameters<typeof clinicalDomain.getFollowUps>[1]) {
    return clinicalDomain.getFollowUps(this, filter);
  }
  createFollowUp(data: Parameters<typeof clinicalDomain.createFollowUp>[1]) {
    return clinicalDomain.createFollowUp(this, data);
  }

  // ==========================================
  // PATIENT & EHR METHODS
  // ==========================================
  getPatients() { return patientDomain.getPatients(this); }
  searchPatients(query?: string, branchId?: number, page?: number, limit?: number) {
    return patientDomain.searchPatients(this, query, branchId, page, limit);
  }
  addPatient(data: Parameters<typeof patientDomain.addPatient>[1]) {
    return patientDomain.addPatient(this, data);
  }
  ensureDefaultPatients() { return patientDomain.ensureDefaultPatients(this); }
  getPatientByIdOrUhid(idOrUhid: string | number) { return patientDomain.getPatientByIdOrUhid(this, idOrUhid); }
  getOrCreatePatient(data: Parameters<typeof patientDomain.getOrCreatePatient>[1]) {
    return patientDomain.getOrCreatePatient(this, data);
  }
  recordPatientVitals(
    uhid: string,
    vitals: Parameters<typeof patientDomain.recordPatientVitals>[2],
    recordedBy?: string
  ) {
    return patientDomain.recordPatientVitals(this, uhid, vitals, recordedBy);
  }
  getPatientVitals(uhid: string) { return patientDomain.getPatientVitals(this, uhid); }
  getPatientTimeline(uhid: string) { return patientDomain.getPatientTimeline(this, uhid); }
  getPatientLongitudinalHistory(idOrUhid: string | number) {
    return patientDomain.getPatientLongitudinalHistory(this, idOrUhid);
  }

  // ==========================================
  // NOTIFICATION METHODS
  // ==========================================
  registerFCMToken(data: Parameters<typeof notificationDomain.registerFCMToken>[1]) {
    return notificationDomain.registerFCMToken(this, data);
  }
  getFCMTokens(userIdOrDoctorId?: string | number) {
    return notificationDomain.getFCMTokens(this, userIdOrDoctorId);
  }

  // ==========================================
  // REFERRAL METHODS
  // ==========================================
  getReferrals(filter?: Parameters<typeof referralDomain.getReferrals>[1]) {
    return referralDomain.getReferrals(this, filter);
  }
  createReferral(data: Parameters<typeof referralDomain.createReferral>[1]) {
    return referralDomain.createReferral(this, data);
  }

  // ==========================================
  // MARKETING METHODS
  // ==========================================
  getMarketingRequests(filter?: Parameters<typeof marketingDomain.getMarketingRequests>[1]) {
    return marketingDomain.getMarketingRequests(this, filter);
  }
  findMarketingRequestByEmail(email: string) {
    return marketingDomain.findMarketingRequestByEmail(this, email);
  }
  findMarketingRepByReferenceId(referenceId: string) {
    return marketingDomain.findMarketingRepByReferenceId(this, referenceId);
  }
  addMarketingRequest(data: MarketingJoinRequest) {
    return marketingDomain.addMarketingRequest(this, data);
  }
  updateMarketingRequest(id: number, updates: Partial<MarketingJoinRequest>) {
    return marketingDomain.updateMarketingRequest(this, id, updates);
  }
  getMarketingRepresentatives(filter?: Parameters<typeof marketingDomain.getMarketingRepresentatives>[1]) {
    return marketingDomain.getMarketingRepresentatives(this, filter);
  }
  addMarketingRepresentative(data: Omit<MarketingRepresentative, 'id'>) {
    return marketingDomain.addMarketingRepresentative(this, data);
  }
  getMarketingEmailLogs(filter?: Parameters<typeof marketingDomain.getMarketingEmailLogs>[1]) {
    return marketingDomain.getMarketingEmailLogs(this, filter);
  }
  addMarketingEmailLog(log: MarketingEmailDispatchLog) {
    return marketingDomain.addMarketingEmailLog(this, log);
  }
}

// Global instance to prevent resets during server hot reloads
const globalForBackendStore = globalThis as unknown as {
  backendRepositoryInstance?: BackendRepository;
};

export const backendStore =
  globalForBackendStore.backendRepositoryInstance ?? new BackendRepository();

// Always preserve singleton across module reloads in all environments
globalForBackendStore.backendRepositoryInstance = backendStore;
