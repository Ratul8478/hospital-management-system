'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Doctor, Patient, Appointment, Bed, Medicine, LabRequest, MarketingRepresentative, MarketingJoinRequest, HospitalReferral } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import {
  Users,
  Stethoscope,
  CalendarDays,
  BedDouble,
  Pill,
  FlaskConical,
  Share2,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Building2,
  UserCheck,
  Search,
  X,
  Sparkles,
  Phone,
  ShieldCheck,
  Activity,
  DollarSign,
  ArrowRightLeft,
  FileText,
  Printer,
  Eye,
  Send,
  Download,
  QrCode,
  AlertCircle,
  HeartPulse,
  UserPlus,
  FileCheck,
  Copy,
  Briefcase,
  Mail,
  PhoneCall,
  ExternalLink,
  RefreshCw,
  IdCard,
  Filter,
  Check,
  Ban
} from 'lucide-react';

export default function ReceptionistHubPage() {
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    userRole,
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    beds,
    addBed,
    updateBed,
    deleteBed,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    labRequests,
    addLabRequest,
    updateLabRequest,
    deleteLabRequest,
    marketingRepresentatives,
    marketingJoinRequests,
    addMarketingRepresentative,
    updateMarketingRepresentative,
    deleteMarketingRepresentative,
    fireMarketingRepresentative,
    reinstateMarketingRepresentative,
    approveMarketingJoinRequest,
    rejectMarketingJoinRequest,
    submitMarketingJoinRequest,
    branchAdminPreApproveMarketingRequest,
    superAdminFinalApproveMarketingRequest,
    hospitalReferrals,
    addHospitalReferral,
    updateHospitalReferralStatus,
    deleteHospitalReferral,
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'doctors' | 'patients' | 'appointments' | 'beds' | 'pharmacy' | 'laboratory' | 'marketing' | 'referrals'
  >('doctors');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Active branch
  const activeBranch = useMemo(() => {
    if (selectedBranchId === 'all') return branches[0] || { id: 1, name: 'Main Hospital HQ', code: 'ARIYAN-HQ' };
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  // Scoped Data by Branch
  const branchDoctors = useMemo(() => {
    if (selectedBranchId === 'all') return doctors;
    return doctors.filter(d => d.branchId === activeBranch.id);
  }, [doctors, selectedBranchId, activeBranch]);

  const branchPatients = useMemo(() => {
    if (selectedBranchId === 'all') return patients;
    return patients.filter(p => p.branchId === activeBranch.id);
  }, [patients, selectedBranchId, activeBranch]);

  const branchAppointments = useMemo(() => {
    if (selectedBranchId === 'all') return appointments;
    return appointments.filter(a => a.branchId === activeBranch.id);
  }, [appointments, selectedBranchId, activeBranch]);

  const branchBeds = useMemo(() => {
    if (selectedBranchId === 'all') return beds;
    return beds.filter(b => b.branchId === activeBranch.id);
  }, [beds, selectedBranchId, activeBranch]);

  const branchMedicines = useMemo(() => {
    if (selectedBranchId === 'all') return medicines;
    return medicines.filter(m => m.branchId === activeBranch.id);
  }, [medicines, selectedBranchId, activeBranch]);

  const branchLabRequests = useMemo(() => {
    if (selectedBranchId === 'all') return labRequests;
    return labRequests.filter(l => l.branchId === activeBranch.id);
  }, [labRequests, selectedBranchId, activeBranch]);

  const branchMarketingReps = useMemo(() => {
    if (selectedBranchId === 'all') return marketingRepresentatives;
    return marketingRepresentatives.filter(r => r.branchId === activeBranch.id);
  }, [marketingRepresentatives, selectedBranchId, activeBranch]);

  const branchMarketingRequests = useMemo(() => {
    if (selectedBranchId === 'all') return marketingJoinRequests;
    return marketingJoinRequests.filter(r => r.targetBranchId === activeBranch.id);
  }, [marketingJoinRequests, selectedBranchId, activeBranch]);

  const branchReferrals = useMemo(() => {
    if (!hospitalReferrals) return [];
    if (selectedBranchId === 'all') return hospitalReferrals;
    return hospitalReferrals.filter(r => {
      const targetId = Number(r.targetHospitalId);
      const isIdMatch = !isNaN(targetId) && targetId === activeBranch.id;
      const isCodeMatch = r.targetHospitalCode && activeBranch.code && r.targetHospitalCode.toLowerCase() === activeBranch.code.toLowerCase();
      const isNameMatch = r.targetHospitalName && activeBranch.name && r.targetHospitalName.toLowerCase().includes(activeBranch.name.toLowerCase());
      return isIdMatch || isCodeMatch || isNameMatch;
    });
  }, [hospitalReferrals, selectedBranchId, activeBranch]);

  // Referral Filter & Viewing States
  const [referralUrgencyFilter, setReferralUrgencyFilter] = useState<'all' | 'EMERGENCY' | 'URGENT' | 'ROUTINE'>('all');
  const [referralStatusFilter, setReferralStatusFilter] = useState<'all' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'ADMITTED'>('all');
  const [viewingReferralSlip, setViewingReferralSlip] = useState<HospitalReferral | null>(null);

  // =========================================================================
  // MODAL STATES
  // =========================================================================

  // 1. Doctor Modals
  const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

  const compileDocScheduleString = (months: string[], days: string[], customDays: string, timing: string): string => {
    const monthsStr = months.length === 12 || months.length === 0 ? 'Jan-Dec (All Months)' : months.join(', ');
    const daysStr = days.length === 7 ? 'Mon-Sun (All Week)' : days.length === 6 && !days.includes('Sun') ? 'Mon-Sat' : days.length === 5 && !days.includes('Sat') && !days.includes('Sun') ? 'Mon-Fri (Weekdays)' : (days.length > 0 ? days.join(', ') : 'Special Days');
    const customStr = customDays.trim() ? ` (Custom: ${customDays.trim()})` : '';
    const timeStr = timing.trim() || '10:00 AM - 02:00 PM';
    return `${monthsStr} • ${daysStr}${customStr} • ${timeStr}`;
  };

  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiology & General Medicine');
  const [docQualification, setDocQualification] = useState('MD, MBBS');
  const [docFee, setDocFee] = useState('800');
  const [docPhone, setDocPhone] = useState('+91 9804222142');
  const [docScheduleMonths, setDocScheduleMonths] = useState<string[]>(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  const [docScheduleDays, setDocScheduleDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [docScheduleCustomDays, setDocScheduleCustomDays] = useState<string>('');
  const [docScheduleTiming, setDocScheduleTiming] = useState<string>('10:00 AM - 02:00 PM');
  const [docSchedule, setDocSchedule] = useState('Jan-Dec (All Months) • Mon-Sat • 10:00 AM - 02:00 PM');
  const [docChamber, setDocChamber] = useState('OPD Chamber 102');
  const [docStatus, setDocStatus] = useState<'available' | 'busy' | 'off-duty'>('available');
  const [docImage, setDocImage] = useState('');
  const [docImagePreview, setDocImagePreview] = useState('');

  // 2. Patient Modals
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patName, setPatName] = useState('');
  const [patAge, setPatAge] = useState('32');
  const [patGender, setPatGender] = useState('Male');
  const [patBlood, setPatBlood] = useState('O+');
  const [patPhone, setPatPhone] = useState('+91 98765 43210');
  const [patCondition, setPatCondition] = useState('General Consultation');
  const [patStatus, setPatStatus] = useState<'opd' | 'admitted' | 'discharged'>('opd');

  // 3. Appointment Modals
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);
  const [appPatientName, setAppPatientName] = useState('');
  const [appUhid, setAppUhid] = useState('');
  const [appDoctorName, setAppDoctorName] = useState('');
  const [appDept, setAppDept] = useState('Cardiology');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [appTime, setAppTime] = useState('11:00 AM');
  const [appType, setAppType] = useState<Appointment['type']>('OPD');
  const [appStatus, setAppStatus] = useState<Appointment['status']>('Waiting');

  // 4. Bed Modals
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [allocatingBed, setAllocatingBed] = useState<Bed | null>(null);
  const [bedNumber, setBedNumber] = useState('');
  const [bedWard, setBedWard] = useState<Bed['wardType']>('general');
  const [bedDailyCharge, setBedDailyCharge] = useState('1500');
  const [bedStatus, setBedStatus] = useState<Bed['status']>('available');
  // Allocation state
  const [bedPatientName, setBedPatientName] = useState('');
  const [bedPatientUhid, setBedPatientUhid] = useState('');
  const [bedAdmissionDate, setBedAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [bedExpectedDischarge, setBedExpectedDischarge] = useState('');
  const [bedExpectedReleaseTime, setBedExpectedReleaseTime] = useState('02:00 PM');
  const [bedDoctor, setBedDoctor] = useState('');

  // 5. Pharmacy Modals
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [medName, setMedName] = useState('');
  const [medCategory, setMedCategory] = useState('Antibiotic');
  const [medStock, setMedStock] = useState('100');
  const [medPrice, setMedPrice] = useState('45');
  const [medExpiry, setMedExpiry] = useState('2027-12-31');
  const [medBatch, setMedBatch] = useState('BT-9921');

  // 6. Lab Modals
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [editingLab, setEditingLab] = useState<LabRequest | null>(null);
  const [labPatientName, setLabPatientName] = useState('');
  const [labPatientUhid, setLabPatientUhid] = useState('');
  const [labTestName, setLabTestName] = useState('Complete Blood Count (CBC)');
  const [labCategory, setLabCategory] = useState('Hematology');
  const [labDoctorName, setLabDoctorName] = useState('Dr . Jiarul Haque');
  const [labStatus, setLabStatus] = useState<LabRequest['status']>('pending');
  const [labPrice, setLabPrice] = useState('450');

  // 7. Marketing Rep & Join Requests States
  const [marketingFilter, setMarketingFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [marketingSearchQuery, setMarketingSearchQuery] = useState('');
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [editingRep, setEditingRep] = useState<MarketingRepresentative | null>(null);
  const [viewingRep, setViewingRep] = useState<MarketingRepresentative | null>(null);
  const [viewingRequest, setViewingRequest] = useState<MarketingJoinRequest | null>(null);

  // Edit Rep Form
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repTerritory, setRepTerritory] = useState('');
  const [repCommission, setRepCommission] = useState('10');

  // Onboard New Rep Form
  const [newRepName, setNewRepName] = useState('');
  const [newRepPhone, setNewRepPhone] = useState('');
  const [newRepEmail, setNewRepEmail] = useState('');
  const [newRepGender, setNewRepGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newRepTerritory, setNewRepTerritory] = useState('');
  const [newRepDistrict, setNewRepDistrict] = useState('Kolkata');
  const [newRepCommission, setNewRepCommission] = useState('10');
  const [newRepExperience, setNewRepExperience] = useState('2');
  const [newRepAadhar, setNewRepAadhar] = useState('');

  // File Upload Helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setDocImage(base64);
        setDocImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // =========================================================================
  // HANDLERS
  // =========================================================================

  // 1. Doctors
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocName('');
    setDocSpecialty('Cardiology & General Medicine');
    setDocQualification('MD, MBBS');
    setDocFee('800');
    setDocPhone('+91 9804222142');
    setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    setDocScheduleDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    setDocScheduleCustomDays('');
    setDocScheduleTiming('10:00 AM - 02:00 PM');
    setDocSchedule('Jan-Dec (All Months) • Mon-Sat • 10:00 AM - 02:00 PM');
    setDocChamber('OPD Chamber 102');
    setDocStatus('available');
    setDocImage('');
    setDocImagePreview('');
    setShowAddDoctorModal(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setDocName(doc.name);
    setDocSpecialty(doc.specialty);
    setDocQualification(doc.qualification || 'MD, MBBS');
    setDocFee(doc.fee.toString());
    setDocPhone(doc.contact);

    const raw = doc.scheduleTime || '10:00 AM - 02:00 PM (Mon-Sat)';
    setDocSchedule(raw);

    if (raw.includes('•')) {
      const parts = raw.split('•').map(p => p.trim());
      if (parts.length >= 3) {
        // Part 1: Months
        if (parts[0].includes('All Months') || parts[0].includes('Jan-Dec') || parts[0].includes('All Year')) {
          setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        } else {
          const parsedMonths = ALL_MONTHS.filter(m => parts[0].includes(m));
          setDocScheduleMonths(parsedMonths.length > 0 ? parsedMonths : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        }
        // Part 2: Days & Custom
        const daysPart = parts[1];
        const customMatch = daysPart.match(/\(Custom:\s*([^)]+)\)/i) || daysPart.match(/\[Custom:\s*([^\]]+)\]/i);
        if (customMatch) {
          setDocScheduleCustomDays(customMatch[1].trim());
        } else {
          setDocScheduleCustomDays('');
        }
        const parsedDays = ALL_DAYS.filter(d => daysPart.includes(d));
        setDocScheduleDays(parsedDays.length > 0 ? parsedDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
        // Part 3: Timing
        setDocScheduleTiming(parts[2] || '10:00 AM - 02:00 PM');
      } else {
        setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        setDocScheduleDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
        setDocScheduleCustomDays('');
        setDocScheduleTiming(raw);
      }
    } else {
      setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
      const parsedDays = ALL_DAYS.filter(d => raw.includes(d));
      setDocScheduleDays(parsedDays.length > 0 ? parsedDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      setDocScheduleCustomDays('');
      setDocScheduleTiming(raw.replace(/\([^)]+\)/g, '').trim() || '10:00 AM - 02:00 PM');
    }

    setDocChamber(doc.chamberRoom || 'OPD Room 101');
    setDocStatus(doc.status);
    setDocImage(doc.image || '');
    setDocImagePreview(doc.image || '');
    setShowAddDoctorModal(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    const compiledSchedule = compileDocScheduleString(docScheduleMonths, docScheduleDays, docScheduleCustomDays, docScheduleTiming);

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        specialty: docSpecialty,
        qualification: docQualification,
        fee: parseFloat(docFee) || 800,
        contact: docPhone,
        scheduleTime: compiledSchedule,
        chamberRoom: docChamber,
        status: docStatus,
        image: docImage || undefined,
      });
      showToast(`Doctor ${docName} schedule & profile updated!`);
    } else {
      addDoctor({
        branchId: activeBranch.id,
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        specialty: docSpecialty,
        qualification: docQualification,
        fee: parseFloat(docFee) || 800,
        contact: docPhone,
        scheduleTime: compiledSchedule,
        chamberRoom: docChamber,
        status: docStatus,
        image: docImage || undefined,
        registeredBy: `Hospital Receptionist (${activeBranch.name})`,
        registrationDate: new Date().toISOString().split('T')[0],
      });
      showToast(`Dr. ${docName} registered with 3-part schedule!`);
    }
    setShowAddDoctorModal(false);
  };

  const handleDeleteDoctor = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from this hospital's database?`)) {
      deleteDoctor(id);
      showToast(`Doctor ${name} removed from hospital records.`, 'error');
    }
  };

  // 2. Patients
  const handleOpenAddPatient = () => {
    setEditingPatient(null);
    setPatName('');
    setPatAge('35');
    setPatGender('Male');
    setPatBlood('O+');
    setPatPhone('+91 98765 43210');
    setPatCondition('General Consultation');
    setPatStatus('opd');
    setShowAddPatientModal(true);
  };

  const handleOpenEditPatient = (p: Patient) => {
    setEditingPatient(p);
    setPatName(p.name);
    setPatAge(p.age.toString());
    setPatGender(p.gender);
    setPatBlood(p.bloodGroup);
    setPatPhone(p.phone);
    setPatCondition(p.condition);
    setPatStatus(p.status);
    setShowAddPatientModal(true);
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patName) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        name: patName,
        age: parseInt(patAge) || 30,
        gender: patGender,
        bloodGroup: patBlood,
        phone: patPhone,
        condition: patCondition,
        status: patStatus,
      });
      showToast(`Patient ${patName} updated!`);
    } else {
      const generatedUhid = `UHID-${activeBranch.code}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
      addPatient({
        branchId: activeBranch.id,
        uhid: generatedUhid,
        name: patName,
        age: parseInt(patAge) || 30,
        gender: patGender,
        bloodGroup: patBlood,
        phone: patPhone,
        condition: patCondition,
        status: patStatus,
      });
      showToast(`Patient ${patName} registered with ${generatedUhid}!`);
    }
    setShowAddPatientModal(false);
  };

  const handleDeletePatient = (id: number, name: string) => {
    if (confirm(`Delete patient ${name} permanently from database?`)) {
      deletePatient(id);
      showToast(`Patient ${name} removed.`, 'error');
    }
  };

  // 3. Appointments
  const handleOpenAddApp = () => {
    setEditingApp(null);
    setAppPatientName('');
    setAppUhid('');
    setAppDoctorName(branchDoctors[0]?.name || 'Dr . Jiarul Haque');
    setAppDept(branchDoctors[0]?.specialty || 'General Medicine');
    setAppDate(new Date().toISOString().split('T')[0]);
    setAppTime('11:00 AM');
    setAppType('OPD');
    setAppStatus('Waiting');
    setShowAddAppModal(true);
  };

  const handleOpenEditApp = (app: Appointment) => {
    setEditingApp(app);
    setAppPatientName(app.patientName);
    setAppUhid(app.uhid);
    setAppDoctorName(app.doctorName);
    setAppDept(app.department);
    setAppDate(app.appointmentDate);
    setAppTime(app.appointmentTime);
    setAppType(app.type);
    setAppStatus(app.status);
    setShowAddAppModal(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPatientName) return;

    if (editingApp) {
      updateAppointment(editingApp.id, {
        patientName: appPatientName,
        uhid: appUhid || editingApp.uhid,
        doctorName: appDoctorName,
        department: appDept,
        appointmentDate: appDate,
        appointmentTime: appTime,
        type: appType,
        status: appStatus,
      });
      showToast(`Appointment for ${appPatientName} updated!`);
    } else {
      const uhidToUse = appUhid || `UHID-${activeBranch.code}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
      addAppointment({
        branchId: activeBranch.id,
        patientName: appPatientName,
        uhid: uhidToUse,
        doctorName: appDoctorName,
        department: appDept,
        appointmentDate: appDate,
        appointmentTime: appTime,
        type: appType,
        status: appStatus,
      });
      showToast(`Token booked for ${appPatientName}!`);
    }
    setShowAddAppModal(false);
  };

  const handleDeleteAppointment = (id: number, patientName: string) => {
    if (confirm(`Cancel and delete appointment for ${patientName}?`)) {
      deleteAppointment(id);
      showToast(`Appointment deleted.`, 'error');
    }
  };

  // 4. Bed Matrix
  const handleOpenAddBed = () => {
    setEditingBed(null);
    setBedNumber(`B-${activeBranch.code}-${branchBeds.length + 101}`);
    setBedWard('general');
    setBedDailyCharge('1500');
    setBedStatus('available');
    setShowAddBedModal(true);
  };

  const handleOpenEditBed = (b: Bed) => {
    setEditingBed(b);
    setBedNumber(b.bedNumber);
    setBedWard(b.wardType);
    setBedDailyCharge(b.dailyCharge.toString());
    setBedStatus(b.status);
    setShowAddBedModal(true);
  };

  const handleSaveBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedNumber) return;

    if (editingBed) {
      updateBed(editingBed.id, {
        bedNumber,
        wardType: bedWard,
        dailyCharge: parseFloat(bedDailyCharge) || 1500,
        status: bedStatus,
      });
      showToast(`Bed ${bedNumber} updated!`);
    } else {
      addBed({
        branchId: activeBranch.id,
        bedNumber,
        wardType: bedWard,
        dailyCharge: parseFloat(bedDailyCharge) || 1500,
        status: bedStatus,
      });
      showToast(`Bed ${bedNumber} added to ${activeBranch.code}!`);
    }
    setShowAddBedModal(false);
  };

  const handleOpenAllocateBed = (b: Bed) => {
    setAllocatingBed(b);
    setBedPatientName(b.patientName || '');
    setBedPatientUhid(b.patientUhid || '');
    setBedAdmissionDate(b.admissionDate || new Date().toISOString().split('T')[0]);
    setBedExpectedDischarge(b.expectedDischargeDate || '');
    setBedExpectedReleaseTime(b.expectedReleaseTime || '02:00 PM');
    setBedDoctor(b.assignedDoctor || branchDoctors[0]?.name || 'Dr . Jiarul Haque');
  };

  const handleSaveBedAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingBed || !bedPatientName) return;

    updateBed(allocatingBed.id, {
      status: 'occupied',
      patientName: bedPatientName,
      patientUhid: bedPatientUhid || `UHID-${activeBranch.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionDate: bedAdmissionDate,
      expectedDischargeDate: bedExpectedDischarge,
      expectedReleaseTime: bedExpectedReleaseTime,
      assignedDoctor: bedDoctor,
    });

    showToast(`Bed ${allocatingBed.bedNumber} allocated to ${bedPatientName}!`);
    setAllocatingBed(null);
  };

  const handleVacateBed = (b: Bed) => {
    if (confirm(`Discharge patient and vacate Bed ${b.bedNumber}?`)) {
      updateBed(b.id, {
        status: 'available',
        patientName: undefined,
        patientUhid: undefined,
        admissionDate: undefined,
        expectedDischargeDate: undefined,
        expectedReleaseTime: undefined,
        assignedDoctor: undefined,
      });
      showToast(`Bed ${b.bedNumber} is now vacant & available.`);
    }
  };

  const handleDeleteBed = (id: number, bedNum: string) => {
    if (confirm(`Permanently remove Bed ${bedNum}?`)) {
      deleteBed(id);
      showToast(`Bed ${bedNum} removed.`, 'error');
    }
  };

  // 5. Pharmacy
  const handleOpenAddMed = () => {
    setEditingMed(null);
    setMedName('');
    setMedCategory('Antibiotic');
    setMedStock('100');
    setMedPrice('45');
    setMedExpiry('2027-12-31');
    setMedBatch('BT-9921');
    setShowAddMedModal(true);
  };

  const handleOpenEditMed = (m: Medicine) => {
    setEditingMed(m);
    setMedName(m.name);
    setMedCategory(m.category);
    setMedStock(m.stock.toString());
    setMedPrice(m.price.toString());
    setMedExpiry(m.expiryDate);
    setMedBatch(m.batchNumber || 'BT-101');
    setShowAddMedModal(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    if (editingMed) {
      updateMedicine(editingMed.id, {
        name: medName,
        category: medCategory,
        stock: parseInt(medStock) || 0,
        price: parseFloat(medPrice) || 0,
        expiryDate: medExpiry,
        batchNumber: medBatch,
      });
      showToast(`Medicine ${medName} updated!`);
    } else {
      addMedicine({
        branchId: activeBranch.id,
        name: medName,
        category: medCategory,
        stock: parseInt(medStock) || 0,
        price: parseFloat(medPrice) || 0,
        expiryDate: medExpiry,
        batchNumber: medBatch,
      });
      showToast(`Medicine ${medName} added to pharmacy inventory!`);
    }
    setShowAddMedModal(false);
  };

  const handleDeleteMedicine = (id: number, name: string) => {
    if (confirm(`Delete ${name} from pharmacy stock?`)) {
      deleteMedicine(id);
      showToast(`Medicine ${name} removed.`, 'error');
    }
  };

  // 6. Diagnostics & Laboratory
  const handleOpenAddLab = () => {
    setEditingLab(null);
    setLabPatientName('');
    setLabPatientUhid('');
    setLabTestName('Complete Blood Count (CBC)');
    setLabCategory('Hematology');
    setLabDoctorName(branchDoctors[0]?.name || 'Dr . Jiarul Haque');
    setLabStatus('pending');
    setLabPrice('450');
    setShowAddLabModal(true);
  };

  const handleOpenEditLab = (l: LabRequest) => {
    setEditingLab(l);
    setLabPatientName(l.patientName);
    setLabPatientUhid(l.patientUhid || '');
    setLabTestName(l.testName);
    setLabCategory(l.category);
    setLabDoctorName(l.doctorName);
    setLabStatus(l.status);
    setLabPrice((l.testPrice || 450).toString());
    setShowAddLabModal(true);
  };

  const handleSaveLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labPatientName) return;

    if (editingLab) {
      updateLabRequest(editingLab.id, {
        patientName: labPatientName,
        patientUhid: labPatientUhid || editingLab.patientUhid,
        testName: labTestName,
        category: labCategory,
        doctorName: labDoctorName,
        status: labStatus,
        testPrice: parseFloat(labPrice) || 450,
      });
      showToast(`Lab test for ${labPatientName} updated!`);
    } else {
      addLabRequest({
        branchId: activeBranch.id,
        requestNumber: `LAB-${activeBranch.code}-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName: labPatientName,
        patientUhid: labPatientUhid || `UHID-${activeBranch.code}-${Math.floor(1000 + Math.random() * 9000)}`,
        testName: labTestName,
        category: labCategory,
        doctorName: labDoctorName,
        status: labStatus,
        testPrice: parseFloat(labPrice) || 450,
      });
      showToast(`Diagnostic order created for ${labPatientName}!`);
    }
    setShowAddLabModal(false);
  };

  const handleDeleteLab = (id: number, reqNum: string) => {
    if (confirm(`Delete lab request ${reqNum}?`)) {
      deleteLabRequest(id);
      showToast(`Lab order deleted.`, 'error');
    }
  };

  // 7. Marketing Reps & Join Requests Handlers
  const handleOpenAddRep = () => {
    setNewRepName('');
    setNewRepPhone('');
    setNewRepEmail('');
    setNewRepGender('Male');
    setNewRepTerritory(`${activeBranch.name} & Surrounding District`);
    setNewRepDistrict(activeBranch.location.split(',')[0] || 'Kolkata');
    setNewRepCommission('10');
    setNewRepExperience('2');
    setNewRepAadhar('');
    setShowAddRepModal(true);
  };

  const handleOnboardNewRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepName.trim() || !newRepPhone.trim()) {
      showToast('Representative Full Name and Phone Number are required', 'error');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedRefId = `REF-MKT-B${activeBranch.id}-${randomSuffix}`;
    const approvalDate = new Date().toISOString().split('T')[0];

    addMarketingRepresentative({
      referenceId: generatedRefId,
      branchId: activeBranch.id,
      branchCode: activeBranch.code,
      branchName: activeBranch.name,
      name: newRepName.trim(),
      gender: newRepGender,
      fatherOrMotherName: 'Guardian',
      dob: '1995-01-01',
      bloodGroup: 'O+',
      aadharNumber: newRepAadhar.trim() || 'XXXX-XXXX-XXXX',
      panNumber: 'XXXXX0000X',
      drivingLicenceNumber: 'DL-XXXXX',
      address: `${newRepTerritory.trim() || 'District Area'}, ${newRepDistrict}`,
      pinCode: '700157',
      district: newRepDistrict,
      state: 'West Bengal',
      country: 'India',
      email: newRepEmail.trim() || `rep.${newRepName.toLowerCase().replace(/[^a-z0-9]/g, '')}@medix.local`,
      emailVerified: true,
      phone: newRepPhone.trim(),
      territory: newRepTerritory.trim() || `${activeBranch.name} Catchment Zone`,
      experienceYears: parseInt(newRepExperience, 10) || 1,
      status: 'active',
      referredPatientsCount: 0,
      totalCommissionEarned: 0,
      pendingPayout: 0,
      commissionRate: newRepCommission.includes('%') ? newRepCommission : `${newRepCommission}%`,
      hiredBy: `Reception Desk (${activeBranch.name})`
    });

    showToast(`✅ Marketing Representative ${newRepName} onboarded with ID: ${generatedRefId}`, 'success');
    setShowAddRepModal(false);
  };

  const handleApprovePendingRequest = (req: MarketingJoinRequest) => {
    const generatedId = superAdminFinalApproveMarketingRequest(req.id, `Reception Desk (${activeBranch.name})`);
    showToast(`✅ Approved! Marketing Representative ID Issued: ${generatedId || 'Active'}`, 'success');
    setViewingRequest(null);
  };

  const handleRejectPendingRequest = (req: MarketingJoinRequest) => {
    if (confirm(`Reject Marketing join request for ${req.name}?`)) {
      rejectMarketingJoinRequest(req.id);
      showToast(`Marketing application for ${req.name} rejected.`, 'error');
      setViewingRequest(null);
    }
  };

  const handleToggleRepStatus = (rep: MarketingRepresentative) => {
    const newStatus = rep.status === 'active' ? 'inactive' : 'active';
    updateMarketingRepresentative(rep.id, { status: newStatus });
    showToast(`Marketing Rep ${rep.name} status updated to ${newStatus.toUpperCase()}`);
  };

  const handleCopyId = (idString: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(idString);
      showToast(`📋 Copied ID: ${idString}`, 'success');
    }
  };

  const handleOpenEditRep = (r: MarketingRepresentative) => {
    setEditingRep(r);
    setRepName(r.name);
    setRepPhone(r.phone);
    setRepTerritory(r.territory);
    setRepCommission(r.commissionRate || '10%');
  };

  const handleSaveRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRep) return;

    updateMarketingRepresentative(editingRep.id, {
      name: repName,
      phone: repPhone,
      territory: repTerritory,
      commissionRate: repCommission.includes('%') ? repCommission : `${repCommission}%`,
    });

    showToast(`Marketing Rep ${repName} updated!`);
    setEditingRep(null);
  };

  const handleFireRep = (id: number, name: string) => {
    if (confirm(`Fire and remove Marketing Rep ${name} completely?`)) {
      deleteMarketingRepresentative(id);
      showToast(`Marketing Rep ${name} fired and purged from database.`, 'error');
    }
  };

  // 8. Referrals & Transfers Handlers
  const handleAcknowledgeReferral = (ref: HospitalReferral) => {
    updateHospitalReferralStatus(ref.id, 'ACKNOWLEDGED');
    showToast(`✅ Referral #${ref.referralId} for ${ref.patientName} acknowledged by Reception Desk!`, 'success');
  };

  const handleAdmitReferralPatient = (ref: HospitalReferral) => {
    const existingPat = branchPatients.find(p => p.uhid === ref.uhid || p.name.toLowerCase() === ref.patientName.toLowerCase());
    if (!existingPat) {
      addPatient({
        branchId: activeBranch.id,
        name: ref.patientName,
        uhid: ref.uhid,
        age: ref.patientAge,
        gender: ref.patientGender,
        bloodGroup: ref.patientBlood || 'B+',
        phone: ref.patientPhone || '+91 98765 43210',
        address: 'Referred from Doctor Application',
        status: 'admitted',
        condition: ref.diagnosis,
        admittedDate: new Date().toISOString().split('T')[0],
        registeredBy: `Inter-Hospital Transfer (${ref.referringDoctorName})`,
      });
    }

    const availableBed = branchBeds.find(b => b.status === 'available');
    if (availableBed) {
      updateBed(availableBed.id, {
        status: 'occupied',
        patientName: ref.patientName,
        patientUhid: ref.uhid,
        admissionDate: new Date().toISOString().split('T')[0],
        expectedDischargeDate: 'In 3 Days',
        expectedReleaseTime: '12:00 PM',
        assignedDoctor: ref.targetDoctorName || branchDoctors[0]?.name || 'Dr . Jiarul Haque',
      });
      updateHospitalReferralStatus(ref.id, 'ADMITTED', `Admitted to Bed ${availableBed.bedNumber} (${availableBed.wardType.toUpperCase()})`);
      showToast(`🛏️ ${ref.patientName} directly admitted to Bed ${availableBed.bedNumber}!`, 'success');
    } else {
      updateHospitalReferralStatus(ref.id, 'ADMITTED', 'Direct Admission Queue Allocated');
      showToast(`🛏️ ${ref.patientName} admitted to IPD Triage Queue!`, 'success');
    }
  };

  const handleCreateOpdTokenForReferral = (ref: HospitalReferral) => {
    const assignedDoctor = branchDoctors.find(d => d.name === ref.targetDoctorName) || branchDoctors[0];
    const doctorName = assignedDoctor ? assignedDoctor.name : (ref.targetDoctorName || 'Dr . Jiarul Haque');
    const dept = assignedDoctor ? assignedDoctor.specialty : ref.targetDepartment;

    addAppointment({
      branchId: activeBranch.id,
      patientName: ref.patientName,
      uhid: ref.uhid,
      doctorName: doctorName,
      department: dept,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: 'Immediate OPD Queue',
      type: ref.urgencyLevel === 'EMERGENCY' ? 'Emergency' : 'OPD',
      status: 'Waiting',
    });

    updateHospitalReferralStatus(ref.id, 'ACKNOWLEDGED', `OPD Priority Token Generated for ${doctorName}`);
    showToast(`🩺 Priority OPD Token generated for ${ref.patientName} under ${doctorName}!`, 'success');
  };

  const handleDeleteReferral = (id: string | number, token: string) => {
    if (confirm(`Remove referral receipt #${token} from reception queue?`)) {
      deleteHospitalReferral(id);
      showToast(`Referral receipt #${token} archived.`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-20">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 border ${
              toastMsg.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-500'
                : 'bg-rose-900 text-rose-100 border-rose-500'
            }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <AlertTriangle className="w-4 h-4 text-rose-300" />}
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* TOP COMMAND HEADER */}
      <div className="bg-[#046a4e] text-white px-4 sm:px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-emerald-800 text-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-600">
                Front Desk Operations
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded-full">
                {activeBranch.code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-emerald-300" />
              <span>Receptionist Central Command Hub</span>
            </h1>
            <p className="text-xs text-emerald-100 mt-1">
              Hospital Front Desk: Full real-time CRUD & scheduling for Doctors, Patients, Beds, Appointments, POS & Diagnostics.
            </p>
          </div>

          {/* Branch Switcher (Dynamic for any hospital branch) */}
          <div className="bg-emerald-950/70 p-3 rounded-2xl border border-emerald-700 flex items-center gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Hospital Branch</p>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-emerald-900 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none border border-emerald-600 cursor-pointer mt-0.5"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
                {userRole === 'super_admin' && <option value="all">🌐 All Hospital Nodes (HQ View)</option>}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-4 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Doctors</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchDoctors.length}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Patients</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchPatients.length}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Appointments</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchAppointments.length}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Beds (IPD)</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {branchBeds.filter(b => b.status === 'occupied').length}/{branchBeds.length}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pharmacy</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchMedicines.length} items</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Lab Orders</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchLabRequests.length}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Marketing</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {branchMarketingReps.filter(r => r.status === 'active').length} Active
            </p>
            <p className="text-[10px] text-amber-600 font-bold">
              {branchMarketingRequests.filter(r => r.status.startsWith('pending')).length} Pending
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm bg-linear-to-br from-white to-emerald-50/50">
            <p className="text-[10px] font-black text-[#046a4e] uppercase flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              <span>Referrals</span>
            </p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchReferrals.length} recpts</p>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 w-full">
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'doctors' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>1. Doctors & OPD</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchDoctors.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'patients' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Patients (EHR)</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchPatients.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'appointments' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>3. Appointments & Tokens</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchAppointments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('beds')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'beds' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>4. IPD & Bed Matrix</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchBeds.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'pharmacy' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>5. Pharmacy & POS</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchMedicines.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('laboratory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'laboratory' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>6. Diagnostics & Labs</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchLabRequests.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer relative ${
              activeTab === 'marketing' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>7. Marketing Reps</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">
              {branchMarketingReps.filter(r => r.status === 'active').length}
            </span>
            {branchMarketingRequests.some(r => r.status.startsWith('pending')) && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-black animate-pulse" title="Pending Applications">
                {branchMarketingRequests.filter(r => r.status.startsWith('pending')).length} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer relative ${
              activeTab === 'referrals' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <span>8. App Referrals</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                branchReferrals.some(r => r.urgencyLevel === 'EMERGENCY' && r.status !== 'ADMITTED')
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-black/10'
              }`}
            >
              {branchReferrals.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 w-full">

        {/* ========================================================================= */}
        {/* TAB 1: DOCTORS & OPD DESK */}
        {/* ========================================================================= */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#046a4e]" />
                  <span>Doctors & OPD Roster Management</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Receptionist controls: Register doctors, update schedules/fees (₹), upload/change photos, or delete.
                </p>
              </div>
              <button
                onClick={handleOpenAddDoctor}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register New Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchDoctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3.5">
                    {doc.image ? (
                      <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-emerald-300 shrink-0 bg-slate-50 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-emerald-800 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                        {doc.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            doc.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : doc.status === 'busy'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <span className="text-xs font-black text-[#046a4e] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          ₹{doc.fee}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1 truncate">{doc.name}</h3>
                      <p className="text-xs text-[#046a4e] font-bold truncate">{doc.specialty}</p>
                      {doc.qualification && <p className="text-[10px] text-slate-400 font-medium">{doc.qualification}</p>}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.scheduleTime || '10:00 AM - 02:00 PM (Daily)'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.chamberRoom || 'OPD Room 102'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.contact || '+91 9804222142'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditDoctor(doc)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit & Schedule</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition cursor-pointer"
                      title="Delete Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PATIENTS (EHR) */}
        {/* ========================================================================= */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#046a4e]" />
                  <span>Patient EHR & Reception Records</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Register new walk-in patients, update conditions, blood groups, or discharge.
                </p>
              </div>
              <button
                onClick={handleOpenAddPatient}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register New Patient</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">UHID</th>
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Age / Gender</th>
                      <th className="p-4">Blood</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Condition</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {branchPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono font-bold text-[#046a4e]">{p.uhid}</td>
                        <td className="p-4 font-extrabold text-slate-900">{p.name}</td>
                        <td className="p-4">{p.age} yrs • {p.gender}</td>
                        <td className="p-4 font-bold text-rose-600">{p.bloodGroup}</td>
                        <td className="p-4 font-mono">{p.phone}</td>
                        <td className="p-4">{p.condition}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              p.status === 'admitted'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : p.status === 'opd'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditPatient(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(p.id, p.name)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: APPOINTMENTS & TOKENS */}
        {/* ========================================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#046a4e]" />
                  <span>Appointments Queue & Token Generation</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Book walk-in tokens, reschedule timings, assign doctors, or mark completed.
                </p>
              </div>
              <button
                onClick={handleOpenAddApp}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Book New Token</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchAppointments.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="h-9 w-9 rounded-xl bg-[#046a4e] text-white font-black text-sm flex items-center justify-center shadow-xs">
                      #{app.tokenNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        app.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : app.status === 'In Consultation'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : app.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{app.patientName}</h3>
                    <p className="text-xs font-mono text-slate-400">{app.uhid}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-800 font-bold">🩺 {app.doctorName}</p>
                    <p className="text-slate-500 font-medium">🏢 {app.department}</p>
                    <p className="text-slate-600 font-bold flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.appointmentDate} at {app.appointmentTime}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditApp(app)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center cursor-pointer"
                    >
                      Edit Slot
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(app.id, app.patientName)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer"
                      title="Cancel Token"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: IPD & BED MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'beds' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-[#046a4e]" />
                  <span>Inpatient (IPD) Bed Matrix & Occupancy Tracking</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Track bed availability, release times, allocate patients with admission duration, or add new beds.
                </p>
              </div>
              <button
                onClick={handleOpenAddBed}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Hospital Bed</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchBeds.map((bed) => (
                <div
                  key={bed.id}
                  className={`rounded-2xl border p-5 shadow-sm space-y-3.5 flex flex-col justify-between ${
                    bed.status === 'occupied'
                      ? 'bg-rose-50/50 border-rose-200'
                      : bed.status === 'available'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BedDouble
                        className={`w-5 h-5 ${
                          bed.status === 'occupied'
                            ? 'text-rose-600'
                            : bed.status === 'available'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      />
                      <span className="font-extrabold text-slate-900 text-sm">{bed.bedNumber}</span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        bed.status === 'occupied'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : bed.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {bed.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-medium">
                      <span>Ward Type:</span>
                      <span className="font-black uppercase text-slate-900">{bed.wardType} Ward</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 font-medium">
                      <span>Daily Tariff:</span>
                      <span className="font-black text-[#046a4e]">₹{bed.dailyCharge}/day</span>
                    </div>
                  </div>

                  {/* Bed Occupant Info */}
                  {bed.status === 'occupied' ? (
                    <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                      <p className="font-black text-rose-950 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-600" />
                        <span>{bed.patientName || 'Admitted Patient'}</span>
                      </p>
                      {bed.patientUhid && (
                        <p className="font-mono text-[10px] text-slate-400 font-bold">{bed.patientUhid}</p>
                      )}
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 space-y-0.5">
                        <p>🗓️ Admitted: <span className="font-bold">{bed.admissionDate || 'Today'}</span></p>
                        {bed.expectedReleaseTime && (
                          <p className="text-amber-800 font-bold">
                            ⏰ Release Time: {bed.expectedReleaseTime} ({bed.expectedDischargeDate || 'Discharge Day'})
                          </p>
                        )}
                        {bed.assignedDoctor && <p className="text-slate-500">👨‍⚕️ {bed.assignedDoctor}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-bold">
                      ✨ Ready for New Admission
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    {bed.status === 'occupied' ? (
                      <button
                        onClick={() => handleVacateBed(bed)}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                      >
                        Vacate / Discharge
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAllocateBed(bed)}
                        className="flex-1 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                      >
                        Admit Patient
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEditBed(bed)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer"
                      title="Edit Bed Settings"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBed(bed.id, bed.bedNumber)}
                      className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-slate-200 transition cursor-pointer"
                      title="Delete Bed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PHARMACY & POS */}
        {/* ========================================================================= */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#046a4e]" />
                  <span>Pharmacy Inventory & Price Structure</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Update stock quantities, unit price (₹), batches, expiry dates, or add new medicines.
                </p>
              </div>
              <button
                onClick={handleOpenAddMed}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Medicine Item</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Medicine Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Stock Units</th>
                      <th className="p-4">Unit Price (₹)</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4">Batch</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {branchMedicines.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-extrabold text-slate-900">{med.name}</td>
                        <td className="p-4 text-slate-500">{med.category}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              med.stock < 20
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {med.stock} in stock
                          </span>
                        </td>
                        <td className="p-4 font-black text-[#046a4e]">₹{med.price}</td>
                        <td className="p-4 font-mono text-slate-500">{med.expiryDate}</td>
                        <td className="p-4 font-mono text-slate-400">{med.batchNumber || 'BT-900'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditMed(med)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(med.id, med.name)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DIAGNOSTICS & LABORATORY */}
        {/* ========================================================================= */}
        {activeTab === 'laboratory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#046a4e]" />
                  <span>Diagnostic Lab Orders & Test Matrix</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage patient lab orders, advance test progress (Pending → Processing → Ready), or add tests.
                </p>
              </div>
              <button
                onClick={handleOpenAddLab}
                className="px-4 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Diagnostic Order</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchLabRequests.map((lab) => (
                <div key={lab.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#046a4e] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {lab.requestNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        lab.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : lab.status === 'processing'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {lab.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{lab.testName}</h3>
                    <p className="text-xs text-slate-500">{lab.category} • Ref: {lab.doctorName}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <p className="text-slate-800 font-bold">👤 Patient: {lab.patientName}</p>
                    <p className="text-slate-500 font-medium">Cost: <span className="font-black text-[#046a4e]">₹{lab.testPrice || 450}</span></p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditLab(lab)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center cursor-pointer"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDeleteLab(lab.id, lab.requestNumber)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer"
                      title="Delete Lab Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MARKETING REPRESENTATIVES & REFERRAL AGENTS (COMPLETE LIVE HUB) */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            {/* Header & Live Metric Summary Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 bg-emerald-50 text-[#046a4e] rounded-2xl border border-emerald-200 shadow-xs">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Field Marketing Representatives & Referral Agents</span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                      Live Hospital CRM
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage active field marketing agents (PROs), track unique Marketing Reference IDs, review pending join requests, and monitor commission tiers for <strong className="text-slate-800">{activeBranch.name}</strong>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenAddRep}
                  className="px-4 py-2.5 bg-linear-to-r from-[#046a4e] to-emerald-700 hover:from-[#03523c] hover:to-emerald-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Onboard Marketing Rep</span>
                </button>
              </div>
            </div>

            {/* Metrics Chips Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Field Agents</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xl font-black text-slate-900">
                    {branchMarketingReps.filter(r => r.status === 'active').length}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active IDs
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Applications</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <p className="text-xl font-black text-amber-700">
                    {branchMarketingRequests.filter(r => r.status.startsWith('pending')).length}
                  </p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Awaiting Review
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Branch</p>
                <p className="text-sm font-black text-slate-900 mt-1 truncate">
                  {activeBranch.code}
                </p>
                <p className="text-[10px] font-medium text-slate-500 truncate">{activeBranch.name}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Default Commission</p>
                <p className="text-xl font-black text-[#046a4e] mt-1">10%</p>
                <p className="text-[10px] font-bold text-slate-500">Per Inpatient Referral</p>
              </div>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setMarketingFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    marketingFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({branchMarketingReps.length + branchMarketingRequests.filter(r => r.status.startsWith('pending')).length})
                </button>

                <button
                  onClick={() => setMarketingFilter('active')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    marketingFilter === 'active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Active Reps ({branchMarketingReps.filter(r => r.status === 'active').length})</span>
                </button>

                <button
                  onClick={() => setMarketingFilter('pending')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    marketingFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  <span>Pending ({branchMarketingRequests.filter(r => r.status.startsWith('pending')).length})</span>
                </button>

                <button
                  onClick={() => setMarketingFilter('inactive')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    marketingFilter === 'inactive'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inactive / Suspended ({branchMarketingReps.filter(r => r.status !== 'active').length})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Name, ID (REF-MKT-..), Phone, Territory..."
                  value={marketingSearchQuery}
                  onChange={(e) => setMarketingSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#046a4e] focus:bg-white transition"
                />
                {marketingSearchQuery && (
                  <button
                    onClick={() => setMarketingSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION A: PENDING JOIN APPLICATIONS (KE PENDING E ACCHE) */}
            {/* ========================================================================= */}
            {(marketingFilter === 'all' || marketingFilter === 'pending') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending Candidate Applications ({branchMarketingRequests.filter(r => r.status.startsWith('pending')).length})</span>
                  </h3>
                </div>

                {branchMarketingRequests.filter(r => r.status.startsWith('pending')).length === 0 ? (
                  marketingFilter === 'pending' ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2 shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">No Pending Applications</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        All marketing candidate applications for {activeBranch.name} have been reviewed. No pending requests.
                      </p>
                    </div>
                  ) : null
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branchMarketingRequests
                      .filter(r => r.status.startsWith('pending'))
                      .filter(r => {
                        const q = marketingSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          r.name.toLowerCase().includes(q) ||
                          `APP-REQ-${r.id}`.toLowerCase().includes(q) ||
                          r.phone.includes(q) ||
                          r.email.toLowerCase().includes(q) ||
                          r.territory.toLowerCase().includes(q)
                        );
                      })
                      .map((req) => (
                        <div
                          key={req.id}
                          className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                        >
                          {/* Top Status Bar */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                              APP-REQ-#{req.id}
                            </span>
                            <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              <span>{req.status === 'pending_super_admin_approval' ? 'Pending Super Admin' : 'Pending Review'}</span>
                            </span>
                          </div>

                          {/* Candidate Bio */}
                          <div>
                            <h4 className="font-black text-slate-900 text-sm">{req.name}</h4>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{req.territory} ({req.district})</span>
                            </p>
                          </div>

                          {/* Contact & Application Data */}
                          <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 text-xs space-y-1.5">
                            <p className="text-slate-700 font-semibold flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`tel:${req.phone}`} className="hover:text-amber-800 font-mono">{req.phone}</a>
                            </p>
                            <p className="text-slate-700 font-semibold flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${req.email}`} className="hover:text-amber-800">{req.email}</a>
                            </p>
                            <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px]">
                              <span className="text-amber-800 font-bold">Target: {req.expectedMonthlyReferrals || 5} Ref/Mo</span>
                              <span className="text-slate-500 font-medium">Applied: {req.appliedDate}</span>
                            </div>
                            {req.qualificationsOrNotes && (
                              <p className="text-[10px] text-slate-600 bg-white/70 p-2 rounded-xl border border-amber-100 mt-1 italic">
                                &ldquo;{req.qualificationsOrNotes}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleApprovePendingRequest(req)}
                              className="flex-1 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white rounded-xl text-xs font-black text-center cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Issue ID</span>
                            </button>
                            <button
                              onClick={() => setViewingRequest(req)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition"
                              title="View Full Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectPendingRequest(req)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer transition"
                              title="Reject Application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION B: ACTIVE MARKETING REPRESENTATIVES (KE ACTIVE ACCHE) */}
            {/* ========================================================================= */}
            {(marketingFilter === 'all' || marketingFilter === 'active' || marketingFilter === 'inactive') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#046a4e] flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                    <UserCheck className="w-3.5 h-3.5 text-[#046a4e]" />
                    <span>Registered Field Marketing Agents ({branchMarketingReps.length})</span>
                  </h3>
                </div>

                {branchMarketingReps.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#046a4e] mx-auto flex items-center justify-center border border-emerald-200">
                      <Users className="w-7 h-7" />
                    </div>
                    <h4 className="font-black text-slate-900 text-base">No Marketing Representatives Registered Yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      There are currently no active marketing representatives registered for <strong>{activeBranch.name}</strong>. Click below to onboard a real field agent and generate an official Reference ID.
                    </p>
                    <button
                      onClick={handleOpenAddRep}
                      className="px-5 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow-md transition cursor-pointer mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Onboard First Marketing Rep</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branchMarketingReps
                      .filter(rep => {
                        if (marketingFilter === 'active') return rep.status === 'active';
                        if (marketingFilter === 'inactive') return rep.status !== 'active';
                        return true;
                      })
                      .filter(rep => {
                        const q = marketingSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          rep.name.toLowerCase().includes(q) ||
                          rep.referenceId.toLowerCase().includes(q) ||
                          rep.phone.includes(q) ||
                          rep.email.toLowerCase().includes(q) ||
                          rep.territory.toLowerCase().includes(q)
                        );
                      })
                      .map((rep) => (
                        <div
                          key={rep.id}
                          className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                        >
                          {/* Card Header: Reference ID & Status Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleCopyId(rep.referenceId)}
                              className="font-mono text-xs font-black text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5 transition cursor-pointer"
                              title="Click to copy Marketing Reference ID"
                            >
                              <span>{rep.referenceId}</span>
                              <Copy className="w-3 h-3 text-purple-600" />
                            </button>

                            <span
                              className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                rep.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${rep.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span>{rep.status}</span>
                            </span>
                          </div>

                          {/* Rep Name & Territory */}
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                              <span>{rep.name}</span>
                              <span className="text-[10px] font-normal text-slate-400">({rep.gender || 'Agent'})</span>
                            </h4>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{rep.territory}</span>
                            </p>
                          </div>

                          {/* Contact & Performance Matrix */}
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                            <p className="text-slate-700 font-semibold flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`tel:${rep.phone}`} className="hover:text-[#046a4e] font-mono">{rep.phone}</a>
                            </p>
                            <p className="text-slate-700 font-semibold flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${rep.email}`} className="hover:text-[#046a4e]">{rep.email}</a>
                            </p>
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 text-xs">
                              <span className="text-[#046a4e] font-black">
                                Commission: {rep.commissionRate || '10%'}
                              </span>
                              <span className="text-slate-600 font-bold">
                                {rep.referredPatientsCount || 0} Referred
                              </span>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => handleOpenEditRep(rep)}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center cursor-pointer transition"
                            >
                              Edit Info
                            </button>
                            <button
                              onClick={() => setViewingRep(rep)}
                              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 cursor-pointer transition"
                              title="View Marketing ID Card / Dossier"
                            >
                              <IdCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleRepStatus(rep)}
                              className={`p-1.5 rounded-xl border cursor-pointer transition ${
                                rep.status === 'active'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              }`}
                              title={rep.status === 'active' ? "Suspend Representative" : "Re-activate Representative"}
                            >
                              {rep.status === 'active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleFireRep(rep.id, rep.name)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer transition"
                              title="Fire / Purge Representative"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: INCOMING APP REFERRALS & TRANSFER RECEIPTS */}
        {/* ========================================================================= */}
        {activeTab === 'referrals' && (
          <div className="space-y-5">
            {/* Header & Live Stream Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-50 text-[#046a4e] rounded-2xl border border-emerald-200">
                    <ArrowRightLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>Incoming App Referrals & Transfer Receipts</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                        Live App Sync
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Patients referred from the Doctor Mobile/Web Application to <strong className="text-slate-800">{activeBranch.name}</strong>. Receipts update automatically in real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Received</p>
                  <p className="text-sm font-black text-slate-900">{branchReferrals.length}</p>
                </div>
                <div className="px-3.5 py-2 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                  <p className="text-[10px] font-bold text-rose-500 uppercase">Emergency Code Red</p>
                  <p className="text-sm font-black text-rose-700">
                    {branchReferrals.filter(r => r.urgencyLevel === 'EMERGENCY').length}
                  </p>
                </div>
                <div className="px-3.5 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <p className="text-[10px] font-bold text-amber-500 uppercase">Urgent</p>
                  <p className="text-sm font-black text-amber-700">
                    {branchReferrals.filter(r => r.urgencyLevel === 'URGENT').length}
                  </p>
                </div>
                <div className="px-3.5 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Admitted/Accepted</p>
                  <p className="text-sm font-black text-emerald-800">
                    {branchReferrals.filter(r => r.status === 'ADMITTED' || r.status === 'ACKNOWLEDGED').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-700 mr-1">Urgency:</span>
                {(['all', 'EMERGENCY', 'URGENT', 'ROUTINE'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setReferralUrgencyFilter(u)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      referralUrgencyFilter === u
                        ? u === 'EMERGENCY'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : u === 'URGENT'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-[#046a4e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {u === 'all' ? 'All Urgencies' : u}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-700 mr-1">Status:</span>
                {(['all', 'DISPATCHED', 'ACKNOWLEDGED', 'ADMITTED'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setReferralStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      referralStatusFilter === s
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'All Status' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Referrals List / Empty State */}
            {branchReferrals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                <div className="h-16 w-16 bg-emerald-50 text-[#046a4e] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <ArrowRightLeft className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Patient Referrals Yet for {activeBranch.name}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When doctors refer patients to this hospital from the Doctor App, their full clinical transfer receipts and telemetry data will arrive here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {branchReferrals
                  .filter(r => (referralUrgencyFilter === 'all' || r.urgencyLevel === referralUrgencyFilter))
                  .filter(r => (referralStatusFilter === 'all' || r.status === referralStatusFilter))
                  .map((ref) => {
                    const isEmergency = ref.urgencyLevel === 'EMERGENCY';
                    const isUrgent = ref.urgencyLevel === 'URGENT';
                    return (
                      <div
                        key={ref.id}
                        className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-sm hover:shadow-md ${
                          isEmergency ? 'border-rose-300 ring-1 ring-rose-200' : isUrgent ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                          {/* Left: Token & Patient Info */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-black text-[#046a4e] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                                <QrCode className="w-3.5 h-3.5" />
                                <span>{ref.referralId}</span>
                              </span>

                              <span
                                className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl border flex items-center gap-1 ${
                                  isEmergency
                                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                                    : isUrgent
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                                }`}
                              >
                                <HeartPulse className="w-3.5 h-3.5" />
                                <span>{ref.urgencyLevel} TRANSFER</span>
                              </span>

                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                  ref.status === 'ADMITTED'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : ref.status === 'ACKNOWLEDGED'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-purple-100 text-purple-800 border-purple-300'
                                }`}
                              >
                                {ref.status}
                              </span>

                              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{ref.receiptDate || 'Today, Just Now'}</span>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-3 pt-1">
                              <h3 className="text-base sm:text-lg font-black text-slate-900">{ref.patientName}</h3>
                              <span className="text-xs font-mono text-slate-500 font-bold">({ref.uhid})</span>
                              <span className="text-xs text-slate-600 font-semibold">
                                {ref.patientAge} Yrs • {ref.patientGender} • Blood: <strong className="text-rose-600">{ref.patientBlood || 'B+'}</strong>
                              </span>
                              {ref.patientPhone && (
                                <span className="text-xs font-mono text-slate-700 font-medium">📞 {ref.patientPhone}</span>
                              )}
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setViewingReferralSlip(ref)}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-400" />
                              <span>View Official Receipt</span>
                            </button>

                            {ref.status !== 'ACKNOWLEDGED' && ref.status !== 'ADMITTED' && (
                              <button
                                onClick={() => handleAcknowledgeReferral(ref)}
                                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Acknowledge</span>
                              </button>
                            )}

                            {ref.status !== 'ADMITTED' && (
                              <button
                                onClick={() => handleAdmitReferralPatient(ref)}
                                className="px-3.5 py-2 bg-[#046a4e] hover:bg-[#03523c] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                              >
                                <BedDouble className="w-3.5 h-3.5" />
                                <span>Admit to Bed</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleCreateOpdTokenForReferral(ref)}
                              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#046a4e] border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                              title="Generate priority OPD appointment token"
                            >
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span>OPD Token</span>
                            </button>

                            <button
                              onClick={() => handleDeleteReferral(ref.id, ref.referralId)}
                              className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 rounded-xl transition cursor-pointer"
                              title="Archive / Remove Receipt"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Details Grid (4-Column Matrix: Doctor, Marketing Rep, Destination, Vitals) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 text-xs">
                          {/* 1. Referring Doctor Details */}
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transferring Doctor</p>
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">Verified</span>
                            </div>
                            <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              <Stethoscope className="w-3.5 h-3.5 text-[#046a4e]" />
                              <span>{ref.referringDoctorName}</span>
                            </p>
                            <p className="text-slate-700 font-semibold text-[11px]">{ref.referringDoctorSpecialty || 'General & Cardiology Medicine'}</p>
                            {ref.referringDoctorQualification && (
                              <p className="text-slate-500 text-[10px]">{ref.referringDoctorQualification}</p>
                            )}
                            <p className="text-slate-600 font-medium text-[11px] truncate">{ref.referringDoctorChamber || 'OPD Chamber Room'}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1 text-[10px] text-slate-500 font-mono">
                              <span>Reg: {ref.referringDoctorRegNo || 'MDX-DOC-8841'}</span>
                              <span>📞 {ref.referringDoctorPhone || '+91 98042 22142'}</span>
                            </div>
                          </div>

                          {/* 2. Marketing Executive / PRO Profile */}
                          <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200/70 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Marketing Rep (PRO)</p>
                              <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">Field Ref</span>
                            </div>
                            <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>{ref.marketingRepName || 'Self-Referred / Direct Patient'}</span>
                            </p>
                            <p className="text-blue-900 font-bold font-mono text-[11px]">
                              {ref.marketingRepCode ? `Code: ${ref.marketingRepCode}` : 'Direct Walk-in'}
                            </p>
                            <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{ref.marketingRepTerritory || 'Direct Hospital Catchment'}</span>
                            </p>
                            <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 mt-1 text-[10px]">
                              <span className="text-blue-700 font-bold">{ref.marketingRepCommissionRate ? `Commission: ${ref.marketingRepCommissionRate}` : 'Direct Intake'}</span>
                              <span className="text-slate-600 font-mono">{ref.marketingRepPhone ? `📞 ${ref.marketingRepPhone}` : '—'}</span>
                            </div>
                          </div>

                          {/* 3. Target Unit & Attending Specialist */}
                          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/70 space-y-1">
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Destination Unit</p>
                            <p className="font-extrabold text-slate-900 text-sm truncate">{ref.targetDepartment}</p>
                            <p className="text-slate-700 font-semibold text-[11px]">
                              Attending: <strong className="text-[#046a4e]">{ref.targetDoctorName || 'Dr . Jiarul Haque'}</strong>
                            </p>
                            <p className="text-emerald-700 font-medium text-[11px]">{ref.targetDoctorSpecialty || 'Clinical Specialist'}</p>
                            <div className="pt-1 border-t border-emerald-200/60 mt-1 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#046a4e]" />
                              <span className="truncate">{activeBranch.name}</span>
                            </div>
                          </div>

                          {/* 4. Vitals & Financial Telemetry */}
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Vitals & Billing</p>
                            <p className="text-slate-800 font-medium font-mono text-[11px]">{ref.vitalsSummary || 'BP: 120/80 mmHg • HR: 74 BPM • SpO2: 99%'}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                              <span className="text-slate-500 font-medium">Est: ₹{ref.estimatedBill ? ref.estimatedBill.toLocaleString('en-IN') : '20,000'}</span>
                              <span className="text-[#046a4e] font-black">Doc Comm: ₹{ref.referralCommission ? ref.referralCommission.toLocaleString('en-IN') : '3,000'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Clinical Diagnosis & Transfer Notes */}
                        <div className="mt-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1 text-xs">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Clinical Diagnosis & Transfer Notes</p>
                          <p className="font-bold text-slate-800">{ref.diagnosis}</p>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">{ref.clinicalSummary}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT DOCTOR */}
      {/* ========================================================================= */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowAddDoctorModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingDoctor ? `Edit ${editingDoctor.name}` : `Register Doctor (${activeBranch.name})`}
              </h3>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs font-medium">
              {/* Doctor Photo Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <label className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#046a4e]" />
                  <span>Doctor Profile Photo</span>
                </label>

                <div className="flex items-center gap-3.5">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white shadow-xs flex items-center justify-center shrink-0">
                    {docImagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={docImagePreview} alt="Doctor Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-1 text-slate-400">
                        <Upload className="h-5 w-5 mx-auto mb-0.5 text-slate-400" />
                        <span className="text-[8px] font-bold block">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-800 cursor-pointer shadow-xs transition">
                      <Upload className="w-3.5 h-3.5 text-[#046a4e]" />
                      <span>{docImagePreview ? 'Replace Photo' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste online image URL (https://...)"
                      value={docImage.startsWith('data:') ? '' : docImage}
                      onChange={(e) => {
                        setDocImage(e.target.value);
                        setDocImagePreview(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[10px] outline-none focus:border-[#046a4e]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr . Jiarul Haque"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cardiology & Surgery"
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="MD, MBBS"
                    value={docQualification}
                    onChange={(e) => setDocQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Consult Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="800"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9804222142"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Chamber Room *</label>
                <input
                  type="text"
                  placeholder="OPD Chamber 102"
                  value={docChamber}
                  onChange={(e) => setDocChamber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                />
              </div>

              {/* 3-PART DOCTOR OPD SCHEDULING WORKSPACE */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-[#046a4e]" />
                    <span>Doctor OPD Scheduling Workspace (3-Part Config)</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#046a4e] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Receptionist Timetable Matrix
                  </span>
                </div>

                {/* PART 1: MONTHS SELECTION */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                      <span className="h-4 w-4 bg-[#046a4e] text-white rounded-full text-[9px] font-black inline-flex items-center justify-center">1</span>
                      <span>Monthly Availability (Select Months)</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])}
                        className="text-[10px] font-bold text-[#046a4e] hover:underline cursor-pointer"
                      >
                        All Months
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setDocScheduleMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Jan-Jun
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setDocScheduleMonths(['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Jul-Dec
                      </button>
                    </div>
                  </div>

                  {/* Months Pills Grid */}
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    {ALL_MONTHS.map(m => {
                      const isSelected = docScheduleMonths.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setDocScheduleMonths(prev =>
                              prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
                            );
                          }}
                          className={`py-1 text-[10px] font-black rounded-lg transition cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#046a4e] text-white shadow-2xs'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PART 2: DAYS OF WEEK & CUSTOM DAYS SELECTION */}
                <div className="space-y-2">
                  <p className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                    <span className="h-4 w-4 bg-[#046a4e] text-white rounded-full text-[9px] font-black inline-flex items-center justify-center">2</span>
                    <span>Weekly Days & Custom Date Selection</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 2A: Weekly Days Selector */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Regular OPD Days</span>
                        <button
                          type="button"
                          onClick={() => setDocScheduleDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])}
                          className="text-[10px] font-bold text-[#046a4e] hover:underline cursor-pointer"
                        >
                          Mon-Sat
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ALL_DAYS.map(d => {
                          const isSelected = docScheduleDays.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setDocScheduleDays(prev =>
                                  prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
                                );
                              }}
                              className={`flex-1 py-1 px-2 text-[10px] font-black rounded-lg transition cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-[#046a4e] text-white shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2B: Custom Date / Specific Days Input */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Custom Dates / 2-3 Specific Days</span>
                        <span className="text-[9px] font-medium text-slate-400">Optional</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 1st & 3rd Saturday, or 15th & 30th"
                        value={docScheduleCustomDays}
                        onChange={(e) => setDocScheduleCustomDays(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['1st & 3rd Sat', '2nd & 4th Sun', 'Alternate Days'].map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setDocScheduleCustomDays(preset)}
                            className="text-[9px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-[#046a4e] px-1.5 py-0.5 rounded-md transition cursor-pointer"
                          >
                            +{preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PART 3: TIMING SELECTION */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                    <span className="h-4 w-4 bg-[#046a4e] text-white rounded-full text-[9px] font-black inline-flex items-center justify-center">3</span>
                    <span>OPD Chamber Timing (Manually Filled Time Slots)</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10:00 AM - 02:00 PM or 05:00 PM - 09:00 PM"
                        value={docScheduleTiming}
                        onChange={(e) => setDocScheduleTiming(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#046a4e] shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 items-center">
                      {['10 AM - 02 PM', '05 PM - 09 PM', '24x7 On-Call'].map(tPreset => (
                        <button
                          key={tPreset}
                          type="button"
                          onClick={() => setDocScheduleTiming(tPreset === '10 AM - 02 PM' ? '10:00 AM - 02:00 PM' : tPreset === '05 PM - 09 PM' ? '05:00 PM - 09:00 PM' : '24x7 Emergency On-Call')}
                          className="flex-1 text-[9px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-emerald-500 hover:text-[#046a4e] py-1 px-1.5 rounded-lg text-center transition cursor-pointer shadow-2xs"
                        >
                          {tPreset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LIVE COMPILED SCHEDULE PREVIEW */}
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider shrink-0">Live Timetable:</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate">
                    {compileDocScheduleString(docScheduleMonths, docScheduleDays, docScheduleCustomDays, docScheduleTiming)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Availability Status</label>
                <select
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                >
                  <option value="available">🟢 Available (On Duty)</option>
                  <option value="busy">🟡 In Surgery / Busy</option>
                  <option value="off-duty">⚪ Off-Duty / On Leave</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingDoctor ? 'Save & Update Doctor' : 'Register Doctor on Roster'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT PATIENT */}
      {/* ========================================================================= */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddPatientModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingPatient ? `Edit ${editingPatient.name}` : `Register New Patient`}
              </h3>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patName}
                  onChange={(e) => setPatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Age</label>
                  <input
                    type="number"
                    value={patAge}
                    onChange={(e) => setPatAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Gender</label>
                  <select
                    value={patGender}
                    onChange={(e) => setPatGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-2 py-2 text-xs font-bold outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Blood</label>
                  <select
                    value={patBlood}
                    onChange={(e) => setPatBlood(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-2 py-2 text-xs font-bold outline-none text-rose-600"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={patPhone}
                  onChange={(e) => setPatPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Medical Condition / Chief Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Chest pain & Hypertension"
                  value={patCondition}
                  onChange={(e) => setPatCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Status</label>
                <select
                  value={patStatus}
                  onChange={(e) => setPatStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  <option value="opd">OPD Consultation</option>
                  <option value="admitted">Admitted (IPD Ward)</option>
                  <option value="discharged">Discharged</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingPatient ? 'Save Patient Details' : 'Register Patient'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / EDIT APPOINTMENT */}
      {/* ========================================================================= */}
      {showAddAppModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddAppModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingApp ? `Edit Token #${editingApp.tokenNumber}` : `Book OPD Token`}
              </h3>
            </div>

            <form onSubmit={handleSaveAppointment} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={appPatientName}
                  onChange={(e) => setAppPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Assign Doctor *</label>
                <select
                  value={appDoctorName}
                  onChange={(e) => {
                    setAppDoctorName(e.target.value);
                    const matched = branchDoctors.find(d => d.name === e.target.value);
                    if (matched) setAppDept(matched.specialty);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  {branchDoctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialty}) - ₹{d.fee}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="11:30 AM"
                    value={appTime}
                    onChange={(e) => setAppTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Token Status</label>
                <select
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  <option value="Waiting">🟡 Waiting</option>
                  <option value="In Consultation">🟣 In Consultation</option>
                  <option value="Completed">🟢 Completed</option>
                  <option value="Cancelled">🔴 Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingApp ? 'Save Appointment Slot' : 'Issue OPD Token'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ALLOCATE BED WITH DISCHARGE TIME */}
      {/* ========================================================================= */}
      {allocatingBed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setAllocatingBed(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                IPD Admission Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                Admit Patient to Bed {allocatingBed.bedNumber}
              </h3>
              <p className="text-xs text-slate-500">
                {allocatingBed.wardType.toUpperCase()} Ward • ₹{allocatingBed.dailyCharge}/day
              </p>
            </div>

            <form onSubmit={handleSaveBedAllocation} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={bedPatientName}
                  onChange={(e) => setBedPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Patient UHID (Optional)</label>
                <input
                  type="text"
                  placeholder="UHID-..."
                  value={bedPatientUhid}
                  onChange={(e) => setBedPatientUhid(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Admission Date</label>
                  <input
                    type="date"
                    required
                    value={bedAdmissionDate}
                    onChange={(e) => setBedAdmissionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Expected Discharge</label>
                  <input
                    type="date"
                    value={bedExpectedDischarge}
                    onChange={(e) => setBedExpectedDischarge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Expected Release Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:00 PM"
                  value={bedExpectedReleaseTime}
                  onChange={(e) => setBedExpectedReleaseTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-[#046a4e]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Attending Doctor</label>
                <select
                  value={bedDoctor}
                  onChange={(e) => setBedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  {branchDoctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Bed Allocation & Check-In</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD / EDIT BED */}
      {/* ========================================================================= */}
      {showAddBedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddBedModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingBed ? `Edit Bed ${editingBed.bedNumber}` : `Add New Bed`}
              </h3>
            </div>

            <form onSubmit={handleSaveBed} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Bed Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICU-01 or B-105"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Ward Category</label>
                  <select
                    value={bedWard}
                    onChange={(e) => setBedWard(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold outline-none"
                  >
                    <option value="icu">ICU Care</option>
                    <option value="deluxe">Deluxe Suite</option>
                    <option value="private">Private Single</option>
                    <option value="general">General Ward</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Daily Charge (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={bedDailyCharge}
                    onChange={(e) => setBedDailyCharge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Bed Status</label>
                <select
                  value={bedStatus}
                  onChange={(e) => setBedStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  <option value="available">🟢 Available (Vacant)</option>
                  <option value="occupied">🔴 Occupied</option>
                  <option value="maintenance">🟡 Maintenance / Sanitization</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingBed ? 'Update Bed' : 'Create Bed'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: ADD / EDIT MEDICINE */}
      {/* ========================================================================= */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddMedModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingMed ? `Edit ${editingMed.name}` : `Add Medicine to Inventory`}
              </h3>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Analgesic"
                    value={medCategory}
                    onChange={(e) => setMedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={medStock}
                    onChange={(e) => setMedStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={medPrice}
                    onChange={(e) => setMedPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none text-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={medExpiry}
                    onChange={(e) => setMedExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Batch Number</label>
                <input
                  type="text"
                  placeholder="BT-9921"
                  value={medBatch}
                  onChange={(e) => setMedBatch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingMed ? 'Update Medicine' : 'Save to Inventory'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ADD / EDIT LAB TEST */}
      {/* ========================================================================= */}
      {showAddLabModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddLabModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeBranch.code} Front Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                {editingLab ? `Edit Order ${editingLab.requestNumber}` : `New Diagnostic Order`}
              </h3>
            </div>

            <form onSubmit={handleSaveLab} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Roy"
                  value={labPatientName}
                  onChange={(e) => setLabPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Diagnostic Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lipid Profile, ECG, X-Ray Chest"
                  value={labTestName}
                  onChange={(e) => setLabTestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Category</label>
                  <input
                    type="text"
                    value={labCategory}
                    onChange={(e) => setLabCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Test Fee (₹)</label>
                  <input
                    type="number"
                    value={labPrice}
                    onChange={(e) => setLabPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold outline-none text-[#046a4e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Diagnostic Progress Status</label>
                <select
                  value={labStatus}
                  onChange={(e) => setLabStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                >
                  <option value="pending">🟡 Sample Pending / Collection</option>
                  <option value="processing">🟣 Processing in Lab</option>
                  <option value="ready">🟢 Ready & Verified</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingLab ? 'Update Lab Order' : 'Create Diagnostic Order'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: EDIT MARKETING REP */}
      {/* ========================================================================= */}
      {editingRep && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-200 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setEditingRep(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Marketing Personnel
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                Edit {editingRep.name} ({editingRep.referenceId})
              </h3>
            </div>

            <form onSubmit={handleSaveRep} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Representative Name *</label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={repPhone}
                  onChange={(e) => setRepPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Territory *</label>
                <input
                  type="text"
                  required
                  value={repTerritory}
                  onChange={(e) => setRepTerritory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Referral Commission (% per patient)</label>
                <input
                  type="number"
                  required
                  value={repCommission}
                  onChange={(e) => setRepCommission(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-[#046a4e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Representative Details</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL DIGITAL REFERRAL SLIP & INTAKE RECEIPT */}
      {/* ========================================================================= */}
      {viewingReferralSlip && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-slate-200 shadow-2xl space-y-6 relative my-8 print:m-0 print:p-6 print:max-w-none print:shadow-none">
            <button
              onClick={() => setViewingReferralSlip(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hospital Official Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#046a4e] rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>OFFICIAL INTER-HOSPITAL REFERRAL & INTAKE RECEIPT</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
                {viewingReferralSlip.targetHospitalName}
              </h2>
              <p className="text-xs font-medium text-slate-600">
                Govt Reg No: WB.33735581 • Reception Call Helpline: +91 91443 76971 • Reception WhatsApp: +91 78109 00370
              </p>
              <p className="text-[11px] text-slate-500">
                Newtown, Sukanta Polli Road, Kolkata 700157, West Bengal, India
              </p>
            </div>

            {/* Token & Urgency Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Tracking Receipt Token:</span>
                <strong className="ml-1.5 font-mono text-[#046a4e] text-sm font-black">{viewingReferralSlip.referralId}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] uppercase ${
                  viewingReferralSlip.urgencyLevel === 'EMERGENCY'
                    ? 'bg-rose-600 text-white'
                    : viewingReferralSlip.urgencyLevel === 'URGENT'
                    ? 'bg-amber-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {viewingReferralSlip.urgencyLevel} PRIORITY
                </span>
                <span className="text-slate-500 font-semibold">{viewingReferralSlip.receiptDate || 'Today, Just Now'}</span>
              </div>
            </div>

            {/* Patient Bio, Referring Doctor & Marketing Rep Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {/* 1. Patient Block */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Patient Identification</p>
                <h4 className="text-base font-black text-slate-900">{viewingReferralSlip.patientName}</h4>
                <p className="text-slate-700 font-mono font-bold">UHID: {viewingReferralSlip.uhid}</p>
                <p className="text-slate-600">
                  Age / Gender: <strong>{viewingReferralSlip.patientAge} Yrs / {viewingReferralSlip.patientGender}</strong>
                </p>
                <p className="text-slate-600">
                  Blood Group: <strong className="text-rose-600">{viewingReferralSlip.patientBlood || 'B+'}</strong>
                </p>
                <p className="text-slate-600 font-mono">Contact: {viewingReferralSlip.patientPhone || '+91 98765 43210'}</p>
              </div>

              {/* 2. Transfer Doctor Block */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transferring Physician</p>
                <h4 className="text-base font-black text-slate-900">{viewingReferralSlip.referringDoctorName}</h4>
                <p className="text-slate-800 font-bold text-[11px]">{viewingReferralSlip.referringDoctorSpecialty || 'Cardiology & Critical Care'}</p>
                {viewingReferralSlip.referringDoctorQualification && (
                  <p className="text-slate-500 text-[10px]">{viewingReferralSlip.referringDoctorQualification}</p>
                )}
                <p className="text-slate-700 font-medium text-[11px] truncate">{viewingReferralSlip.referringDoctorChamber || 'OPD Chamber Room'}</p>
                <p className="text-slate-600 font-mono text-[11px]">Phone: {viewingReferralSlip.referringDoctorPhone || '+91 98042 22142'}</p>
                <p className="text-emerald-700 font-bold text-[10px] mt-1">Council Reg: {viewingReferralSlip.referringDoctorRegNo || 'MDX-DOC-8841'}</p>
              </div>

              {/* 3. Connected Field Marketing Executive / PRO Block */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Marketing Rep (PRO)</p>
                  <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">Field Ref</span>
                </div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{viewingReferralSlip.marketingRepName || 'Self-Referred / Direct Patient'}</span>
                </h4>
                <p className="text-blue-900 font-mono font-bold text-xs">
                  {viewingReferralSlip.marketingRepCode ? `Agent ID: ${viewingReferralSlip.marketingRepCode}` : 'Direct Hospital Walk-in'}
                </p>
                <p className="text-slate-700 font-medium text-[11px]">
                  Territory: <strong>{viewingReferralSlip.marketingRepTerritory || 'Direct Catchment Zone'}</strong>
                </p>
                <p className="text-slate-600 font-mono text-[11px]">Phone: {viewingReferralSlip.marketingRepPhone || '—'}</p>
                <p className="text-blue-700 font-bold text-[10px] mt-1">
                  Doctor Relationship: {viewingReferralSlip.marketingRepCommissionRate ? `${viewingReferralSlip.marketingRepCommissionRate} Tier` : 'Direct Admission (Standard)'}
                </p>
              </div>
            </div>

            {/* Target Department & Specialist Assignment */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Hospital Department & Attending Specialist Assignment</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{viewingReferralSlip.targetDepartment}</p>
                  <p className="text-slate-700">
                    Attending: <strong className="text-[#046a4e]">{viewingReferralSlip.targetDoctorName || 'Dr . Jiarul Haque'}</strong> ({viewingReferralSlip.targetDoctorSpecialty || 'Senior Consultant'})
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-200/80 text-emerald-950 font-black text-[10px] rounded-xl self-start sm:self-auto">
                  {viewingReferralSlip.status} AT RECEPTION
                </span>
              </div>
            </div>

            {/* Clinical Diagnosis & Vitals */}
            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Primary Diagnosis</p>
                <p className="font-black text-slate-900 text-sm">{viewingReferralSlip.diagnosis}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Vital Signs Telemetry at Dispatch</p>
                <p className="font-mono text-slate-800 font-bold">{viewingReferralSlip.vitalsSummary || 'BP: 120/80 mmHg • HR: 74 BPM • SpO2: 99%'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Clinical Transfer Rationale & Summary Notes</p>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">{viewingReferralSlip.clinicalSummary}</p>
              </div>
            </div>

            {/* Signature Lines (3-Way Verification: Doctor, Marketing Rep, Reception Desk) */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <p className="font-black text-slate-900">{viewingReferralSlip.referringDoctorName}</p>
                <p className="text-[10px] text-slate-500 font-medium">Referring Doctor Signature</p>
              </div>
              <div className="border-t border-blue-400 pt-2 space-y-0.5 bg-blue-50/30 rounded-b-xl">
                <p className="font-black text-blue-950">{viewingReferralSlip.marketingRepName || 'Self-Referred / Patient Direct'}</p>
                <p className="text-[10px] text-blue-700 font-medium">Field Marketing (PRO) Verification</p>
              </div>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <p className="font-black text-slate-900">{activeBranch.name} Front Desk</p>
                <p className="text-[10px] text-slate-500 font-medium">Receptionist Intake & Triage Stamp</p>
              </div>
            </div>

            {/* Print and Close Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setViewingReferralSlip(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-full transition cursor-pointer"
              >
                Close Slip
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: ONBOARD NEW MARKETING REPRESENTATIVE */}
      {/* ========================================================================= */}
      {showAddRepModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowAddRepModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Field Onboarding
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#046a4e]" />
                <span>Onboard Marketing Representative</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Register a new field marketing agent for <strong>{activeBranch.name}</strong>. An official Marketing Reference ID will be generated automatically.
              </p>
            </div>

            <form onSubmit={handleOnboardNewRep} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={newRepName}
                    onChange={(e) => setNewRepName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Gender</label>
                  <select
                    value={newRepGender}
                    onChange={(e) => setNewRepGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Phone Number (Calling / WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 12345"
                    value={newRepPhone}
                    onChange={(e) => setNewRepPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none focus:border-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="rep@email.com"
                    value={newRepEmail}
                    onChange={(e) => setNewRepEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Territory / Catchment *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barasat, Newtown & Salt Lake"
                    value={newRepTerritory}
                    onChange={(e) => setNewRepTerritory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">District / City</label>
                  <input
                    type="text"
                    placeholder="e.g. North 24 Parganas"
                    value={newRepDistrict}
                    onChange={(e) => setNewRepDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Commission Rate (% per referral)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newRepCommission}
                    onChange={(e) => setNewRepCommission(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-[#046a4e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newRepExperience}
                    onChange={(e) => setNewRepExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Aadhar / ID Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 5621-8841-9923"
                  value={newRepAadhar}
                  onChange={(e) => setNewRepAadhar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <p className="font-black flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#046a4e]" />
                  <span>Automatic Reference ID Issuance</span>
                </p>
                <p className="text-emerald-800">
                  Submitting will generate a permanent reference ID (e.g. <code>REF-MKT-B{activeBranch.id}-XXXX</code>) linked to {activeBranch.name}.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-linear-to-r from-[#046a4e] to-emerald-700 hover:from-[#03523c] hover:to-emerald-800 text-white font-black text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Issue Reference ID & Activate Marketing Rep</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 10: MARKETING REPRESENTATIVE DIGITAL ID CARD & DOSSIER */}
      {/* ========================================================================= */}
      {viewingRep && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 shadow-2xl space-y-6 relative my-8 print:m-0 print:p-6 print:max-w-none print:shadow-none">
            <button
              onClick={() => setViewingRep(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Hospital ID Header */}
            <div className="text-center space-y-1 pb-4 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#046a4e] rounded-full border border-emerald-200 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Hospital Field Credential</span>
              </div>
              <h3 className="font-black text-xl text-slate-900">{activeBranch.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{activeBranch.address || activeBranch.location}</p>
            </div>

            {/* Rep ID Badge Card */}
            <div className="bg-linear-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 rounded-3xl shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black text-lg">
                    {viewingRep.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">{viewingRep.name}</h4>
                    <p className="text-[11px] text-emerald-300 font-semibold">Field Marketing Executive (PRO)</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    {viewingRep.status}
                  </span>
                </div>
              </div>

              {/* Reference ID Banner */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-emerald-200 font-bold">Marketing Reference ID</p>
                  <p className="font-mono font-black text-sm text-white tracking-wider">{viewingRep.referenceId}</p>
                </div>
                <button
                  onClick={() => handleCopyId(viewingRep.referenceId)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition cursor-pointer"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Credentials Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <p className="text-[10px] text-emerald-300 font-semibold">Territory</p>
                  <p className="font-bold text-white truncate">{viewingRep.territory}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300 font-semibold">Contact Phone</p>
                  <p className="font-mono font-bold text-white">{viewingRep.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300 font-semibold">Commission Tier</p>
                  <p className="font-bold text-emerald-300">{viewingRep.commissionRate || '10%'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300 font-semibold">Approved Date</p>
                  <p className="font-mono text-white text-[11px]">{viewingRep.approvedDate || 'Active'}</p>
                </div>
              </div>
            </div>

            {/* Performance & Verification Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Referred Inpatient Admissions:</span>
                <strong className="font-black text-slate-900">{viewingRep.referredPatientsCount || 0} Patients</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Email Address:</span>
                <span className="font-mono text-slate-800">{viewingRep.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Government ID / Aadhar:</span>
                <span className="font-mono text-slate-800">{viewingRep.aadharNumber || 'Verified On File'}</span>
              </div>
            </div>

            {/* Print and Close Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setViewingRep(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-full transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print ID Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 11: PENDING APPLICATION REVIEW DOSSIER */}
      {/* ========================================================================= */}
      {viewingRequest && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 shadow-2xl space-y-6 relative my-8">
            <button
              onClick={() => setViewingRequest(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Candidate Join Dossier
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                Application APP-REQ-#{viewingRequest.id}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review applicant profile and decide on onboarding for <strong>{activeBranch.name}</strong>.
              </p>
            </div>

            <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/70">
                <div>
                  <h4 className="font-black text-slate-900 text-base">{viewingRequest.name}</h4>
                  <p className="text-slate-600 text-xs">{viewingRequest.gender || 'Male'} • Applied on {viewingRequest.appliedDate}</p>
                </div>
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {viewingRequest.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">📞 Phone:</span>
                  <strong className="font-mono text-slate-900">{viewingRequest.phone}</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">✉️ Email:</span>
                  <span className="font-mono text-slate-900">{viewingRequest.email}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">📍 Proposed Territory:</span>
                  <strong className="text-slate-900">{viewingRequest.territory} ({viewingRequest.district})</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">🎯 Expected Monthly Referrals:</span>
                  <strong className="text-[#046a4e]">{viewingRequest.expectedMonthlyReferrals || 5} Patients / Month</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">💼 Experience:</span>
                  <span className="text-slate-900">{viewingRequest.experienceYears || 2} Years</span>
                </p>
              </div>

              {viewingRequest.qualificationsOrNotes && (
                <div className="pt-2 border-t border-amber-200/70">
                  <p className="text-[10px] font-bold text-amber-900 uppercase">Applicant Statement:</p>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-2xl border border-amber-200 mt-1 italic">
                    &ldquo;{viewingRequest.qualificationsOrNotes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleRejectPendingRequest(viewingRequest)}
                className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-full border border-rose-200 transition cursor-pointer"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApprovePendingRequest(viewingRequest)}
                className="flex-2 py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs rounded-full shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Issue Marketing ID</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
