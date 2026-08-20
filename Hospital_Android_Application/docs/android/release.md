# HMS Doctor Android Application — Release & Deployment Guide

## 1. Build Types & Environments

| Build Variant | Application ID | API Base URL | Minification |
|:---|:---|:---|:---:|
| **Debug** | `com.hms.doctor.debug` | Development / Emulator | Disabled |
| **Staging** | `com.hms.doctor.staging` | Staging Cluster | Disabled |
| **Release** | `com.hms.doctor` | Production REST Endpoint | ProGuard / R8 Enabled |

---

## 2. Generating Release Artifacts

### 2.1 Generating Signed Android App Bundle (AAB)
```bash
./gradlew bundleRelease
```
Output path: `app/build/outputs/bundle/release/app-release.aab`

### 2.2 Generating Universal Production APK
```bash
./gradlew assembleRelease
```
Output path: `app/build/outputs/apk/release/app-release.apk`
