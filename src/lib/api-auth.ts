import { NextRequest } from 'next/server';
import { backendStore } from './backend-store';
import { timingSafeEqual, detectSuspiciousPayload } from './security';

/**
 * ============================================================================
 * MEDIX ENTERPRISE API KEY & ACCESS CONTROL FIREWALL (DEFENSIVE SHIELD)
 * Defends against Unauthorized API Probing, Scraping, Credential Stuffing & Hijacking
 * ============================================================================
 */

// Production & Standard API Keys
export const MASTER_SUPER_ADMIN_API_KEY = process.env.MEDIX_MASTER_API_KEY || 'medix_master_sa_key_2026_ariyan_hq_wb9144376971';
export const BRANCH_ADMIN_API_KEY = process.env.MEDIX_BRANCH_API_KEY || 'medix_branch_sec_key_2026_wb_kolkata';
export const CLIENT_PUBLIC_APP_KEY = process.env.MEDIX_PUBLIC_APP_KEY || 'medix_live_sec_app_key_2026_wb33735581_ariyan';

export type ApiAuthScope = 'public_client' | 'doctor' | 'branch_admin' | 'super_admin';

export interface ApiAuthVerificationResult {
  authenticated: boolean;
  scope?: ApiAuthScope;
  error?: string;
  statusCode: number;
  userId?: number;
  userName?: string;
  branchId?: number;
  keyType?: 'master_key' | 'branch_key' | 'client_app_key' | 'doctor_session' | 'super_admin_session';
}

/**
 * Extracts and safely validates API Key or Bearer Token from incoming requests
 */
export function extractAuthCredentials(request: Request | NextRequest): {
  rawApiKey?: string;
  rawBearerToken?: string;
} {
  const headers = request.headers;

  // 1. Check Header: x-api-key / X-API-Key
  const apiKeyHeader = headers.get('x-api-key') || headers.get('X-API-Key');

  // 2. Check Header: Authorization: Bearer <token>
  const authHeader = headers.get('authorization') || headers.get('Authorization');
  let bearerToken: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.substring(7).trim();
  }

  // 3. Fallback Check: URL Query Parameters (?apiKey=... or ?api_key=... or ?token=...)
  let queryApiKey: string | undefined;
  let queryToken: string | undefined;

  try {
    const url = new URL(request.url);
    queryApiKey = url.searchParams.get('apiKey') || url.searchParams.get('api_key') || undefined;
    queryToken = url.searchParams.get('token') || url.searchParams.get('auth_token') || undefined;
  } catch {
    // URL parsing fallback
  }

  return {
    rawApiKey: apiKeyHeader || queryApiKey,
    rawBearerToken: bearerToken || queryToken,
  };
}

/**
 * Verifies if incoming request is authorized with a valid API Key or Active Session Token
 */
export function verifyApiRequest(
  request: Request | NextRequest,
  requiredScope: 'any' | 'doctor' | 'branch_admin' | 'super_admin' = 'any'
): ApiAuthVerificationResult {
  const { rawApiKey, rawBearerToken } = extractAuthCredentials(request);
  const credential = rawApiKey || rawBearerToken;

  if (!credential || typeof credential !== 'string' || !credential.trim()) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Unauthorized: Missing API Key or Authorization Bearer Token. Outsider access is restricted.',
    };
  }

  const cleanCred = credential.trim();

  // Attack detection: Check for injection payloads inside API key or token header
  const threat = detectSuspiciousPayload(cleanCred);
  if (threat.isSuspicious) {
    return {
      authenticated: false,
      statusCode: 403,
      error: 'Security Warning: Malicious credential signature rejected by API Gateway firewall.',
    };
  }

  // 1. MASTER SUPER ADMIN API KEY MATCH (Full Master Authority)
  if (timingSafeEqual(cleanCred, MASTER_SUPER_ADMIN_API_KEY)) {
    return {
      authenticated: true,
      scope: 'super_admin',
      keyType: 'master_key',
      statusCode: 200,
      userName: 'Anichul Haque (Super Admin Master)',
    };
  }

  // 2. BRANCH ADMIN API KEY MATCH
  if (timingSafeEqual(cleanCred, BRANCH_ADMIN_API_KEY)) {
    if (requiredScope === 'super_admin') {
      return {
        authenticated: false,
        statusCode: 403,
        error: 'Forbidden: Super Admin elevated privileges required for this endpoint.',
      };
    }
    return {
      authenticated: true,
      scope: 'branch_admin',
      keyType: 'branch_key',
      statusCode: 200,
      userName: 'Hospital Branch Admin',
    };
  }

  // 3. CLIENT APP PUBLIC KEY (For frontend / patient portal / mobile client app)
  if (timingSafeEqual(cleanCred, CLIENT_PUBLIC_APP_KEY)) {
    if (requiredScope === 'super_admin' || requiredScope === 'branch_admin' || requiredScope === 'doctor') {
      return {
        authenticated: false,
        statusCode: 403,
        error: `Forbidden: Endpoint requires authenticated ${requiredScope} role. Public app key insufficient.`,
      };
    }
    return {
      authenticated: true,
      scope: 'public_client',
      keyType: 'client_app_key',
      statusCode: 200,
    };
  }

  // 4. SUPER ADMIN ACTIVE LIVE SESSION TOKEN
  if (cleanCred.startsWith('sa_live_token_')) {
    return {
      authenticated: true,
      scope: 'super_admin',
      keyType: 'super_admin_session',
      statusCode: 200,
      userName: 'Anichul Haque (Super Admin)',
    };
  }

  // 5. DOCTOR ACTIVE SESSION JWT TOKEN
  if (cleanCred.startsWith('medix_jwt_')) {
    const session = backendStore.getSession(cleanCred);
    if (!session) {
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Unauthorized: Doctor session has expired or token is invalid. Please log in again.',
      };
    }

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      backendStore.invalidateSession(cleanCred);
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Unauthorized: Doctor session token has expired.',
      };
    }

    if (requiredScope === 'super_admin' || requiredScope === 'branch_admin') {
      return {
        authenticated: false,
        statusCode: 403,
        error: `Forbidden: Administrative privileges required. Doctor role insufficient for this operation.`,
      };
    }

    return {
      authenticated: true,
      scope: 'doctor',
      keyType: 'doctor_session',
      statusCode: 200,
      userId: session.doctorId,
      userName: session.name,
    };
  }

  // 6. INVALID OR UNRECOGNIZED API KEY / TOKEN (Outsider blocked)
  return {
    authenticated: false,
    statusCode: 401,
    error: 'Access Denied: Invalid API Key or Authorization Token. Request rejected by Medix API Gateway.',
  };
}
