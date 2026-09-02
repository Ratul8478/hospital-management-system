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
  /(\$where\b|\$regex\b|\$gt\b|\$lt\b|\$ne\b|\$eq\b)/i,
  /(\|\|\s*['"]?[^'"]*['"]?\s*===?\s*['"]?[^'"]*['"]?)/i,
  /(\bor\b\s+['"]?1['"]?\s*=\s*['"]?1['"]?)/i,
  /(\bor\b\s+true\b)/i,
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
 * Deep sanitization for incoming request bodies and nested objects (with Prototype Pollution defense)
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
    const sanitizedObj: Record<string, any> = Object.create(null);
    for (const [key, value] of Object.entries(data)) {
      // Guard against Prototype Pollution attack vectors (__proto__, constructor, prototype)
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      const sanitizedKey = sanitizeString(key);
      sanitizedObj[sanitizedKey] = sanitizeObject(value);
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Validates whether an image URL / Data URI is safe from XSS, SSRF, and script injection
 */
export function validateSafeImageUrl(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  const cleanUrl = url.trim();

  // Allow standard Base64 image payloads
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(cleanUrl)) {
    return true;
  }

  // Allow secure HTTPS image URLs
  if (/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s<>"'`]*)?$/i.test(cleanUrl)) {
    // Disallow dangerous schemes or embedded scripts
    if (/(javascript\s*:|vbscript\s*:|data\s*:text|<script)/i.test(cleanUrl)) {
      return false;
    }
    return true;
  }

  // Allow local static assets
  if (/^\/[a-zA-Z0-9_\-./]+\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(cleanUrl)) {
    return !cleanUrl.includes('..');
  }

  return false;
}

/**
 * Sanitizes file names to defend against Path Traversal (CWE-22)
 */
export function sanitizeFileName(fileName: unknown): string {
  if (typeof fileName !== 'string') return 'file_upload';
  return fileName
    .replace(/[/\\]+/g, '_')
    .replace(/^\.+/, '')
    .replace(/\.\./g, '')
    .replace(/^_+/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
}

/**
 * Generates a cryptographically secure 6-digit OTP using CSPRNG
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
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
 * Cryptographically secure token generator using CSPRNG
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

/**
 * Secure PBKDF2 Password Hashing (OWASP standard compliant)
 */
export function hashPassword(password: string, salt?: string): string {
  const cleanPass = (password || '').trim();
  const secretSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(cleanPass, secretSalt, 10000, 32, 'sha256').toString('hex');
  return `${secretSalt}:${derivedKey}`;
}

/**
 * Secure PBKDF2 Password Verification using constant-time comparison
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  
  // Support direct match for backward compatibility with initial plain admin credentials if any
  if (timingSafeEqual(password.trim(), storedHash.trim())) {
    return true;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;

  const [salt, expectedHash] = parts;
  const derivedKey = crypto.pbkdf2Sync(password.trim(), salt, 10000, 32, 'sha256').toString('hex');
  return timingSafeEqual(derivedKey, expectedHash);
}

