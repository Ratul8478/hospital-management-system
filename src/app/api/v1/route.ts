import { apiSuccess, handleOptions } from '@/lib/api-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return apiSuccess(
    {
      system: 'Medix HMS Unified Backend REST API',
      version: 'v1.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: {
          login: { method: 'POST', path: '/api/v1/auth/login', description: 'Doctor login and JWT session generation' },
          logout: { method: 'POST', path: '/api/v1/auth/logout', description: 'Invalidate active doctor session/token' },
        },
        doctor: {
          todaysAppointments: { method: 'GET, POST', path: '/api/v1/doctor/appointments/today', description: "Today's OPD queue, tokens & patient statuses" },
          updateAppointmentStatus: { method: 'PATCH, PUT, POST', path: '/api/v1/doctor/appointments/[id]/status', description: 'Update status (In Consultation, Completed, Cancelled)' },
          prescriptions: { method: 'GET, POST', path: '/api/v1/doctor/prescriptions', description: 'Query and issue electronic prescriptions (Rx)' },
          medicalReports: { method: 'GET', path: '/api/v1/doctor/reports', description: 'Patient diagnostic lab and radiology reports' },
          admissions: { method: 'GET', path: '/api/v1/doctor/admissions', description: 'Admitted IPD inpatients and bed allocation details' },
          followups: { method: 'GET, POST', path: '/api/v1/doctor/followups', description: 'Scheduled patient follow-ups tracker' },
          earnings: { method: 'GET', path: '/api/v1/doctor/earnings', description: 'Doctor revenue analytics (today, week, month)' },
          leaveManagement: { method: 'GET, POST', path: '/api/v1/doctor/leave', description: 'Doctor leave applications and duty roster balances' },
          referrals: { method: 'GET, POST', path: '/api/v1/doctor/referrals', description: 'Inter-hospital patient referral dispatch & tracking' },
        },
        hospitals: {
          directory: { method: 'GET, POST', path: '/api/v1/hospitals', description: 'Web-registered and approved hospitals/branches directory' },
        },
        doctors: {
          directory: { method: 'GET, POST', path: '/api/v1/doctors', description: 'Web-registered doctors, specializations & availability roster' },
        },
        patients: {
          directory: { method: 'GET, POST', path: '/api/v1/patients', description: 'Searchable patient directory by name, UHID, phone' },
          longitudinalHistory: { method: 'GET', path: '/api/v1/patients/[id]/history', description: 'Full clinical longitudinal health history and EHR records' },
        },
        notifications: {
          fcmToken: { method: 'GET, POST', path: '/api/v1/notifications/fcm-token', description: 'Register and query doctor device FCM push tokens' },
        },
      },
    },
    {
      status: 200,
      message: 'Medix HMS REST API v1 is healthy and operational.',
    }
  );
}
