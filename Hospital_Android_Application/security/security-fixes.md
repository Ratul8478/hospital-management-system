# HMS Enterprise System — Security Fixes & Defense-in-Depth Implementation Log

**Document Version:** 2.0.0  
**Lead Engineer:** Blue Team Lead & Principal Application Security Engineer  
**Date:** August 18, 2026  
**Scope:** Root-Cause Code Patches across Android, Network Layer, Background Services & Client Storage  

---

## 1. Summary of Applied Security Fixes

```
┌─────────────┬───────────────────────────────────────┬───────────────────┬──────────────┐
│ Vuln ID     │ Fix Title                             │ Target Layer      │ Status       │
├─────────────┼───────────────────────────────────────┼───────────────────┼──────────────┤
│ VULN-AND-01 │ Hardened WebView Sandbox Configuration│ Android / UI      │ ✅ PATCHED   │
│ VULN-API-01 │ Contextual Security Header Injection  │ Network / OkHttp  │ ✅ PATCHED   │
│ VULN-FCM-01 │ Dynamic Authenticated Doctor FCM Bind │ Android / FCM     │ ✅ PATCHED   │
│ VULN-WEB-01 │ Client Inactivity Auto-Lock Engine    │ Web / JavaScript  │ ✅ PATCHED   │
└─────────────┴───────────────────────────────────────┴───────────────────┴──────────────┘
```

---

## 2. Detailed Code Modifications & Diffs

### 2.1 Patch 1 (`VULN-AND-01`): Hardened WebView Sandbox Configuration
* **File:** [`doctor-android/app/src/main/java/com/hms/doctor/MainActivity.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/MainActivity.kt#L64-L77)
* **Vulnerability:** `allowFileAccess = true`, `allowContentAccess = true`, and `mixedContentMode = MIXED_CONTENT_ALWAYS_ALLOW` permitted potential sandbox file reading via `file://` scheme.
* **Code Modification:**
```diff
  settings.apply {
      javaScriptEnabled = true
      domStorageEnabled = true
      databaseEnabled = true
-     allowFileAccess = true
-     allowContentAccess = true
+     allowFileAccess = false
+     allowContentAccess = false
      loadWithOverviewMode = true
      useWideViewPort = true
      builtInZoomControls = false
      displayZoomControls = false
      cacheMode = WebSettings.LOAD_DEFAULT
-     mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
+     mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
  }
```
* **Security Result:** Prevents local sandbox extraction and blocks unencrypted mixed HTTP resources.

---

### 2.2 Patch 2 (`VULN-API-01`): Contextual Security Header Injection
* **File:** [`doctor-android/app/src/main/java/com/hms/doctor/core/network/AuthInterceptor.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/core/network/AuthInterceptor.kt#L16-L34)
* **Vulnerability:** Absence of explicit client-supplied context headers allowed potential parameter tampering in multi-tenant/branch hospital networks.
* **Code Modification:**
```diff
  val builder = originalRequest.newBuilder()
      .header("Content-Type", "application/json")
      .header("Accept", "application/json")
      .header("X-Client-Platform", "android-doctor")
      .header("X-Client-Version", "1.0.0")

+ val doctorId = sessionManager.getDoctorId()
+ if (doctorId > 0) {
+     builder.header("X-Doctor-Id", doctorId.toString())
+ }
+ val branchId = sessionManager.getBranchId()
+ if (branchId > 0) {
+     builder.header("X-Branch-Id", branchId.toString())
+ }

  val token = sessionManager.getToken()
  if (!token.isNullOrBlank()) {
      builder.header("Authorization", "Bearer $token")
  }
```
* **Security Result:** Server-side authorization policies can cross-verify the authenticated token identity against the active session context.

---

### 2.3 Patch 3 (`VULN-FCM-01`): Dynamic Authenticated Doctor FCM Token Binding
* **File:** [`doctor-android/app/src/main/java/com/hms/doctor/core/notifications/HmsFirebaseMessagingService.kt`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/doctor-android/app/src/main/java/com/hms/doctor/core/notifications/HmsFirebaseMessagingService.kt#L23-L37)
* **Vulnerability:** Static fallback user ID `99` caused tokens from unauthenticated devices to register under an unauthorized account.
* **Code Modification:**
```diff
+ @Inject
+ lateinit var sessionManager: SessionManager

  override fun onNewToken(token: String) {
      super.onNewToken(token)
-     CoroutineScope(Dispatchers.IO).launch {
-         try {
-             notificationRepository.registerFcmToken(99, token)
-         } catch (_: Exception) {}
-     }
+     val doctorId = sessionManager.getDoctorId()
+     if (doctorId > 0) {
+         CoroutineScope(Dispatchers.IO).launch {
+             try {
+                 notificationRepository.registerFcmToken(doctorId, token)
+             } catch (_: Exception) {}
+         }
+     }
  }
```
* **Security Result:** Device notification tokens are exclusively registered to authenticated physicians.

---

### 2.4 Patch 4 (`VULN-WEB-01`): Session Activity Tracking & Idle Re-Lock
* **File:** [`preview/app.js`](file:///e:/DOWNLOADS/Users/Mr.Ratul/Hospital_Android_Application/preview/app.js) / Client Session Layer
* **Vulnerability:** Indefinite mobile session persistence without background timeout.
* **Fix Implementation:** Added activity timestamp tracking with automatic clinical re-authentication prompt on resume after 15 minutes of inactivity.
* **Security Result:** Mitigates risk of unauthorized clinical chart access on unattended mobile devices in hospital wards.
