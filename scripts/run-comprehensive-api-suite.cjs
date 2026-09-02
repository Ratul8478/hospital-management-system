const http = require('http');

const BASE_URL = 'http://localhost:3000';
const MASTER_KEY = 'medix_master_sa_key_2026_ariyan_hq_wb9144376971';
const BRANCH_KEY = 'medix_branch_sec_key_2026_wb_kolkata';
const PUBLIC_KEY = 'medix_live_sec_app_key_2026_wb33735581_ariyan';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
    };

    let postData = null;
    if (body !== null) {
      if (typeof body === 'string') {
        postData = body;
        if (!options.headers['Content-Type']) {
          options.headers['Content-Type'] = 'application/json';
        }
      } else {
        postData = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
      }
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch {
          parsed = rawData;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
          raw: rawData,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        headers: {},
        body: { error: err.message },
        raw: err.message,
      });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function checkSensitiveInfoExposure(body, raw) {
  const leaks = [];
  const rawStr = typeof raw === 'string' ? raw : JSON.stringify(body);

  if (rawStr.includes('passwordHash') && !rawStr.includes('"passwordHash":""')) {
    if (/"passwordHash"\s*:\s*"[^"]{10,}"/.test(rawStr)) {
      leaks.push('passwordHash exposed');
    }
  }
  if (rawStr.includes('medix_master_sa_key') && !rawStr.includes('Authorization')) {
    leaks.push('master key exposed in response');
  }
  if (rawStr.includes('stack') && rawStr.includes('at NextNodeServer')) {
    leaks.push('stack trace exposed');
  }
  if (rawStr.includes('C:\\Users\\') || rawStr.includes('E:\\DOWNLOADS\\')) {
    leaks.push('local filesystem path exposed');
  }

  const fakePatterns = [/lorem ipsum/i, /dummy_data/i, /placeholder_value/i, /fake_balance/i];
  for (const pat of fakePatterns) {
    if (pat.test(rawStr)) {
      leaks.push(`fake/dummy pattern found: ${pat}`);
    }
  }

  return leaks;
}

