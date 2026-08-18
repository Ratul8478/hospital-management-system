# Medix Doctor Android: Release, Signing & Production Deployment

**Package:** `com.medix.doctor`  
**Distribution Channels:** Google Play Console (Internal Testing, Closed Alpha/Beta, Production) & Enterprise Private APK  
**Minification & Shrinking:** R8 / ProGuard Optimized  
**Signing Standard:** Android App Bundle (AAB) v3/v4 Signature Scheme  

---

## 1. Build Variants & Product Flavors

The Medix Android application supports three distinct environment flavors across two build types (`debug` and `release`):

| Flavor | Application ID | Target API Endpoint | Purpose |
|:---|:---|:---|:---|
| **`dev`** | `com.medix.doctor.dev` | `http://10.0.2.2:3000/api/v1/` | Local engineering & mock feature testing |
| **`staging`** | `com.medix.doctor.staging` | `https://staging-medix-api.medixhealth.io/api/v1/` | QA regression & hospital UAT testing |
| **`prod`** | `com.medix.doctor` | `https://hospital-management-system-using-an.vercel.app/api/v1/` | Live production hospital operations |

### Gradle Product Flavors Configuration (`build.gradle.kts`):
```kotlin
flavorDimensions += "environment"

productFlavors {
    create("dev") {
        dimension = "environment"
        applicationIdSuffix = ".dev"
        versionNameSuffix = "-dev"
        buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:3000/api/v1/\"")
    }
    create("staging") {
        dimension = "environment"
        applicationIdSuffix = ".staging"
        versionNameSuffix = "-staging"
        buildConfigField("String", "BASE_URL", "\"https://staging-medix-api.medixhealth.io/api/v1/\"")
    }
    create("prod") {
        dimension = "environment"
        buildConfigField("String", "BASE_URL", "\"https://hospital-management-system-using-an.vercel.app/api/v1/\"")
    }
}
```

---

## 2. Keystore Generation & Secure Signing Setup

### 2.1 Generating Production Release Keystore
Generate a 2048-bit RSA release keystore using the Java `keytool` utility:

```bash
keytool -genkey -v -keystore medix-doctor-release.jks \
  -alias medix_release_key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Medix Health Systems, OU=Mobile Clinical Engineering, O=Medix Corp, L=Mumbai, ST=Maharashtra, C=IN"
```

---

### 2.2 Secure `keystore.properties` Configuration
Never commit signing credentials or passwords to version control (`.gitignore` must include `*.jks` and `keystore.properties`).

Create `android-doctor/keystore.properties`:
```properties
storeFile=../medix-doctor-release.jks
storePassword=SECURE_STORE_PASSWORD_HERE
keyAlias=medix_release_key
keyPassword=SECURE_KEY_PASSWORD_HERE
```

Configure `signingConfigs` in `android-doctor/app/build.gradle.kts`:
```kotlin
val keystorePropertiesFile = rootProject.file("keystore.properties")
val keystoreProperties = java.util.Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(java.io.FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                storeFile = file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
                enableV1Signing = true
                enableV2Signing = true
                enableV3Signing = true
                enableV4Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

---

## 3. R8 / ProGuard Optimization & Obfuscation Rules

ProGuard and R8 optimize bytecode, strip unused classes, and obfuscate symbols to prevent reverse engineering while preserving reflective libraries (Retrofit, Gson, Room, Hilt, Coil).

Review of active rules in [`android-doctor/app/proguard-rules.pro`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital%20management%20System%20Using%20Antigravity/android-doctor/app/proguard-rules.pro):

```proguard
# Preserve Retrofit and Gson annotations
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.medix.doctor.data.model.** { *; }
-keep class com.medix.doctor.data.remote.dto.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Preserve Room Database Entities and DAOs
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Dao interface * { *; }
-keep @androidx.room.Entity class * { *; }
-dontwarn androidx.room.paging.**

# Preserve Kotlin Coroutines internals
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Preserve OkHttp3 & Okio
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Preserve Coil Image Loader
-dontwarn coil.**
-keep class coil.** { *; }

# Preserve Dagger Hilt Generated Components
-keep class * extends dagger.hilt.internal.GeneratedComponentManager
-keep class * implements dagger.hilt.internal.GeneratedComponent
-keep class * implements dagger.hilt.internal.ComponentManager

# Preserve Crashlytics Line Numbers and Source File info
-keepattributes SourceFile,LineNumberTable
```

---

## 4. Building Release Artifacts

### Generating Android App Bundle (AAB for Google Play Store):
```bash
cd android-doctor
./gradlew bundleProdRelease
```
*Output Location:* `android-doctor/app/build/outputs/bundle/prodRelease/app-prod-release.aab`

### Generating Standalone Signed APK (For Enterprise / Hospital Sideloading):
```bash
cd android-doctor
./gradlew assembleProdRelease
```
*Output Location:* `android-doctor/app/build/outputs/apk/prod/release/app-prod-release.apk`

---

## 5. Pre-Release QA & Security Release Checklist

Before distributing any build to Google Play or enterprise MDM systems, verify every item below:

- [ ] **API Endpoint Verification:** Confirm `BASE_URL` points strictly to the production server: `https://hospital-management-system-using-an.vercel.app/api/v1/`.
- [ ] **Version Code & Name:** Increment `versionCode` (e.g. `2`) and `versionName` (e.g. `"1.1.0"`) in `build.gradle.kts`.
- [ ] **ProGuard & R8 Obfuscation:** Verify `isMinifyEnabled = true` and test release build on physical device to ensure no `ClassNotFoundException` or JSON parsing issues occur.
- [ ] **HIPAA & Sensitive Log Redaction:** Confirm `HttpLoggingInterceptor` is disabled or set to `Level.NONE` in release mode. No patient PHI or access tokens are logged to Logcat.
- [ ] **Biometric / PIN Screen Lock:** Verify biometric prompt or PIN authentication functions properly when resuming from background.
- [ ] **Offline Sync Validation:** Test airplane mode consultation and confirm proper synchronization upon network recovery.
- [ ] **Crashlytics Mapping File:** Ensure `mapping.txt` is retained or automatically uploaded via Firebase Crashlytics Gradle plugin for de-obfuscation.
- [ ] **App Permissions Review:** Confirm the app only requests necessary permissions (`INTERNET`, `ACCESS_NETWORK_STATE`, `POST_NOTIFICATIONS`).

---

## 6. Google Play Console Rollout Phases

1. **Internal Testing Track:** Distributed to core clinical engineering team & hospital QA testers (0 - 24 hours).
2. **Closed Testing (Alpha/Beta):** Rolled out to 50+ on-duty doctors across Mumbai, Bengaluru, and Delhi branches for pilot UAT feedback.
3. **Staged Production Rollout:**
   - Day 1: 10% of doctor user base.
   - Day 3: 25% rollout (Monitoring crash-free user rate > 99.8%).
   - Day 5: 50% rollout.
   - Day 7: 100% full hospital network production release.
