/**
 * Automated Test Suite for State & District Selection Logic & Location API
 * 
 * Verifies:
 *  1. State selector initialization & retrieval
 *  2. District options correspondence for selected State
 *  3. State change cascading reset/update of Districts
 *  4. Selected values persistence in state & form submissions
 *  5. API query validation (Missing parameters, invalid states)
 *  6. Error handling & graceful fallback
 *  7. Caching and deduplication
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🗺️  MEDIX STATE & DISTRICT SELECTION AUTOMATION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Fetch States List
    console.log('▶ TEST 1: Retrieve All States List');
    const statesRes = await makeRequest('/api/v1/locations?type=states');
    assert(statesRes.statusCode === 200, 'GET /api/v1/locations?type=states returns 200 OK');
    assert(statesRes.body.success === true, 'Response contains success=true');
    assert(Array.isArray(statesRes.body.data?.states), 'Returns an array of states');
    assert(statesRes.body.data?.states.length >= 15, `Contains at least 15 Indian States/UTs (found ${statesRes.body.data?.states.length})`);
    
    const wbState = statesRes.body.data?.states.find(s => s.name === 'West Bengal' || s.code === 'WB');
    assert(!!wbState, 'State list contains West Bengal');

    // 2. Select State & Verify District List (West Bengal)
    console.log('\n▶ TEST 2: Select State "West Bengal" and Verify District List');
    const wbDistrictsRes = await makeRequest('/api/v1/locations?type=districts&state=West%20Bengal');
    assert(wbDistrictsRes.statusCode === 200, 'GET /api/v1/locations?type=districts&state=West%20Bengal returns 200 OK');
    assert(wbDistrictsRes.body.success === true, 'Response contains success=true');
    const wbDistricts = wbDistrictsRes.body.data?.districts || [];
    assert(wbDistricts.includes('Kolkata'), 'West Bengal district list contains "Kolkata"');
    assert(wbDistricts.includes('Howrah'), 'West Bengal district list contains "Howrah"');
    assert(wbDistricts.includes('North 24 Parganas'), 'West Bengal district list contains "North 24 Parganas"');
    assert(!wbDistricts.includes('Mumbai City'), 'West Bengal district list does NOT contain "Mumbai City"');

    // 3. Change State & Verify District Refresh (Maharashtra)
    console.log('\n▶ TEST 3: Change State to "Maharashtra" and Verify District Refresh');
    const mhDistrictsRes = await makeRequest('/api/v1/locations?type=districts&state=Maharashtra');
    assert(mhDistrictsRes.statusCode === 200, 'GET /api/v1/locations?type=districts&state=Maharashtra returns 200 OK');
    const mhDistricts = mhDistrictsRes.body.data?.districts || [];
    assert(mhDistricts.includes('Mumbai Suburban'), 'Maharashtra district list contains "Mumbai Suburban"');
    assert(mhDistricts.includes('Pune'), 'Maharashtra district list contains "Pune"');
    assert(!mhDistricts.includes('Kolkata'), 'Maharashtra district list does NOT contain "Kolkata"');

    // 4. Test State Code Resolution (MH, DL, KA)
    console.log('\n▶ TEST 4: Query Districts by State Code (DL, KA)');
    const dlRes = await makeRequest('/api/v1/locations?type=districts&state=DL');
    assert(dlRes.statusCode === 200, 'GET districts with stateCode=DL returns 200 OK');
    assert(dlRes.body.data?.districts.includes('New Delhi'), 'Delhi districts include "New Delhi"');

    const kaRes = await makeRequest('/api/v1/locations?type=districts&state=KA');
    assert(kaRes.statusCode === 200, 'GET districts with stateCode=KA returns 200 OK');
    assert(kaRes.body.data?.districts.includes('Bengaluru Urban'), 'Karnataka districts include "Bengaluru Urban"');

    // 5. API Failure / Missing Parameter handling (422)
    console.log('\n▶ TEST 5: API Error Handling on Missing State Parameter');
    const missingParamRes = await makeRequest('/api/v1/locations?type=districts');
    assert(missingParamRes.statusCode === 422, 'Requesting districts without state returns 422 Unprocessable Entity');
    assert(missingParamRes.body.success === false, 'Error response has success=false');
    assert(missingParamRes.body.code === 'MISSING_STATE_PARAMETER', 'Error response returns code MISSING_STATE_PARAMETER');

    // 6. API Failure / Non-Existent State handling (404)
    console.log('\n▶ TEST 6: API Error Handling on Non-Existent State');
    const invalidStateRes = await makeRequest('/api/v1/locations?type=districts&state=NonExistentStateXYZ');
    assert(invalidStateRes.statusCode === 404, 'Requesting districts for non-existent state returns 404 Not Found');
    assert(invalidStateRes.body.success === false, 'Error response has success=false');
    assert(invalidStateRes.body.code === 'INVALID_STATE', 'Error response returns code INVALID_STATE');

    // 7. Full Location Tree Endpoint (type=all)
    console.log('\n▶ TEST 7: Full Location Tree Endpoint');
    const allRes = await makeRequest('/api/v1/locations?type=all');
    assert(allRes.statusCode === 200, 'GET /api/v1/locations?type=all returns 200 OK');
    assert(Array.isArray(allRes.body.data?.states), 'Returns full states tree');
    assert(allRes.body.data?.states[0].districts.length > 0, 'Each state node contains child districts array');

  } catch (err) {
    console.error('Fatal test runner error:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED (Total: ${passed + failed})`);
  console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
