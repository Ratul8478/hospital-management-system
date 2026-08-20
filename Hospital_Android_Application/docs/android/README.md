# HMS Doctor Native Android Application

Welcome to the **HMS Doctor** Native Android Application repository. This production-ready mobile companion connects hospital physicians and specialists directly to the central Hospital Management System (HMS) backend.

---

## 🌟 Key Capabilities & Feature Scope

1. **Secure Doctor Authentication**: Sanctum Bearer token integration, EncryptedSharedPreferences storage, Biometric authentication, and automated session invalidation on 401.
2. **Live OPD Queue & Appointments**: Real-time token number management, patient call buzzer, consultation status transitions (`Waiting` $\to$ `In Consultation` $\to$ `Completed`).
3. **Electronic Health Records (EHR)**: Server-side patient lookup (by name, UHID, or phone), vital signs telemetry, and chronological medical history timelines.
4. **Digital Prescription Builder**: Clinical diagnosis, symptoms, and dynamic multi-medication row builder (dosage, frequency, duration, instructions) with automated routing to the central pharmacy.
5. **Diagnostic Lab Reports**: Pathology and radiology status tracker (`ready`, `pending`, `processing`) with critical abnormality highlighting.
6. **Inpatient Admissions (IPD)**: Real-time bed occupancy monitoring across ICU, Private, and General wards with nursing observations.
7. **Follow-up Scheduling**: Track upcoming patient reviews and overdue consultations.
8. **Earnings & Consultation Analytics**: Today, monthly, and lifetime consultation revenue breakdowns and pending hospital payouts.
9. **Physician Profile & Duty Status**: Manage clinical credentials and instant availability switching (`AVAILABLE`, `BUSY`, `OFF_DUTY`).
10. **Firebase Push Notifications**: High-priority background alerts for critical laboratory findings and urgent OPD appointments.

---

## 🛠 Tech Stack

- **Language:** Kotlin 2.0+
- **UI Framework:** Jetpack Compose & Material 3
- **Design Language:** Calm Clinical Intelligence
- **Dependency Injection:** Dagger-Hilt 2.52
- **Networking:** Retrofit 2.11 + OkHttp 4.12
- **Data Serialization:** Gson / Kotlinx Serialization
- **Architecture:** Clean Layered Architecture (Presentation $\to$ Domain $\to$ Data $\to$ Core) with MVVM & StateFlow
- **Security:** AndroidX Security-Crypto (MasterKeys, EncryptedSharedPreferences)
- **Push Services:** Firebase Cloud Messaging (FCM)
- **Testing:** JUnit4, MockK, Kotlinx Coroutines Test, Turbine

---

## 📂 Project Navigation

```
doctor-android/
├── app/
│   ├── src/main/java/com/hms/doctor/
│   │   ├── core/          (common, network, auth, security, storage, notifications, ui, navigation)
│   │   ├── data/          (remote, dto, mapper, repository)
│   │   ├── domain/        (model, repository, usecase)
│   │   ├── di/            (NetworkModule, RepositoryModule)
│   │   └── feature/       (auth, home, appointments, patients, prescriptions, reports, admissions, followups, earnings, profile, notifications)
│   └── src/test/          (unit and viewmodel tests)
```

---

## 📖 Technical Documentation

- [Architecture Guide](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/architecture.md)
- [Setup & Build Instructions](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/setup.md)
- [API Integration](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/api-integration.md)
- [Authentication & Session Lifecycle](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/authentication.md)
- [Push Notifications & Deep Links](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/notifications.md)
- [Security & HIPAA Compliance](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/security.md)
- [Testing & Quality Assurance](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/testing.md)
- [Production Release & Deployment](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/docs/android/release.md)
