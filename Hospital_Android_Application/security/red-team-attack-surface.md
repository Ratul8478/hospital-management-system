# HMS System Security Assessment — Red Team Attack Surface Inventory

**Assessment ID:** SEC-AUDIT-2026-08  
**Scope:** HMS Doctor Android App (`com.hms.doctor`), Laravel REST API (v1), Web Dashboard & Offline Bundle  
**Date:** August 18, 2026  
**Classification:** Internal Authorized Security Assessment  
**Lead Researcher:** Red Team Security Specialist & Application Security Researcher  

---

## 1. Executive Attack Surface Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HOSPITAL MANAGEMENT SYSTEM (HMS)                     │
├───────────────────────┬────────────────────────┬───────────────────────┤
│ Android Mobile Client │ Laravel REST API (v1)  │ Web Dashboard Engine  │
│ (Kotlin/Compose, SDK  │ (Sanctum Tokens, MySQL │ (Vue/HTML5, Offline   │
│ 35, Keystore, FCM)    │ Relational Clinical)   │ Hybrid Storage)       │
└───────────────────────┴────────────────────────┴───────────────────────┘
```

The Hospital Management System processes Protected Health Information (PHI), Electronic Medical Records (EMR), narcotic/prescription orders, laboratory telemetry, inpatient bed allocations, and doctor financial settlements.

---

## 2. Android Application Attack Surface (`com.hms.doctor`)

### 2.1 Manifest & Component Exposure
* **Package Name:** `com.hms.doctor`
* **Entry Activity:** `MainActivity` (Exported: `true`, Category: `LAUNCHER`)
* **Deep Link Schemes:** `hmsdoctor://app` (Intent filter: `android.intent.action.VIEW`, `BROWSABLE`)
* **Services:** `com.hms.doctor.core.notifications.HmsFirebaseMessagingService` (Exported: `false`)
* **Application Flags:**
  * `allowBackup="false"` (Protected against adb backup extraction)
  * `usesCleartextTraffic="false"` (Enforced via `network_security_config.xml`)
  * `networkSecurityConfig="@xml/network_security_config"`

### 2.2 Local Storage & Cryptography
* **Token Store:** `EncryptedSharedPreferences` via `androidx.security.crypto:security-crypto:1.1.0-alpha06`
* **Encryption Standard:** AES-256-GCM backed by Android Hardware Keystore (`MasterKey`)
* **Cached Assets:** `android_asset/medix/index.html` (Local hybrid bundle)

### 2.3 IPC & Inter-Process Communication
* Deep link uri parsing: potential parameter injection on `hmsdoctor://app` routes.
* Notification Intent pending intents: verifying mutable vs immutable flag configurations.

---

## 3. Laravel REST API (v1) Attack Surface

### 3.1 Authentication & Session Endpoints
| HTTP Method | Route | Auth Req | Target Data / Capability |
|:---|:---|:---:|:---|
| `POST` | `/api/v1/auth/login` | No | Credential verification & Sanctum token issue |
| `POST` | `/api/v1/auth/logout` | Bearer | Token revocation & session termination |
| `POST` | `/api/v1/auth/forgot-password` | No | Password recovery email dispatch |
| `POST` | `/api/v1/notifications/fcm-token`| Bearer | Device FCM registration |

### 3.2 Clinical Consultation & Queue Endpoints
| HTTP Method | Route | Auth Req | Parameters | BOLA / IDOR Sensitivity |
|:---|:---|:---:|:---|:---:|
| `GET` | `/api/v1/doctor/appointments/today` | Bearer | `date`, `status` | Doctor-scoped filtering |
| `GET` | `/api/v1/doctor/appointments/{id}` | Bearer | `{id}` (Path) | **HIGH**: Object authorization check |
| `PATCH` | `/api/v1/doctor/appointments/{id}/status`| Bearer | `status` | **HIGH**: Invalid state transition |
| `GET` | `/api/v1/doctor/patients` | Bearer | `search`, `page` | Patient directory search |
| `GET` | `/api/v1/doctor/patients/{id}/history` | Bearer | `{id}` (Path) | **CRITICAL**: Full patient EHR access |

### 3.3 Prescription & Laboratory Telemetry Endpoints
| HTTP Method | Route | Auth Req | Parameters | BOLA / IDOR Sensitivity |
|:---|:---|:---:|:---|:---:|
| `POST` | `/api/v1/doctor/prescriptions` | Bearer | Body JSON | **CRITICAL**: Pharmacy dispatch integrity |
| `GET` | `/api/v1/doctor/prescriptions` | Bearer | `doctorId`, `page`| Prescription audit log |
| `GET` | `/api/v1/doctor/reports` | Bearer | `status`, `page` | **CRITICAL**: Diagnostic reports & PDFs |
| `GET` | `/api/v1/doctor/admissions` | Bearer | `ward` | Inpatient bed allocations |
| `GET` | `/api/v1/doctor/followups` | Bearer | `due` | Patient recall contacts |
| `GET` | `/api/v1/doctor/earnings` | Bearer | `period` | **HIGH**: Financial consultation data |

---

## 4. Web & Hybrid Client Attack Surface

* **DOM XSS Vectors:** Review `innerHTML` and unsanitized template injection in `preview/src_index.html` and `preview/app.js`.
* **Client-side Session Storage:** Review `localStorage.getItem('hms_token')` exposure to cross-site scripting.
* **Content-Security-Policy (CSP):** Enforcing strict script-src, style-src, and frame-ancestors.

---

## 5. Threat Modeling & Attack Vectors

1. **Broken Object Level Authorization (BOLA/IDOR):** Attacker Doctor A alters `{id}` to fetch Patient B or Appointment C assigned to Doctor B.
2. **Privilege Escalation:** Tampering with role payloads (`role: "super_admin"`) during token refresh or profile updates.
3. **Sensitive Data Exposure in Push Notifications:** Diagnostic lab alerts or PHI sent in plaintext notification bodies.
4. **WebView Local File Exposure:** Testing `allowFileAccess` and cross-origin file URL access in Android container.
5. **Hardcoded Fallbacks:** Inspecting client source for hardcoded fallback tokens or default doctor IDs (`99`).
