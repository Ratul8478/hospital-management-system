# Medix Doctor Android Application (`android-doctor`)

**Package:** `com.medix.doctor`  
**Target Platform:** Android 8.0+ (API Level 26 to API Level 34)  
**Language & Runtime:** Kotlin 1.9.24 / JVM 17  
**UI Framework:** 100% Jetpack Compose with Material 3 Design System  
**Architecture:** Clean Architecture + MVVM + Unidirectional Data Flow (UDF)  
**Backend Infrastructure:** Medix Cloud Platform (`https://hospital-management-system-using-an.vercel.app/`)  

---

## 1. Project Overview

The **Medix Doctor Android Application** is an enterprise-grade mobile clinical companion designed specifically for on-duty doctors, surgeons, specialists, and clinical department heads operating across the Medix hospital network (Mumbai Central, Bengaluru South, Delhi North, Pune West, and Kolkata East campuses).

The application delivers frictionless, real-time clinical workflows right at the point of care:
- **Live OPD Queue & Token Calling:** Instant queue visibility, token progression, and buzzer calling.
- **Offline-First Patient EHR:** Complete access to patient histories, allergies, chronic conditions, and past encounters even in low-connectivity hospital basements or OT zones.
- **Bedside Vital Signs Telemetry:** Rapid recording and historical charting of BP, SpO2, Heart Rate, Temperature, BMI, and automated abnormal metric flagging.
- **Digital Prescriptions (e-Rx):** Rapid drug dosage scheduling with automated routing to the hospital's central pharmacy.
- **Multi-Branch Clinical Context:** Dynamic branch switching allowing visiting consultants to switch hospital contexts seamlessly.
- **Real-Time Push Notifications:** Immediate alerts for high-priority emergency codes, ICU critical vitals, and incoming patient check-ins via Firebase Cloud Messaging.

---

## 2. Technology Stack & Key Dependencies

| Category | Technology / Library | Version | Purpose |
|:---|:---|:---|:---|
| **Language** | Kotlin | `1.9.24` | Modern, null-safe language for Android |
| **UI Toolkit** | Jetpack Compose (BOM) | `2024.05.00` | Declarative reactive UI components |
| **Design System** | Material 3 (`androidx.compose.material3`) | Latest | Enterprise clinical color schemes, typography, cards |
| **Dependency Injection**| Dagger Hilt | `2.51.1` | Standardized compile-time dependency injection |
| **Annotation Processing**| KSP (Kotlin Symbol Processing) | `1.9.24-1.0.20`| High-speed code generation for Hilt & Room |
| **Networking** | Retrofit 2 & OkHttp 3 | `2.11.0` / `4.12.0` | Type-safe REST client, connection pooling, interceptors |
| **Local Persistence** | AndroidX Room Database | `2.6.1` | SQLite object mapping with Kotlin Flow reactive streams |
| **Asynchronous Engine** | Kotlin Coroutines & Flow | `1.8.1` | Structured concurrency and asynchronous event pipelines |
| **Image Loading** | Coil Compose | `2.6.0` | Performant image loading and memory/disk caching |
| **Navigation** | Navigation Compose | `2.7.7` | Type-safe declarative composable navigation |
| **Push Notifications** | Firebase Cloud Messaging (BOM) | `33.1.0` | Real-time push notifications and critical alerts |
| **Unit & UI Testing** | JUnit 4, MockK, Turbine, Compose UI Test | `4.13.2` | Comprehensive multi-tier test automation |

---

## 3. Architecture Blueprint

The app adheres strictly to **Google's Modern Android Architecture Guidelines** and the principles of **Clean Architecture**:

```
 ┌─────────────────────────────────────────────────────────┐
 │               Presentation Layer (UI)                   │
 │   Jetpack Compose Screens • StateFlow • ViewModels      │
 └────────────────────────────┬────────────────────────────┘
                              │
 ┌────────────────────────────▼────────────────────────────┐
 │                  Domain Layer (Core)                    │
 │    Use Cases (Interactors) • Domain Models • Contracts  │
 └────────────────────────────┬────────────────────────────┘
                              │
 ┌────────────────────────────▼────────────────────────────┐
 │                   Data Layer (Repo)                     │
 │  Repository Implementations • NetworkBoundResource       │
 │   ┌───────────────────────┐   ┌──────────────────────┐  │
 │   │ Remote: Retrofit/OkHttp│   │ Local: Room Database │  │
 │   └───────────────────────┘   └──────────────────────┘  │
 └─────────────────────────────────────────────────────────┘
```

---

## 4. Module Directory Structure

```
android-doctor/
├── app/
│   ├── build.gradle.kts          # App-level build configuration and dependencies
│   ├── proguard-rules.pro        # ProGuard/R8 shrinking & obfuscation rules
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml   # Permissions, Application, Activity registry
│       │   ├── java/com/medix/doctor/
│       │   │   ├── MedixDoctorApp.kt # Application class with @HiltAndroidApp
│       │   │   ├── di/               # Hilt Dependency Injection Modules (Network, Database, Repo)
│       │   │   ├── data/
│       │   │   │   ├── remote/       # Retrofit API Services, Interceptors, DTOs
│       │   │   │   ├── local/        # Room Database, DAOs, Local Entities
│       │   │   │   └── repository/   # Repository Implementations (Offline sync)
│       │   │   ├── domain/
│       │   │   │   ├── model/        # Clean Domain Models (Appointment, Doctor, Patient, VitalSign)
│       │   │   │   ├── repository/   # Repository Interface Contracts
│       │   │   │   ├── usecase/      # Business Logic Interactors
│       │   │   │   └── util/         # Resource & Network Result Utilities
│       │   │   └── ui/
│       │   │       ├── theme/        # Medix Clinical Color Palette, Typography, Shapes
│       │   │       ├── navigation/   # NavGraph, Screen Routes, Arguments
│       │   │       ├── auth/         # Login, Biometric Authentication Screens & ViewModels
│       │   │       ├── dashboard/    # Doctor Home Dashboard, Queue Summary, Quick Stats
│       │   │       ├── queue/        # Live OPD Queue Management, Token Call Action
│       │   │       ├── patient/      # Patient EHR Detail, Clinical Timeline, Vitals Entry
│       │   │       └── prescription/ # Digital Rx Creation, Drug Autocomplete, Routing
│       │   └── res/
│       │       ├── drawable/         # Clinical icons, vectors, branded assets
│       │       ├── mipmap/           # Application launcher icons
│       │       └── values/           # strings.xml, colors.xml, themes.xml
│       └── test/                     # Unit tests (JUnit, MockK, Turbine)
├── build.gradle.kts              # Top-level build configuration
├── gradle.properties             # JVM arguments and AndroidX flags
└── settings.gradle.kts           # Module inclusions and repository configurations
```

---

## 5. Quick Links & Documentation Index

For in-depth guides, consult the dedicated technical documentation:
- **[Architecture Deep-Dive](architecture.md):** Clean Architecture layers, MVI/MVVM flow, and sequence diagrams.
- **[API Integration & Contracts](api-integration.md):** Retrofit setup, auth interceptors, token refresh, and error mappings.
- **[Development Setup Guide](setup.md):** Android Studio setup, SDK configuration, and running on emulators/devices.
- **[Testing & QA Strategy](testing.md):** Unit test suite, Compose UI tests, and Web <-> Android synchronization test scenarios.
- **[Release, Signing & ProGuard](release.md):** Build variants, keystore signing, R8 rules, and pre-release checklist.
- **[Complete API Audit](../android-api-audit.md):** Full specification of all backend REST endpoints.
