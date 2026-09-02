import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('doctorId') || undefined;

    const tokens = backendStore.getFCMTokens(userId);

    return apiSuccess(tokens, {
      status: 200,
      message: 'Registered device push notification tokens retrieved.',
      meta: { count: tokens.length },
    });
  } catch (err: any) {
    console.error('Error in /api/v1/notifications/fcm-token GET:', err);
    return apiError(err?.message || 'Failed to fetch notification tokens', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'any');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: API Key or Doctor Token required', authResult.statusCode || 401);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const { token, fcmToken, registrationToken, userId, doctorId, deviceType, platform } = body || {};
    const fcmKey = token || fcmToken || registrationToken;

    if (!fcmKey || typeof fcmKey !== 'string' || fcmKey.trim().length < 8) {
      return apiError('Field "token" is required and must be at least 8 characters long.', 422, {
        field: 'token',
      });
    }
    if (fcmKey.trim().length > 1000) {
      return apiError('Field "token" exceeds maximum length of 1000 characters.', 422, {
        field: 'token',
      });
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    const registration = backendStore.registerFCMToken({
      userId: userId || doctorId || authResult.userName || 'client',
      doctorId: doctorId ? parseInt(String(doctorId), 10) : undefined,
      token: fcmKey.trim(),
      deviceType: (deviceType === 'ios' ? 'ios' : deviceType === 'web' ? 'web' : 'android') as 'web' | 'ios' | 'android',
      platform: platform ? String(platform).trim() : 'mobile',
      userAgent,
    });

    return apiSuccess(registration, {
      status: 201,
      message: 'Doctor device push notification FCM token registered successfully.',
    });
  } catch (err: any) {
    console.error('Error in /api/v1/notifications/fcm-token POST:', err);
    return apiError(err?.message || 'Failed to register FCM device token', 500);
  }
}
