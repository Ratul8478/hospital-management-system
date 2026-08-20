# HMS Doctor Android Application — Authentication & Session Lifecycle

## 1. Authentication Strategy

HMS Doctor integrates with Laravel's **Sanctum Token Authentication** standard.

---

## 2. Authentication Flow

```
[Doctor Login Input] ──► Local Validation ──► POST /api/v1/auth/login ──► Sanctum Token Issued
                                                                                  │
[Home / OPD Queue] ◄── Session Stored in EncryptedSharedPreferences ◄─────────────┘
```

1. **Input Submission:** Doctor enters email/identifier and password.
2. **REST Call:** Request sent over HTTPS TLS 1.3 to `POST /api/v1/auth/login`.
3. **Session Persistence:** On `200 OK`, the Bearer access token and doctor profile details are encrypted via Android Keystore `MasterKeys.AES256_GCM_SPEC` inside `EncryptedPreferencesManager`.
4. **Auto Header Injection:** `AuthInterceptor` attaches `Authorization: Bearer <token>` to all subsequent requests.

---

## 3. Session Expiration & Auto-Logout

- If any API endpoint returns `401 Unauthorized` (e.g. token revocation or expiration):
  1. `AuthInterceptor` intercepts the HTTP 401 code.
  2. `SessionManager.clearSession()` wipes all tokens and cached state.
  3. `MainActivity` observing `sessionManager.isLoggedIn` automatically navigates back to `LoginScreen`.
