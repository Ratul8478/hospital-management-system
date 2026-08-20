package com.hms.doctor.di

import com.hms.doctor.data.repository.*
import com.hms.doctor.domain.repository.*
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository

    @Binds
    @Singleton
    abstract fun bindAppointmentRepository(impl: AppointmentRepositoryImpl): AppointmentRepository

    @Binds
    @Singleton
    abstract fun bindPatientRepository(impl: PatientRepositoryImpl): PatientRepository

    @Binds
    @Singleton
    abstract fun bindPrescriptionRepository(impl: PrescriptionRepositoryImpl): PrescriptionRepository

    @Binds
    @Singleton
    abstract fun bindReportRepository(impl: ReportRepositoryImpl): ReportRepository

    @Binds
    @Singleton
    abstract fun bindAdmissionRepository(impl: AdmissionRepositoryImpl): AdmissionRepository

    @Binds
    @Singleton
    abstract fun bindFollowUpRepository(impl: FollowUpRepositoryImpl): FollowUpRepository

    @Binds
    @Singleton
    abstract fun bindEarningsRepository(impl: EarningsRepositoryImpl): EarningsRepository

    @Binds
    @Singleton
    abstract fun bindNotificationRepository(impl: NotificationRepositoryImpl): NotificationRepository
}
