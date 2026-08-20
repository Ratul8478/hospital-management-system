package com.hms.doctor

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class HmsDoctorApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
