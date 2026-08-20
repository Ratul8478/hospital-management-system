package com.hms.doctor.data.mapper

import com.hms.doctor.data.remote.dto.*
import com.hms.doctor.domain.model.*

fun UserDto.toDomain(): DoctorUser {
    return DoctorUser(
        id = id,
        name = name,
        email = email,
        phone = phone,
        specialty = specialty,
        department = department,
        qualification = qualification,
        registrationNumber = registrationNumber,
        branchId = branchId,
        branchCode = branchCode,
        branchName = branchName,
        fee = fee,
        status = status,
        role = role,
        avatarUrl = avatarUrl
    )
}

fun AppointmentDto.toDomain(): Appointment {
    return Appointment(
        id = id,
        branchId = branchId,
        branchName = branchName,
        patientId = patientId,
        patientName = patientName,
        uhid = uhid,
        patientAge = patientAge,
        patientGender = patientGender,
        patientPhone = patientPhone,
        doctorId = doctorId,
        doctorName = doctorName,
        department = department,
        appointmentDate = appointmentDate,
        appointmentTime = appointmentTime,
        tokenNumber = tokenNumber,
        type = type,
        status = status,
        symptoms = symptoms,
        notes = notes,
        consultationRoom = consultationRoom,
        queuePosition = queuePosition,
        vitals = vitals?.toDomain()
    )
}

fun VitalsDto.toDomain(): Vitals {
    return Vitals(
        bpSystolic = bpSystolic,
        bpDiastolic = bpDiastolic,
        heartRateBpm = heartRateBpm,
        temperatureCelsius = temperatureCelsius,
        spO2Percentage = spO2Percentage,
        bloodSugarMgDl = bloodSugarMgDl,
        bmi = bmi,
        isAbnormal = isAbnormal,
        notes = notes,
        recordedAt = recordedAt
    )
}

fun PatientDto.toDomain(): Patient {
    return Patient(
        id = id,
        branchId = branchId,
        uhid = uhid,
        name = name,
        age = age,
        gender = gender,
        bloodGroup = bloodGroup,
        phone = phone,
        email = email,
        condition = condition,
        status = status,
        address = address,
        allergies = allergies,
        chronicConditions = chronicConditions,
        emergencyContactName = emergencyContactName,
        emergencyContactPhone = emergencyContactPhone,
        registeredDate = registeredDate,
        lastVisitedDate = lastVisitedDate,
        assignedDoctorName = assignedDoctorName,
        assignedDoctorId = assignedDoctorId,
        bedNumber = bedNumber,
        wardType = wardType
    )
}

fun TimelineEventDto.toDomain(): TimelineEvent {
    return TimelineEvent(
        id = id,
        patientId = patientId,
        eventType = eventType,
        title = title,
        description = description,
        timestamp = timestamp,
        doctorName = doctorName,
        department = department,
        documentUrl = documentUrl
    )
}

fun PrescriptionDto.toDomain(): Prescription {
    return Prescription(
        id = id,
        prescriptionNumber = prescriptionNumber,
        appointmentId = appointmentId,
        patientId = patientId,
        uhid = uhid,
        patientName = patientName,
        patientAge = patientAge,
        patientGender = patientGender,
        doctorId = doctorId,
        doctorName = doctorName,
        department = department,
        branchId = branchId,
        diagnosis = diagnosis,
        symptoms = symptoms,
        medicines = medicines.map { it.toDomain() },
        advice = advice,
        followUpDate = followUpDate,
        status = status,
        createdAt = createdAt
    )
}

fun PrescriptionItemDto.toDomain(): PrescriptionItem {
    return PrescriptionItem(
        name = name,
        category = category,
        dosage = dosage,
        frequency = frequency,
        duration = duration,
        instructions = instructions
    )
}

fun PrescriptionItem.toDto(): PrescriptionItemDto {
    return PrescriptionItemDto(
        name = name,
        category = category,
        dosage = dosage,
        frequency = frequency,
        duration = duration,
        instructions = instructions
    )
}

fun ReportDto.toDomain(): DiagnosticReport {
    return DiagnosticReport(
        id = id,
        patientId = patientId,
        uhid = uhid,
        patientName = patientName,
        doctorId = doctorId,
        doctorName = doctorName,
        testName = testName,
        category = category,
        status = status,
        resultSummary = resultSummary,
        criticalAlert = criticalAlert,
        criticalDetails = criticalDetails,
        sampleCollectedAt = sampleCollectedAt,
        reportedAt = reportedAt,
        fileUrl = fileUrl
    )
}

fun ReportsSummaryDto.toDomain(): ReportsSummary {
    return ReportsSummary(
        total = total,
        ready = ready,
        pending = pending,
        criticalAlerts = criticalAlerts
    )
}

fun AdmissionDto.toDomain(): Admission {
    return Admission(
        id = id,
        patientId = patientId,
        uhid = uhid,
        patientName = patientName,
        patientAge = patientAge,
        patientGender = patientGender,
        doctorId = doctorId,
        doctorName = doctorName,
        branchId = branchId,
        branchName = branchName,
        wardType = wardType,
        roomNumber = roomNumber,
        bedNumber = bedNumber,
        admissionDate = admissionDate,
        diagnosis = diagnosis,
        status = status,
        nursingNotes = nursingNotes,
        currentCondition = currentCondition,
        attendingNurse = attendingNurse
    )
}

fun FollowUpDto.toDomain(): FollowUp {
    return FollowUp(
        id = id,
        patientId = patientId,
        uhid = uhid,
        patientName = patientName,
        patientPhone = patientPhone,
        doctorId = doctorId,
        doctorName = doctorName,
        scheduledDate = scheduledDate,
        reason = reason,
        status = status,
        notes = notes
    )
}

fun DoctorEarningsDto.toDomain(): DoctorEarnings {
    return DoctorEarnings(
        doctorId = doctorId,
        doctorName = doctorName,
        specialty = specialty,
        fee = fee,
        todayConsultations = todayConsultations,
        todayEarnings = todayEarnings,
        monthConsultations = monthConsultations,
        monthEarnings = monthEarnings,
        totalConsultations = totalConsultations,
        totalEarnings = totalEarnings,
        pendingPayout = pendingPayout,
        currency = if (currency.isNullOrBlank() || currency == "$") "₹" else currency
    )
}
