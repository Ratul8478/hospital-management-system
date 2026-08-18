# Medix Enterprise API Audit & Mobile-Backend Contract

**Document Version:** 2.4.0  
**Target Applications:** Medix Web Portal & Medix Doctor Android App (`com.medix.doctor`)  
**Base URL (Production):** `https://hospital-management-system-using-an.vercel.app/api/v1`  
**Base URL (Staging):** `https://staging-medix-api.medixhealth.io/api/v1`  
**Base URL (Local/Dev):** `http://10.0.2.2:3000/api/v1` (Android Emulator loopback)  
**Security Standard:** OAuth2.0 / JWT Bearer, TLS 1.3, HIPAA & GDPR Health Data Privacy Compliant  

---

## 1. Executive Summary & Protocol Overview

The Medix Enterprise Hospital Management System provides a unified RESTful JSON API powering both the Web Management Portal and the native Kotlin Android Doctor Companion Application. This document provides a complete audit of all endpoints, authentication flows, request/response schemas, error protocols, status codes, and cross-platform synchronization standards.

### 1.1 Transport & Serialization Standards
- **Content-Type:** `application/json; charset=utf-8`
- **Authentication Header:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Multi-Tenant / Branch Scope Header:** `X-Branch-ID: <BRANCH_ID>` (Integer ID, e.g. `1` for Medix Central Mumbai)
- **Client Identification Header:** `X-Client-Platform: android-doctor` | `X-Client-Version: 1.0.0`
- **Idempotency Header (Mutations):** `X-Idempotency-Key: <UUID_V4>` (Required on `POST /consultations`, `POST /prescriptions`, `POST /vitals`)
- **Date-Time Format:** ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)

---

## 2. Standardized Envelope & Error Format

All API responses follow the standard Medix API Envelope.

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "metadata": {
    "timestamp": "2026-08-16T12:00:00Z",
    "traceId": "medix-req-8f3a1b2c-94e1",
    "version": "v1"
  }
}
```

### 2.2 Standard Paginated Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Records fetched successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 142,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "metadata": {
    "timestamp": "2026-08-16T12:00:00Z",
    "traceId": "medix-req-8f3a1b2c-94e2"
  }
}
```

### 2.3 Standard Error Envelope (RFC 7807 Compliant)
```json
{
  "success": false,
  "statusCode": 422,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid vital signs telemetry parameters",
    "details": "Blood pressure systolic value exceeds biological limit",
    "fieldErrors": [
      {
        "field": "bpSystolic",
        "rejectedValue": 320,
        "constraint": "Must be between 40 and 260 mmHg"
      }
    ],
    "traceId": "medix-err-9a8b7c6d-31f0",
    "timestamp": "2026-08-16T12:00:00Z"
  }
}
```

---

## 3. Global HTTP Status Code Matrix

| Status Code | Semantic Meaning | Usage Context |
|:---|:---|:---|
| `200 OK` | Request Succeeded | `GET`, `PATCH`, `PUT` requests returning body payload |
| `201 Created` | Resource Created | `POST` requests (Consultation, Prescription, Vital, Lab Order) |
| `204 No Content` | Success (No Body) | `DELETE` operations or session termination |
| `304 Not Modified` | Cache Valid | Conditional `GET` requests passing `If-None-Match: <ETag>` |
| `400 Bad Request` | Malformed Payload | Missing mandatory JSON keys, malformed JSON syntax |
| `401 Unauthorized` | Authentication Failed | Missing, expired, or corrupted JWT Bearer token |
| `403 Forbidden` | Access Denied | Doctor attempting to access unassigned branch or super-admin resources |
| `404 Not Found` | Entity Missing | Patient UHID, Appointment ID, or Prescription ID not found |
| `409 Conflict` | State Conflict | Double-booking doctor slot, concurrent consultation lock |
| `422 Unprocessable`| Domain Validation Error| Field-level validation failures (e.g. invalid drug dosage) |
| `429 Too Many Req` | Rate Limit Exceeded | Client exceeded 120 req/minute threshold |
| `500 Internal Error`| Server Exception | Unhandled backend exception (returns `traceId`) |
| `503 Service Unavail`| Maintenance / DB down | Temporary upstream outage |

---

## 4. End-to-End API Endpoint Specification

### 4.1 Authentication & Session Lifecycle

