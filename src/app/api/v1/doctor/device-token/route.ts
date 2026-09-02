import { NextRequest } from 'next/server';
import { backendStore } from '@/lib/backend-store';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { verifyApiRequest } from '@/lib/api-auth';
import { sanitizeObject, detectSuspiciousPayload } from '@/lib/security';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyApiRequest(request, 'doctor');
    if (!authResult.authenticated) {
      return apiError(authResult.error || 'Unauthorized: Doctor session or valid API key required', authResult.statusCode || 401);
    }

    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch {
      return apiError('Invalid JSON payload in request body', 400);
    }

    const threatCheck = detectSuspiciousPayload(rawBody);
    if (threatCheck.isSuspicious) {
      return apiError('Security Alert: Malicious device token payload rejected.', 400);
    }

    const body = sanitizeObject(rawBody);
    const token = body?.deviceToken || body?.token || body?.fcmToken;

    if (!token || typeof token !== 'string' || token.trim().length < 8) {
      return apiError('Field "deviceToken" is required and must be at least 8 characters long.', 422, { field: 'deviceToken' });
    }
    if (token.trim().length > 1000) {
      return apiError('Field "deviceToken" exceeds maximum length of 1000 characters.', 422, { field: 'deviceToken' });
    }

    const validDeviceTypes = ['android', 'ios', 'web', 'tablet', 'mobile'];
    const normDeviceType = body?.deviceType ? String(body.deviceType).trim().toLowerCase() : 'android';
    if (body?.deviceType && !validDeviceTypes.includes(normDeviceType)) {
      return apiError('Field "deviceType" must be one of: android, ios, web, tablet, mobile.', 422, { field: 'deviceType' });
    }

    const doctorId = authResult.userId || (body?.doctorId ? parseInt(body.doctorId, 10) : undefined);

    const registration = backendStore.registerFCMToken({
      userId: doctorId || authResult.userName || 'doctor',
      doctorId,
      token: token.trim(),
      deviceType: (normDeviceType === 'ios' ? 'ios' : normDeviceType === 'web' ? 'web' : 'android') as 'web' | 'ios' | 'android',
      platform: body?.platform ? String(body.platform).trim() : 'android-doctor-app',
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return apiSuccess(
      {
        registered: true,
        deviceId: registration.id,
        deviceType: registration.deviceType,
        updatedAt: registration.updatedAt,
      },
      {
        status: 200,
        message: 'Doctor device push notification token registered successfully.',
      }
    );
  } catch (err: any) {
    return apiServerError('/api/v1/doctor/device-token POST', err);
  }
}
