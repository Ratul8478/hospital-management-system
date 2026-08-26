/**
 * Local verification of the hospital/doctor sync contract.
 * Run against `npm run dev` on port 3000.
 */
const BASE = 'http://localhost:3000';
const APP_KEY = 'medix_live_sec_app_key_2026_wb33735581_ariyan';
const MASTER_KEY = 'medix_master_sa_key_2026_ariyan_hq_wb9144376971';

const branch = (id, code, name) => ({
  id, code, name,
  location: 'Kolkata, West Bengal',
  address: `${name} Road, Kolkata 700001`,
  branchHead: `Dr. Head ${id}`,
  adminName: `Admin ${id}`,
  adminEmail: `admin${id}@medix.local`,
  adminPhone: '+91 91443 76971',
  status: 'active',
  revenue: 0, patientCount: 0, bedOccupancy: '0 / 50 Beds',
});

const doctor = (id, branchId, name, image) => ({
  id, branchId, name,
  specialty: 'Cardiology & Critical Care',
  qualification: 'MBBS, MD',
  fee: 750,
  status: 'available',
  contact: '+91 98042 22142',
  scheduleTime: '10:00 AM - 02:00 PM',
  chamberRoom: 'OPD Chamber 102',
  image,
});

async function post(branches, doctors) {
  const res = await fetch(`${BASE}/api/v1/database`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': MASTER_KEY },
    body: JSON.stringify({ branches, doctors }),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function getHospitals() {
  const res = await fetch(`${BASE}/api/v1/hospitals`, { headers: { 'x-api-key': APP_KEY } });
  const body = await res.json().catch(() => null);
  return { status: res.status, hospitals: body?.data?.hospitals || [] };
}

async function getDoctors() {
  const res = await fetch(`${BASE}/api/v1/doctors`, { headers: { 'x-api-key': APP_KEY } });
  const body = await res.json().catch(() => null);
  return { status: res.status, doctors: body?.data?.doctors || [] };
}

let failures = 0;
function check(label, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
  if (!ok) failures++;
}

(async () => {
  // --- Baseline: unconfigured roster store must not break anything -----------
  const baseline = await getHospitals();
  check('GET /hospitals responds 200 with no roster store configured',
    baseline.status === 200 && baseline.hospitals.length > 0,
    `status=${baseline.status} count=${baseline.hospitals.length}`);

  // --- ADD: two hospitals, two doctors, one carrying a portrait -------------
  const PHOTO = 'https://example.com/dr-photo.jpg';
  const added = await post(
    [branch(1, 'ARIYAN-HQ', 'ARIYAN HOSPITAL MULTISPECIALITY'), branch(9, 'NEW-CLINIC', 'Brand New Test Clinic')],
    [doctor(101, 1, 'Dr. Existing Doc', ''), doctor(901, 9, 'Dr. Freshly Added', PHOTO)]
  );
  check('POST /database accepts the roster', added.status === 200, `status=${added.status}`);

  const afterAdd = await getHospitals();
  const newHosp = afterAdd.hospitals.find(h => h.code === 'NEW-CLINIC');
  check('newly added hospital appears in GET /hospitals', Boolean(newHosp),
    `codes=[${afterAdd.hospitals.map(h => h.code).join(', ')}]`);

  const newDoc = newHosp?.doctors?.find(d => d.name === 'Dr. Freshly Added');
  check('newly added doctor appears under that hospital', Boolean(newDoc),
    newHosp ? `doctors=[${newHosp.doctors.map(d => d.name).join(', ')}]` : 'hospital missing');

  check('doctor portrait survives the sync', newDoc?.image === PHOTO || newDoc?.avatarUrl === PHOTO,
    `image=${JSON.stringify(newDoc?.image)} avatarUrl=${JSON.stringify(newDoc?.avatarUrl)}`);

  const afterAddDocs = await getDoctors();
  check('GET /doctors lists the new doctor',
    afterAddDocs.doctors.some(d => d.name === 'Dr. Freshly Added'),
    `count=${afterAddDocs.doctors.length}`);

  // --- REMOVE: drop the new hospital and its doctor -------------------------
  await post([branch(1, 'ARIYAN-HQ', 'ARIYAN HOSPITAL MULTISPECIALITY')], [doctor(101, 1, 'Dr. Existing Doc', '')]);

  const afterRemove = await getHospitals();
  check('removed hospital disappears from GET /hospitals',
    !afterRemove.hospitals.some(h => h.code === 'NEW-CLINIC'),
    `codes=[${afterRemove.hospitals.map(h => h.code).join(', ')}]`);

  const afterRemoveDocs = await getDoctors();
  check('removed doctor disappears from GET /doctors',
    !afterRemoveDocs.doctors.some(d => d.name === 'Dr. Freshly Added'),
    `names=[${afterRemoveDocs.doctors.map(d => d.name).join(', ')}]`);

  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
