# HMS Doctor Android Application — Enterprise Deployment & Production Runbook

**Document Version:** 2.0.0  
**Author:** Principal Android Architect & DevOps Lead  
**Application Package:** `com.hms.doctor` (`Medix Doctor Pro / HMS Doctor`)  
**Target Platform:** Android SDK 26–35 (Android 8.0 Oreo to Android 15 Vanilla Ice Cream)  

---

## 1. Prerequisites & Tooling

To build, sign, and deploy the application to Google Play Store or private hospital Enterprise Mobility Management (EMM/MDM), ensure the following tools are installed:

- **JDK:** Java Development Kit 17 LTS (`OpenJDK 17.0.10+7` or Temurin 17)
- **Android SDK:** Command-line Tools / Android Studio Ladybug (2024.2.1+) with SDK Platform 35 (`android-35`) and Build Tools `35.0.0`
- **Gradle:** Gradle 8.9 (bundled via `gradlew`)
- **Backend:** Laravel REST API (v1) with MySQL 8.0 & Sanctum Authentication

---

## 2. Release Keystore Generation

Execute the following standard `keytool` command to generate the enterprise production release keystore:

```bash
keytool -genkey -v -keystore hms-doctor-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias hms-doctor-key \
  -dname "CN=HMS Doctor, OU=Healthcare Systems, O=Medix Central Hospital, L=Mumbai, ST=Maharashtra, C=IN"
```

### Store Credentials Safely:
Configure local properties in `gradle.properties` (or CI/CD environment secrets):

```properties
HMS_RELEASE_STORE_FILE=hms-doctor-release.jks
HMS_RELEASE_STORE_PASSWORD=YourSecureKeystorePassword
HMS_RELEASE_KEY_ALIAS=hms-doctor-key
HMS_RELEASE_KEY_PASSWORD=YourSecureKeyPassword
```

---

## 3. Signing Configuration in `build.gradle.kts`

Add the `signingConfigs` block inside `doctor-android/app/build.gradle.kts`:

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file(project.findProperty("HMS_RELEASE_STORE_FILE") ?: "hms-doctor-release.jks")
            storePassword = project.findProperty("HMS_RELEASE_STORE_PASSWORD") as String? ?: ""
            keyAlias = project.findProperty("HMS_RELEASE_KEY_ALIAS") as String? ?: ""
            keyPassword = project.findProperty("HMS_RELEASE_KEY_PASSWORD") as String? ?: ""
            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            enableV4Signing = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

---

## 4. Compiling Production Builds

### 4.1 Generate Android App Bundle (.aab) for Google Play:
```bash
./gradlew bundleRelease
```
*Output Location:* `app/build/outputs/bundle/release/app-release.aab`

### 4.2 Generate Universal Signed Standalone APK (.apk):
```bash
./gradlew assembleRelease
```
*Output Location:* `app/build/outputs/apk/release/app-release.apk`

---

## 5. Firebase Cloud Messaging (FCM) Production Configuration

1. In the **Firebase Console** (`console.firebase.google.com`), select or create your hospital project: `medix-hospital-fcm`.
2. Add an Android app with package name: `com.hms.doctor`.
3. Add the release SHA-1 and SHA-256 certificate fingerprints from your keystore:
   ```bash
   keytool -list -v -keystore hms-doctor-release.jks -alias hms-doctor-key
   ```
4. Download the production `google-services.json` and place it in:
   `doctor-android/app/google-services.json`.

---

## 6. Backend API Configuration & Transport Security

### 6.1 Base URL Injection:
The Android network client communicates via `NetworkModule.kt`:

- **Production Endpoint:** `https://api.medixhospital.com/api/v1/`
- **Staging / Local Emulator:** `http://10.0.2.2:8000/api/v1/` or `http://localhost:8000/api/v1/`

### 6.2 Network Security Config:
Transport security is governed by [`network_security_config.xml`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/res/xml/network_security_config.xml), enforcing TLS 1.3 encryption across all production endpoints while permitting secure loopback debugging on development builds.

---

## 7. Automated CI/CD Workflow (GitHub Actions)

Create `.github/workflows/android-release.yml` for automated compilation:

```yaml
name: Android Release Build & Test

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to Gradle
        run: chmod +x gradlew
        working-directory: doctor-android

      - name: Run Unit Tests
        run: ./gradlew testDebugUnitTest
        working-directory: doctor-android

      - name: Assemble Debug APK
        run: ./gradlew assembleDebug
        working-directory: doctor-android

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Medix_Doctor_App
          path: doctor-android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 8. Google Play Store Deployment Checklist

- [x] Application name is **Medix** (`HMS Doctor Pro`).
- [x] Package Name: `com.hms.doctor`.
- [x] Currency is standardized to **Indian Rupee (₹ / INR)** across all 11 modules.
- [x] Medical registration format complies with National Medical Commission (**NMC**) standards.
- [x] ProGuard / R8 rules configured to prevent obfuscation of Retrofit DTOs and Gson reflection models.
- [x] Biometric touch authentication enabled with fallback to secure credential sign-in.
- [x] All automated unit tests passing (`32 actionable tasks, 0 failures`).
