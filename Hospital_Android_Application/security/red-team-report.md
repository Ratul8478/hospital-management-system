# HMS System Security Assessment — Red Team Findings & Threat Report

**Assessment ID:** SEC-AUDIT-2026-08  
**Scope:** HMS Doctor Android Application, REST API v1, Web Client & Offline Engine  
**Assessment Period:** August 18, 2026  
**Classification:** Internal Authorized Red Team Vulnerability Report  
**Lead Auditor:** Red Team Security Lead & Adversarial Security Researcher  

---

## 1. Executive Summary

An authorized, adversarial penetration test and security audit was executed against the **Hospital Management System (HMS)** client application and associated API boundaries. 

The assessment identified **4 actionable security vulnerabilities** across Android IPC, WebView configuration, FCM token handling, and object authorization parameters. No critical zero-day exploits or active credential leaks were found in release assets.

```
┌───────────────────────────┬───────────┬─────────┬────────────┐
│ Finding ID & Title        │ Severity  │ Layer   │ Status     │
├───────────────────────────┼───────────┼─────────┼────────────┤
│ VULN-AND-01: Permissive WebView Settings | HIGH | Android | OPEN |
│ VULN-API-01: BOLA Risk in Patient EHR    | HIGH | API/Client| OPEN |
│ VULN-FCM-01: Hardcoded FCM Doctor ID 99 | MEDIUM | Android | OPEN |
│ VULN-WEB-01: Missing Idle Inactivity Lock | MEDIUM | Web/Hybrid| OPEN |
└───────────────────────────┴───────────┴─────────┴────────────┘
```

---

## 2. Detailed Vulnerability Findings

---

### Finding 1: Overly Permissive WebView File & Content Settings
* **Finding ID:** `VULN-AND-01`
* **Severity:** **HIGH** (CVSS: 7.4 / CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N)
* **Affected Component:** [`MainActivity.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/MainActivity.kt#L64-L76)
* **Security Category:** Insecure Client Configuration & Local File Exposure (CWE-200 / CWE-749)
* **Attack Precondition:** Attacker launches malicious intent or loads external URI in WebView container.
* **Safe Reproduction Steps:**
  1. Inspect `MainActivity.kt` lines 68–76.
  2. Notice `allowFileAccess = true`, `allowContentAccess = true`, and `mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW`.
  3. A compromised origin or injected script can read arbitrary internal sandbox files via `file://` protocol.
* **Observed Behavior:** File access and mixed content are globally permitted.
* **Expected Behavior:** `allowFileAccess` and `allowContentAccess` must be set to `false` (assets load via `AssetLoader` or explicit scheme), and `mixedContentMode` set to `MIXED_CONTENT_NEVER_ALLOW`.
* **Business Impact:** Potential exposure of local SQLite / SharedPreferences cache.
* **Recommended Remediation:** Restrict WebView settings to `allowFileAccess = false`, `allowContentAccess = false`, and `MIXED_CONTENT_NEVER_ALLOW`.

---

### Finding 2: BOLA / IDOR Risk in Direct Patient History Lookup
* **Finding ID:** `VULN-API-01`
* **Severity:** **HIGH** (CVSS: 7.1 / CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N)
* **Affected Component:** [`RepositoryImpls.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/data/repository/RepositoryImpls.kt#L154-L170) & `/api/v1/doctor/patients/{id}/history`
* **Security Category:** Broken Object Level Authorization (CWE-639 / OWASP API1:2023)
* **Attack Precondition:** Authenticated Doctor A knows or iterates UHID/patient ID belonging to Doctor B's private department.
* **Safe Reproduction Steps:**
  1. Authenticate with Doctor A token.
  2. Send `GET /api/v1/doctor/patients/999/history`.
  3. If backend does not verify doctor-patient affiliation, full longitudinal chart of Patient 999 is returned.
* **Observed Behavior:** Repository passes arbitrary `patientIdOrUhid` string without client-side session context validation.
* **Expected Behavior:** Backend and client must enforce branch/doctor assignment checks and log unauthorized access attempts.
* **Recommended Remediation:** Ensure `AuthInterceptor` injects active `branchId` and `doctorId`, and backend Laravel policy verifies permission before returning patient chart.

---

### Finding 3: Hardcoded Doctor ID Fallback (99) in FCM Token Binding
* **Finding ID:** `VULN-FCM-01`
* **Severity:** **MEDIUM** (CVSS: 5.3 / CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N)
* **Affected Component:** [`HmsFirebaseMessagingService.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/core/notifications/HmsFirebaseMessagingService.kt#L31)
* **Security Category:** Insecure Direct Object Reference / Hardcoded Credential Identifier (CWE-798)
* **Attack Precondition:** Device generates a new Firebase registration token on app install.
* **Safe Reproduction Steps:**
  1. Inspect `onNewToken(token: String)` in `HmsFirebaseMessagingService.kt`.
  2. Line 31 calls `notificationRepository.registerFcmToken(99, token)`.
  3. Every doctor device registers its token under static user ID `99`.
* **Observed Behavior:** FCM token is registered under hardcoded ID `99` regardless of authenticated doctor.
* **Expected Behavior:** Service must inject `SessionManager.getDoctorId()`, and if `doctorId == 0` (unauthenticated), defer registration until doctor completes login.
* **Recommended Remediation:** Inject `SessionManager` into `HmsFirebaseMessagingService` and dynamically register token only for the authenticated doctor.

---

### Finding 4: Missing Inactivity Session Timeout in Clinical Container
* **Finding ID:** `VULN-WEB-01`
* **Severity:** **MEDIUM** (CVSS: 4.6 / CVSS:3.1/AV:P/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
* **Affected Component:** [`preview/app.js`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/preview/app.js) / Client Session Store
* **Security Category:** Insufficient Session Expiration (CWE-613)
* **Attack Precondition:** Doctor leaves physical device unattended in hospital ward.
* **Safe Reproduction Steps:**
  1. Doctor logs into app.
  2. App is left idle for > 30 minutes.
  3. No automatic biometric re-lock or PIN prompt triggers upon resuming activity.
* **Observed Behavior:** Session persists indefinitely without idle timeout.
* **Expected Behavior:** In compliance with HIPAA and hospital security protocols, 15-minute inactivity timer should prompt biometric unlock or re-authentication.
* **Recommended Remediation:** Implement client-side inactivity timer in `MainActivity.kt` and `app.js` that requests biometric re-lock after 15 minutes of background/idle state.

---

## 3. Positive Security Controls Identified

* ✅ Android Keystore `MasterKey` AES-256-GCM encryption verified for Sanctum Bearer tokens.
* ✅ Automatic session termination on HTTP 401 Unauthorized (`AuthInterceptor.kt`).
* ✅ Strict TLS 1.3 enforcement and cleartext blocking in `network_security_config.xml`.
* ✅ `allowBackup="false"` in `AndroidManifest.xml` prevents physical adb backup extraction.
* ✅ ProGuard rules protect sensitive DTOs and reflection models from reverse engineering.

---
*Report submitted to Blue Team for immediate remediation.*
