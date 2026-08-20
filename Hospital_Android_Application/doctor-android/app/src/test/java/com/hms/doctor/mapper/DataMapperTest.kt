package com.hms.doctor.mapper

import com.hms.doctor.data.mapper.toDomain
import com.hms.doctor.data.remote.dto.*
import org.junit.Assert.*
import org.junit.Test

class DataMapperTest {

    @Test
    fun userDto_mapsToDoctorUserDomainModel() {
        val dto = UserDto(
            id = 1,
            name = "Dr. Sarah Williams",
            email = "sarah.williams@medix.com",
            phone = "+91 98200 11223",
            specialty = "Cardiologist",
            department = "Cardiology",
            qualification = "MD, DM",
            registrationNumber = "NMC-1234",
            branchId = 1,
            branchCode = "MEDIX-MAIN",
            branchName = "Main Campus",
            fee = 1500.0,
            status = "AVAILABLE",
            role = "doctor",
            avatarUrl = null
        )

        val domain = dto.toDomain()

        assertEquals(1, domain.id)
        assertEquals("Dr. Sarah Williams", domain.name)
        assertEquals("Cardiologist", domain.specialty)
        assertEquals(1500.0, domain.fee, 0.001)
    }

    @Test
    fun appointmentDto_mapsToAppointmentDomainModel() {
        val dto = AppointmentDto(
            id = 101,
            branchId = 1,
            branchName = "Main Hospital",
            patientId = 401,
            patientName = "Aarav Sharma",
            uhid = "UHID-2026-0042",
            patientAge = 45,
            patientGender = "Male",
            patientPhone = "+91 98765 43210",
            doctorId = 1,
            doctorName = "Dr. Sarah Williams",
            department = "Cardiology",
            appointmentDate = "2026-08-16",
            appointmentTime = "10:30 AM",
            tokenNumber = 14,
            type = "OPD",
            status = "Waiting",
            symptoms = "Chest tightness",
            notes = "History of hypertension",
            consultationRoom = "OPD-302",
            queuePosition = 1,
            vitals = VitalsDto(
                bpSystolic = 135,
                bpDiastolic = 85,
                heartRateBpm = 74,
                temperatureCelsius = 36.9,
                spO2Percentage = 99
            )
        )

        val domain = dto.toDomain()

        assertEquals(101, domain.id)
        assertEquals(14, domain.tokenNumber)
        assertEquals("Waiting", domain.status)
        assertEquals(135, domain.vitals?.bpSystolic)
    }

    @Test
    fun patientDto_mapsToPatientDomainModel() {
        val dto = PatientDto(
            id = 401,
            branchId = 1,
            uhid = "UHID-2026-0042",
            name = "Aarav Sharma",
            age = 45,
            gender = "Male",
            bloodGroup = "B+",
            phone = "+91 98765 43210",
            email = "aarav@example.com",
            condition = "Hypertension",
            status = "OPD",
            address = "Mumbai",
            allergies = listOf("Penicillin"),
            chronicConditions = listOf("Hypertension")
        )

        val domain = dto.toDomain()

        assertEquals(401, domain.id)
        assertEquals("UHID-2026-0042", domain.uhid)
        assertEquals("Aarav Sharma", domain.name)
        assertEquals(listOf("Penicillin"), domain.allergies)
    }
}
