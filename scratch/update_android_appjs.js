const fs = require('fs');
const path = require('path');

const appJsPath = path.join(process.cwd(), 'Hospital_Android_Application', 'preview', 'app.js');
let appJsCode = fs.readFileSync(appJsPath, 'utf8');

const startMarker = `// 2. Asynchronous API fetch for Remote APK / Server Synchronization`;
const endMarker = `if (hospRes && hospRes.success && hospRes.data && hospRes.data.hospitals && hospRes.data.hospitals.length > 0) {`;

const startIndex = appJsCode.indexOf(startMarker);
const endIndex = appJsCode.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `// 2. Asynchronous API fetch for Remote APK / Server Synchronization (FIREBASE FIRESTORE SYNC)
    function parseFirestoreValue(val) {
      if (!val) return null;
      if (val.stringValue !== undefined) return val.stringValue;
      if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
      if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
      if (val.booleanValue !== undefined) return val.booleanValue;
      if (val.arrayValue) return (val.arrayValue.values || []).map(parseFirestoreValue);
      if (val.mapValue && val.mapValue.fields) {
        const obj = {};
        for (const key in val.mapValue.fields) {
          obj[key] = parseFirestoreValue(val.mapValue.fields[key]);
        }
        return obj;
      }
      return null;
    }

    async function fetchFirestoreData(docName) {
      try {
        const res = await fetch(\`https://firestore.googleapis.com/v1/projects/medix-doctor-app/databases/(default)/documents/medix_realtime_db/\${docName}\`);
        if (!res.ok) return null;
        const json = await res.json();
        if (json.fields && json.fields.data) {
          return parseFirestoreValue(json.fields.data);
        }
      } catch (e) {
        console.error("Firestore fetch error:", e);
      }
      return null;
    }

    let [rawHosp, rawDoc] = await Promise.all([
      fetchFirestoreData('branches'),
      fetchFirestoreData('doctors')
    ]);

    let hospRes = rawHosp && rawHosp.length > 0 ? { success: true, data: { hospitals: rawHosp } } : null;
    let docRes = rawDoc && rawDoc.length > 0 ? { success: true, data: { doctors: rawDoc } } : null;

    `;
  appJsCode = appJsCode.substring(0, startIndex) + replacement + appJsCode.substring(endIndex);
  fs.writeFileSync(appJsPath, appJsCode, 'utf8');
  console.log("Successfully replaced fetch logic with Firestore in preview/app.js");
} else {
  console.log("Could not find markers in app.js");
}
