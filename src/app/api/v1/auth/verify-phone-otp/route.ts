import { NextRequest } from 'next/server';
import { apiSuccess, apiError, apiServerError, handleOptions } from '@/lib/api-response';
import { validatePhone, validateRequiredString } from '@/lib/validation';
import { verifyPhoneOtp } from '@/lib/otp-store';

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

    const { phone, otp, otpToken } = body || {};

    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      return apiError(phoneVal.error!, phoneVal.code, phoneVal.code === 'FIREWALL_SECURITY_ALERT' ? 400 : 422);
    }

    const otpVal = validateRequiredString(otp, 'OTP code', 6, 6);
    if (!otpVal.isValid) {
      return apiError('Validation Error: Please enter a valid 6-digit OTP code.', 'INVALID_OTP_FORMAT', 422);
    }

    const cleanPhone = phoneVal.value!;
    const cleanOtp = otpVal.value!;

    const verifyResult = verifyPhoneOtp(cleanPhone, cleanOtp, otpToken);

    if (!verifyResult.success) {
      return apiError(
        verifyResult.error || 'Invalid or expired OTP code.',
        'INVALID_OTP',
        400,
        { remainingAttempts: verifyResult.remainingAttempts }
      );
    }

    return apiSuccess({
      phone: cleanPhone,
      verified: true,
      message: `Phone number ${cleanPhone} has been verified successfully.`,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
