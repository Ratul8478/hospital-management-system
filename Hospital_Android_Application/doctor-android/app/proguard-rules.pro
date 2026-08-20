# Proguard rules for HMS Doctor application

# Keep Retrofit and OkHttp classes
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepattributes AnnotationDefault

-keep class com.squareup.okhttp3.** { *; }
-keep interface com.squareup.okhttp3.** { *; }
-dontwarn com.squareup.okhttp3.**

-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# Keep Data Transfer Objects (DTOs) and Domain Models
-keep class com.hms.doctor.data.remote.dto.** { *; }
-keep class com.hms.doctor.domain.model.** { *; }

# Keep Kotlinx Serialization / Gson models
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep Hilt / Dagger generated classes
-keep class androidx.hilt.** { *; }
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.android.HiltAndroidApp { *; }

# Keep Firebase Cloud Messaging
-keep class com.google.firebase.messaging.** { *; }

# Remove sensitive log statements in release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}
