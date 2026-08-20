# HMS Doctor Android Application — Architecture Guide

## 1. Architectural Philosophy

The **HMS Doctor** Android application follows **Clean Architecture** combined with the **Model-View-ViewModel (MVVM)** design pattern and **Unidirectional Data Flow (UDF)** via Kotlin Coroutines and `StateFlow`.

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│   Jetpack Compose UI  ◄───►  ViewModel (StateFlow)      │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                       │
│    Domain Models  ◄───►  Repository Interfaces          │
└───────────────────────────▲─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                       DATA LAYER                        │
│   Repository Impls  ◄───►  Mappers  ◄───►  DTOs / API   │
│   Retrofit REST Client  ◄───►  Encrypted Storage        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### 2.1 Presentation Layer (`com.hms.doctor.feature.*`)
- **Declarative Compose UI**: Stateless UI components consuming strongly typed `UiState` data classes.
- **ViewModels (`@HiltViewModel`)**: Manage UI state transitions, handle user events, and interact with Domain Repositories.
- **StateFlow & Coroutines**: Expose immutable state flows (`StateFlow<UiState>`) updated sequentially via `viewModelScope`.

### 2.2 Domain Layer (`com.hms.doctor.domain.*`)
- **Domain Models**: Clean business entities (`Appointment`, `Patient`, `Prescription`, `DiagnosticReport`, `Admission`, `FollowUp`, `DoctorEarnings`) completely decoupled from JSON serializers or external framework libraries.
- **Repository Contracts**: Abstract interfaces defining data access contracts.

### 2.3 Data Layer (`com.hms.doctor.data.*`)
- **DTOs (`data/remote/dto/`)**: Serialized JSON transfer objects matching the backend REST envelope.
- **Mappers (`data/mapper/`)**: Pure conversion functions mapping DTOs to Domain Models and vice versa.
- **Repository Implementations (`data/repository/`)**: Concrete implementations communicating with Retrofit interfaces and handling error status codes (401, 403, 404, 422, 500) and network timeouts.

### 2.4 Core Layer (`com.hms.doctor.core.*`)
- **Network**: `AuthInterceptor` appending Bearer tokens and client version headers.
- **Security & Storage**: `EncryptedPreferencesManager` backed by Android Keystore.
- **Navigation**: `HmsNavHost` with declarative route matching and argument serialization.
- **Design System**: Calm Clinical Intelligence color scheme, Material 3 Typography, and custom accessible healthcare components.