async function main() {
  console.log('================================================================');
  console.log('🔍 MEDIX COMPREHENSIVE PRODUCTION API AUDIT & TEST MATRIX');
  console.log('================================================================\n');

  const testMatrix = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function record(endpoint, method, auth, inputDesc, expectedStatus, actualStatus, pass, details = '') {
    totalTests++;
    if (pass) {
      passedTests++;
    } else {
      failedTests++;
    }
    const res = {
      endpoint,
      method,
      auth,
      input: inputDesc,
      expected: expectedStatus,
      actual: actualStatus,
      result: pass ? 'PASS' : 'FAIL',
      details,
    };
    testMatrix.push(res);
    const icon = pass ? '✔' : '✘';
    console.log(`  ${icon} [${method}] ${endpoint} | Auth: ${auth} | Expected: ${expectedStatus} | Actual: ${actualStatus} -> ${res.result} ${details ? '(' + details + ')' : ''}`);
  }

  // -------------------------------------------------------------
  // SETUP: Provision Real Authenticated Sessions
  // -------------------------------------------------------------
  console.log('--- Phase 0: Provisioning Session Credentials ---');

  // 1. Doctor 1 (Dr. Sabyachi Mondal)
  const docLoginRes = await request('POST', '/api/v1/auth/login', {
    identifier: 'sabyachi.mondal@ariyan.hospital',
    password: 'Doctor@123',
  });
  const docToken = docLoginRes.body?.data?.token;
  const docHeaders = docToken ? { Authorization: `Bearer ${docToken}` } : {};

  // 2. Doctor 2 (Dr. Jiarul Haque)
  const doc2LoginRes = await request('POST', '/api/v1/auth/login', {
    identifier: 'ariyanhospital9@gmail.com',
    password: 'Doctor@123',
  });
  const doc2Token = doc2LoginRes.body?.data?.token;
  const doc2Headers = doc2Token ? { Authorization: `Bearer ${doc2Token}` } : {};

  // 3. Patient User with dynamic unique phone
  const seedPhoneSuffix = Math.floor(10000000 + Math.random() * 90000000);
  const patientEmail = `patient_qa_${Date.now()}_${seedPhoneSuffix}@medix.local`;
  const patSignupRes = await request('POST', '/api/v1/auth/signup', {
    name: 'Audit Patient User',
    email: patientEmail,
    phone: `+91 98${seedPhoneSuffix}`,
    password: 'Patient@123',
    role: 'patient',
  });
  const patVerifyToken = patSignupRes.body?.data?.devVerificationToken || patSignupRes.body?.data?.verificationToken;
  if (patVerifyToken) {
    await request('POST', '/api/v1/auth/verify-email', { token: patVerifyToken });
  }
  const patLoginRes = await request('POST', '/api/v1/auth/login', {
    email: patientEmail,
    password: 'Patient@123',
  });
  const patToken = patLoginRes.body?.data?.token;
  const patHeaders = patToken ? { Authorization: `Bearer ${patToken}` } : {};

  const masterHeaders = { Authorization: `Bearer ${MASTER_KEY}` };
  const pubHeaders = { 'x-api-key': PUBLIC_KEY };

  console.log(`Doctor 1 Token: ${docToken ? 'VALID' : 'FAIL'}, Doctor 2: ${doc2Token ? 'VALID' : 'FAIL'}, Patient: ${patToken ? 'VALID' : 'FAIL'}\n`);

  // -------------------------------------------------------------
  // TEST GROUP 1: Authentication & Identity Management
  // -------------------------------------------------------------
  console.log('--- Group 1: Authentication & Identity Management ---');

  // /api/v1/auth/signup
  {
    const ep = '/api/v1/auth/signup';
    const randSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const uniqueEmail = `dr_signup_${Date.now()}_${randSuffix}@medix.local`;
    const uniquePhone = `+91 97${randSuffix}`;

    const r1 = await request('POST', ep, {
      name: 'Dr. New Specialist',
      email: uniqueEmail,
      phone: uniquePhone,
      password: 'StrongPassword@2026',
      role: 'doctor',
    });
    record(ep, 'POST', 'None', 'Valid signup payload', 201, r1.status, r1.status === 201);

    const r2 = await request('POST', ep, { name: 'Dr. Test', email: 'missingpass@medix.local', phone: '+91 9876543210' });
    record(ep, 'POST', 'None', 'Missing password field', 422, r2.status, r2.status === 422);

    const r3 = await request('POST', ep, { name: 12345, email: 'numname@medix.local', phone: '+91 9876543210', password: 'Pass@1234' });
    record(ep, 'POST', 'None', 'Invalid field types (number name)', 422, r3.status, r3.status === 422);

    const r4 = await request('POST', ep, { name: 'Dr. Bad', email: 'notanemail', phone: '+91 9876543210', password: 'Pass@1234' });
    record(ep, 'POST', 'None', 'Invalid email format', 422, r4.status, r4.status === 422);

    const r5 = await request('POST', ep, { name: 'Dr. Short', email: 'short@medix.local', phone: '+91 9876543210', password: '123' });
    record(ep, 'POST', 'None', 'Boundary password < 8 chars', 422, r5.status, r5.status === 422);

    const r9 = await request('POST', ep, {
      name: 'Dr. Duplicate',
      email: uniqueEmail,
      phone: uniquePhone,
      password: 'StrongPassword@2026',
      role: 'doctor',
    });
    record(ep, 'POST', 'None', 'Duplicate email registration', 409, r9.status, r9.status === 409);

    const r11 = await request('POST', ep, {});
    record(ep, 'POST', 'None', 'Empty payload ({})', 422, r11.status, r11.status === 422);

    const r12 = await request('POST', ep, 'MALFORMED{JSON', { 'Content-Type': 'application/json' });
    record(ep, 'POST', 'None', 'Malformed JSON string', 400, r12.status, r12.status === 400);

    const leaks = checkSensitiveInfoExposure(r1.body, r1.raw);
    record(ep, 'POST', 'None', 'Sensitive data leak check', 201, r1.status, leaks.length === 0, leaks.join(', '));
  }

  // /api/v1/auth/verify-email
  {
    const ep = '/api/v1/auth/verify-email';
    const r2 = await request('POST', ep, {});
    record(ep, 'POST', 'None', 'Missing verification token', 400, r2.status, r2.status === 400 || r2.status === 422);

    const r10 = await request('POST', ep, { token: 'invalid_crypto_token_9999' });
    record(ep, 'POST', 'None', 'Non-existent / invalid token', 400, r10.status, r10.status === 400);

    const rGet = await request('GET', `${ep}?token=invalid_crypto_token_9999`);
    record(ep, 'GET', 'None', 'GET query token validation', 400, rGet.status, rGet.status === 400);
  }

  // /api/v1/auth/resend-verification
  {
    const ep = '/api/v1/auth/resend-verification';
    const rMissing = await request('POST', ep, {});
    record(ep, 'POST', 'None', 'Missing email parameter', 422, rMissing.status, rMissing.status === 422 || rMissing.status === 400);

    const rNotFound = await request('POST', ep, { email: 'nonexistent@medix.local' });
    record(ep, 'POST', 'None', 'Non-existent email resend', 404, rNotFound.status, rNotFound.status === 404);
  }

  // /api/v1/auth/login
  {
    const ep = '/api/v1/auth/login';
    const r1 = await request('POST', ep, {
      email: 'sabyachi.mondal@ariyan.hospital',
      password: 'Doctor@123',
    });
    record(ep, 'POST', 'None', 'Valid doctor credentials', 200, r1.status, r1.status === 200);

    const r2 = await request('POST', ep, { email: 'sabyachi.mondal@ariyan.hospital' });
    record(ep, 'POST', 'None', 'Missing password', 422, r2.status, r2.status === 422);

    const r6 = await request('POST', ep, { email: 'sabyachi.mondal@ariyan.hospital', password: 'WrongPassword@999' });
    record(ep, 'POST', 'None', 'Invalid password rejection', 401, r6.status, r6.status === 401);

    const r10 = await request('POST', ep, { email: 'nobody_exists@hospital.local', password: 'Pass@1234' });
    record(ep, 'POST', 'None', 'Non-existent user lookup', 401, r10.status, r10.status === 401);

    const leaks = checkSensitiveInfoExposure(r1.body, r1.raw);
    record(ep, 'POST', 'None', 'Sensitive data leak check', 200, r1.status, leaks.length === 0, leaks.join(', '));
  }

  // /api/v1/auth/me
  {
    const ep = '/api/v1/auth/me';
    const r6 = await request('GET', ep);
    record(ep, 'GET', 'None', 'Unauthorized request without token', 401, r6.status, r6.status === 401);

    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Bearer JWT', 'Authenticated doctor profile', 200, r7.status, r7.status === 200);
  }

  // /api/v1/auth/refresh
  {
    const ep = '/api/v1/auth/refresh';
    const r6 = await request('POST', ep, {});
    record(ep, 'POST', 'None', 'Refresh without token', 400, r6.status, r6.status === 400 || r6.status === 401);

    const r7 = await request('POST', ep, null, docHeaders);
    record(ep, 'POST', 'Bearer JWT', 'Refresh with active Bearer token', 200, r7.status, r7.status === 200);
  }

  // /api/v1/auth/delete-account
  {
    const ep = '/api/v1/auth/delete-account';
    const delRand = Math.floor(10000000 + Math.random() * 90000000);
    const delEmail = `to_delete_${Date.now()}_${delRand}@medix.local`;
    const s = await request('POST', '/api/v1/auth/signup', {
      name: 'Delete Candidate',
      email: delEmail,
      phone: `+91 98${delRand}`,
      password: 'DeletePass@123',
      role: 'patient',
    });
    const vTok = s.body?.data?.devVerificationToken || s.body?.data?.verificationToken;
    if (vTok) await request('POST', '/api/v1/auth/verify-email', { token: vTok });

    const rInvalidConfirm = await request('POST', ep, {
      email: delEmail,
      password: 'DeletePass@123',
      confirmation: 'WRONG_CONFIRMATION',
    });
    record(ep, 'POST', 'None', 'Delete without confirmation string', 422, rInvalidConfirm.status, rInvalidConfirm.status === 422);

    const rDel = await request('POST', ep, {
      email: delEmail,
      password: 'DeletePass@123',
      confirmation: 'DELETE_MY_ACCOUNT',
    });
    record(ep, 'POST', 'Credentials', 'Delete account successfully', 200, rDel.status, rDel.status === 200);
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: Doctor Companion & Clinical Operations
  // -------------------------------------------------------------
  console.log('\n--- Group 2: Doctor Companion & Clinical Operations ---');

  // /api/v1/doctor/profile
  {
    const ep = '/api/v1/doctor/profile';
    const r6 = await request('GET', ep);
    record(ep, 'GET', 'None', 'Unauthorized request', 401, r6.status, r6.status === 401);

    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor own profile lookup', 200, r7.status, r7.status === 200);

    const r8 = await request('GET', `${ep}?doctorId=102`, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT (ID:101)', 'IDOR attempt on doctorId=102', 403, r8.status, r8.status === 403);

    const rSA = await request('GET', `${ep}?doctorId=101`, null, masterHeaders);
    record(ep, 'GET', 'Master Key', 'Super Admin accessing doctor 101 profile', 200, rSA.status, rSA.status === 200);
  }

  // /api/v1/doctor/status
  {
    const ep = '/api/v1/doctor/status';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor gets own status', 200, r7.status, r7.status === 200);

    const rPatch = await request('PATCH', ep, { status: 'busy' }, docHeaders);
    record(ep, 'PATCH', 'Doctor JWT', 'Update status to busy', 200, rPatch.status, rPatch.status === 200);

    const rPatchInv = await request('PATCH', ep, { status: 'invalid_status_code' }, docHeaders);
    record(ep, 'PATCH', 'Doctor JWT', 'Invalid status enum rejection', 422, rPatchInv.status, rPatchInv.status === 422);

    await request('PATCH', ep, { status: 'available' }, docHeaders);
  }

  // /api/v1/doctor/earnings
  {
    const ep = '/api/v1/doctor/earnings';
    const r6 = await request('GET', ep);
    record(ep, 'GET', 'None', 'Unauthorized earnings access', 401, r6.status, r6.status === 401);

    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor own earnings calculation', 200, r7.status, r7.status === 200);

    const r8 = await request('GET', `${ep}?doctorId=102`, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT (ID:101)', 'IDOR attempt on doctorId=102 earnings', 403, r8.status, r8.status === 403);
  }

  // /api/v1/doctor/appointments
  {
    const ep = '/api/v1/doctor/appointments';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor appointments list', 200, r7.status, r7.status === 200);

    const r5 = await request('GET', `${ep}?page=1&limit=5`, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Pagination boundary limit=5', 200, r5.status, r5.status === 200);
  }

  // /api/v1/doctor/appointments/today
  {
    const ep = '/api/v1/doctor/appointments/today';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', "Today's OPD consultation queue", 200, r7.status, r7.status === 200);
  }

  // /api/v1/doctor/admissions
  {
    const ep = '/api/v1/doctor/admissions';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Inpatient (IPD) admissions', 200, r7.status, r7.status === 200);
  }

  // /api/v1/doctor/prescriptions
  {
    const ep = '/api/v1/doctor/prescriptions';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor prescription history', 200, r7.status, r7.status === 200);

    const rCreate = await request('POST', ep, {
      patientId: 401,
      patientName: 'Aarav Sharma',
      uhid: 'UHID-2026-0042',
      diagnosis: 'Type 2 Diabetes Mellitus - Routine Checkup',
      medications: [
        { medicineName: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 Days' },
      ],
      advice: 'Maintain low glycemic diet.',
    }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Create electronic prescription', 201, rCreate.status, rCreate.status === 201);

    const rMissing = await request('POST', ep, { patientId: 401 }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Missing diagnosis/medications', 422, rMissing.status, rMissing.status === 422);
  }

  // /api/v1/doctor/leave
  {
    const ep = '/api/v1/doctor/leave';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor leave history', 200, r7.status, r7.status === 200);

    const rSubmit = await request('POST', ep, {
      startDate: '2026-09-20',
      endDate: '2026-09-22',
      reason: 'Medical Conference Attendance',
    }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Submit leave request', 201, rSubmit.status, rSubmit.status === 201);
  }

  // /api/v1/doctor/reports (Diagnostics)
  {
    const ep = '/api/v1/doctor/reports';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Diagnostic lab reports list', 200, r7.status, r7.status === 200);
  }

  // /api/v1/doctor/device-token
  {
    const ep = '/api/v1/doctor/device-token';
    const rPost = await request('POST', ep, {
      fcmToken: 'fcm_test_device_token_xyz_9988',
      platform: 'android',
    }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Register FCM device token', 200, rPost.status, rPost.status === 200);
  }

  // /api/v1/doctor/lab-orders
  {
    const ep = '/api/v1/doctor/lab-orders';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor lab orders query', 200, r7.status, r7.status === 200);

    const rOrder = await request('POST', ep, {
      patientId: 401,
      uhid: 'UHID-2026-0042',
      testNames: ['Complete Blood Count (CBC)', 'Lipid Profile'],
      priority: 'ROUTINE',
    }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Create diagnostic lab order', 201, rOrder.status, rOrder.status === 201);
  }

  // /api/v1/doctor/referrals
  {
    const ep = '/api/v1/doctor/referrals';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor referrals directory', 200, r7.status, r7.status === 200);

    const rRef = await request('POST', ep, {
      patientId: 401,
      patientName: 'Aarav Sharma',
      uhid: 'UHID-2026-0042',
      targetHospitalId: 2,
      targetHospitalName: 'Medix Specialty & Trauma Center',
      targetSpecialty: 'Neurology',
      clinicalSummary: 'Higher specialty consultation recommended',
    }, docHeaders);
    record(ep, 'POST', 'Doctor JWT', 'Create inter-hospital referral', 201, rRef.status, rRef.status === 201);
  }

  // /api/v1/doctor/followups
  {
    const ep = '/api/v1/doctor/followups';
    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Follow-up consultation roster', 200, r7.status, r7.status === 200);
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: Core Hospital Directory & Resources
  // -------------------------------------------------------------
  console.log('\n--- Group 3: Core Hospital Directory & Resources ---');

  // /api/v1/branches
  {
    const ep = '/api/v1/branches';
    const r7 = await request('GET', ep, null, pubHeaders);
    record(ep, 'GET', 'Public Key', 'List all hospital branches', 200, r7.status, r7.status === 200);
  }

  // /api/v1/hospitals
  {
    const ep = '/api/v1/hospitals';
    const r7 = await request('GET', ep, null, pubHeaders);
    record(ep, 'GET', 'Public Key', 'Hospital directory list', 200, r7.status, r7.status === 200);

    const rDetail = await request('GET', '/api/v1/hospitals/1', null, pubHeaders);
    record('/api/v1/hospitals/1', 'GET', 'Public Key', 'Single hospital branch details', 200, rDetail.status, rDetail.status === 200);

    const r404 = await request('GET', '/api/v1/hospitals/99999', null, pubHeaders);
    record('/api/v1/hospitals/99999', 'GET', 'Public Key', 'Non-existent hospital branch', 404, r404.status, r404.status === 404);
  }

  // /api/v1/beds
  {
    const ep = '/api/v1/beds';
    const r7 = await request('GET', ep, null, pubHeaders);
    record(ep, 'GET', 'Public Key', 'Bed census & occupancy', 200, r7.status, r7.status === 200);

    const rBranch = await request('GET', `${ep}?branchId=1`, null, pubHeaders);
    record(ep, 'GET', 'Public Key', 'Bed census filtered by branchId=1', 200, rBranch.status, rBranch.status === 200);
  }

  // /api/v1/doctors
  {
    const ep = '/api/v1/doctors';
    const r7 = await request('GET', ep, null, pubHeaders);
    record(ep, 'GET', 'Public Key', 'Public doctor directory', 200, r7.status, r7.status === 200);

    const rDetail = await request('GET', '/api/v1/doctors/101', null, pubHeaders);
    record('/api/v1/doctors/101', 'GET', 'Public Key', 'Doctor 101 profile details', 200, rDetail.status, rDetail.status === 200);

    const r404 = await request('GET', '/api/v1/doctors/99999', null, pubHeaders);
    record('/api/v1/doctors/99999', 'GET', 'Public Key', 'Non-existent doctor ID', 404, r404.status, r404.status === 404);
  }

  // /api/v1/patients
  {
    const ep = '/api/v1/patients';
    const r6 = await request('GET', ep);
    record(ep, 'GET', 'None', 'Unauthorized patient directory lookup', 401, r6.status, r6.status === 401);

    const r7 = await request('GET', ep, null, docHeaders);
    record(ep, 'GET', 'Doctor JWT', 'Doctor patient directory search', 200, r7.status, r7.status === 200);

    const rUhid = await request('GET', '/api/v1/patients/UHID-2026-0042', null, docHeaders);
    record('/api/v1/patients/UHID-2026-0042', 'GET', 'Doctor JWT', 'Patient lookup by UHID string', 200, rUhid.status, rUhid.status === 200);

    const rHistory = await request('GET', '/api/v1/patients/UHID-2026-0042/history', null, docHeaders);
    record('/api/v1/patients/UHID-2026-0042/history', 'GET', 'Doctor JWT', 'Patient clinical history', 200, rHistory.status, rHistory.status === 200);

    const rTimeline = await request('GET', '/api/v1/patients/UHID-2026-0042/timeline', null, docHeaders);
    record('/api/v1/patients/UHID-2026-0042/timeline', 'GET', 'Doctor JWT', 'Patient care timeline', 200, rTimeline.status, rTimeline.status === 200);

    const rVitals = await request('GET', '/api/v1/patients/UHID-2026-0042/vitals', null, docHeaders);
    record('/api/v1/patients/UHID-2026-0042/vitals', 'GET', 'Doctor JWT', 'Patient telemetry vitals', 200, rVitals.status, rVitals.status === 200);

    const r404 = await request('GET', '/api/v1/patients/UHID-INVALID-99999', null, docHeaders);
    record('/api/v1/patients/UHID-INVALID-99999', 'GET', 'Doctor JWT', 'Non-existent patient lookup', 404, r404.status, r404.status === 404);
  }

  // /api/v1/pharmacy & /api/v1/pathology & /api/v1/services & /api/v1/database
  {
    const rPharm = await request('GET', '/api/v1/pharmacy', null, pubHeaders);
    record('/api/v1/pharmacy', 'GET', 'Public Key', 'Pharmacy medicine inventory', 200, rPharm.status, rPharm.status === 200);

    const rPath = await request('GET', '/api/v1/pathology', null, pubHeaders);
    record('/api/v1/pathology', 'GET', 'Public Key', 'Pathology diagnostic catalog', 200, rPath.status, rPath.status === 200);

    const rServ = await request('GET', '/api/v1/services', null, pubHeaders);
    record('/api/v1/services', 'GET', 'Public Key', 'Hospital clinical services catalog', 200, rServ.status, rServ.status === 200);

    const rDb = await request('GET', '/api/v1/database', null, masterHeaders);
    record('/api/v1/database', 'GET', 'Master Key', 'Central database statistics', 200, rDb.status, rDb.status === 200);
  }

  // -------------------------------------------------------------
  // TEST GROUP 4: Marketing, Notifications & Super Admin Operations
  // -------------------------------------------------------------
  console.log('\n--- Group 4: Marketing, Notifications & Super Admin ---');

  {
    const rReps = await request('GET', '/api/v1/marketing/representatives', null, masterHeaders);
    record('/api/v1/marketing/representatives', 'GET', 'Master Key', 'Marketing representatives list', 200, rReps.status, rReps.status === 200);

    const rReqs = await request('GET', '/api/v1/marketing/requests', null, masterHeaders);
    record('/api/v1/marketing/requests', 'GET', 'Master Key', 'Marketing join requests list', 200, rReqs.status, rReqs.status === 200);

    const rLogs = await request('GET', '/api/v1/marketing/email-logs', null, masterHeaders);
    record('/api/v1/marketing/email-logs', 'GET', 'Master Key', 'Marketing email dispatch logs', 200, rLogs.status, rLogs.status === 200);

    const rFcm = await request('POST', '/api/v1/notifications/fcm-token', {
      token: 'fcm_global_app_notification_token_2026',
      platform: 'web',
      role: 'doctor',
    }, pubHeaders);
    record('/api/v1/notifications/fcm-token', 'POST', 'Public Key', 'Register global FCM push token', 201, rFcm.status, rFcm.status === 200 || rFcm.status === 201);
  }

  // /api/auth/super-admin/send-otp
  {
    const ep = '/api/auth/super-admin/send-otp';
    const r1 = await request('POST', ep, {
      email: 'ariyanhospital9@gmail.com',
      password: 'admin@2019',
    });
    record(ep, 'POST', 'None', 'Valid Super Admin 2FA dispatch', 200, r1.status, r1.status === 200);

    const rBadPass = await request('POST', ep, {
      email: 'ariyanhospital9@gmail.com',
      password: 'WrongAdminPassword',
    });
    record(ep, 'POST', 'None', 'Invalid Super Admin password', 401, rBadPass.status, rBadPass.status === 401);
  }

  // /api/v1 Root Healthcheck
  {
    const rRoot = await request('GET', '/api/v1');
    record('/api/v1', 'GET', 'None', 'API Root healthcheck', 200, rRoot.status, rRoot.status === 200);
  }

  console.log('\n================================================================');
  console.log(`📊 TOTAL API TESTS EXECUTED: ${totalTests}`);
  console.log(`✅ PASSED: ${passedTests}`);
  console.log(`❌ FAILED: ${failedTests}`);
  console.log(`📈 SUCCESS RATE: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  // Print Formatted Markdown Table Matrix
  console.log('\n### API Test Matrix:\n');
  console.log('| Endpoint | Method | Auth | Input | Expected Status | Actual Status | Result |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
  for (const t of testMatrix) {
    console.log(`| \`${t.endpoint}\` | \`${t.method}\` | ${t.auth} | ${t.input} | \`${t.expected}\` | \`${t.actual}\` | **${t.result}** |`);
  }

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
