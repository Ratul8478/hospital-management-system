# HMS Enterprise System — Full Red Team Attack Surface Inventory

**Assessment Scope:** Hospital Management System (HMS)  
**Components:** Laravel REST API (v1), Vue Web Application, Super Admin Panel, Doctor Android Mobile Client (`com.hms.doctor`), MySQL Relational Store, Firebase Cloud Messaging (FCM)  
**Date:** August 18, 2026  
**Document:** `security/red-team/attack-surface.md`  
**Classification:** Authorized Adversarial Threat Modeling & Attack Surface Map  

---

## 1. System Topology & Trust Boundaries

```
                 ┌──────────────────────────────────────────────────────────┐
                 │                   EXTERNAL UNTRUSTED ZONE                │
                 │  Physician Mobile Devices • Web Browsers • External Net  │
                 └──────────────┬────────────────────────────┬──────────────┘
                                │ TLS 1.3 (HTTPS)            │ TLS 1.3 (HTTPS)
                                ▼                            ▼
                 ┌───────────────────────────┐  ┌───────────────────────────┐
                 │ Doctor Android App Client │  │ Vue Web / Admin Dashboard │
                 │ (Encrypted Prefs, Keystore│  │ (Session Store, Vue Router│
                 │  Biometrics, ProGuard)    │  │  Client Form Interceptors)│
                 └──────────────┬────────────┘  └────────────┬──────────────┘
                                │ Bearer Token + Context     │ Session / Bearer
                                ▼                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION / API TRUST BOUNDARY                                │
│  Laravel 11 REST API Engine (`/api/v1/`)                                                  │
│  - Authentication: Laravel Sanctum Bearer Token Verification                              │
│  - Interceptors & Middleware: `auth:sanctum`, Role/Permission Middleware, Rate Limiting   │
│  - Context Headers: `X-Doctor-Id`, `X-Branch-Id`, `X-Client-Platform`, `X-Client-Version` │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │ Parameterized Queries & ORM
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                             DATA STORAGE & INTEGRATION ZONE                               │
│  - Clinical Relational Database: MySQL 8.0 (Encrypted at Rest, Transactions, Locks)       │
│  - Push Notification Relay: Firebase Cloud Messaging (FCM v1 REST API)                    │
│  - Document Storage: Private Medical Reports Storage (Signed URLs / Stream Gateways)      │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Exhaustive API Endpoint Inventory & Attack Surface Matrix

### 2.1 Authentication & Credential Management
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/login` | None | Public / All | `email`, `password`, `device_name` | Sanctum Bearer Token, Doctor Profile Object | Brute-force credential stuffing, password spray, timing enumeration, token leakage |
| `POST` | `/api/v1/auth/logout` | Bearer Token | All Authenticated | None | Success confirmation | Stale token reuse, incomplete server-side token revocation |
| `POST` | `/api/v1/auth/forgot-password` | None | Public | `email` | Recovery dispatch status | User enumeration via response timing, password reset poisoning |
| `POST` | `/api/v1/notifications/fcm-token`| Bearer Token | Authenticated Doctor | `doctorId`, `fcmToken` | Registration status | Token hijacking, cross-user device registration (BOLA) |

---

### 2.2 Clinical Consultations & OPD Queue Management
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/appointments/today` | Bearer Token | Doctor | `doctorId`, `branchId`, `status` | Queue stats, today's appointment list with vitals | Cross-doctor queue enumeration, branch scoping bypass |
| `GET` | `/api/v1/doctor/appointments/{id}` | Bearer Token | Doctor, Reception | `id` (Path) | Full appointment detail, chief complaints, vitals | Broken Object Level Authorization (BOLA), viewing other doctors' appointments |
| `PATCH` | `/api/v1/doctor/appointments/{id}/status` | Bearer Token | Doctor, Reception | `status`, `notes`, `consultationRoom` | Updated appointment entity | Unauthorized queue state transitions (e.g. skipping waiting to completed) |

---

### 2.3 Patient Longitudinal EHR & Medical Directory
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/patients` | Bearer Token | Doctor, Reception, Admin | `search`, `branchId`, `page`, `limit` | Paginated patient summary records | Mass patient harvesting, PII exposure via search parameters |
| `GET` | `/api/v1/doctor/patients/{id}/history` | Bearer Token | Doctor | `id` (UHID / Patient ID) | Demographics, timeline events, past consultations | BOLA / IDOR: Cross-doctor and cross-department medical history exfiltration |

