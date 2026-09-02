const http = require('http');

const BASE_URL = 'http://localhost:3000';

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(path, BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(resData);
          } catch {
            parsed = resData;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('\n================================================================');
  console.log('🧪 MEDIX ACCOUNT DELETION & COMPLIANCE TEST');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Create a disposable user
  const testEmail = `disposable_test_${Date.now()}@medix.local`;
  const signupRes = await post('/api/v1/auth/signup', {
    name: 'Temporary User',
    email: testEmail,
    phone: '+91 98000 11223',
    password: 'TestPassword@123',
    role: 'patient',
  });
  console.log('Debug signupRes:', signupRes.status, signupRes.body);

  const verifyToken = signupRes.body?.data?.devVerificationToken || signupRes.body?.data?.verificationToken;
  const verifyRes = await post('/api/v1/auth/verify-email', { token: verifyToken });
  console.log('Debug verifyRes:', verifyRes.status, verifyRes.body);

  // Login
  const loginRes = await post('/api/v1/auth/login', {
    email: testEmail,
    password: 'TestPassword@123',
  });
  console.log('Debug loginRes:', loginRes.status, loginRes.body);

  const token = loginRes.body?.data?.token;

  // 2. Reject deletion without confirmation
  const noConfirmRes = await post(
    '/api/v1/auth/delete-account',
    { confirmation: 'NO' },
    { Authorization: `Bearer ${token}` }
  );
  if (noConfirmRes.status === 422) {
    console.log('  ✔ PASS: Deletion without correct confirmation string rejected (422)');
    passed++;
  } else {
    console.log(`  ✘ FAIL: Expected 422, got ${noConfirmRes.status}`, noConfirmRes.body);
    failed++;
  }

  // 3. Delete account with Bearer token
  const deleteRes = await post(
    '/api/v1/auth/delete-account',
    { confirmation: 'DELETE_MY_ACCOUNT' },
    { Authorization: `Bearer ${token}` }
  );
  if (deleteRes.status === 200 && deleteRes.body?.data?.deleted) {
    console.log('  ✔ PASS: Account deleted successfully with Bearer token (200)');
    passed++;
  } else {
    console.log(`  ✘ FAIL: Expected 200, got ${deleteRes.status}`, deleteRes.body);
    failed++;
  }

  // 4. Verify login fails after deletion
  const loginAfterDelete = await post('/api/v1/auth/login', {
    email: testEmail,
    password: 'TestPassword@123',
  });
  if (loginAfterDelete.status === 401) {
    console.log('  ✔ PASS: Login rejected for deleted user (401)');
    passed++;
  } else {
    console.log(`  ✘ FAIL: Expected 401, got ${loginAfterDelete.status}`);
    failed++;
  }

  // 5. Create another user and delete with email + password
  const testEmail2 = `disposable_pw_${Date.now()}@medix.local`;
  const s2 = await post('/api/v1/auth/signup', {
    name: 'PW Delete User',
    email: testEmail2,
    phone: '+91 98000 22334',
    password: 'PwPassword@123',
    role: 'patient',
  });
  const token2 = s2.body?.data?.devVerificationToken || s2.body?.data?.verificationToken;
  await post('/api/v1/auth/verify-email', { token: token2 });

  const deleteWithPwRes = await post('/api/v1/auth/delete-account', {
    email: testEmail2,
    password: 'PwPassword@123',
    confirmation: 'DELETE_MY_ACCOUNT',
  });
  if (deleteWithPwRes.status === 200 && deleteWithPwRes.body?.data?.deleted) {
    console.log('  ✔ PASS: Account deleted successfully with Email + Password credentials (200)');
    passed++;
  } else {
    console.log(`  ✘ FAIL: Expected 200, got ${deleteWithPwRes.status}`, deleteWithPwRes.body);
    failed++;
  }

  console.log(`\n================================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`================================================================\n`);

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
