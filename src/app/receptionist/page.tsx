'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Doctor, Patient, Appointment, Bed, Medicine, LabRequest, MarketingRepresentative } from '@/lib/data';
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
  DollarSign
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
    updateMarketingRepresentative,
    deleteMarketingRepresentative,
    fireMarketingRepresentative,
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'doctors' | 'patients' | 'appointments' | 'beds' | 'pharmacy' | 'laboratory' | 'marketing'
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

  // =========================================================================
  // MODAL STATES
  // =========================================================================

  // 1. Doctor Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiology & General Medicine');
  const [docQualification, setDocQualification] = useState('MD, MBBS');
  const [docFee, setDocFee] = useState('800');
  const [docPhone, setDocPhone] = useState('+91 9804222142');
  const [docSchedule, setDocSchedule] = useState('10:00 AM - 02:00 PM (Mon-Sat)');
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

  // 7. Marketing Rep Modal
  const [editingRep, setEditingRep] = useState<MarketingRepresentative | null>(null);
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repTerritory, setRepTerritory] = useState('');
  const [repCommission, setRepCommission] = useState('10');

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
    setDocSchedule('10:00 AM - 02:00 PM (Mon-Sat)');
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
    setDocSchedule(doc.scheduleTime || '10:00 AM - 02:00 PM');
    setDocChamber(doc.chamberRoom || 'OPD Room 101');
    setDocStatus(doc.status);
    setDocImage(doc.image || '');
    setDocImagePreview(doc.image || '');
    setShowAddDoctorModal(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        specialty: docSpecialty,
        qualification: docQualification,
        fee: parseFloat(docFee) || 800,
        contact: docPhone,
        scheduleTime: docSchedule,
        chamberRoom: docChamber,
        status: docStatus,
        image: docImage || undefined,
      });
      showToast(`Doctor ${docName} updated successfully!`);
    } else {
      addDoctor({
        branchId: activeBranch.id,
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        specialty: docSpecialty,
        qualification: docQualification,
        fee: parseFloat(docFee) || 800,
        contact: docPhone,
        scheduleTime: docSchedule,
        chamberRoom: docChamber,
        status: docStatus,
        image: docImage || undefined,
        registeredBy: `Hospital Receptionist (${activeBranch.name})`,
        registrationDate: new Date().toISOString().split('T')[0],
      });
      showToast(`Dr. ${docName} registered on Receptionist Desk!`);
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
      const generatedUhid = `UHID-${activeBranch.code}-${Math.floor(1000 + Math.random() * 9000)}`;
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
      const uhidToUse = appUhid || `UHID-${activeBranch.code}-${Math.floor(1000 + Math.random() * 9000)}`;
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

  // 7. Marketing Reps
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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
            <p className="text-lg font-black text-slate-900 mt-0.5">{branchMarketingReps.length} reps</p>
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
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'marketing' ? 'bg-[#046a4e] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>7. Marketing Reps</span>
            <span className="ml-1 px-2 py-0.5 bg-black/10 rounded-full text-[10px]">{branchMarketingReps.length}</span>
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
        {/* TAB 7: MARKETING REPRESENTATIVES */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#046a4e]" />
                  <span>Marketing Representatives & Referral Agents</span>
                </h2>
                <p className="text-xs text-slate-500">
                  View and manage marketing personnel assigned to this hospital, edit territory, commission, or fire.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchMarketingReps.map((rep) => (
                <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {rep.referenceId}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        rep.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{rep.name}</h3>
                    <p className="text-xs text-slate-500">{rep.territory}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-700 font-medium">📞 {rep.phone}</p>
                    <p className="text-slate-700 font-medium">✉️ {rep.email}</p>
                    <p className="text-[#046a4e] font-black mt-1">
                      Commission: {rep.commissionRate || '10%'} per referral
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditRep(rep)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center cursor-pointer"
                    >
                      Edit Info
                    </button>
                    <button
                      onClick={() => handleFireRep(rep.id, rep.name)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer"
                      title="Fire / Purge Rep"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Schedule Timetable</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 02:00 PM (Mon-Sat)"
                    value={docSchedule}
                    onChange={(e) => setDocSchedule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Chamber Room</label>
                  <input
                    type="text"
                    placeholder="OPD Chamber 102"
                    value={docChamber}
                    onChange={(e) => setDocChamber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
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
    </div>
  );
}
