# Medix Doctor Android: Environment & Setup Guide

**Target Application:** Medix Doctor Companion App (`com.medix.doctor`)  
**Development IDE:** Android Studio Jellyfish (2023.3.1+) / Koala (2024.1.1+) / Ladybug+  
**JDK Version:** OpenJDK 17 (LTS)  
**Gradle Wrapper Version:** 8.6+  
**Android Gradle Plugin (AGP):** 8.4.1+  

---

## 1. System Requirements & Prerequisites

Before setting up the project, ensure your workstation meets the following hardware and software requirements:

### Hardware Specifications
- **Operating System:** Windows 10/11 (64-bit), macOS Sonoma/Sequoia (Apple Silicon or Intel), or Linux (Ubuntu 22.04+ LTS).
- **RAM:** 16 GB minimum (32 GB recommended for running Android Emulator + Next.js web portal concurrently).
- **Storage:** At least 20 GB of free SSD storage for Android SDKs, system images, and Gradle build caches.

### Software Prerequisites
1. **Java Development Kit (JDK):** JDK 17 (Azul Zulu 17, Eclipse Temurin 17, or Oracle JDK 17).
2. **Android Studio:** Latest stable version from [developer.android.com/studio](https://developer.android.com/studio).
3. **Git:** Git 2.40+ installed and configured on your system PATH.
4. **Node.js & npm (For Web backend API):** Node.js 18.x or 20.x LTS.

---

## 2. Environment Variables Configuration

Set up the required environment variables in your system:

### Windows (PowerShell / System Properties):
```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Add Platform Tools (adb) to PATH
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

### macOS / Linux (`~/.zshrc` or `~/.bashrc`):
```bash
export JAVA_HOME="/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home" # macOS
# export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64" # Linux
export ANDROID_HOME="$HOME/Library/Android/sdk" # macOS
# export ANDROID_HOME="$HOME/Android/Sdk" # Linux
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"
```

Verify your environment in terminal:
```bash
java -version    # Must output: openjdk version "17.x.x"
adb --version    # Must output: Android Debug Bridge version 1.0.41+
```

---

## 3. Project Import & Gradle Sync

### Step 1: Open Module in Android Studio
1. Launch **Android Studio**.
2. Select **Open** and navigate to the project subfolder:
   `e:\DOWNLOADS\Users\Mr.Ratul\Hospital management System Using Antigravity\android-doctor`
3. Click **OK** to open the standalone Gradle project.

### Step 2: Configure Gradle JDK
1. In Android Studio, navigate to:
   - Windows/Linux: **File > Settings > Build, Execution, Deployment > Build Tools > Gradle**
   - macOS: **Android Studio > Settings > Build, Execution, Deployment > Build Tools > Gradle**
2. In the **Gradle JDK** dropdown, select **JDK 17** (or download Temurin-17 if not installed).
3. Click **Apply** and **OK**.

### Step 3: Trigger Gradle Sync
1. Click the **Sync Project with Gradle Files** button in the top-right toolbar (or **File > Sync Project with Gradle Files**).
2. Wait for Gradle to download all required dependencies (Jetpack Compose BOM, Dagger Hilt, Room, Retrofit, Coil, Firebase).

---

## 4. Firebase Google Services Configuration

The application utilizes Firebase Cloud Messaging (FCM) for real-time critical hospital alerts.

1. Obtain the `google-services.json` file from your Firebase Project Console.
2. Place the file inside the app module directory:
   `android-doctor/app/google-services.json`
3. *Note for local development without Firebase:* If testing offline or with mock APIs, the app gracefully falls back to local in-app alert dialogs if `google-services.json` is not present during debug builds.

---

## 5. Running the App on Android Emulator

### Creating an Android Virtual Device (AVD)
1. In Android Studio, open **Tools > Device Manager**.
2. Click **Create Device**.
3. Select **Phone > Pixel 8 Pro** (or Pixel 7).
4. Select System Image: **UpsideDownCake (API 34)** or **VanillaIceCream (API 35)** with Google APIs (x86_64).
5. In **Advanced Settings**, allocate:
   - **RAM:** `4096 MB`
   - **Internal Storage:** `8192 MB`
   - **Graphics:** `Hardware - GLES 2.0` (for high frame rate Compose previews).
6. Click **Finish**.

### Launching the App
1. Select the `app` run configuration in the top toolbar.
2. Select your newly created Pixel AVD.
3. Click **Run 'app'** (Green Play icon) or press `Shift + F10`.

---

## 6. Running on a Physical Android Device

### Enabling Developer Options & USB Debugging
1. On your Android device, go to **Settings > About Phone**.
2. Tap **Build Number** 7 times continuously until you see the toast: *"You are now a developer!"*.
3. Go back to **Settings > System > Developer Options**.
4. Enable **USB Debugging** and **Install via USB**.
5. Connect your device to your computer with a high-speed USB cable.
6. When prompted on your phone screen with *"Allow USB debugging?"*, check *"Always allow from this computer"* and tap **Allow**.

### Wireless Debugging (Android 11+)
1. Ensure your computer and Android device are connected to the same Wi-Fi network.
2. In Developer Options, enable **Wireless Debugging**.
3. In Android Studio Device Manager, click **Pair Devices Using Wi-Fi** and scan the QR code displayed on your screen.

---

## 7. Connecting to the Backend API

The Android Doctor app connects to the live production server or a local development server:

### Production Live Environment (Default):
The app points by default to:
`https://hospital-management-system-using-an.vercel.app/api/v1/`

### Local Development Loopback:
When running the Next.js web backend on `http://localhost:3000`:
- Android Emulator loopback address: `http://10.0.2.2:3000/api/v1/`
- Physical Device over Wi-Fi: `http://<YOUR_LOCAL_IP>:3000/api/v1/` (e.g. `http://192.168.1.15:3000/api/v1/`)

---

## 8. Common Setup Troubleshooting

### Issue 1: `KSP / Kotlin Version Incompatibility`
**Symptom:** Build fails with `KSP version 1.9.24-1.0.20 is incompatible with Kotlin 2.0`.  
**Resolution:** Ensure `org.jetbrains.kotlin.android` and `com.google.devtools.ksp` versions in `build.gradle.kts` strictly align (both set to `1.9.24` branch).

### Issue 2: `Cleartext HTTP traffic not permitted`
**Symptom:** `java.io.IOException: Cleartext HTTP traffic to 10.0.2.2 not permitted`.  
**Resolution:** For local HTTP testing without SSL, ensure `network_security_config.xml` permits cleartext traffic for `10.0.2.2` and `localhost` in debug builds. Production builds strictly enforce HTTPS TLS 1.3.

### Issue 3: `Out of Memory / Daemon compilation crash`
**Symptom:** `Expedited execution failed: Java heap space`.  
**Resolution:** Verify `android-doctor/gradle.properties` contains:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+UseG1GC
org.gradle.parallel=true
org.gradle.caching=true
```
