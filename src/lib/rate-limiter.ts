/**
 * ============================================================================
 * MEDIX ENTERPRISE IN-MEMORY RATE LIMITER & BRUTE-FORCE DEFENDER
 * Prevents DDoS, Credential Stuffing, & API Scraping Attacks
 * ============================================================================
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowSizeMs: number;
  private lastCleanupTime = Date.now();

  constructor(maxRequests: number = 60, windowSizeMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowSizeMs = windowSizeMs;
  }

  public check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    // Periodic cleanup of stale records every 5 minutes
    if (now - this.lastCleanupTime > 300000) {
      this.cleanup(windowStart);
      this.lastCleanupTime = now;
    }

    let record = this.cache.get(identifier);

    if (!record) {
      record = { timestamps: [] };
      this.cache.set(identifier, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetTimeMs = Math.max(0, oldestInWindow + this.windowSizeMs - now);

      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetTimeMs,
      };
    }

    // Record this request
    record.timestamps.push(now);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.timestamps.length,
      resetTimeMs: this.windowSizeMs,
    };
  }

  private cleanup(windowStart: number): void {
    for (const [key, record] of this.cache.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Pre-configured rate limiting policies:
 */

// 1. Auth Limit: 60 attempts per minute per IP (Defends against brute-forcing)
export const authRateLimiter = new SlidingWindowRateLimiter(60, 60000);

// 2. Standard API Limit: 300 requests per minute per IP
export const apiRateLimiter = new SlidingWindowRateLimiter(300, 60000);

// 3. Mutation / Registration Limit: 60 submissions per minute per IP
export const registrationRateLimiter = new SlidingWindowRateLimiter(60, 60000);
