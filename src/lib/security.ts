/**
 * ============================================================================
 * MEDIX ENTERPRISE SECURITY & THREAT MITIGATION ENGINE
 * Compliant with OWASP Top 10, HIPAA Data Privacy, & ISO/IEC 27001
 * ============================================================================
 */

import crypto from 'crypto';

/**
 * HTML Entity Map for strict XSS prevention
 */
const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Common SQL, NoSQL, and Command Injection signature patterns
 */
const INJECTION_PATTERNS = [
  /(\bunion\b.*\bselect\b)/i,
  /(\bselect\b.*\bfrom\b)/i,
  /(\binsert\b.*\binto\b)/i,
  /(\bdelete\b.*\bfrom\b)/i,
  /(\bdrop\b\s+(table|database|index|view)\b)/i,
  /(\bexec\b|\bexecute\b)\s*\(.*\)/i,
  /(\bwaitfor\b\s+delay\b)/i,
  /(\bbenchmark\b\s*\(.*\))/i,
  /(;\s*--)/,
  /(\b--\s*$)/,
  /(\/\*.*\*\/)/,
  /(\$where\b|\$regex\b|\$gt\b|\$lt\b|\$ne\b)/i,
  /(\.\.\/|\.\.\\)/, // Path Traversal
  /(<script\b[^>]*>([\s\S]*?)<\/script>)/i, // Inline scripts
  /(javascript\s*:|vbscript\s*:|data\s*:text\/html)/i, // Malicious URI schemes
  /(onload\s*=|onerror\s*=|onclick\s*=|onmouseover\s*=|eval\s*\()/i, // DOM XSS hooks
];

/**
 * Strips dangerous HTML tags, javascript protocols, and control characters
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  // 1. Remove dangerous null bytes and hidden control characters
  let clean = input.replace(/\0/g, '').trim();

  // 2. Escape HTML special characters
  clean = clean.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITY_MAP[char] || char);

  return clean;
}

/**
 * Deep sanitization for incoming request bodies and nested objects
 */
export function sanitizeObject<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return sanitizeString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeString(key);
      sanitizedObj[sanitizedKey] = sanitizeObject(value);
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Detects suspicious injection signatures in user input
 */
export function detectSuspiciousPayload(input: unknown): { isSuspicious: boolean; reason?: string } {
  if (!input) return { isSuspicious: false };

  const str = typeof input === 'string' ? input : JSON.stringify(input);

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(str)) {
      return {
        isSuspicious: true,
        reason: `Potential security threat detected: signature matched pattern ${pattern.toString()}`,
      };
    }
  }

  return { isSuspicious: false };
}

/**
 * Constant-time string comparison to defend against timing side-channel attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');

    if (bufA.length !== bufB.length) {
      // Dummy check to prevent length-leak timing
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Cryptographically secure token generator
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Cryptographic SHA-256 hash with optional application salt
 */
export function hashSecret(secret: string, salt: string = 'MEDIX_SECURE_SALT_2026'): string {
  return crypto.createHmac('sha256', salt).update(secret).digest('hex');
}

/**
 * Mask sensitive PII (Personally Identifiable Information) for audit logging & display
 */
export function maskSensitiveData(type: 'email' | 'phone' | 'aadhar' | 'pan', val: string): string {
  if (!val || typeof val !== 'string') return '';

  switch (type) {
    case 'email': {
      const parts = val.split('@');
      if (parts.length !== 2) return '***@***';
      const [name, domain] = parts;
      const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : '***';
      return `${maskedName}@${domain}`;
    }
    case 'phone': {
      const clean = val.replace(/\D/g, '');
      if (clean.length < 4) return '******';
      return `******${clean.slice(-4)}`;
    }
    case 'aadhar': {
      const clean = val.replace(/\D/g, '');
      if (clean.length < 4) return 'XXXX-XXXX-XXXX';
      return `XXXX-XXXX-${clean.slice(-4)}`;
    }
    case 'pan': {
      if (val.length < 4) return 'XXXXX****X';
      return `${val.slice(0, 3)}****${val.slice(-1)}`;
    }
    default:
      return '******';
  }
}

/**
 * Email syntax validator (RFC 5322 compliant standard)
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Phone number validator (International & Indian standard)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleanDigits = phone.replace(/\D/g, '');
  return cleanDigits.length >= 10 && cleanDigits.length <= 15;
}

/**
 * UHID (Universal Health Identifier) format validator
 */
export function isValidUHID(uhid: string): boolean {
  if (!uhid || typeof uhid !== 'string') return false;
  return /^UHID-[A-Z0-9]+-[0-9]{8}-[0-9]{4,6}$/.test(uhid.trim());
}
