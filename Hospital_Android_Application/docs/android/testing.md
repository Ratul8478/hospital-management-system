# HMS Doctor Android Application — Testing & QA Guide

## 1. Test Strategy & Coverage

The testing suite covers all critical business paths:

### 1.1 ViewModel Unit Tests (`src/test/java/com/hms/doctor/*`)
- `LoginViewModelTest`: Tests validation, successful token issuance, error handling on 401/422.
- `AppointmentsViewModelTest`: Tests OPD queue loading, status filtering, and query searching.
- `PrescriptionViewModelTest`: Tests prescription drug row builder, field validation, and pharmacy routing.

### 1.2 Data Mapper & Contract Tests
- `DataMapperTest`: Verifies bidirectional conversion between backend DTOs and clean Domain Models.

---

## 2. Running Unit Tests via Gradle
```bash
./gradlew testDebugUnitTest
```
