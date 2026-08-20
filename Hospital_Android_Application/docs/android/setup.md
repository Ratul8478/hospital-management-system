# HMS Doctor Android Application — Setup & Build Guide

## 1. System Requirements

- **Android Studio:** Ladybug (2024.2.1+) or newer
- **JDK Version:** Java 17 (Azul Zulu 17 or OpenJDK 17)
- **Gradle Version:** 8.10.2 (bundled via Gradle Wrapper)
- **Minimum Android SDK:** API 26 (Android 8.0 Oreo)
- **Target / Compile Android SDK:** API 35 (Android 15)

---

## 2. Project Setup & Configuration

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd Hospital_Android_Application/doctor-android
   ```

2. **Open in Android Studio:**
   - Launch Android Studio.
   - Select **Open an existing project**.
   - Navigate to `doctor-android/` and select `settings.gradle.kts`.

3. **Sync Gradle:**
   - Android Studio will automatically resolve dependencies from `gradle/libs.versions.toml`.
   - Alternatively, trigger synchronization from terminal:
     ```bash
     ./gradlew --refresh-dependencies
     ```

---

## 3. Running the App

### Debug Build
```bash
./gradlew assembleDebug
```

### Staging Build
```bash
./gradlew assembleStaging
```

### Release Build
```bash
./gradlew assembleRelease
```

---

## 4. Running Unit Tests
```bash
./gradlew testDebugUnitTest
```
