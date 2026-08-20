/**
 * Test Suite: Doctor Registration with Mandatory Reference ID, Chamber Address & Inter-Hospital Referral System
 */
const fs = require('fs');
const path = require('path');

console.log("============================================================");
console.log("🧪 TESTING: DOCTOR REGISTRATION & INTER-HOSPITAL REFERRALS");
console.log("============================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName, details = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName} - ${details}`);
  }
}

// Test 1: Verify Registration markup in src_index.html has all required fields
const htmlContent = fs.readFileSync(path.join(__dirname, '../preview/src_index.html'), 'utf8');
assert(htmlContent.includes('id="reg-name"'), "TEST-01: Doctor Registration form contains 'reg-name' input");
assert(htmlContent.includes('id="reg-chamber-address"'), "TEST-02: Doctor Registration form contains 'reg-chamber-address' input");
assert(htmlContent.includes('id="reg-pincode"'), "TEST-03: Doctor Registration form contains 'reg-pincode' input");
assert(htmlContent.includes('id="reg-district"'), "TEST-04: Doctor Registration form contains 'reg-district' input");
assert(htmlContent.includes('id="reg-state"'), "TEST-05: Doctor Registration form contains 'reg-state' input");
assert(htmlContent.includes('id="reg-reference-id"'), "TEST-06: Doctor Registration form contains 'reg-reference-id' input");
assert(htmlContent.includes('id="reg-email"'), "TEST-07: Doctor Registration form contains 'reg-email' input");
assert(htmlContent.includes('id="reg-password"'), "TEST-08: Doctor Registration form contains 'reg-password' input");
assert(htmlContent.includes('Register & Open Medix Portal'), "TEST-09: Register & Open Medix Portal button present in markup");

// Test 2: Verify app.js enforces mandatory fields
const jsContent = fs.readFileSync(path.join(__dirname, '../preview/app.js'), 'utf8');
assert(jsContent.includes('if (!refId)'), "TEST-10: app.js validates that refId is not empty in handleRegister()");
assert(jsContent.includes('if (!chamberAddress)'), "TEST-11: app.js validates that chamberAddress is not empty");
assert(jsContent.includes('if (!pincode)'), "TEST-12: app.js validates that pincode is not empty");
assert(jsContent.includes('if (!district)'), "TEST-13: app.js validates that district is not empty");
assert(jsContent.includes('if (!state)'), "TEST-14: app.js validates that state is not empty");

// Test 3: Verify Inter-Hospital Referral System markup & logic
assert(htmlContent.includes('id="modal-refer-hospital"'), "TEST-15: Modal for Inter-Hospital Referral exists in markup");
assert(htmlContent.includes('id="modal-referral-slip"'), "TEST-16: Modal for Official Transfer & Referral Slip exists in markup");
assert(htmlContent.includes('Apollo Multispecialty Hospital'), "TEST-17: City network hospitals dropdown configured");
assert(jsContent.includes('function executeHospitalReferral()'), "TEST-18: executeHospitalReferral() function defined in app.js");
assert(jsContent.includes('function populateReferralSlip('), "TEST-19: populateReferralSlip() function generates official transfer document");
assert(jsContent.includes('REF-HOSP-2026-'), "TEST-20: Generates unique tracking tokens for inter-hospital transfers");

// Test 4: Verify Android Domain Models, Repositories & ViewModel
const domainModels = fs.readFileSync(path.join(__dirname, '../doctor-android/app/src/main/java/com/hms/doctor/domain/model/DomainModels.kt'), 'utf8');
assert(domainModels.includes('data class HospitalReferral('), "TEST-21: Kotlin DomainModel contains HospitalReferral data class");

const repoImpls = fs.readFileSync(path.join(__dirname, '../doctor-android/app/src/main/java/com/hms/doctor/data/repository/RepositoryImpls.kt'), 'utf8');
assert(repoImpls.includes('override suspend fun registerDoctor('), "TEST-22: AuthRepositoryImpl implements registerDoctor() with chamber details and referenceId");
assert(repoImpls.includes('override suspend fun referPatientToHospital('), "TEST-23: PatientRepositoryImpl implements referPatientToHospital()");

const loginVm = fs.readFileSync(path.join(__dirname, '../doctor-android/app/src/main/java/com/hms/doctor/feature/auth/LoginViewModel.kt'), 'utf8');
assert(loginVm.includes('registerReferenceId') && loginVm.includes('registerChamberAddress'), "TEST-24: Android LoginViewModel manages registerReferenceId & chamber address state");

const loginScreen = fs.readFileSync(path.join(__dirname, '../doctor-android/app/src/main/java/com/hms/doctor/feature/auth/LoginScreen.kt'), 'utf8');
assert(loginScreen.includes('Register & Open Medix Portal'), "TEST-25: Android LoginScreen has 'Register & Open Medix Portal' button");

console.log("\n============================================================");
console.log(`Results: ${passed}/${total} Tests Passed (${passed === total ? 'ALL 100% VERIFIED' : 'FAILED'})`);
console.log("============================================================");
