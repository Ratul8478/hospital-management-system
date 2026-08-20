# HMS Doctor Android Application — Push Notifications & Deep Links

## 1. Firebase Cloud Messaging (FCM) Integration

The application integrates **Firebase Cloud Messaging** via `HmsFirebaseMessagingService` to deliver critical clinical alerts.

---

## 2. Notification Types & Priority Channels

| Channel ID | Channel Name | Importance | Trigger Scenarios |
|:---|:---|:---:|:---|
| `hms_clinical_alerts_channel` | Clinical & OPD Alerts | `HIGH` | Critical lab reports, emergency queue additions, ICU bed transfers |

---

## 3. FCM Lifecycle Flow

1. **Token Generation:** On device initialization, `HmsFirebaseMessagingService.onNewToken(token)` triggers.
2. **Backend Sync:** The token is dispatched to `POST /api/v1/notifications/fcm-token` and mapped to the physician's account in MySQL.
3. **Incoming Payload Handling:** When a background message is received, high-priority notifications are displayed in the Android system tray with pending intents linked to `MainActivity`.
