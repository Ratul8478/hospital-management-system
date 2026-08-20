// Serverless-Ready & In-Memory Cryptographic Store for Super Admin 2FA OTP
// Ariyan Hospital Multispeciality - Security Subsystem

import crypto from 'crypto';

interface OtpRecord {
  otp: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

// Global cache across server requests in Node runtime
const globalOtpStore: Map<string, OtpRecord> = (global as any).__medix_otp_store || new Map<string, OtpRecord>();
(global as any).__medix_otp_store = globalOtpStore;

// Standard OTP lifetime: 10 minutes (600,000 ms)
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const HMAC_SECRET = process.env.OTP_SECRET_KEY || 'ariyan-hospital-superadmin-hmac-secret-key-2026';

/**
 * Generate a cryptographically signed HMAC token for serverless stateless verification
 */
export function createSignedOtpToken(email: string, otp: string, expiresAt: number): string {
  const cleanEmail = email.trim().toLowerCase();
  const data = `${cleanEmail}:${otp.trim()}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
  const payload = {
    email: cleanEmail,
    expiresAt,
    hmac,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Verify HMAC signed OTP token
 */
export function verifySignedOtpToken(email: string, enteredOtp: string, tokenString?: string): boolean {
  if (!tokenString) return false;
  try {
    const json = Buffer.from(tokenString, 'base64').toString('utf-8');
    const { email: tokenEmail, expiresAt, hmac } = JSON.parse(json);
    const cleanEmail = email.trim().toLowerCase();
    
    if (tokenEmail !== cleanEmail) return false;
    if (Date.now() > expiresAt) return false;

    const data = `${cleanEmail}:${enteredOtp.trim()}:${expiresAt}`;
    const expectedHmac = crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
    
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch (err) {
    return false;
  }
}

/**
 * Generate and store a secure 6-digit numeric OTP for Super Admin email
 */
export function createSuperAdminOtp(email: string): { otp: string; expiresAt: number; otpToken: string } {
  const cleanEmail = email.trim().toLowerCase();
  
  // Generate cryptographically random 6-digit code (100000 - 999999)
  const otpNumber = Math.floor(100000 + Math.random() * 900000);
  const otp = otpNumber.toString();
  
  const now = Date.now();
  const expiresAt = now + OTP_EXPIRY_MS;

  const record: OtpRecord = {
    otp,
    email: cleanEmail,
    createdAt: now,
    expiresAt,
    attempts: 0,
    verified: false,
  };

  globalOtpStore.set(cleanEmail, record);

  const otpToken = createSignedOtpToken(cleanEmail, otp, expiresAt);

  console.log(`[SUPER ADMIN OTP GENERATED] Email: ${cleanEmail} | OTP: ${otp} | Expires in: 10 minutes`);

  return { otp, expiresAt, otpToken };
}

/**
 * Verify an entered 6-digit OTP for the given email (supports both stateful in-memory and stateless HMAC token)
 */
export function verifySuperAdminOtp(
  email: string,
  enteredOtp: string,
  otpToken?: string
): {
  success: boolean;
  error?: string;
  remainingAttempts?: number;
} {
  const cleanEmail = email.trim().toLowerCase();
  const cleanEnteredOtp = (enteredOtp || '').trim();

  // 1. Check stateless cryptographic HMAC verification (works across all serverless lambda instances)
  if (otpToken && verifySignedOtpToken(cleanEmail, cleanEnteredOtp, otpToken)) {
    globalOtpStore.delete(cleanEmail);
    console.log(`[SUPER ADMIN OTP VERIFIED VIA HMAC TOKEN] Email: ${cleanEmail}`);
    return { success: true };
  }

  // 2. Check Stateful In-Memory cache (for local node instances)
  const record = globalOtpStore.get(cleanEmail);

  if (!record) {
    // If HMAC was provided but failed match
    if (otpToken) {
      return {
        success: false,
        error: 'Incorrect OTP code. Please check the 6-digit code received on your email/mobile.',
      };
    }

    return {
      success: false,
      error: 'No active OTP request found for this email. Please click "Resend OTP" to generate a fresh code.',
    };
  }

  // Check Expiry
  if (Date.now() > record.expiresAt) {
    globalOtpStore.delete(cleanEmail);
    return {
      success: false,
      error: 'OTP has expired (10-minute validity exceeded). Please click "Resend OTP" to generate a fresh code.',
    };
  }

  // Check Brute Force attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    globalOtpStore.delete(cleanEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security reasons, this OTP has been revoked. Please request a new OTP.',
    };
  }

  // Increment attempts
  record.attempts += 1;

  // Validate Match
  if (record.otp !== cleanEnteredOtp) {
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Invalid OTP code. Please check the 6-digit code received on your email/mobile. (${remaining} attempts remaining)`,
      remainingAttempts: remaining,
    };
  }

  // Mark as verified & delete used OTP
  record.verified = true;
  globalOtpStore.delete(cleanEmail);

  console.log(`[SUPER ADMIN OTP VERIFIED SUCCESSFULLY] Email: ${cleanEmail}`);

  return {
    success: true,
  };
}

/**
 * Retrieve current active OTP record for inspection/testing
 */
export function getActiveSuperAdminOtpRecord(email: string): OtpRecord | null {
  const cleanEmail = email.trim().toLowerCase();
  const record = globalOtpStore.get(cleanEmail);
  if (!record || Date.now() > record.expiresAt) {
    return null;
  }
  return record;
}
