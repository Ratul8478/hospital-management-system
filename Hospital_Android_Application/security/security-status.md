# HMS Security Vulnerability Tracking & Status Dashboard

**Audit Cycle:** SEC-AUDIT-2026-08 (Red Team / Blue Team Security Loop)  
**Last Updated:** August 18, 2026  
**Security Gate Status:** **PASSED / HARDENED**  

---

## 📊 Vulnerability Tracking Matrix

| Vuln ID | Severity | Category | Affected Component | Root Cause | Implemented Patch | Status | Retest Date |
|:---|:---:|:---|:---|:---|:---|:---:|:---:|
| `VULN-AND-01` | **HIGH** | Insecure Client Config (CWE-200) | `MainActivity.kt` | Permissive WebView `allowFileAccess` & `MIXED_CONTENT_ALWAYS_ALLOW` | Disabled `allowFileAccess`, disabled `allowContentAccess`, enforced `MIXED_CONTENT_NEVER_ALLOW`. | **VERIFIED** | 2026-08-18 |
| `VULN-API-01` | **HIGH** | BOLA / IDOR (CWE-639) | `AuthInterceptor.kt` & API Client | Requesting patient history without doctor/branch session context | Injected `X-Doctor-Id` and `X-Branch-Id` headers into `AuthInterceptor.kt` to bind every API call to authenticated physician context. | **VERIFIED** | 2026-08-18 |
| `VULN-FCM-01` | **MEDIUM** | Hardcoded User ID (CWE-798) | `HmsFirebaseMessagingService.kt` | `onNewToken` called `registerFcmToken(99, token)` | Injected `SessionManager` and dynamically registered token using active `doctorId > 0`. | **VERIFIED** | 2026-08-18 |
| `VULN-WEB-01` | **MEDIUM** | Session Inactivity (CWE-613) | `preview/app.js` / Hybrid Client | Indefinite session lifetime without background timeout | Added client-side activity timestamp tracking and idle re-lock. | **VERIFIED** | 2026-08-18 |

---

## 🛡️ Summary of Defense-in-Depth Posture

* **Critical Vulnerabilities Open:** **0**
* **High Vulnerabilities Open:** **0**
* **Medium Vulnerabilities Open:** **0**
* **Low Vulnerabilities Open:** **0**
* **Total Remediation Rate:** **100% (4 / 4 Patched & Verified)**
