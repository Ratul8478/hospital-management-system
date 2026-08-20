# HMS Doctor Android Application — API Audit & Contract Specification

**Document Version:** 1.0.0  
**Target Application:** HMS Doctor Native Android App (`com.hms.doctor`)  
**Backend:** Existing HMS Laravel REST API & MySQL Database  
**Base URL:** `https://hospital-management-system-using-an.vercel.app/api/v1`  
**Security Standard:** Sanctum Token / Bearer Authentication, TLS 1.3, HIPAA & GDPR Compliant  

---

## 1. Transport & Header Conventions

- **Content-Type:** `application/json; charset=utf-8`
- **Authentication Header:** `Authorization: Bearer <SANCTUM_TOKEN>`
- **Client Identifier:** `X-Client-Platform: android-doctor`
- **Client Version:** `X-Client-Version: 1.0.0`

---

## 2. Standard Envelope Formats

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { "total": 18 }
}
```

### 2.2 Standard Error Envelope
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Clinical validation failed",
  "error": {
    "field": "diagnosis",
    "details": "Diagnosis field is mandatory for prescription generation"
  }
}
```

---

## 3. Core API Endpoint Matrix

| Feature Area | Endpoint | Method | Auth | Description |
|:---|:---|:---:|:---:|:---|
| **Auth** | `/auth/login` | `POST` | No | Authenticate doctor credentials & issue Sanctum token |
| **Auth** | `/auth/logout` | `POST` | Yes | Invalidate token & unbind device sessions |
| **Appointments** | `/doctor/appointments/today` | `GET` | Yes | Retrieve today's OPD queue & stats (`waiting`, `inConsultation`, `completed`) |
| **Appointments** | `/doctor/appointments/{id}/status`| `PATCH` | Yes | Transition queue state (`Waiting` $\to$ `In Consultation` $\to$ `Completed`) |
| **Patients** | `/patients` | `GET` | Yes | Search patient EHR directory with query & pagination |
| **Patients** | `/patients/{id}/history` | `GET` | Yes | Retrieve full patient medical history & timeline |
| **Prescriptions** | `/doctor/prescriptions` | `GET` | Yes | Fetch issued digital prescriptions |
| **Prescriptions** | `/doctor/prescriptions` | `POST` | Yes | Create electronic prescription & route to Pharmacy |
| **Reports** | `/doctor/reports` | `GET` | Yes | Fetch diagnostic lab reports by status (`ready`, `pending`, `critical`) |
| **Admissions** | `/doctor/admissions` | `GET` | Yes | Retrieve IPD inpatients and bed allocations (ICU, Private, General) |
| **Follow-ups** | `/doctor/followups` | `GET` | Yes | Retrieve upcoming follow-up schedules |
| **Earnings** | `/doctor/earnings` | `GET` | Yes | Retrieve consultation fees & payout analytics |
| **Notifications** | `/notifications/fcm-token` | `POST` | Yes | Register Firebase Cloud Messaging token for emergency alerts |

---

## 4. Cross-Platform Shared Data Principle

- **Single Source of Truth:** MySQL database accessed through authorized Laravel REST API.
- **Data Parity:** Web receptionist actions (e.g. creating patient or appointment) reflect immediately on Android. Android doctor actions (e.g. issuing prescription or updating queue status) reflect immediately on Web/Admin panels.
- **Authorization:** Doctor access scope is determined entirely server-side by the authenticated Sanctum token. Client-supplied IDs are never trusted as authoritative.
