/**
 * Notification Domain
 *
 * Handles FCM push notification token registration and lookup.
 */

import type { RepositoryState, FCMRegistration } from './types';

export function registerFCMToken(
  state: RepositoryState,
  data: {
    userId: string | number;
    doctorId?: number;
    token: string;
    deviceType?: 'web' | 'ios' | 'android';
    platform?: string;
    userAgent?: string;
  }
): FCMRegistration {
  const existingIndex = state.fcmTokens.findIndex((t) => t.token === data.token);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updated: FCMRegistration = {
      ...state.fcmTokens[existingIndex],
      userId: data.userId,
      doctorId: data.doctorId,
      deviceType: data.deviceType || state.fcmTokens[existingIndex].deviceType,
      platform: data.platform || state.fcmTokens[existingIndex].platform,
      userAgent: data.userAgent || state.fcmTokens[existingIndex].userAgent,
      updatedAt: now,
    };
    state.fcmTokens[existingIndex] = updated;
    return updated;
  }

  const nextId = Math.max(...state.fcmTokens.map((t) => t.id), 0) + 1;
  const newReg: FCMRegistration = {
    id: nextId,
    userId: data.userId,
    doctorId: data.doctorId,
    token: data.token,
    deviceType: data.deviceType || 'web',
    platform: data.platform || 'web-browser',
    userAgent: data.userAgent,
    createdAt: now,
    updatedAt: now,
  };

  state.fcmTokens.push(newReg);
  return newReg;
}

export function getFCMTokens(
  state: RepositoryState,
  userIdOrDoctorId?: string | number
): FCMRegistration[] {
  if (!userIdOrDoctorId) return state.fcmTokens;
  return state.fcmTokens.filter(
    (t) =>
      String(t.userId) === String(userIdOrDoctorId) ||
      (t.doctorId && String(t.doctorId) === String(userIdOrDoctorId))
  );
}
