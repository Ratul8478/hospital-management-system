# HMS System Security Assessment — Blue Team Hardening & Remediation Plan

**Plan ID:** SEC-PLAN-2026-08  
**Lead Engineer:** Blue Team Security Lead & Secure Code Reviewer  
**Target Date:** August 18, 2026  
**Status:** In Progress / Active Remediation  

---

## 1. Vulnerability-to-Remediation Mapping

| Vuln ID | Title | Severity | Root Cause | Planned Fix | Regression Risk | Verification Test |
|:---|:---|:---:|:---|:---|:---:|:---|
| `VULN-AND-01` | Insecure WebView Settings | **HIGH** | `allowFileAccess = true` & `MIXED_CONTENT_ALWAYS_ALLOW` enabled globally in `MainActivity.kt`. | Harden WebView settings: disable `allowFileAccess`, disable `allowContentAccess`, enforce `MIXED_CONTENT_NEVER_ALLOW`. | Low | Verify asset loading continues functioning with zero console errors. |
| `VULN-API-01` | BOLA Risk in Patient EHR | **HIGH** | Unverified patient ID lookup without doctor session context. | Inject `X-Doctor-Id` and `X-Branch-Id` in `AuthInterceptor.kt` to bind every API request to authenticated doctor context. | Very Low | Automated unit tests asserting doctor ID header presence. |
| `VULN-FCM-01` | Hardcoded Doctor ID 99 in FCM | **MEDIUM** | Static user ID `99` passed to `registerFcmToken`. | Inject `SessionManager` into `HmsFirebaseMessagingService` and register token using active `doctorId`. Defer if unauthenticated. | Low | Test FCM token update on fresh login. |
| `VULN-WEB-01` | Missing Inactivity Lock | **MEDIUM** | Indefinite session lifetime on mobile client. | Add client-side session activity timestamp tracking; trigger biometric re-authentication after 15 min idle. | Low | Session state validation tests. |

---

## 2. Step-by-Step Implementation Sequence

1. **Patch 1 (`MainActivity.kt`):**
   * Set `allowFileAccess = false`
   * Set `allowContentAccess = false`
   * Set `mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW`
2. **Patch 2 (`HmsFirebaseMessagingService.kt`):**
   * Add `@Inject lateinit var sessionManager: SessionManager`
   * Check `val doctorId = sessionManager.getDoctorId()`
   * Only dispatch API call if `doctorId > 0`
3. **Patch 3 (`AuthInterceptor.kt`):**
   * Inject `X-Doctor-Id: {doctorId}` and `X-Branch-Id: {branchId}` into outgoing OkHttp request headers
4. **Patch 4 (`preview/app.js`):**
   * Add `lastActivityTime` tracking with automatic clinical session lock

---

## 3. Regression Testing Criteria

* All 11 clinical modules must continue functioning normally.
* Offline asset loading must not be impaired.
* Gradle unit test suite (`testDebugUnitTest`) must execute with 100% pass rate.
* Production APK assembly (`assembleDebug`) must build with 0 errors.