#### `POST /auth/login`
- **Description:** Authenticate doctor using medical license ID/email and secure password.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "doctor@nmc.local",
  "password": "Password@123",
  "clientPlatform": "android-doctor",
  "deviceInfo": {
    "deviceModel": "Pixel 8 Pro",
    "osVersion": "Android 14 (API 34)",
    "appVersion": "1.0.0"
  }
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Authentication successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...",
    "expiresIn": 3600,
    "user": {
      "id": "DOC-2026-004",
      "email": "doctor@nmc.local",
      "name": "Dr. Sarah Jenkins",
      "role": "doctor",
      "branchId": 1,
      "branchName": "Medix Central Multispecialty Hospital",
      "branchCode": "MEDIX-MAIN",
      "phone": "+91 98200 11223",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      "doctorProfileId": 1
    }
  }
}
```

#### `POST /auth/refresh`
- **Description:** Exchange a valid refresh token for a newly signed access token.
- **Auth Required:** No (Refresh Token in body)
- **Request Body:**
```json
{
  "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..."
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new...",
    "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4.new...",
    "expiresIn": 3600
  }
}
```

#### `POST /auth/logout`
- **Description:** Invalidate active session and unbind FCM device tokens.
- **Auth Required:** Yes (`Bearer <token>`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctor session successfully terminated"
}
```

---

### 4.2 Doctor Profile, Timetable & Duty Status

#### `GET /doctor/profile`
- **Description:** Fetch detailed clinical credentials, specialties, consultation fee, and statistics for the logged-in doctor.
- **Auth Required:** Yes
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "branchId": 1,
    "branchName": "Medix Central Multispecialty Hospital",
    "name": "Dr. Sarah Jenkins",
    "email": "doctor@nmc.local",
    "specialty": "Cardiologist",
    "department": "Cardiovascular Sciences",
    "fee": 1500.0,
    "status": "AVAILABLE",
    "contact": "+91 98200 11223",
    "qualifications": "MD, DM (Cardiology), FACC",
    "experienceYears": 14,
    "rating": 4.9,
    "totalPatientsTreated": 3840,
    "activeConsultations": 12,
    "roomNumber": "OPD-302, 3rd Floor Wing A",
    "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "shiftTiming": "09:00 AM - 05:00 PM"
  }
}
```

#### `PATCH /doctor/status`
- **Description:** Update doctor duty status (`AVAILABLE`, `BUSY`, `OFF_DUTY`).
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "status": "BUSY",
  "reason": "Emergency angioplasty in Cath Lab 2"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "doctorId": 1,
    "status": "BUSY",
    "updatedAt": "2026-08-16T12:05:00Z"
  }
}
```

---

### 4.3 Appointments & Live OPD Queue Engine

#### `GET /doctor/appointments`
- **Description:** Fetch appointments filtered by branch, date, type, or status with pagination.
- **Auth Required:** Yes
- **Query Parameters:**
  - `date`: `YYYY-MM-DD` (e.g. `2026-08-16`, default: today)
  - `status`: `SCHEDULED` | `WAITING` | `IN_CONSULTATION` | `COMPLETED` | `CANCELLED` | `NO_SHOW` (optional)
  - `type`: `OPD` | `FOLLOW_UP` | `EMERGENCY` | `CONSULTATION` (optional)
  - `page`: Integer (default `1`)
  - `limit`: Integer (default `20`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "branchId": 1,
      "branchName": "Medix Central Multispecialty Hospital",
      "patientId": 401,
      "patientName": "Aarav Sharma",
      "uhid": "UHID-2026-0042",
      "patientAge": 45,
      "patientGender": "Male",
      "patientPhone": "+91 98765 43210",
      "doctorId": 1,
      "doctorName": "Dr. Sarah Jenkins",
      "department": "Cardiology",
      "appointmentDate": "2026-08-16",
      "appointmentTime": "10:30 AM",
      "tokenNumber": 14,
      "type": "OPD",
      "status": "WAITING",
      "symptoms": "Chest tightness on exertion, intermittent shortness of breath",
      "notes": "Patient history of Hypertension",
      "consultationRoom": "OPD-302",
      "queuePosition": 2,
      "estimatedWaitMinutes": 15,
      "vitals": {
        "bpSystolic": 138,
        "bpDiastolic": 88,
        "heartRateBpm": 78,
        "temperatureCelsius": 36.8,
        "spO2Percentage": 98,
        "recordedAt": "2026-08-16T10:15:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 18,
    "totalPages": 1
  }
}
```

#### `PATCH /doctor/appointments/{id}/status`
- **Description:** Transition appointment workflow state.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "status": "IN_CONSULTATION",
  "consultationRoom": "OPD-302"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Appointment status updated to IN_CONSULTATION",
  "data": {
    "id": 101,
    "status": "IN_CONSULTATION",
    "updatedAt": "2026-08-16T10:32:00Z"
  }
}
```

