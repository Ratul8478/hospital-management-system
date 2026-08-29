import { NextResponse } from 'next/server';
import { createSuperAdminOtp } from '@/lib/otp-store';
import { sendSuperAdminOtpEmail } from '@/lib/email-service';
import { detectSuspiciousPayload } from '@/lib/security';
import { DEFAULT_SUPER_ADMIN_PROFILE } from '@/lib/data';

// Target credentials strictly required for Super Admin
const ALLOWED_SUPER_ADMIN_EMAILS = [
  'ariyanhospital9@gmail.com',
  DEFAULT_SUPER_ADMIN_PROFILE.email.toLowerCase(),
  'varshahealth01@gmail.com',
];

const ALLOWED_SUPER_ADMIN_PASSWORDS = [
  'admin@2019',
  DEFAULT_SUPER_ADMIN_PROFILE.password,
  'Saanvi@786',
];

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
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Security Threat & Injection Firewall check
    const emailThreat = detectSuspiciousPayload(email);
    const passThreat = detectSuspiciousPayload(password);
    if (emailThreat.isSuspicious || passThreat.isSuspicious) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security Warning: Malicious input pattern blocked by firewall.',
        },
        { status: 403 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 3. Strict Super Admin Credential Check
    const isEmailValid = ALLOWED_SUPER_ADMIN_EMAILS.includes(cleanEmail);
    const isPasswordValid = ALLOWED_SUPER_ADMIN_PASSWORDS.includes(cleanPassword);

    if (!isEmailValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication Failed: Unrecognized Super Admin email. Please enter "ariyanhospital9@gmail.com".',
        },
        { status: 401 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication Failed: Invalid password for Super Admin. Please enter "admin@2019".',
        },
        { status: 401 }
      );
    }

    // 4. Generate real-time 6-digit OTP and signed serverless token
    const { otp, expiresAt, otpToken } = createSuperAdminOtp(cleanEmail);

    // 5. Send Real-Time Email via Nodemailer/SMTP
    const emailResult = await sendSuperAdminOtpEmail({
      to: cleanEmail,
      otp,
      adminName: 'Anichul Haque (Super Admin)',
      hospitalName: DEFAULT_SUPER_ADMIN_PROFILE.hospitalName || 'ARIYAN HOSPITAL MULTISPECIALITY',
    });

    const hasRealSmtp = Boolean(
      process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.RESEND_API_KEY
    );

    return NextResponse.json({
      success: true,
      message: emailResult.mode === 'real_smtp'
        ? `Real-time OTP has been delivered to ${cleanEmail}. Please check your inbox / spam folder.`
        : `Real-time OTP generated for ${cleanEmail}.`,
      email: cleanEmail,
      expiresAt,
      expiresInSeconds: 600,
      otpToken,
      deliveryMode: emailResult.mode,
      deliveryInfo: emailResult.info,
      // Always provide the OTP code since real SMTP is not set up yet
      devOtp: otp,
    });
  } catch (error: any) {
    console.error('[SEND OTP API ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
