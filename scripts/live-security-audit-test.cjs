const fs = require('fs');

async function runPenetrationTestSuite() {
  const BASE_URL = 'http://localhost:3000';
  const findings = [];

  function recordFinding(category, testName, attackPayload, expectedBehavior, actualBehavior, status, passed, severity = 'LOW', fileInvolved = '') {
    findings.push({
      category,
      testName,
      attackPayload,
      expectedBehavior,
      actualBehavior,
      status,
      passed: passed ? 'PASS' : 'FAIL',
      severity,
      fileInvolved
    });
  }

  console.log('================================================================');
  console.log('🛡️ RUNNING LIVE PENETRATION & EXPLOIT RESISTANCE SUITE');
  console.log('================================================================\n');

  // --- VECTOR 1: UNPROTECTED SENSITIVE ENDPOINTS ---
  const sensitiveEndpoints = [
    { url: '/api/v1/database', method: 'GET', name: 'Database Export Dump' },
    { url: '/api/v1/doctor/earnings', method: 'GET', name: 'Doctor Earnings Analytics' },
    { url: '/api/v1/doctor/prescriptions', method: 'GET', name: 'Prescription Records' },
    { url: '/api/v1/marketing/requests', method: 'GET', name: 'Marketing Join Requests' },
    { url: '/api/v1/marketing/requests/1/approve', method: 'POST', name: 'Super Admin Representative Approval' },
    { url: '/api/v1/patients', method: 'GET', name: 'EHR Patient Directory' }
  ];

  for (const ep of sensitiveEndpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep.url}`, { method: ep.method });
      const pass = (res.status === 401 || res.status === 403);
      recordFinding(
        'Authentication Enforcement',
        `Unauthenticated call to ${ep.name}`,
        `No Authorization header sent`,
        'HTTP 401 Unauthorized or HTTP 403 Forbidden',
        `HTTP ${res.status}`,
        res.status,
        pass,
        'CRITICAL',
        `src/app${ep.url}/route.ts`
      );
    } catch (err) {
      recordFinding('Authentication Enforcement', `Unauthenticated call to ${ep.name}`, 'None', '401/403', err.message, 500, false, 'HIGH', ep.url);
    }
  }

  // --- VECTOR 2: IDOR / CROSS-USER AUTHORIZATION ---
  // Authenticate as Doctor 101 (Dr. Sabyachi Mondal)
  let doctor101Token = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sabyachi.mondal@ariyan.hospital',
        password: 'Doctor@123',
        role: 'doctor'
      })
    });
    const loginData = await loginRes.json();
    doctor101Token = loginData.data?.token || '';
  } catch (_) {}

  // Doctor 101 attempts to view Doctor 102's earnings
  try {
    const res = await fetch(`${BASE_URL}/api/v1/doctor/earnings?doctorId=102`, {
      headers: { 'Authorization': `Bearer ${doctor101Token}` }
    });
    const pass = res.status === 403;
    recordFinding(
      'IDOR & Cross-User Access',
      'Doctor 101 requests Doctor 102 earnings via doctorId parameter',
      '?doctorId=102 with token for doctor 101',
      'HTTP 403 Forbidden: Doctors may only access their own records',
      `HTTP ${res.status}`,
      res.status,
      pass,
      'HIGH',
      'src/app/api/v1/doctor/earnings/route.ts'
    );
  } catch (err) {
    recordFinding('IDOR', 'Doctor earnings IDOR test', '?doctorId=102', '403', err.message, 500, false, 'HIGH', 'doctor/earnings');
  }

  // Doctor 101 attempts to view Doctor 102's private profile
  try {
    const res = await fetch(`${BASE_URL}/api/v1/doctor/profile?doctorId=102`, {
      headers: { 'Authorization': `Bearer ${doctor101Token}` }
    });
    const pass = res.status === 403;
    recordFinding(
      'IDOR & Cross-User Access',
      'Doctor 101 requests Doctor 102 profile via doctorId parameter',
      '?doctorId=102 with token for doctor 101',
      'HTTP 403 Forbidden: Doctors may only access their own records',
      `HTTP ${res.status}`,
      res.status,
      pass,
      'HIGH',
      'src/app/api/v1/doctor/profile/route.ts'
    );
  } catch (err) {
    recordFinding('IDOR', 'Doctor profile IDOR test', '?doctorId=102', '403', err.message, 500, false, 'HIGH', 'doctor/profile');
  }

  // --- VECTOR 3: INJECTION & MALICIOUS PAYLOADS ---
  const injectionPayloads = [
    { name: 'SQL Injection in login identifier', payload: "admin' OR 1=1 --" },
    { name: 'NoSQL $where injection in login', payload: '{"$gt": ""}' },
    { name: 'XSS script injection in login', payload: '<script>alert(1)</script>' },
    { name: 'Path Traversal probe', payload: '../../../etc/passwd' }
  ];

  for (const inj of injectionPayloads) {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inj.payload,
          password: 'Password@123',
          role: 'doctor'
        })
      });
      const data = await res.json();
      const pass = res.status === 400 || res.status === 401 || res.status === 422;
      recordFinding(
        'Injection Resistance',
        inj.name,
        inj.payload,
        'HTTP 400/401/422: Rejected and sanitized by firewall/validator',
        `HTTP ${res.status}: ${data.error?.message || data.error || 'Blocked'}`,
        res.status,
        pass,
        'MEDIUM',
        'src/lib/validation.ts & security.ts'
      );
    } catch (err) {
      recordFinding('Injection Resistance', inj.name, inj.payload, '400/401/422', err.message, 500, false, 'MEDIUM', 'login');
    }
  }

  // --- VECTOR 4: FORGED / TAMPERED TOKENS ---
  const forgedTokens = [
    { name: 'Forged JWT signature', token: 'medix_jwt_1_tampered_signature_payload' },
    { name: 'Arbitrary admin bearer token', token: 'Bearer admin' },
    { name: 'Null byte token in query param', token: 'medix_jwt_%00_admin', isQuery: true }
  ];

  for (const ft of forgedTokens) {
    try {
      const url = ft.isQuery ? `${BASE_URL}/api/v1/auth/me?token=${ft.token}` : `${BASE_URL}/api/v1/auth/me`;
      const headers = ft.isQuery ? {} : { 'Authorization': `Bearer ${ft.token}` };
      const res = await fetch(url, { headers });
      const pass = res.status === 400 || res.status === 401;
      recordFinding(
        'Token Forgery Resistance',
        ft.name,
        ft.token,
        'HTTP 400/401: Rejected by cryptographically verified session lookup',
        `HTTP ${res.status}`,
        res.status,
        pass,
        'CRITICAL',
        'src/lib/api-auth.ts'
      );
    } catch (err) {
      recordFinding('Token Forgery', ft.name, ft.token, '401', err.message, 500, false, 'CRITICAL', 'api-auth.ts');
    }
  }

  // --- VECTOR 5: STATIC APP KEY RESTRICTION (HARDENING VERIFICATION) ---
  try {
    const res = await fetch(`${BASE_URL}/api/v1/doctor/earnings`, {
      headers: { 'x-api-key': 'medix_live_sec_app_key_2026_wb33735581_ariyan' }
    });
    const pass = res.status === 403;
    recordFinding(
      'Public Key Abuse Resistance',
      'Attempt to access doctor earnings using public client app key',
      'x-api-key: CLIENT_PUBLIC_APP_KEY',
      'HTTP 403 Forbidden: Public client app key is insufficient',
      `HTTP ${res.status}`,
      res.status,
      pass,
      'HIGH',
      'src/lib/api-auth.ts'
    );
  } catch (err) {
    recordFinding('Key Abuse', 'Public key abuse test', 'CLIENT_PUBLIC_APP_KEY', '403', err.message, 500, false, 'HIGH', 'api-auth.ts');
  }

  console.log('-----------------------------------------------------------------------------------------');
  console.log('| CATEGORY                 | TEST NAME                                 | STATUS | RESULT |');
  console.log('-----------------------------------------------------------------------------------------');
  findings.forEach(f => {
    const catStr = f.category.slice(0, 24).padEnd(24, ' ');
    const nameStr = f.testName.slice(0, 41).padEnd(41, ' ');
    const statusStr = String(f.status).padEnd(6, ' ');
    const passStr = f.passed === 'PASS' ? '✅ PASS' : '❌ FAIL';
    console.log(`| ${catStr} | ${nameStr} | ${statusStr} | ${passStr} |`);
  });
  console.log('-----------------------------------------------------------------------------------------');

  const allPassed = findings.every(f => f.passed === 'PASS');
  console.log(`\nLIVE AUDIT RESULT: ${allPassed ? '🎉 ALL 16 EXPLOIT CHECKS PASSED' : '⚠️ SOME ISSUES FLAGGED'}`);

  return findings;
}

runPenetrationTestSuite();
