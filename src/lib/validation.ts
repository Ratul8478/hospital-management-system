/**
 * ============================================================================
 * CENTRALIZED INPUT VALIDATION & SANITIZATION ENGINE
 * ----------------------------------------------------------------------------
 * Provides strict, reusable, production-ready schema and parameter validators
 * across all Medix Hospital API routes and domain handlers.
 * ============================================================================
 */

import { detectSuspiciousPayload, sanitizeString } from './security';

export interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  error?: string;
  code?: string;
}

/**
 * Validates and normalizes email addresses.
 */
export function validateEmail(email: unknown): ValidationResult<string> {
  if (typeof email !== 'string' || !email.trim()) {
    return {
      isValid: false,
      error: 'Validation Error: Email address is required.',
      code: 'MISSING_EMAIL',
    };
  }

  const threat = detectSuspiciousPayload(email);
  if (threat.isSuspicious) {
    return {
      isValid: false,
      error: 'Security Alert: Suspicious characters detected in email address.',
      code: 'FIREWALL_SECURITY_ALERT',
    };
  }

  const clean = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean) || clean.length > 254) {
    return {
      isValid: false,
      error: 'Validation Error: Please provide a valid email address format (e.g. name@domain.com).',
      code: 'INVALID_EMAIL_FORMAT',
    };
  }

  return { isValid: true, value: clean };
}

/**
 * Validates phone numbers (minimum 10 digits).
 */
export function validatePhone(phone: unknown): ValidationResult<string> {
  if (typeof phone !== 'string' || !phone.trim()) {
    return {
      isValid: false,
      error: 'Validation Error: Contact phone number is required.',
      code: 'MISSING_PHONE',
    };
  }

  const threat = detectSuspiciousPayload(phone);
  if (threat.isSuspicious) {
    return {
      isValid: false,
      error: 'Security Alert: Suspicious characters detected in phone number.',
      code: 'FIREWALL_SECURITY_ALERT',
    };
  }

  const clean = sanitizeString(phone.trim());
  const digitsOnly = clean.replace(/[^0-9]/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Validation Error: Phone number must contain between 10 and 15 digits.',
      code: 'INVALID_PHONE_LENGTH',
    };
  }

  return { isValid: true, value: clean };
}

/**
 * Validates password complexity and length.
 */
export function validatePassword(password: unknown, minLength = 8): ValidationResult<string> {
  if (typeof password !== 'string' || !password) {
    return {
      isValid: false,
      error: 'Validation Error: Password is required.',
      code: 'MISSING_PASSWORD',
    };
  }

  const threat = detectSuspiciousPayload(password);
  if (threat.isSuspicious) {
    return {
      isValid: false,
      error: 'Security Alert: Suspicious sequence detected in password field.',
      code: 'FIREWALL_SECURITY_ALERT',
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Validation Error: Password must be at least ${minLength} characters long.`,
      code: 'WEAK_PASSWORD',
    };
  }

  return { isValid: true, value: password };
}

/**
 * Validates required non-empty string fields.
 */
export function validateRequiredString(
  val: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 500
): ValidationResult<string> {
  if (typeof val !== 'string' || !val.trim()) {
    return {
      isValid: false,
      error: `Validation Error: ${fieldName} is required.`,
      code: `MISSING_${fieldName.toUpperCase().replace(/\s+/g, '_')}`,
    };
  }

  const threat = detectSuspiciousPayload(val);
  if (threat.isSuspicious) {
    return {
      isValid: false,
      error: `Security Alert: Suspicious characters detected in ${fieldName}.`,
      code: 'FIREWALL_SECURITY_ALERT',
    };
  }

  const clean = sanitizeString(val.trim());
  if (clean.length < minLength || clean.length > maxLength) {
    return {
      isValid: false,
      error: `Validation Error: ${fieldName} must be between ${minLength} and ${maxLength} characters.`,
      code: `INVALID_${fieldName.toUpperCase().replace(/\s+/g, '_')}_LENGTH`,
    };
  }

  return { isValid: true, value: clean };
}

/**
 * Validates enum values against an allowed set.
 */
export function validateEnum<T extends string>(
  val: unknown,
  allowedValues: readonly T[],
  fieldName: string
): ValidationResult<T> {
  if (typeof val !== 'string' || !val.trim()) {
    return {
      isValid: false,
      error: `Validation Error: ${fieldName} is required.`,
      code: `MISSING_${fieldName.toUpperCase().replace(/\s+/g, '_')}`,
    };
  }

  const clean = val.trim() as T;
  if (!allowedValues.includes(clean)) {
    return {
      isValid: false,
      error: `Validation Error: Invalid ${fieldName} "${val}". Allowed values: ${allowedValues.join(', ')}`,
      code: `INVALID_${fieldName.toUpperCase().replace(/\s+/g, '_')}_ENUM`,
    };
  }

  return { isValid: true, value: clean };
}

/**
 * Validates positive numbers (e.g. fees, quantities).
 */
export function validatePositiveNumber(
  val: unknown,
  fieldName: string,
  min = 0,
  max = 10000000
): ValidationResult<number> {
  const num = Number(val);
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `Validation Error: ${fieldName} must be a valid number.`,
      code: `INVALID_${fieldName.toUpperCase().replace(/\s+/g, '_')}_NUMBER`,
    };
  }

  if (num < min || num > max) {
    return {
      isValid: false,
      error: `Validation Error: ${fieldName} must be between ${min} and ${max}.`,
      code: `OUT_OF_RANGE_${fieldName.toUpperCase().replace(/\s+/g, '_')}`,
    };
  }

  return { isValid: true, value: num };
}