#### `POST /doctor/appointments/{id}/call`
- **Description:** Broadcast real-time call buzzer to waiting area display and patient mobile notification.
- **Auth Required:** Yes
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Patient token 14 called into OPD-302",
  "data": {
    "appointmentId": 101,
    "tokenNumber": 14,
    "patientName": "Aarav Sharma",
    "room": "OPD-302",
    "broadcastTimestamp": "2026-08-16T10:32:15Z"
  }
}
```

---

### 4.4 Patient Records & Electronic Health Records (EHR)

#### `GET /patients`
- **Description:** Search patient directory across UHID, Name, Phone Number.
- **Auth Required:** Yes
- **Query Parameters:** `query` (string), `branchId` (optional), `status` (optional)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 401,
      "branchId": 1,
      "uhid": "UHID-2026-0042",
      "name": "Aarav Sharma",
      "age": 45,
      "gender": "Male",
      "bloodGroup": "B+",
      "phone": "+91 98765 43210",
      "condition": "Hypertensive Heart Disease (Stage 1)",
      "status": "OPD",
      "registeredDate": "2024-03-12"
    }
  ]
}
```

#### `GET /patients/{uhid}`
- **Description:** Retrieve full clinical profile, allergies, chronic ailments, emergency contacts, and active bed assignment.
- **Auth Required:** Yes
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": 401,
    "branchId": 1,
    "uhid": "UHID-2026-0042",
    "name": "Aarav Sharma",
    "age": 45,
    "gender": "Male",
    "bloodGroup": "B+",
    "phone": "+91 98765 43210",
    "email": "aarav.sharma@example.com",
    "address": "Flat 402, Sea Green Heights, Worli, Mumbai - 400018",
    "condition": "Hypertensive Heart Disease",
    "status": "OPD",
    "allergies": ["Penicillin", "Sulfonamides"],
    "chronicConditions": ["Hypertension (6 yrs)", "Type 2 Diabetes"],
    "emergencyContactName": "Pooja Sharma (Spouse)",
    "emergencyContactPhone": "+91 98765 43211",
    "registeredDate": "2024-03-12",
    "lastVisitedDate": "2026-08-16",
    "assignedDoctorName": "Dr. Sarah Jenkins",
    "assignedDoctorId": 1,
    "bedNumber": null,
    "wardType": null
  }
}
```

#### `GET /patients/{uhid}/timeline`
- **Description:** Fetch complete chronological medical history events (consultations, admissions, surgeries, prescriptions).
- **Auth Required:** Yes
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 9012,
      "patientId": 401,
      "eventType": "CONSULTATION",
      "title": "Cardiology Follow-Up Consultation",
      "description": "Reviewed 2D Echo results. Ejection Fraction 55%. Prescribed Telmisartan 40mg.",
      "timestamp": "2026-08-16T10:45:00Z",
      "doctorName": "Dr. Sarah Jenkins",
      "department": "Cardiology",
      "documentUrl": "https://medix-docs.s3.amazonaws.com/rx/RX-2026-8910.pdf"
    },
    {
      "id": 8104,
      "patientId": 401,
      "eventType": "LAB_REPORT",
      "title": "Lipid Profile & HbA1c",
      "description": "Total Cholesterol 210 mg/dL, HbA1c 6.8%",
      "timestamp": "2026-08-10T08:30:00Z",
      "doctorName": "Dr. Meera Joshi",
      "department": "Biochemistry",
      "documentUrl": "https://medix-docs.s3.amazonaws.com/lab/LAB-401-2026.pdf"
    }
  ]
}
```

