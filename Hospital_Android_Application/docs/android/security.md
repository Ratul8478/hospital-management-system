# HMS Doctor Android Application — Security & HIPAA Compliance

## 1. Healthcare Security Compliance Standards

HMS Doctor conforms to **HIPAA** and **GDPR** clinical privacy mandates:
- **No Local Database Mirroring:** Sensitive medical records and full patient databases are never stored locally on device storage.
- **Hardware-Backed Encryption:** Tokens and user metadata are stored using Android Keystore `MasterKeys.AES256_GCM_SPEC` in `EncryptedSharedPreferences`.
- **Zero Sensitive Logging:** HTTP Logging Interceptors are disabled in release builds (`HttpLoggingInterceptor.Level.NONE`), and ProGuard strips debug log invocations.
- **Network Security Configuration:** Strict HTTPS requirement with `android:usesCleartextTraffic="false"`.
- **Biometric Authentication:** Optional BiometricPrompt integration for local app unlock without credential re-entry.