---

### 2.4 Digital Prescriptions & Pharmacy Order Routing
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/prescriptions` | Bearer Token | Doctor, Pharmacist | `doctorId`, `patientId`, `uhid`, `search` | Prescriptions audit log list | Prescription enumeration, unauthorized dispensing checks |
| `POST` | `/api/v1/doctor/prescriptions` | Bearer Token | Doctor | Prescription JSON with medicine items, dosage, diagnosis | Generated Prescription entity (`RX-XXXX`) | Tampering with medicine quantities, unauthorized narcotic dispatch, doctor identity spoofing |

---

### 2.5 Diagnostic Telemetry & Medical Laboratory Reports
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/reports` | Bearer Token | Doctor, Lab Tech | `doctorId`, `patientId`, `category`, `status` | Reports summary counters, diagnostic tests list | BOLA: Accessing unassigned sensitive lab reports (e.g. HIV, oncology, toxicology) |
| `GET` | `/api/v1/doctor/reports/{id}/download` | Bearer Token | Doctor, Patient | `id` (Path) | Secure PDF binary stream | Insecure direct file downloads, predictable file URL paths, missing token expiration |

---

### 2.6 Inpatient IPD Admissions & Bed Allocation
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/admissions` | Bearer Token | Doctor, Nurse, Admin | `doctorId`, `branchId`, `wardType` | Active inpatient records, room/bed numbers | Ward enumeration, nursing handover notes leakage |
| `POST` | `/api/v1/doctor/admissions/{id}/transfer` | Bearer Token | Doctor, Admin | `targetWard`, `targetBed` | Transfer confirmation | Race condition on bed allocation (double booking), invalid ward transfers |

---

### 2.7 Follow-up Recall & Patient Scheduling
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/followups` | Bearer Token | Doctor, Reception | `doctorId`, `date`, `status` | Scheduled follow-up contacts & clinical notes | PII disclosure (phone numbers), unauthorized rescheduling |

---

### 2.8 Doctor Financial Settlements & Earnings Analytics
| Method | Path | Auth Required | Target Roles | Input Parameters | Output Data | Threat Vectors & Attack Surface |
|:---|:---|:---:|:---|:---|:---|:---|
| `GET` | `/api/v1/doctor/earnings` | Bearer Token | Doctor, Accountant, Admin | `doctorId` | Fee schedules, daily revenue, monthly revenue, pending payout in ₹ | Horizontal privilege escalation: viewing another physician's consultation earnings |

---

## 3. Role-Based Access Control (RBAC) Matrix

```
┌─────────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Capability      │ Super Admin │ Doctor      │ Reception   │ Pharmacist  │ Lab Tech    │
├─────────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ User Auth/Admin │ FULL (CRUD) │ Self Only   │ Read Only   │ Read Only   │ Read Only   │
│ OPD Queue View  │ All Doctors │ Assigned Dr │ All Doctors │ No Access   │ No Access   │
│ View Patient EHR│ Audit Mode  │ Assigned Pt │ Demographics│ Active Rx   │ Active Tests│
│ Write Rx        │ No Access   │ Assigned Pt │ No Access   │ Dispense    │ No Access   │
│ Lab Report View │ Audit Mode  │ Assigned Dr │ Status Only │ No Access   │ Upload/Edit │
│ IPD Bed Alloc   │ FULL (CRUD) │ View/Assign │ Check-in    │ View Ward   │ No Access   │
│ View Earnings   │ All Revenue │ Own Fee (₹) │ Daily Cash  │ Rx Billing  │ Test Billing│
└─────────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```