#### `POST /patients/{uhid}/vitals`
- **Description:** Record real-time vital signs telemetry from bedside or OPD triage.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "bpSystolic": 135,
  "bpDiastolic": 85,
  "heartRateBpm": 74,
  "temperatureCelsius": 36.9,
  "spO2Percentage": 99,
  "respiratoryRateBpm": 16,
  "weightKg": 76.5,
  "heightCm": 175.0,
  "bloodSugarMgDl": 118.0,
  "notes": "Post-prandial reading. Patient rested for 10 mins prior."
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Vital signs recorded successfully",
  "data": {
    "id": 5501,
    "patientId": 401,
    "uhid": "UHID-2026-0042",
    "bpSystolic": 135,
    "bpDiastolic": 85,
    "heartRateBpm": 74,
    "temperatureCelsius": 36.9,
    "spO2Percentage": 99,
    "bmi": 24.98,
    "isAbnormal": false,
    "recordedAt": "2026-08-16T12:08:00Z",
    "recordedBy": "Dr. Sarah Jenkins"
  }
}
```

---

### 4.5 Consultations, Electronic Prescriptions & Lab Orders

#### `POST /doctor/prescriptions`
- **Description:** Create an electronic prescription with drugs, dosage schedule, and pharmacy routing.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "appointmentId": 101,
  "patientUhid": "UHID-2026-0042",
  "diagnosis": "Essential Primary Hypertension",
  "clinicalNotes": "Advised low-sodium diet and 30 minutes daily brisk walking.",
  "items": [
    {
      "medicineName": "Telmisartan 40mg",
      "dosage": "1 Tablet",
      "frequency": "Once daily (Morning, after food)",
      "durationDays": 30,
      "instructions": "Take with full glass of water"
    },
    {
      "medicineName": "Aspirin 75mg Gastro-resistant",
      "dosage": "1 Tablet",
      "frequency": "Once daily (Night, after dinner)",
      "durationDays": 30,
      "instructions": "Do not chew or crush"
    }
  ]
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Electronic Prescription generated & routed to Central Pharmacy",
  "data": {
    "prescriptionId": 8910,
    "prescriptionNumber": "RX-2026-8910",
    "uhid": "UHID-2026-0042",
    "doctorName": "Dr. Sarah Jenkins",
    "issuedAt": "2026-08-16T10:50:00Z",
    "pharmacySyncStatus": "QUEUED_FOR_DISPENSING"
  }
}
```

#### `POST /doctor/lab-orders`
- **Description:** Submit laboratory investigation or diagnostic imaging order.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "patientUhid": "UHID-2026-0042",
  "appointmentId": 101,
  "testNames": ["Lipid Profile Extended", "HbA1c Glycated Hemoglobin", "Serum Creatinine"],
  "priority": "ROUTINE",
  "clinicalIndication": "Annual cardiovascular risk review"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "orderId": 4412,
    "orderNumber": "LAB-REQ-2026-4412",
    "status": "PENDING_SAMPLE_COLLECTION",
    "itemCount": 3
  }
}
```

---

### 4.6 Multi-Branch Network & Bed Inventory

#### `GET /branches`
- **Description:** Retrieve real-time telemetry across all 5 Medix network branches.
- **Auth Required:** Yes
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "MEDIX-MAIN",
      "name": "Medix Central Multispecialty Hospital",
      "location": "Mumbai (Central Campus)",
      "bedOccupiedCount": 84,
      "bedTotalCount": 120,
      "bedOccupancy": "84 / 120 Beds",
      "facilityType": "Hospital",
      "status": "active"
    },
    {
      "id": 2,
      "code": "MEDIX-SOUTH",
      "name": "Medix Specialty & Trauma Center",
      "location": "Bengaluru (South Campus)",
      "bedOccupiedCount": 58,
      "bedTotalCount": 75,
      "bedOccupancy": "58 / 75 Beds",
      "facilityType": "Hospital",
      "status": "active"
    }
  ]
}
```

---

### 4.7 FCM Push Notification Registry

#### `POST /doctor/device-token`
- **Description:** Register Android FCM device token for high-priority emergency codes, queue changes, and lab results.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "fcmToken": "eK3_8X7-bN0:APA91bF...qW9_Zp41x",
  "deviceModel": "Samsung Galaxy S24 Ultra",
  "osVersion": "Android 14"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "FCM device token registered successfully"
}
```

---

## 5. Security, Rate Limiting & Audit Policies

1. **Token Lifetime:** Access Token expires in 60 minutes (`3600s`). Refresh Token expires in 30 days.
2. **Rate Limiting:** Max 120 requests/minute per authenticated doctor IP/Token. Burst limit: 30 requests in 5 seconds.
3. **Audit Trail Logging:** All EHR reads, patient searches, prescription writes, and status transitions are recorded in the central immutable audit log (`INITIAL_AUDIT_LOGS`) with timestamp, doctor ID, IP address, and payload hash.
4. **Data Masking:** Non-treating staff cannot view sensitive psychiatric or HIV/oncology notes without elevated clinical clearance.
