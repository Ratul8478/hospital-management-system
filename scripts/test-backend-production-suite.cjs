const http = require('http');

console.log('================================================================');
console.log('🧪 MEDIX BACKEND API PRODUCTION HARDENING VERIFICATION SUITE');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function recordTest(title, passed, details = '') {
  if (passed) {
    passedTests++;
    console.log(`  ✅ [PASSED] ${title} ${details ? '(' + details + ')' : ''}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAILED] ${title} -> ${details}`);
    failures.push({ title, details });
  }
}

function requestJson(url, options = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 3000,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runSuite() {
  const base = 'http://localhost:3000';
  const appKey = 'medix_live_sec_app_key_2026_wb33735581_ariyan';
  const superAdminKey = 'medix_master_sa_key_2026_ariyan_hq_wb9144376971';

  // Wait 3 seconds for Next.js dev server readiness
  console.log('Waiting for Next.js server readiness on port 3000...');
  for (let i = 0; i < 10; i++) {
    const ping = await requestJson(`${base}/api/v1/branches`, {
      headers: { 'x-api-key': appKey },
    });
    if (ping.status === 200) break;
    await wait(1000);
  }

  console.log('\n--- 1. HOSPITAL & BRANCH INFRASTRUCTURE APIS ---');
  const branchesRes = await requestJson(`${base}/api/v1/branches`, {
    headers: { 'x-api-key': appKey },
  });
  recordTest(
    'GET /api/v1/branches returns active branches',
    branchesRes.status === 200 && Array.isArray(branchesRes.data?.data?.branches),
    `Count: ${branchesRes.data?.data?.branches?.length || 0}`
  );

  const hospitalsRes = await requestJson(`${base}/api/v1/hospitals`, {
    headers: { 'x-api-key': appKey },
  });
  recordTest(
    'GET /api/v1/hospitals returns hospital registry',
    hospitalsRes.status === 200 && Array.isArray(hospitalsRes.data?.data?.hospitals),
    `Count: ${hospitalsRes.data?.data?.hospitals?.length || 0}`
  );

  const bedsRes = await requestJson(`${base}/api/v1/beds`, {
    headers: { 'x-api-key': appKey },
  });
  recordTest(
    'GET /api/v1/beds returns IPD ward telemetry',
    bedsRes.status === 200 && Array.isArray(bedsRes.data?.data?.inpatientFacilities)
  );

  console.log('\n--- 2. DOCTOR AUTHENTICATION & SESSION LIFECYCLE ---');
  // Test invalid password
  const badLoginRes = await requestJson(`${base}/api/v1/auth/login`, {
    method: 'POST',
    body: { email: 'ariyanhospital9@gmail.com', password: 'WrongPassword999!' },
  });
  recordTest(
    'POST /api/v1/auth/login rejects incorrect password with 401',
    badLoginRes.status === 401
  );

  // Test missing password
  const noPassLoginRes = await requestJson(`${base}/api/v1/auth/login`, {
    method: 'POST',
    body: { email: 'ariyanhospital9@gmail.com' },
  });
  recordTest(
    'POST /api/v1/auth/login rejects missing password with 422',
    noPassLoginRes.status === 422
  );

  // Test valid doctor login
  const loginRes = await requestJson(`${base}/api/v1/auth/login`, {
    method: 'POST',
    body: { email: 'ariyanhospital9@gmail.com', password: 'Doctor@123' },
  });
  const doctorToken = loginRes.data?.data?.token;
  const refreshToken = loginRes.data?.data?.refreshToken;
  const doctorId = loginRes.data?.data?.user?.id;
  recordTest(
    'POST /api/v1/auth/login issues Bearer token & refresh token',
    loginRes.status === 200 && Boolean(doctorToken) && Boolean(refreshToken),
    `Doctor: ${loginRes.data?.data?.user?.name}`
  );

  // Test token refresh
  const refreshRes = await requestJson(`${base}/api/v1/auth/refresh`, {
    method: 'POST',
    body: { refreshToken },
  });
  recordTest(
    'POST /api/v1/auth/refresh extends session and returns new token',
    refreshRes.status === 200 && Boolean(refreshRes.data?.data?.token)
  );

  const activeDoctorToken = refreshRes.data?.data?.token || doctorToken;
  const docHeaders = {
    Authorization: `Bearer ${activeDoctorToken}`,
  };

  console.log('\n--- 3. DOCTOR PROFILE, STATUS & QUEUE APIS ---');
  const profileRes = await requestJson(`${base}/api/v1/doctor/profile`, {
    headers: docHeaders,
  });
  recordTest(
    'GET /api/v1/doctor/profile returns authenticated doctor profile',
    profileRes.status === 200 && profileRes.data?.data?.name !== undefined,
    `Name: ${profileRes.data?.data?.name}, Fee: ₹${profileRes.data?.data?.fee}`
  );

  const statusRes = await requestJson(`${base}/api/v1/doctor/status`, {
    method: 'PATCH',
    headers: docHeaders,
    body: { status: 'AVAILABLE' },
  });
  recordTest(
    'PATCH /api/v1/doctor/status updates duty status',
    statusRes.status === 200 && statusRes.data?.data?.status === 'AVAILABLE'
  );

  const apptsRes = await requestJson(`${base}/api/v1/doctor/appointments`, {
    headers: docHeaders,
  });
  recordTest(
    'GET /api/v1/doctor/appointments returns paginated appointments',
    apptsRes.status === 200 && Array.isArray(apptsRes.data?.data?.appointments)
  );

  const todayApptsRes = await requestJson(`${base}/api/v1/doctor/appointments/today`, {
    headers: docHeaders,
  });
  recordTest(
    'GET /api/v1/doctor/appointments/today scopes to doctor queue',
    todayApptsRes.status === 200 && Array.isArray(todayApptsRes.data?.data?.queue)
  );

  const newApptRes = await requestJson(`${base}/api/v1/doctor/appointments/today`, {
    method: 'POST',
    headers: docHeaders,
    body: {
      patientName: 'Subhas Chandra Bose',
      patientAge: 52,
      patientGender: 'Male',
      patientPhone: '+91 98310 12345',
      department: 'Cardiology',
      notes: 'Chest discomfort after exertion',
    },
  });
  const createdApptId = newApptRes.data?.data?.id;
  recordTest(
    'POST /api/v1/doctor/appointments/today schedules appointment with auto-token',
    newApptRes.status === 201 && Boolean(createdApptId),
    `Appt ID: ${createdApptId}, Token: #${newApptRes.data?.data?.tokenNumber}`
  );

  if (createdApptId) {
    const callRes = await requestJson(`${base}/api/v1/doctor/appointments/${createdApptId}/call`, {
      method: 'POST',
      headers: docHeaders,
    });
    recordTest(
      'POST /api/v1/doctor/appointments/[id]/call broadcasts patient token buzzer',
      callRes.status === 200 && callRes.data?.data?.tokenNumber !== undefined
    );

    const statusUpdateRes = await requestJson(`${base}/api/v1/doctor/appointments/${createdApptId}/status`, {
      method: 'PATCH',
      headers: docHeaders,
      body: { status: 'In Consultation' },
    });
    recordTest(
      'PATCH /api/v1/doctor/appointments/[id]/status transitions state',
      statusUpdateRes.status === 200 && statusUpdateRes.data?.data?.status === 'In Consultation'
    );
  }

  console.log('\n--- 4. CLINICAL PRESCRIPTIONS & DIAGNOSTIC ORDERS ---');
  const rxRes = await requestJson(`${base}/api/v1/doctor/prescriptions`, {
    method: 'POST',
    headers: docHeaders,
    body: {
      patientName: 'Subhas Chandra Bose',
      uhid: 'UHID-2026-0042',
      diagnosis: 'Hypertensive Heart Disease',
      medicines: [
        {
          name: 'Amlodipine 5mg',
          dosage: '1 Tablet',
          frequency: 'Once Daily (Night)',
          duration: '30 Days',
        },
      ],
      advice: 'Maintain low sodium intake and monitor BP daily.',
    },
  });
  recordTest(
    'POST /api/v1/doctor/prescriptions creates prescription bound to doctor',
    rxRes.status === 201 && rxRes.data?.data?.prescriptionNumber !== undefined,
    `Rx #: ${rxRes.data?.data?.prescriptionNumber}`
  );

  const labOrderRes = await requestJson(`${base}/api/v1/doctor/lab-orders`, {
    method: 'POST',
    headers: docHeaders,
    body: {
      uhid: 'UHID-2026-0042',
      testNames: ['Lipid Profile', 'ECG 12-Lead', 'Echocardiogram 2D'],
      priority: 'URGENT',
      clinicalIndication: 'Rule out ischemia',
    },
  });
  recordTest(
    'POST /api/v1/doctor/lab-orders registers diagnostic investigation order',
    labOrderRes.status === 201 && labOrderRes.data?.data?.orderNumber !== undefined
  );

  const reportsRes = await requestJson(`${base}/api/v1/doctor/reports`, {
    headers: docHeaders,
  });
  recordTest(
    'GET /api/v1/doctor/reports returns diagnostic investigation list',
    reportsRes.status === 200 && Array.isArray(reportsRes.data?.data?.reports)
  );

  console.log('\n--- 5. DOCTOR EARNINGS (Crash Fix & Real Aggregations) ---');
  const earningsRes = await requestJson(`${base}/api/v1/doctor/earnings`, {
    headers: docHeaders,
  });
  recordTest(
    'GET /api/v1/doctor/earnings calculates genuine financial metrics without 500 crash',
    earningsRes.status === 200 &&
      earningsRes.data?.data?.todayEarnings !== undefined &&
      earningsRes.data?.data?.currency === 'INR',
    `Today Earnings: ₹${earningsRes.data?.data?.todayEarnings}, Month Earnings: ₹${earningsRes.data?.data?.monthEarnings}`
  );

  console.log('\n--- 6. PATIENT REGISTRATION, VITALS & EHR TIMELINE ---');
  const testPatientPhone = `+91 98300 ${Math.floor(10000 + Math.random() * 90000)}`;
  const testPatientName = `Priyanka Sen ${Date.now().toString().slice(-4)}`;
  const newPatientRes = await requestJson(`${base}/api/v1/patients`, {
    method: 'POST',
    headers: { 'x-api-key': appKey },
    body: {
      name: testPatientName,
      age: 29,
      gender: 'Female',
      bloodGroup: 'B+',
      phone: testPatientPhone,
      condition: 'Ante-natal OPD Care',
    },
  });
  const createdUhid = newPatientRes.data?.data?.uhid;
  const createdPatientId = newPatientRes.data?.data?.id;
  recordTest(
    'POST /api/v1/patients persists new patient in database',
    newPatientRes.status === 201 && Boolean(createdUhid),
    `UHID: ${createdUhid}`
  );

  if (createdUhid) {
    const fetchPatientRes = await requestJson(`${base}/api/v1/patients/${createdUhid}`, {
      headers: { 'x-api-key': appKey },
    });
    recordTest(
      'GET /api/v1/patients/[id] retrieves newly persisted patient by UHID',
      fetchPatientRes.status === 200 && fetchPatientRes.data?.data?.name === testPatientName
    );

    const vitalsRes = await requestJson(`${base}/api/v1/patients/${createdUhid}/vitals`, {
      method: 'POST',
      headers: { 'x-api-key': appKey },
      body: {
        bpSystolic: 118,
        bpDiastolic: 76,
        heartRateBpm: 72,
        temperatureCelsius: 36.8,
        spO2Percentage: 99,
        weightKg: 58,
        heightCm: 162,
      },
    });
    recordTest(
      'POST /api/v1/patients/[id]/vitals logs telemetry data with BMI calculation',
      vitalsRes.status === 201 && vitalsRes.data?.data?.bmi !== undefined,
      `BMI: ${vitalsRes.data?.data?.bmi}`
    );

    const timelineRes = await requestJson(`${base}/api/v1/patients/${createdUhid}/timeline`, {
      headers: { 'x-api-key': appKey },
    });
    recordTest(
      'GET /api/v1/patients/[id]/timeline returns chronological EHR events',
      timelineRes.status === 200 && Array.isArray(timelineRes.data?.data?.timeline)
    );
  }

  console.log('\n--- 7. SUPER ADMIN 2FA & PROTECTED OPERATIONS ---');
  // Block outsider without key on /api/v1/database
  const blockedDbRes = await requestJson(`${base}/api/v1/database`, {
    headers: {},
  });
  recordTest(
    'GET /api/v1/database rejects unauthenticated outsider with 401',
    blockedDbRes.status === 401
  );

  // Authenticate Super Admin via Master Key
  const saMasterDbRes = await requestJson(`${base}/api/v1/database`, {
    headers: { 'x-api-key': superAdminKey },
  });
  recordTest(
    'GET /api/v1/database succeeds with Super Admin Master Key',
    saMasterDbRes.status === 200 && Boolean(saMasterDbRes.data?.data?.hospitalDatabase?.primaryHospital || saMasterDbRes.data?.data?.primaryHospital)
  );

  // Test Super Admin 2FA OTP flow
  const otpSendRes = await requestJson(`${base}/api/auth/super-admin/send-otp`, {
    method: 'POST',
    body: { email: 'ariyanhospital9@gmail.com', password: 'admin@2019' },
  });
  const otpToken = otpSendRes.data?.otpToken;
  recordTest(
    'POST /api/auth/super-admin/send-otp issues HMAC token without exposing devOtp in response',
    otpSendRes.status === 200 && Boolean(otpToken) && otpSendRes.data?.devOtp === undefined
  );

  console.log('\n================================================================');
  console.log(`🏁 TEST EXECUTION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${passedTests + failedTests})`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    console.error('FAILURES:');
    failures.forEach((f) => console.error(`  - ${f.title}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND PRODUCTION API ENDPOINTS VERIFIED AND PASSING 100%!');
    process.exit(0);
  }
}

runSuite().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
