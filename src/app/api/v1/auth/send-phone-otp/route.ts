import { NextRequest } from 'next/server';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { validatePhone } from '@/lib/validation';
import { createPhoneOtp } from '@/lib/otp-store';
import { sendPhoneOtpSms } from '@/lib/sms-service';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return apiError('Malformed JSON: Request body must be a valid JSON object.', 'MALFORMED_JSON', 400);
    }

    const { phone, purpose = 'registration' } = body || {};

    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      return apiError(phoneVal.error!, phoneVal.code, phoneVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    const cleanPhone = phoneVal.value!;

    // Generate secure 6-digit OTP
    const { otp, expiresAt, otpToken } = createPhoneOtp(cleanPhone, purpose);

    // Dispatch SMS via provider
    const smsResult = await sendPhoneOtpSms({
      to: cleanPhone,
      otp,
      purpose,
    });

    if (!smsResult.success) {
      return apiError(
        smsResult.error || 'Failed to dispatch SMS OTP. Please check the mobile number and try again.',
        'SMS_DISPATCH_FAILED',
        500
      );
    }

    return apiSuccess({
      phone: cleanPhone,
      otpToken,
      expiresAt,
      message: `6-digit verification code has been dispatched to ${cleanPhone}.`,
      provider: smsResult.provider,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
