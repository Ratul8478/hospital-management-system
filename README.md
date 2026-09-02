# Medix Enterprise Hospital Management System (HMS)

<p align="center">
  <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" alt="Medix Enterprise Healthcare" width="100%" style="border-radius: 12px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>An enterprise-grade, multi-branch hospital management platform and native Android doctor clinical companion.</strong>
</p>

<p align="center">
  <a href="https://medix-hospital-system.vercel.app/"><img src="https://img.shields.io/badge/Live%20Production-Deploy-emerald?style=for-the-badge&logo=vercel" alt="Live Deployment"></a>
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Android%20Native-blue?style=for-the-badge&logo=android" alt="Platform">
  <img src="https://img.shields.io/badge/Architecture-Clean%20%26%20MVVM-purple?style=for-the-badge" alt="Architecture">
  <img src="https://img.shields.io/badge/Compliance-HIPAA%20%7C%20HL7%20FHIR-red?style=for-the-badge" alt="Compliance">
</p>

---

## 🏥 Live Production Portal

Access the live production enterprise system directly:  
🌐 **[https://medix-hospital-system.vercel.app/](https://medix-hospital-system.vercel.app/)**

---

## 🌟 Executive Overview

**Medix** is a next-generation healthcare operating system designed for multi-location hospital networks, specialty trauma centers, and diagnostic clinics. It bridges administrative governance, clinical excellence, pharmacy inventory, laboratory diagnostics, and financial auditing into a unified, synchronized ecosystem.

The repository is organized as a monorepo containing:
1. **Medix Web Enterprise Portal (`/src`):** High-performance full-stack web portal built with Next.js, React, TypeScript, and modern responsive design architectures with 15 interchangeable clinical landing concepts.
2. **Medix Doctor Android App (`/android-doctor`):** Native Kotlin companion application with 100% Jetpack Compose UI, Dagger Hilt DI, Room offline cache, and Retrofit 2 networking for on-duty medical consultants.

---

## 🏛️ Multi-Branch Network Architecture

Medix supports multi-tenant operational partitioning with unified global telemetry across 5 flagship hospital campuses:

| Branch Code | Campus Name | Location | Primary Specialization | Bed Capacity |
|:---|:---|:---|:---|:---|
| **`MEDIX-MAIN`** | Medix Central Multispecialty Hospital | Mumbai (Central) | Quaternary Care & Multi-Organ Transplant | 120 Beds (84 Occupied) |
| **`MEDIX-SOUTH`**| Medix Specialty & Trauma Center | Bengaluru (South) | Emergency Trauma, Orthopedics & Neuro | 75 Beds (58 Occupied) |
| **`MEDIX-NORTH`**| Medix Mother & Child Super-Specialty | New Delhi (North) | Neonatal ICU, Obstetrics & Gynecology | 60 Beds (46 Occupied) |
| **`MEDIX-WEST`** | Medix Daycare & Diagnostic Satellite | Pune (West) | Daycare Surgery & High-Throughput Lab | 25 Beds (12 Occupied) |
| **`MEDIX-EAST`** | Medix Cardiac & Neuro Institute | Kolkata (East) | Cardiology, Cath Labs & Neurosurgery | 100 Beds (Expansion) |

---

## 👥 Role-Based Access Control (RBAC)

The platform provides granular permissions tailored to clinical and operational workflows:

```
                          ┌───────────────────────────┐
                          │   Super Administrator     │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
 ┌─────────▼──────────┐       ┌─────────▼──────────┐       ┌─────────▼──────────┐
 │   Branch Admin     │       │  Medical Director  │       │ Franchise Partner  │
 └─────────┬──────────┘       └─────────┬──────────┘       └────────────────────┘
           │                            │
   ┌───────┴───────┐            ┌───────┴───────┐
   │ Receptionist  │            │  Doctor / MD  │
   ├───────────────┤            ├───────────────┤
   │ Accountant    │            │ Nurse / Ward  │
   ├───────────────┤            ├───────────────┤
   │ Pharmacist    │            │ Lab Tech      │
   └───────────────┘            └───────────────┘
```

- **Super Administrator:** Global network oversight, branch provisioning, executive financial analytics, administrator hiring/firing.
- **Branch Administrator:** Campus-level bed allocation, staff duty rosters, revenue reconciliation, local OPD schedules.
- **Doctor / Consultant:** Patient queue management, bedside vital telemetry, clinical timelines, electronic prescriptions (e-Rx), diagnostic orders.
- **Receptionist & Triage:** Patient registration, UHID issuance, token allocation, emergency triage tagging.
- **Pharmacist:** Inventory management, batch expiry tracking, e-Rx dispensing, automated stock alerts.
- **Laboratory Technician:** Diagnostic test queues, specimen tracking, pathology result verification.
- **Accountant / Billing:** Invoicing, insurance pre-authorizations, daily revenue auditing.
- **Patient:** Personal health records (PHR), appointment booking, prescription downloads.

---

## 💻 Tech Stack & Architecture

### Web Application (`/src`)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.0+ / JavaScript ES2024
- **UI & Styling:** React 19, Modern Responsive CSS System, Lucide React Icons
- **State Management:** React Context API + LocalStorage Synchronization
- **Design Concepts:** 15 modular healthcare landing page concepts selectable on the fly

### Android Doctor Companion App (`/android-doctor`)
- **Language:** 100% Kotlin 1.9+ / JVM 17
- **UI Toolkit:** Jetpack Compose with Material 3 Design
- **Architecture:** Clean Architecture + MVVM + Unidirectional Data Flow
- **Dependency Injection:** Dagger Hilt 2.51
- **Local Database:** AndroidX Room 2.6 (Offline-First SQLite Cache)
- **Networking:** Retrofit 2.11 + OkHttp 4.12 with Atomic Token Refresh Mutex
- **Async Concurrency:** Kotlin Coroutines & Reactive Flows
- **Push Notifications:** Firebase Cloud Messaging (FCM)

---

## 📱 Android Doctor Companion Features

- **Live OPD Queue Engine:** Real-time token caller with room buzzer dispatch.
- **Bedside Vitals Telemetry:** Instant calculation of BMI, BP, SpO2, and automated abnormal metric triggers.
- **Offline-First Patient EHR:** Complete clinical history available during network dropouts in surgical wards.
- **Digital Prescriptions (e-Rx):** Rapid drug dosage scheduling routed directly to the Central Pharmacy.
- **Multi-Branch Context Switching:** Instant hospital campus switching for visiting super-specialists.

---

## 🚀 Getting Started

### 1. Web Portal Setup

```bash
# Clone repository
git clone https://github.com/Ratul8478/hospital-management-system.git
cd hospital-management-system

# Install dependencies
npm install

# Run local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Android Doctor App Setup

```bash
# Navigate to Android module
cd android-doctor

# Open in Android Studio or compile debug APK via CLI
./gradlew assembleDebug

# Run unit test suite
./gradlew testDebugUnitTest
```

---

## 📚 Technical Documentation Index

Detailed technical specifications and architectural documentation are available in the [`docs/`](docs/) directory:

- 📋 **[Complete API Audit](docs/android-api-audit.md):** Full inventory of all REST endpoints, request/response schemas, status codes, and error envelopes.
- 📱 **[Android Doctor Overview](docs/android/README.md):** Architecture overview, package directory, and mobile capabilities.
- 🏗️ **[Android Architecture Specification](docs/android/architecture.md):** Clean architecture layers, MVVM, UDF, and sequence diagrams.
- 🔌 **[Android API Integration Guide](docs/android/api-integration.md):** Retrofit client, OkHttp interceptors, and mutual token refresh mechanism.
- 🛠️ **[Android Environment Setup](docs/android/setup.md):** Android Studio setup, SDK prerequisites, and emulator configuration.
- 🧪 **[QA & Test Automation Strategy](docs/android/testing.md):** Unit test suite, Compose UI testing, and Web <-> Android synchronization scenarios.
- 🚀 **[Release, Signing & Deployment](docs/android/release.md):** Build flavors, ProGuard/R8 rules, keystore signing, and pre-release checklist.

---

## 🔒 Security, Compliance & Audit Policies

- **HIPAA & GDPR Ready:** End-to-end encryption for patient protected health information (PHI).
- **Immutable Audit Logging:** Every patient record access, prescription issuance, and status change is immutably logged with user ID, IP address, and timestamp.
- **Role Isolation:** Strict tenant separation preventing cross-branch data leaks.

---

## 📄 License

This project is proprietary software developed for Medix Enterprise Healthcare Systems. All rights reserved.
