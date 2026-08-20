# HMS Doctor Android Application — API Contracts & Backend Integration Specification

**Document Version:** 2.0.0  
**Target Backend:** Laravel REST API (v1) & MySQL Clinical Relational Store  
**Client Header:** `X-Client-Platform: android-doctor`, `X-Client-Version: 1.0.0`  
**Authorization:** `Bearer {sanctum_token}`  
**Standard Response Wrapper:** `ApiResponseDto<T>`  

---

## 1. Standard Response Envelope Format

All API responses follow a strict enterprise JSON wrapper:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "currentPage": 1,
    "lastPage": 5,
    "perPage": 20,
    "total": 98
  }
}
```

---

## 2. Authentication Module

### 2.1 Doctor Login
* **Method & Route:** `POST /api/v1/auth/login`
* **Request Payload:**
```json
{
  "email": "sarah.williams@medix.com",
  "password": "Doctor@123",
  "device_name": "Pixel_8_Pro_Doctor"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Authentication successful",
  "data": {
    "token": "1|sanctum_token_hash_value_here",
    "doctor": {
      "id": 1,
      "name": "Dr. Sarah Williams",
      "email": "sarah.williams@medix.com",
      "specialty": "Cardiologist",
      "department": "Cardiology",
      "licenseNumber": "NMC-2024-88412",
      "phone": "+91 98765 43210",
      "avatarUrl": "https://cdn.medixhospital.com/avatars/dr_sarah.jpg",
      "dutyStatus": "AVAILABLE",
      "hospitalBranch": "Main Wing A"
    }
  }
}
```

### 2.2 Sign Out
* **Method & Route:** `POST /api/v1/auth/logout`
* **Headers:** `Authorization: Bearer {token}`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully logged out and session revoked."
}
```

---

## 3. Appointments & OPD Queue Module

### 3.1 Fetch Today's Queue
* **Method & Route:** `GET /api/v1/doctor/appointments/today`
* **Query Parameters:** `date=YYYY-MM-DD`, `status=WAITING|IN_CONSULTATION|COMPLETED|ALL`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "stats": {
      "total": 18,
      "waiting": 5,
      "inConsultation": 1,
      "completed": 12
    },
    "appointments": [
      {
        "id": 101,
        "tokenNumber": 15,
        "patientId": 42,
        "uhid": "UHID-2026-0042",
        "patientName": "Aarav Sharma",
        "patientAge": 45,
        "patientGender": "Male",
        "patientPhone": "+91 98765 11223",
        "appointmentTime": "10:30 AM",
        "status": "In Consultation",
        "type": "OPD",
        "symptoms": "Chest tightness on exertion, mild shortness of breath",
        "vitals": {
          "bpSystolic": 138,
          "bpDiastolic": 88,
          "heartRateBpm": 78,
          "temperatureCelsius": 37.0,
          "spO2Percentage": 98,
          "bloodSugarMgDl": 110.0,
          "bmi": 24.8,
          "isAbnormal": false
        }
      }
    ]
  }
}
```

### 3.2 Transition Queue Status
* **Method & Route:** `PATCH /api/v1/doctor/appointments/{id}/status`
* **Request Payload:**
```json
{
  "status": "IN_CONSULTATION"
}
```

---

## 4. Digital Prescription Studio Module

### 4.1 Create & Dispatch Prescription
* **Method & Route:** `POST /api/v1/doctor/prescriptions`
* **Request Payload:**
```json
{
  "appointmentId": 101,
  "patientId": 42,
  "diagnosis": "Essential Hypertension & Mild Exertional Angina",
  "symptoms": "Chest discomfort, stage 1 systolic elevation",
  "advice": "Low sodium diet, brisk walking 30 mins daily, follow up in 2 weeks with repeat lipid profile.",
  "followUpDays": 14,
  "medicines": [
    {
      "name": "Telmisartan 40mg",
      "category": "Antihypertensive",
      "dosage": "1 Tablet",
      "frequency": "Once daily (Morning after breakfast)",
      "duration": "14 Days",
      "instructions": "Take with water after food"
    },
    {
      "name": "Atorvastatin 10mg",
      "category": "Statin / Lipid Lowering",
      "dosage": "1 Tablet",
      "frequency": "Once daily (Night at bedtime)",
      "duration": "14 Days",
      "instructions": "Bedtime administration recommended"
    }
  ]
}
```
* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Prescription generated and routed to Central Pharmacy",
  "data": {
    "id": 501,
    "prescriptionNumber": "RX-2026-0501",
    "pdfUrl": "https://api.medixhospital.com/prescriptions/RX-2026-0501.pdf",
    "createdAt": "2026-08-18T10:45:00Z"
  }
}
```

---

## 5. Diagnostic & Lab Reports Module

### 5.1 Fetch Laboratory Telemetry
* **Method & Route:** `GET /api/v1/doctor/reports`
* **Query Parameters:** `status=READY|PENDING|CRITICAL`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "summary": {
      "total": 24,
      "ready": 18,
      "pending": 5,
      "criticalAlerts": 1
    },
    "reports": [
      {
        "id": 801,
        "patientId": 42,
        "uhid": "UHID-2026-0042",
        "patientName": "Aarav Sharma",
        "testName": "Lipid Profile Comprehensive",
        "category": "Biochemistry",
        "status": "Ready",
        "criticalAlert": true,
        "criticalDetails": "Total Cholesterol: 245 mg/dL (High), LDL: 165 mg/dL (High)",
        "resultSummary": "Dyslipidemia detected with elevated atherogenic index.",
        "reportedAt": "2026-08-18 09:15 AM",
        "fileUrl": "https://api.medixhospital.com/reports/LAB-801.pdf"
      }
    ]
  }
}
```

---

## 6. Doctor Earnings & Financial Analytics

### 6.1 Fetch Consultation Revenue
* **Method & Route:** `GET /api/v1/doctor/earnings`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "doctorId": 1,
    "doctorName": "Dr. Sarah Williams",
    "specialty": "Cardiology",
    "fee": 800.0,
    "todayConsultations": 18,
    "todayEarnings": 14400.0,
    "monthConsultations": 234,
    "monthEarnings": 187200.0,
    "totalConsultations": 1450,
    "totalEarnings": 1160000.0,
    "pendingPayout": 45000.0,
    "currency": "₹"
  }
}
```
