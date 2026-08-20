# HMS Doctor Android Application — API Integration Guide

## 1. Network Architecture

The network communication layer uses **Retrofit 2** backed by **OkHttpClient** with interceptors for authorization headers, request logging, and error handling.

---

## 2. API Endpoints Map

### Authentication
- `POST /api/v1/auth/login` — Authenticate physician and retrieve Sanctum session token.
- `POST /api/v1/auth/logout` — Terminate active doctor session.

### OPD Queue & Appointments
- `GET /api/v1/doctor/appointments/today` — Retrieve today's appointment roster and queue stats (`total`, `waiting`, `inConsultation`, `completed`).
- `PATCH /api/v1/doctor/appointments/{id}/status` — Transition appointment status (`Waiting` $\to$ `In Consultation` $\to$ `Completed`).

### Patients & EHR History
- `GET /api/v1/patients` — Search patient records by name, UHID, or phone.
- `GET /api/v1/patients/{id}/history` — Retrieve patient clinical timeline, vitals telemetry, and prior prescriptions.

### Digital Prescriptions
- `GET /api/v1/doctor/prescriptions` — Retrieve all prescriptions authored by the doctor.
- `POST /api/v1/doctor/prescriptions` — Submit newly authored prescription with multi-drug builder to backend and Central Pharmacy.

### Diagnostic Reports & IPD
- `GET /api/v1/doctor/reports` — Diagnostic lab tests filtered by status (`ready`, `pending`, `critical`).
- `GET /api/v1/doctor/admissions` — Inpatient admissions and bed allocations across ICU, Private, and General wards.
- `GET /api/v1/doctor/followups` — Follow-up calendar and overdue consultations.
- `GET /api/v1/doctor/earnings` — Financial consultation analytics and pending hospital payouts.
- `POST /api/v1/notifications/fcm-token` — Register FCM device token for background emergency and lab alerts.

---

## 3. Error Handling Protocol

All API calls wrap their results in `NetworkResult<T>`:
- `NetworkResult.Success<T>(data, message)`
- `NetworkResult.Error(message, statusCode, isNetworkError)`
- `NetworkResult.Loading`

Offline states and network timeouts trigger `isNetworkError = true`, rendering dedicated "Unable to Connect" views with retry triggers.
