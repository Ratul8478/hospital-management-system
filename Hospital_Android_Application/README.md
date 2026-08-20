# 🏥 Medix Doctor Pro — Hospital Management System (HMS) Android Application

[![Platform](https://img.shields.io/badge/Platform-Android%208.0%2B%20%28API%2026--35%29-blue.svg)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0.0-purple.svg)](https://kotlinlang.org)
[![UI Framework](https://img.shields.io/badge/Jetpack%20Compose-BOM%202024.09.00-brightgreen.svg)](https://developer.android.com/jetpack/compose)
[![Design System](https://img.shields.io/badge/Design%20System-Calm%20Clinical%20Intelligence-navy.svg)](#design-system)
[![Currency Standard](https://img.shields.io/badge/Currency-INR%20%28%E2%82%B9%29-orange.svg)](#localization)
[![Compliance](https://img.shields.io/badge/Compliance-HIPAA%20%7C%20NMC%20India-success.svg)](#compliance)
[![Build Status](https://img.shields.io/badge/Build-Passing%20%28100%25%20Tests%29-brightgreen.svg)](#automated-testing)

**Medix Doctor Pro** (`com.hms.doctor`) is a mission-critical, enterprise-grade Android clinical companion built for attending physicians, surgeons, and healthcare professionals within multi-specialty hospital networks. It provides real-time Outpatient Department (OPD) queue management, longitudinal Electronic Health Record (EHR) exploration, digital prescription synthesis with central pharmacy dispatch, critical diagnostic biomarker alarms, Inpatient Department (IPD) ward monitoring, and consultation revenue analytics.

---

## 📑 Core Documentation Suite

| Document | Description | Link |
|:---|:---|:---|
| 🔍 **Architecture Audit** | Comprehensive 12-section codebase audit, technical debt, and priority ranking | [`docs/android-audit.md`](docs/android-audit.md) |
| 🔌 **API Contracts** | Laravel REST API v1 endpoints, Sanctum auth headers, JSON payloads & DTO mappers | [`docs/api-contracts.md`](docs/api-contracts.md) |
| 🧪 **QA Test Matrix** | 100% Passing test scenarios across all 11 modules with error boundary verifications | [`docs/qa-test-matrix.md`](docs/qa-test-matrix.md) |
| 🚢 **Deployment Guide** | Production Play Store AAB packaging, release keystore signing, and CI/CD workflows | [`docs/deployment-guide.md`](docs/deployment-guide.md) |

---

## 🎨 Design System: Calm Clinical Intelligence

The UI adheres to the **Calm Clinical Intelligence** design system engineered specifically for clinical ergonomics, fast recognition under high stress, and zero visual clutter:

* **Primary Identity:** Deep Navy (`#123B5D`) & Clinical Sapphire (`#1E6FD9`)
* **Bio-Teal & Success:** Bio-Teal (`#16A6B6`) & Emerald Green (`#159A67`)
* **Attention & Critical:** Amber Warning (`#D58B00`) & Crimson Alert (`#D64545`)
* **Surfaces & Canvas:** High-readability pristine white surfaces (`#FFFFFF`) on subtle clinical grey-blue (`#F5F8FB`)
* **Typography:** Tabular monospace figures for clinical vitals, clear hierarchy with 48dp+ touch target bounding boxes.

---

## 🇮🇳 India Healthcare & NMC Localization

* **Currency Standard:** All consultation tariffs, registration fees, monthly collections, and hospital payouts are formatted in **Indian Rupees (₹ / INR)**.
* **Licensing Compliance:** Doctor profiles and signed electronic prescriptions follow **National Medical Commission (NMC)** registration number standards.
* **Insurance Networks:** Integrated with Indian healthcare cashless networks (Ayushman Bharat PM-JAY, Star Health, HDFC ERGO, ICICI Lombard, Niva Bupa).

---

## 📱 Feature Modules (11 Production Screens)

1. 🔐 **Authentication & Biometrics:** Dual-mode Doctor Sign In, 1-click quick credentials fill, and Android Keystore biometric touch authentication.
2. 🏥 **Clinical Home Dashboard:** Real-time animated ticker, OPD metrics ribbon, Next Patient in Queue spotlight, and Quick Actions dock.
3. 📅 **OPD Queue & Appointments:** Live search by UHID/Name, queue status filters (`Waiting`, `In Consult`, `Completed`), and bedside call triggers.
4. 🩺 **Patient 360° EHR Chart:** Multi-tab longitudinal medical history, vital biomarker gauges, past consultations log, and active prescriptions.
5. 💊 **Digital Prescription Studio:** Multi-drug builder with dosage, duration, frequency, diagnosis, and direct pharmacy routing.
6. 🧪 **Diagnostic & Lab Reports:** Lab reports categorized by status (`Ready`, `Pending`, `Critical`) with abnormal biomarker highlights.
7. 🛏️ **IPD Inpatient Admissions:** Real-time ward breakdown (ICU, Private Suites, General), bed tracking, and nursing notes.
8. 🗓️ **Follow-up Recall Scheduler:** Due-today recall filters, longitudinal follow-up logs, and 1-tap patient calling.
9. 💰 **Doctor Earnings Analytics:** Period selectors (`Today`, `This Month`, `All Time`), OPD fee schedules, and weekly payout tracking.
10. 👤 **Doctor Profile & Availability:** NMC credentials, MD qualifications, and duty toggles (`Available`, `In Surgery`, `Off Duty`).
11. 🔔 **Hospital Emergency Notifications:** FCM heads-up notifications with high-priority clinical channels and vibration patterns.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  Jetpack Compose UI (Material 3) + StateFlow ViewModel      │
│  (StateViews, HmsTopAppBar, HmsCard, StatusBadge)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Observes UIState / Emits Intent
┌──────────────────────────────▼──────────────────────────────┐
│                       DOMAIN LAYER                          │
│  Pure Kotlin Business Logic, Models & Repository Contracts  │
│  (Appointment, PatientHistory, Prescription, Report, etc.)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Implements Interfaces
┌──────────────────────────────▼──────────────────────────────┐
│                        DATA LAYER                           │
│  Repository Implementations + Mappers + NetworkResult Wrap │
│  Retrofit 2.11 + OkHttp 4.12 (AuthInterceptor)              │
│  EncryptedSharedPreferences (AES-256-GCM / MasterKey)      │
└─────────────────────────────────────────────────────────────┘
```

* **Kotlin:** `2.0.0`
* **Jetpack Compose:** Material Design 3 (`1.3.0`)
* **Dependency Injection:** Dagger Hilt `2.51.1` via KSP
* **Networking:** Retrofit `2.11.0` + OkHttp `4.12.0`
* **Security:** `androidx.security.crypto:security-crypto:1.1.0-alpha06`
* **Notifications:** Firebase Cloud Messaging (Firebase BOM `33.2.0`)
* **Image Loading:** Coil Compose `2.7.0`

---

## 🚀 Quick Start Guide

### 1. Prerequisites:
* OpenJDK 17 LTS
* Android SDK Platform 35 (`compileSdk = 35`, `targetSdk = 35`, `minSdk = 26`)

### 2. Build Debug APK:
```bash
cd doctor-android
./gradlew assembleDebug
```
*Generated APK:* [`Medix_Doctor_App.apk`](Medix_Doctor_App.apk) *(23.58 MB)*

### 3. Run Automated Unit Tests:
```bash
cd doctor-android
./gradlew testDebugUnitTest
```
*Result:* **`BUILD SUCCESSFUL` (32 actionable tasks, 0 failures)**

---

## 📦 Deliverables Summary

- **Ready-to-Install APK:** [`Medix_Doctor_App.apk`](Medix_Doctor_App.apk)
- **Native Android Studio Project:** [`doctor-android`](doctor-android)
- **Live Cloudflare Demonstration:** [https://worked-seq-application-students.trycloudflare.com](https://worked-seq-application-students.trycloudflare.com)
