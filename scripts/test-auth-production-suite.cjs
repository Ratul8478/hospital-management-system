/**
 * Comprehensive Production Authentication & Authorization Test Suite
 * Tests all 14 scenarios required for high-assurance healthcare production environments.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path || '/', BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✘ FAIL:\x1b[0m ${message}`);
    if (details) console.error(`    \x1b[33mDetails:\x1b[0m`, details);
    failed++;
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🚀 MEDIX AUTHENTICATION & AUTHORIZATION PRODUCTION TEST SUITE');
  console.log('================================================================\n');

  const uniqueId = Date.now();
  const testEmail = `patient.auth.${uniqueId}@example.com`;
  const testPhone = `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPassword = 'SecurePassword@2026';
  let verificationToken = '';
  let sessionToken = '';
  let refreshToken = '';

  // -------------------------------------------------------------
  // TEST 1: SIGNUP (Normal User Creation)
  // -------------------------------------------------------------
  console.log('--- 1. Testing Signup Endpoint ---');
  const signupRes = await request(
    { path: '/api/v1/auth/signup', method: 'POST' },
    {
      name: 'Rohan Deshmukh',
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      confirmPassword: testPassword,
      role: 'patient',
    }
  );

  assert(
    signupRes.statusCode === 201,
    'Signup returns HTTP 201 Created',
    `Status: ${signupRes.statusCode}`
  );
  assert(
    signupRes.data?.data?.requiresVerification === true,
    'Signup enforces requiresVerification: true',
    signupRes.data
  );
  assert(
    signupRes.data?.data?.user?.isEmailVerified === false,
    'User account created in unverified state (isEmailVerified: false)',
    signupRes.data?.data?.user
  );

  verificationToken = signupRes.data?.data?.devVerificationToken;
  assert(
    typeof verificationToken === 'string' && verificationToken.length >= 32,
    'Secure cryptographic email verification token generated',
    `Token length: ${verificationToken?.length}`
  );

  // -------------------------------------------------------------
  // TEST 2: DUPLICATE SIGNUP PREVENTION
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Duplicate Signup Prevention ---');
  const duplicateRes = await request(
    { path: '/api/v1/auth/signup', method: 'POST' },
    {
      name: 'Rohan Duplicate',
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      confirmPassword: testPassword,
      role: 'patient',
    }
  );

  assert(
    duplicateRes.statusCode === 409,
    'Duplicate signup with existing email returns HTTP 409 Conflict',
    `Status: ${duplicateRes.statusCode}`
  );
  assert(
    duplicateRes.data?.success === false,
    'Duplicate signup cleanly rejected with error message',
    duplicateRes.data?.error
  );

  // -------------------------------------------------------------
  // TEST 3: INVALID SIGNUP VALIDATION
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Invalid Signup Request ---');
  const invalidSignupRes = await request(
    { path: '/api/v1/auth/signup', method: 'POST' },
    {
      name: '',
      email: 'not-an-email',
      phone: '123',
      password: 'short',
    }
  );

  assert(
    invalidSignupRes.statusCode === 422,
    'Invalid signup parameters return HTTP 422 Unprocessable Entity',
    `Status: ${invalidSignupRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 4: UNVERIFIED LOGIN ATTEMPT
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Unverified User Login Attempt ---');
  const unverifiedLoginRes = await request(
    { path: '/api/v1/auth/login', method: 'POST' },
    {
      email: testEmail,
      password: testPassword,
      role: 'patient',
    }
  );

  assert(
    unverifiedLoginRes.statusCode === 403,
    'Unverified account login strictly rejected with HTTP 403 Forbidden',
    `Status: ${unverifiedLoginRes.statusCode}`
  );
  assert(
    unverifiedLoginRes.data?.error?.details?.requiresVerification === true,
    'Response indicates requiresVerification: true with unverified status',
    unverifiedLoginRes.data?.error
  );

  // -------------------------------------------------------------
  // TEST 5: EMAIL VERIFICATION WORKFLOW
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Email Verification ---');
  const verifyRes = await request(
    { path: '/api/v1/auth/verify-email', method: 'POST' },
    {
      token: verificationToken,
      email: testEmail,
    }
  );

  assert(
    verifyRes.statusCode === 200,
    'Valid email verification token returns HTTP 200 OK',
    `Status: ${verifyRes.statusCode}`
  );
  assert(
    verifyRes.data?.data?.verified === true,
    'Account marked verified (verified: true)',
    verifyRes.data
  );

  // -------------------------------------------------------------
  // TEST 6: TOKEN REUSE PREVENTION
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Verification Token Reuse Prevention ---');
  const reuseRes = await request(
    { path: '/api/v1/auth/verify-email', method: 'POST' },
    {
      token: verificationToken,
      // Omit email so it checks purely by token
    }
  );

  assert(
    reuseRes.statusCode === 400 || reuseRes.data?.data?.alreadyVerified === true,
    'Reused verification token is safely handled / rejected',
    `Status: ${reuseRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 7: EXPIRED / INVALID VERIFICATION TOKEN
  // -------------------------------------------------------------
  console.log('\n--- 7. Testing Invalid Verification Token ---');
  const invalidTokenRes = await request(
    { path: '/api/v1/auth/verify-email', method: 'POST' },
    {
      token: 'fake_invalid_token_999999999999999999999999',
    }
  );

  assert(
    invalidTokenRes.statusCode === 400 || invalidTokenRes.statusCode === 410,
    'Nonexistent verification token returns HTTP 400 Bad Request',
    `Status: ${invalidTokenRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 8: VERIFIED LOGIN
  // -------------------------------------------------------------
  console.log('\n--- 8. Testing Verified User Login ---');
  const verifiedLoginRes = await request(
    { path: '/api/v1/auth/login', method: 'POST' },
    {
      email: testEmail,
      password: testPassword,
      role: 'patient',
    }
  );

  assert(
    verifiedLoginRes.statusCode === 200,
    'Verified user login succeeds with HTTP 200 OK',
    `Status: ${verifiedLoginRes.statusCode}`
  );
  assert(
    typeof verifiedLoginRes.data?.data?.token === 'string' &&
      verifiedLoginRes.data?.data?.token.startsWith('medix_jwt_'),
    'Returns cryptographically random Bearer session token (medix_jwt_*)',
    verifiedLoginRes.data?.data?.token
  );
  assert(
    typeof verifiedLoginRes.data?.data?.refreshToken === 'string' &&
      verifiedLoginRes.data?.data?.refreshToken.startsWith('medix_rf_'),
    'Returns refresh token (medix_rf_*)',
    verifiedLoginRes.data?.data?.refreshToken
  );

  sessionToken = verifiedLoginRes.data?.data?.token;
  refreshToken = verifiedLoginRes.data?.data?.refreshToken;

  // -------------------------------------------------------------
  // TEST 9: WRONG PASSWORD REJECTION
  // -------------------------------------------------------------
  console.log('\n--- 9. Testing Wrong Password Rejection ---');
  const wrongPassRes = await request(
    { path: '/api/v1/auth/login', method: 'POST' },
    {
      email: testEmail,
      password: 'WrongPassword@123',
    }
  );

  assert(
    wrongPassRes.statusCode === 401,
    'Wrong password rejected with HTTP 401 Unauthorized',
    `Status: ${wrongPassRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 10: NON-EXISTENT USER REJECTION
  // -------------------------------------------------------------
  console.log('\n--- 10. Testing Non-Existent User Rejection ---');
  const nonExistentRes = await request(
    { path: '/api/v1/auth/login', method: 'POST' },
    {
      email: 'nonexistent.ghost.user@example.com',
      password: 'SomePassword@123',
    }
  );

  assert(
    nonExistentRes.statusCode === 401,
    'Non-existent account rejected with HTTP 401 Unauthorized',
    `Status: ${nonExistentRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 11: AUTHENTICATED IDENTITY INSPECTION (/api/v1/auth/me)
  // -------------------------------------------------------------
  console.log('\n--- 11. Testing /api/v1/auth/me with Bearer Token ---');
  const meRes = await request({
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });

  assert(
    meRes.statusCode === 200,
    'Authenticated /api/v1/auth/me returns HTTP 200 OK',
    `Status: ${meRes.statusCode}`
  );
  assert(
    meRes.data?.data?.user?.email === testEmail,
    'Identity matches authenticated token email',
    meRes.data?.data?.user
  );

  // -------------------------------------------------------------
  // TEST 12: LOGOUT & TOKEN REVOCATION
  // -------------------------------------------------------------
  console.log('\n--- 12. Testing Logout & Token Invalidation ---');
  const logoutRes = await request({
    path: '/api/v1/auth/logout',
    method: 'POST',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });

  assert(
    logoutRes.statusCode === 200,
    'Logout returns HTTP 200 OK',
    `Status: ${logoutRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 13: INVALIDATED TOKEN ACCESS ATTEMPT
  // -------------------------------------------------------------
  console.log('\n--- 13. Testing Revoked Token Access ---');
  const revokedAccessRes = await request({
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });

  assert(
    revokedAccessRes.statusCode === 401,
    'Access with revoked token rejected with HTTP 401 Unauthorized',
    `Status: ${revokedAccessRes.statusCode}`
  );

  // -------------------------------------------------------------
  // TEST 14: CROSS-USER ACCESS ATTEMPT (DOCTOR SCOPING)
  // -------------------------------------------------------------
  console.log('\n--- 14. Testing Cross-User Scope Isolation ---');
  // Login as Doctor 101
  const docLogin = await request(
    { path: '/api/v1/auth/login', method: 'POST' },
    { email: 'sabyachi.mondal@ariyan.hospital', password: 'Doctor@123' }
  );

  assert(
    docLogin.statusCode === 200,
    'Doctor 101 login succeeds',
    `Status: ${docLogin.statusCode}`
  );
  const docToken = docLogin.data?.data?.token;

  // Doctor 101 attempts to query Doctor 102's earnings
  const crossDocRes = await request({
    path: '/api/v1/doctor/earnings?doctorId=102',
    method: 'GET',
    headers: { Authorization: `Bearer ${docToken}` },
  });

  assert(
    crossDocRes.statusCode === 403,
    'Cross-doctor data tampering rejected with HTTP 403 Forbidden',
    `Status: ${crossDocRes.statusCode}`
  );

  // Doctor 101 queries own earnings
  const ownDocRes = await request({
    path: '/api/v1/doctor/earnings?doctorId=101',
    method: 'GET',
    headers: { Authorization: `Bearer ${docToken}` },
  });

  assert(
    ownDocRes.statusCode === 200,
    'Doctor querying own records succeeds with HTTP 200 OK',
    `Status: ${ownDocRes.statusCode}`
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED:      \x1b[32m${passed}\x1b[0m`);
  console.log(`FAILED:      \x1b[${failed > 0 ? '31' : '32'}m${failed}\x1b[0m`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
