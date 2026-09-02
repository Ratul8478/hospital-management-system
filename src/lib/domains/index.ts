/**
 * Domain Modules Barrel Export
 *
 * Re-exports all domain types and functions for direct access.
 * API routes typically import from '@/lib/backend-store' instead.
 */

// Types & permissions (single source of truth)
export * from './types';

// Domain functions
export * as auth from './auth';
export * as hospital from './hospital';
export * as doctor from './doctor';
export * as appointment from './appointment';
export * as clinical from './clinical';
export * as patient from './patient';
export * as notification from './notification';
export * as referral from './referral';
export * as marketing from './marketing';

// Location (standalone, not part of BackendRepository)
export { getAllStates, getDistrictsByState, isValidState, isValidDistrictForState } from '../location-data';
export type { StateLocation } from '../location-data';
