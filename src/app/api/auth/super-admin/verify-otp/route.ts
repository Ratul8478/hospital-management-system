import { NextResponse } from 'next/server';
import { verifySuperAdminOtp } from '@/lib/otp-store';
import { detectSuspiciousPayload, generateSecureToken } from '@/lib/security';
import { DEFAULT_SUPER_ADMIN_PROFILE } from '@/lib/data';
import { registerSuperAdminSession } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, otpToken } = body;

    // 1. Basic validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit OTP are required.' },
        { status: 400 }
      );
    }

    // 2. Threat detection
    const otpThreat = detectSuspiciousPayload(otp);
    if (otpThreat.isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Security pattern violation blocked by firewall.' },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // 3. Verify OTP against stateless HMAC token and in-memory store
    const verificationResult = verifySuperAdminOtp(cleanEmail, cleanOtp, otpToken);

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error || 'Invalid OTP code. Please check your email inbox.',
          remainingAttempts: verificationResult.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // 4. Successful verification - generate cryptographically secure session token and register session
    const sessionToken = `sa_live_token_${Date.now()}_${generateSecureToken(32)}`;
    registerSuperAdminSession(sessionToken, cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Super Admin 2FA Identity Verified Successfully! Unlocking Master Command Dashboard.',
      token: sessionToken,
      user: {
        role: 'super_admin',
        email: cleanEmail,
        name: 'Anichul Haque (Super Admin)',
        hospital: DEFAULT_SUPER_ADMIN_PROFILE.hospitalName || 'ARIYAN HOSPITAL MULTISPECIALITY',
        govtRegNumber: DEFAULT_SUPER_ADMIN_PROFILE.govtRegNumber || 'WB.33735581',
      },
    });
  } catch (error: any) {
    console.error('[VERIFY OTP API ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying OTP.' },
      { status: 500 }
    );
  }
}

