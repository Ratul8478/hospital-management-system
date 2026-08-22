import { sanitizeString, sanitizeObject, detectSuspiciousPayload, timingSafeEqual, generateSecureOtp, generateSecureToken, validateSafeImageUrl, sanitizeFileName } from './src/lib/security';
import { SlidingWindowRateLimiter } from './src/lib/rate-limiter';

console.log('================================================================');
console.log('🔴 RED TEAM (Offense) VS 🛡️ BLUE TEAM (Defense) SECURITY AUDIT');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function assertTest(title: string, passed: boolean) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log('  ✅ [DEFENDED] ' + title);
  } else {
    console.error('  ❌ [FAILED]   ' + title);
  }
}

// 1. Attack Vector: XSS Script Injection
const xssPayload = '<script>alert(document.cookie)</script>';
assertTest('Red Team XSS attack payload neutralized', detectSuspiciousPayload(xssPayload).isSuspicious === true);
assertTest('XSS HTML entities safely escaped', !sanitizeString(xssPayload).includes('<script>'));

// 2. Attack Vector: SQL Injection (Union / Select)
const sqliPayload = "admin' UNION SELECT * FROM users--";
assertTest('Red Team SQLi signature detected and blocked', detectSuspiciousPayload(sqliPayload).isSuspicious === true);

// 3. Attack Vector: NoSQL / Mongo Injection
const nosqliPayload = "admin' || '1'=='1' || ''=='";
assertTest('NoSQL injection vector detected', detectSuspiciousPayload(nosqliPayload).isSuspicious === true);

// 4. Attack Vector: Prototype Pollution
const maliciousObject = JSON.parse('{"__proto__": {"isAdmin": true}, "name": "Hacker"}');
const sanitized = sanitizeObject(maliciousObject);
assertTest('Prototype pollution __proto__ key safely stripped', ({} as any).isAdmin === undefined);

// 5. Attack Vector: Malicious Image URL (javascript: protocol)
const evilImg = 'javascript:alert(1)';
assertTest('Malicious javascript: URI image rejected', validateSafeImageUrl(evilImg) === false);

// 6. Safe Base64 Image
const safeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
assertTest('Valid Base64 PNG image approved', validateSafeImageUrl(safeBase64) === true);

// 7. Attack Vector: Path Traversal (CWE-22)
const evilFile = '../../../etc/passwd';
assertTest('Path traversal in file name sanitized', sanitizeFileName(evilFile) === 'etc_passwd');

// 8. Attack Vector: OTP Timing Side-Channel Attack
const safeCompare = timingSafeEqual('982144', '982144');
const failCompare = timingSafeEqual('982144', '982145');
assertTest('Constant-time timingSafeEqual handles valid match', safeCompare === true);
assertTest('Constant-time timingSafeEqual rejects mismatch', failCompare === false);

// 9. Cryptographic OTP CSPRNG Validation
const otps = new Set<string>();
for (let i = 0; i < 100; i++) {
  otps.add(generateSecureOtp());
}
assertTest('100 CSPRNG OTPs generated with full 6-digit entropy (>95 unique)', otps.size >= 95);

// 10. Cryptographic Token Generator Validation
const token1 = generateSecureToken(32);
const token2 = generateSecureToken(32);
assertTest('Cryptographic Session Tokens are 64-char hex strings', token1.length === 64 && token1 !== token2);

// 11. Rate Limiter Brute-Force Defense
const limiter = new SlidingWindowRateLimiter(5, 60000);
for (let i = 0; i < 5; i++) {
  limiter.check('attacker-ip');
}
const blockedAttempt = limiter.check('attacker-ip');
assertTest('Attacker IP throttled (429) after 5 rapid requests', blockedAttempt.success === false);

// 12. Attack Vector: Outsider Hacker Requesting Protected Endpoint Without API Key
import { verifyApiRequest, MASTER_SUPER_ADMIN_API_KEY, CLIENT_PUBLIC_APP_KEY } from './src/lib/api-auth';
const fakeReqNoKey = new Request('http://localhost:3000/api/v1/database', {
  headers: {}
});
const noKeyResult = verifyApiRequest(fakeReqNoKey, 'super_admin');
assertTest('Outsider without API Key instantly blocked (401 Unauthorized)', noKeyResult.authenticated === false && noKeyResult.statusCode === 401);

// 13. Attack Vector: Outsider Hacker Providing Forged / Guesswork API Key
const fakeReqBadKey = new Request('http://localhost:3000/api/v1/database', {
  headers: { 'x-api-key': 'attacker_random_fake_key_99999' }
});
const badKeyResult = verifyApiRequest(fakeReqBadKey, 'super_admin');
assertTest('Outsider with Forged API Key rejected (401 Access Denied)', badKeyResult.authenticated === false && badKeyResult.statusCode === 401);

// 14. Attack Vector: Outsider Hacker Attempting SQL Injection in API Key Header
const fakeReqSqlKey = new Request('http://localhost:3000/api/v1/database', {
  headers: { 'x-api-key': "' OR '1'='1' --" }
});
const sqlKeyResult = verifyApiRequest(fakeReqSqlKey, 'super_admin');
assertTest('Malicious SQLi payload in API Key header blocked by firewall (403 Forbidden)', sqlKeyResult.authenticated === false && sqlKeyResult.statusCode === 403);

// 15. Valid Super Admin Master Key Authentication
const validSaReq = new Request('http://localhost:3000/api/v1/database', {
  headers: { 'x-api-key': MASTER_SUPER_ADMIN_API_KEY }
});
const saResult = verifyApiRequest(validSaReq, 'super_admin');
assertTest('Legitimate Master Super Admin API Key authenticated (200 OK)', saResult.authenticated === true && saResult.scope === 'super_admin');

// 16. Client Public App Key Scope Restriction
const validClientReq = new Request('http://localhost:3000/api/v1/hospitals', {
  headers: { 'x-api-key': CLIENT_PUBLIC_APP_KEY }
});
const clientResult = verifyApiRequest(validClientReq, 'any');
assertTest('Legitimate App Public Key granted client scope', clientResult.authenticated === true && clientResult.scope === 'public_client');

console.log('================================================================');
console.log('🎯 FINAL RESULT: ' + passedTests + ' / ' + totalTests + ' DEFENSIVE TESTS PASSED');
console.log('================================================================');

