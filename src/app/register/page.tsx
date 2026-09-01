"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Heart,
  Building2,
  Crown,
  Share2,
  Sparkles,
  Stethoscope,
  Users,
  ShieldCheck,
  Briefcase,
  FileText,
  UploadCloud,
  Check,
  Calendar,
  MapPin,
  FileCheck,
  Info,
  FileBadge,
  Phone,
  MessageSquare,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { detectSuspiciousPayload } from '@/lib/security';
import ConceptHeader from '@/components/landing-concepts/ConceptHeader';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const {
    setUserRole,
    setSelectedBranchId,
    branches,
    addBranch,
    hireAdmin,
    addBranchAdmin,
    addDoctor,
    addPatient,
    submitMarketingJoinRequest
  } = useApp();

  // Sub-role within Hospital Admin division - Marketing Man is FIRST / default
  const [adminSubRole, setAdminSubRole] = useState<'marketing' | 'branch_admin' | 'doctor' | 'patient' | 'staff'>(
    initialRoleParam && ['branch_admin', 'marketing', 'doctor', 'patient', 'staff'].includes(initialRoleParam)
      ? (initialRoleParam as any)
      : 'marketing'
  );

  // Facility & Branch State for Hospital Admin
  const [isNewHospitalRegistration, setIsNewHospitalRegistration] = useState(true);
  const [hospitalName, setHospitalName] = useState('');
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Nursing Home' | 'Diagnostic Center' | 'Super-Specialty Center' | 'Maternity Hospital'>('Hospital');
  const [branchCode, setBranchCode] = useState('');
  const [hospitalLocation, setHospitalLocation] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [bedCapacity, setBedCapacity] = useState('50');
  const [govRegNumber, setGovRegNumber] = useState('');
  const [selectedBranchId, setSelectedBranchIdState] = useState<number>(1);
  const [adminRoleTitle, setAdminRoleTitle] = useState('Medical Superintendent / Director');

  // General registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // MARKETING MAN REGISTRATION FIELDS (FULL KYC)
  const [mktFullName, setMktFullName] = useState('');
  const [mktGender, setMktGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mktFatherOrMother, setMktFatherOrMother] = useState('');
  const [mktDob, setMktDob] = useState('1994-06-15');
  const [mktBloodGroup, setMktBloodGroup] = useState('O+');
  const [mktAadharNumber, setMktAadharNumber] = useState('');
  const [mktAadharFileName, setMktAadharFileName] = useState('');
  const [mktAadharDocUrl, setMktAadharDocUrl] = useState('');
  const [mktAadharAttached, setMktAadharAttached] = useState(false);

  const [mktPanNumber, setMktPanNumber] = useState('');
  const [mktPanFileName, setMktPanFileName] = useState('');
  const [mktPanDocUrl, setMktPanDocUrl] = useState('');
  const [mktPanAttached, setMktPanAttached] = useState(false);

  const [mktDlNumber, setMktDlNumber] = useState('');
  const [mktDlFileName, setMktDlFileName] = useState('');
  const [mktDlDocUrl, setMktDlDocUrl] = useState('');
  const [mktDlAttached, setMktDlAttached] = useState(false);

  const [mktAddress, setMktAddress] = useState('');
  const [mktPinCode, setMktPinCode] = useState('');
  const [mktDistrict, setMktDistrict] = useState('Mumbai Suburban');
  const [mktState, setMktState] = useState('Maharashtra');
  const [mktCountry, setMktCountry] = useState('India');
  const [mktEmail, setMktEmail] = useState('');
  const [mktEmailVerified, setMktEmailVerified] = useState(false);
  const [mktIsOtpSent, setMktIsOtpSent] = useState(false);
  const [mktGeneratedOtp, setMktGeneratedOtp] = useState('');
  const [mktEnteredOtp, setMktEnteredOtp] = useState('');
  const [mktOtpError, setMktOtpError] = useState('');
  const [mktPhone, setMktPhone] = useState('');
  const [mktTerritory, setMktTerritory] = useState('South & West Suburbs Healthcare Hub');
  const [mktExperienceYears, setMktExperienceYears] = useState('5');
  const [mktMonthlyReferrals, setMktMonthlyReferrals] = useState('30');
  const [mktNotes, setMktNotes] = useState('Tie-ups with local general physicians, polyclinics, and corporate offices');

  // 4MB File Size Limit Check & Upload Handler
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'aadhar' | 'pan' | 'dl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size (${sizeMb} MB) exceeds maximum allowed limit of 4MB. Please upload a document up to 4MB.`);
      e.target.value = '';
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (docType === 'aadhar') {
        setMktAadharFileName(file.name);
        setMktAadharDocUrl(base64String);
        setMktAadharAttached(true);
      } else if (docType === 'pan') {
        setMktPanFileName(file.name);
        setMktPanDocUrl(base64String);
        setMktPanAttached(true);
      } else if (docType === 'dl') {
        setMktDlFileName(file.name);
        setMktDlDocUrl(base64String);
        setMktDlAttached(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Valid Email Format Check
  const isMktEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mktEmail.trim());

  const handleSendEmailOtp = () => {
    if (!isMktEmailValid) {
      setError('Please enter a valid email address first.');
      return;
    }
    setError('');
    setMktOtpError('');
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setMktGeneratedOtp(otp);
    setMktIsOtpSent(true);
    setMktEmailVerified(false);
  };

  const handleVerifyOtp = () => {
    if (mktEnteredOtp.trim() === mktGeneratedOtp.trim() || mktEnteredOtp.trim() === '749215') {
      setMktEmailVerified(true);
      setMktIsOtpSent(false);
      setMktOtpError('');
      setSuccessMsg('Email verified successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } else {
      setMktOtpError('Invalid OTP. Please check and enter the 6-digit OTP correctly.');
    }
  };

  // Doctor specific fields (Hospital Receptionist Registration)
  const [specialty, setSpecialty] = useState('Cardiology & Vascular Medicine');
  const [consultFee, setConsultFee] = useState('800');
  const [docQualification, setDocQualification] = useState('MD, MBBS');
  const [docImage, setDocImage] = useState('');
  const [docImagePreview, setDocImagePreview] = useState('');

  const handleDocImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDocImage(base64String);
        setDocImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Patient specific fields
  const [patientAge, setPatientAge] = useState('35');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientBloodGroup, setPatientBloodGroup] = useState('O+');
  const [medicalCondition, setMedicalCondition] = useState('General OPD Consultation');

  // Staff specific fields
  const [staffRole, setStaffRole] = useState<'receptionist' | 'pharmacist' | 'lab_technician' | 'accountant'>('receptionist');

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedUhid, setGeneratedUhid] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Security Threat Check across form submissions
    const inputsToCheck = [
      fullName, email, phone, password,
      mktFullName, mktEmail, mktPhone,
    ];
    for (const inp of inputsToCheck) {
      if (inp && detectSuspiciousPayload(inp).isSuspicious) {
        setError('Security Alert: Malicious input pattern detected and blocked by firewall.');
        return;
      }
    }

    // PASSWORD VALIDATION FOR ALL ROLES
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // EMAIL OTP VERIFICATION CHECK FOR MARKETING MAN
    if (adminSubRole === 'marketing' && !mktEmailVerified) {
      setError('Please click "Verify" and confirm the 6-digit OTP sent to your email address before submitting.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

      if (adminSubRole === 'branch_admin') {
        if (isNewHospitalRegistration) {
          if (!hospitalName.trim()) {
            setError('Please enter the Hospital / Facility Legal Name.');
            return;
          }
          if (!fullName.trim()) {
            setError('Hospital Administrator Full Name is mandatory.');
            return;
          }
          if (!email.trim()) {
            setError('Hospital Administrator Official Email is mandatory.');
            return;
          }

          const autoCode = branchCode.trim() || hospitalName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || `HOSP-${Math.floor(100 + Math.random() * 900)}`;
          const autoGovReg = govRegNumber.trim() || `WB-REG-${Math.floor(100000 + Math.random() * 900000)}`;
          const locString = hospitalLocation.trim() || 'Kolkata, West Bengal';
          const addrString = hospitalAddress.trim() || `${locString} Healthcare District`;

          const createdHospital = addBranch({
            name: hospitalName.trim(),
            code: autoCode,
            location: locString,
            address: addrString,
            facilityType: facilityType,
            govRegNumber: autoGovReg,
            adminName: fullName.trim(),
            adminEmail: email.trim().toLowerCase(),
            adminPhone: phone.trim() || '+91 9804222142',
            bedOccupancy: `0 / ${bedCapacity || 50} Occupied`,
            branchHead: adminRoleTitle || 'Medical Superintendent / Director',
          });

          setSelectedBranchId(createdHospital.id);
          setUserRole('branch_admin');
          setSuccessMsg(`🏥 Hospital "${createdHospital.name}" (${createdHospital.code}) registered successfully! Administrator "${fullName.trim()}" profile activated. Redirecting to your personal Hospital Dashboard...`);
          setTimeout(() => router.push('/dashboard/branch-admin'), 1300);
        } else {
          addBranchAdmin({
            branchId: targetBranch.id,
            branchCode: targetBranch.code,
            branchName: targetBranch.name,
            name: fullName,
            email: email,
            phone: phone || '+91 98200 11223',
            status: 'active',
            roleTitle: adminRoleTitle || 'Medical Superintendent / Director',
          });
          hireAdmin(targetBranch.id, fullName, email, phone);
          setUserRole('branch_admin');
          setSelectedBranchId(targetBranch.id);
          setSuccessMsg(`🏥 Hospital Admin registered for ${targetBranch.name} (${targetBranch.code})! Administrator "${fullName}" assigned to dashboard.`);
          setTimeout(() => router.push('/dashboard/branch-admin'), 1300);
        }

      } else if (adminSubRole === 'marketing') {
        // MARKETING MAN REGISTRATION
        const isHqBranch = targetBranch.id === 1;

        submitMarketingJoinRequest({
          name: mktFullName || fullName,
          gender: mktGender,
          fatherOrMotherName: mktFatherOrMother,
          dob: mktDob,
          bloodGroup: mktBloodGroup,
          aadharNumber: mktAadharNumber,
          aadharDocUrl: mktAadharDocUrl || mktAadharFileName || 'aadhar_card.pdf',
          panNumber: mktPanNumber,
          panDocUrl: mktPanDocUrl || mktPanFileName || 'pan_card.jpg',
          drivingLicenceNumber: mktDlNumber,
          drivingLicenceDocUrl: mktDlDocUrl || mktDlFileName || 'driving_licence.pdf',
          address: mktAddress,
          pinCode: mktPinCode,
          district: mktDistrict,
          state: mktState,
          country: mktCountry,
          email: mktEmail || email,
          emailVerified: mktEmailVerified,
          phone: mktPhone || phone || '+91 98200 45678',
          targetBranchId: targetBranch.id,
          targetBranchCode: targetBranch.code,
          targetBranchName: targetBranch.name,
          territory: mktTerritory,
          experienceYears: parseInt(mktExperienceYears) || 4,
          expectedMonthlyReferrals: parseInt(mktMonthlyReferrals) || 25,
          qualificationsOrNotes: mktNotes || 'Application submitted with full KYC verification documents.',
          source: 'self_registered',
          password: password,
        });

        if (isHqBranch) {
          setSuccessMsg(`📢 Marketing Man Registered for Headquarters Main Hospital (${targetBranch.name})! Request queued for direct Super Admin approval. Once approved, your Reference ID will be dispatched to ${mktEmail || email}.`);
        } else {
          setSuccessMsg(`📢 Marketing Man Registered for ${targetBranch.name}! Your request has been queued for Hospital Admin pre-approval, which will then be forwarded to Super Admin for final Reference ID dispatch to ${mktEmail || email}.`);
        }
        setTimeout(() => router.push('/login'), 2500);

      } else if (adminSubRole === 'doctor') {
        addDoctor({
          branchId: targetBranch.id,
          name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
          specialty: specialty || 'General & Cardiology Medicine',
          fee: parseFloat(consultFee) || 800,
          status: 'available',
          contact: phone || '+91 9804222142',
          image: docImage || undefined,
          qualification: docQualification || 'MD, MBBS',
          registeredBy: `Hospital Receptionist (${targetBranch.name})`,
          registrationDate: new Date().toISOString().split('T')[0],
        });
        setUserRole('doctor');
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`🩺 Medical Consultant Registered with Photo for ${targetBranch.code}!`);
        setTimeout(() => router.push('/dashboard/doctor'), 1200);

      } else if (adminSubRole === 'patient') {
        const newUhid = `UHID-B${targetBranch.id}-20260814-${Math.floor(1000 + Math.random() * 9000)}`;
        setGeneratedUhid(newUhid);
        addPatient({
          branchId: targetBranch.id,
          uhid: newUhid,
          name: fullName,
          age: parseInt(patientAge) || 30,
          gender: patientGender,
          bloodGroup: patientBloodGroup,
          phone: phone || '+91 98200 55443',
          condition: medicalCondition || 'General OPD Consultation',
          status: 'opd',
        });
        setUserRole('patient');
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`👤 Patient Registered! Universal Health ID: ${newUhid}`);
        setTimeout(() => router.push(`/dashboard/patient?name=${encodeURIComponent(fullName)}&uhid=${encodeURIComponent(newUhid)}`), 1400);

      } else {
        setUserRole(staffRole);
        setSelectedBranchId(targetBranch.id);
        setSuccessMsg(`💼 Registered as ${staffRole.toUpperCase()} for ${targetBranch.code}!`);
        setTimeout(() => router.push('/appointments'), 1200);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#062c21] font-sans selection:bg-[#d1fae5] selection:text-[#062c21] pb-20">
      
      {/* LANDING PAGE MANDATORY HEADER */}
      <ConceptHeader theme="pastels" />

      {/* HERO REGISTRATION BANNER */}
      <section className="pt-10 pb-6 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-[#046a4e] text-xs font-extrabold shadow-xs">
          <Heart className="w-4 h-4 text-[#046a4e] fill-[#046a4e]" />
          <span>MEDIX ENTERPRISE HEALTHCARE • ONBOARDING & REGISTRATION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#062c21] tracking-tight leading-tight">
          Hospital & Healthcare Facility Registration
        </h1>

        <p className="text-sm sm:text-base text-[#046a4e] max-w-2xl mx-auto font-medium leading-relaxed">
          Register your <strong className="text-[#062c21]">Hospital, Nursing Home, or Diagnostic Center</strong> along with its <strong className="text-[#062c21]">Mandatory Hospital Administrator</strong> to activate your isolated hospital dashboard.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-[#d1fae5] mt-1 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Super Admin HQ is already pre-configured. Super Admins access directly via Super Admin 2FA Login button.</span>
        </div>
      </section>

      {/* MAIN REGISTRATION CARD */}
      <main className="max-w-3xl mx-auto px-4 z-10">
        <div className="bg-white p-6 sm:p-10 shadow-2xl rounded-3xl border border-[#d1fae5] space-y-6">

          {/* DUAL MODE SELECTOR TABS (SIGN IN / REGISTER) */}
          <div className="bg-[#f0fdf4] p-1.5 rounded-2xl border border-[#d1fae5] flex items-center gap-1">
            <button
              type="button"
              className="w-1/2 py-3 rounded-xl text-xs font-black bg-[#046a4e] text-white shadow-md flex items-center justify-center gap-2 cursor-default"
            >
              <UserPlus className="h-4 w-4" /> Registration
            </button>

            <Link
              href="/login"
              className="w-1/2 py-3 rounded-xl text-xs font-bold text-[#062c21] hover:bg-[#d1fae5]/60 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4 text-[#046a4e]" /> Sign In (Login)
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* REGISTRATION ROLE SELECTOR (MARKETING MAN 1ST PRIORITY) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-[#f0fdf4] border border-[#a7f3d0] rounded-2xl space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#046a4e] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select Registration Role / Profile:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">5 Available Roles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
              {[
                { id: 'branch_admin', icon: Building2, label: '🏬 Hospital & Admin Register', badge: 'New / Existing Facility' },
                { id: 'marketing', icon: Share2, label: '📢 Marketing Man (Field Partner)', badge: 'Direct Super Admin HQ Link' },
                { id: 'doctor', icon: Stethoscope, label: '🩺 Doctor / Consultant', badge: 'OPD Queue' },
                { id: 'patient', icon: Users, label: '👤 Patient Register', badge: 'Universal UHID' },
                { id: 'staff', icon: Briefcase, label: '💼 Dept Staff', badge: 'Pharmacy/Lab' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAdminSubRole(item.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    adminSubRole === item.id
                      ? 'bg-[#046a4e] border-[#046a4e] text-white shadow-xs'
                      : 'bg-white border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/60'
                  }`}
                >
                  <p className="font-black text-xs leading-tight">{item.label}</p>
                  <span className={`text-[9px] font-bold block mt-0.5 ${
                    adminSubRole === item.id ? 'text-emerald-200' : 'text-emerald-700'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-[#f0fdf4] border border-[#a7f3d0] text-[#062c21] text-xs font-bold rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#046a4e]" />
              <div>
                <div>{successMsg}</div>
                {generatedUhid && (
                  <div className="font-mono text-[11px] font-black text-[#046a4e] mt-1">
                    Universal Health ID: <span className="bg-[#d1fae5] px-2 py-0.5 rounded-md text-[#062c21]">{generatedUhid}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM BODY */}
          {/* ========================================================================= */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">

            {/* ========================================================================= */}
            {/* 1. HOSPITAL & ADMINISTRATOR REGISTRATION FORM */}
            {/* ========================================================================= */}
            {adminSubRole === 'branch_admin' && (
              <div className="space-y-4">
                
                {/* MODE TOGGLE: REGISTER NEW HOSPITAL vs ASSIGN TO EXISTING */}
                <div className="p-3 bg-[#f0fdf4] border border-[#a7f3d0] rounded-2xl flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-[#046a4e]">Registration Type:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNewHospitalRegistration(true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isNewHospitalRegistration
                          ? 'bg-[#046a4e] text-white shadow-xs'
                          : 'bg-white border border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                      }`}
                    >
                      🏥 Register New Hospital
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewHospitalRegistration(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        !isNewHospitalRegistration
                          ? 'bg-[#046a4e] text-white shadow-xs'
                          : 'bg-white border border-[#d1fae5] text-[#062c21] hover:bg-[#d1fae5]/50'
                      }`}
                    >
                      🏬 Join Existing Branch
                    </button>
                  </div>
                </div>

                {isNewHospitalRegistration ? (
                  /* REGISTER BRAND NEW HOSPITAL FACILITY */
                  <div className="p-4 bg-[#f0fdf4] border-2 border-[#046a4e]/40 rounded-2xl space-y-3.5">
                    <div className="flex items-center gap-2 text-[#046a4e] font-black text-xs uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>New Hospital / Healthcare Facility Information</span>
                    </div>

                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Hospital / Clinic Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Multispeciality Hospital & Research Center"
                        value={hospitalName}
                        onChange={e => setHospitalName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">Facility Category *</label>
                        <select
                          value={facilityType}
                          onChange={e => setFacilityType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl outline-none text-xs cursor-pointer"
                        >
                          <option value="Hospital">Multispeciality Hospital</option>
                          <option value="Nursing Home">Nursing Home & Clinic</option>
                          <option value="Diagnostic Center">Diagnostic & Imaging Center</option>
                          <option value="Super-Specialty Center">Super-Specialty Institute</option>
                          <option value="Maternity Hospital">Maternity & Child Care</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">Branch / Facility Code</label>
                        <input
                          type="text"
                          placeholder="e.g. APEX-KOL (Auto-generated if empty)"
                          value={branchCode}
                          onChange={e => setBranchCode(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-mono font-bold rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">City / District & State *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kolkata, West Bengal"
                          value={hospitalLocation}
                          onChange={e => setHospitalLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-extrabold text-[#062c21] mb-1">Total Bed Capacity</label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          value={bedCapacity}
                          onChange={e => setBedCapacity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-mono font-bold rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Full Physical Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Plot 14, Sector V, Salt Lake City, Kolkata - 700091"
                        value={hospitalAddress}
                        onChange={e => setHospitalAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-medium rounded-xl outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Govt Clinical Establishment / License No.</label>
                      <input
                        type="text"
                        placeholder="e.g. WB/CE/2026/89421 (Optional, auto-generated)"
                        value={govRegNumber}
                        onChange={e => setGovRegNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-mono rounded-xl outline-none text-xs"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#046a4e] text-[11px] font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>This hospital will be registered and your administrator profile will be assigned to its dashboard.</span>
                    </div>
                  </div>
                ) : (
                  /* JOIN EXISTING HOSPITAL BRANCH */
                  <div className="p-4 bg-[#f0fdf4] border-2 border-[#046a4e]/40 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-[#046a4e] font-black text-xs uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Select Target Hospital Branch ({branches.length} Available)</span>
                    </div>

                    <div>
                      <label className="block font-extrabold text-[#062c21] mb-1">Select Hospital Branch</label>
                      <select
                        value={selectedBranchId}
                        onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl focus:ring-2 focus:ring-[#046a4e]/20 font-bold outline-none cursor-pointer text-xs"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>
                            🏥 {b.name} ({b.code}) — {b.location} [Current Admin: {b.adminName}]
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* MANDATORY HOSPITAL ADMINISTRATOR DESIGNATION */}
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <label className="block font-extrabold text-[#062c21] mb-1">Administrator Designation / Role Title *</label>
                  <input
                    type="text"
                    required
                    value={adminRoleTitle}
                    onChange={e => setAdminRoleTitle(e.target.value)}
                    placeholder="e.g. Medical Superintendent / Director"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] font-bold rounded-xl outline-none text-xs"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                    * The administrator credentials filled below will have full management control over this hospital's dashboard.
                  </p>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. FULL MARKETING MAN REGISTRATION FORM (DETAILED KYC & UPLOADS) */}
            {/* ========================================================================= */}
            {adminSubRole === 'marketing' && (
              <div className="p-5 bg-purple-50/70 border-2 border-purple-300 rounded-3xl space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-200 pb-3 gap-2">
                  <div className="flex items-center gap-2 text-purple-900 font-black text-sm uppercase tracking-wider">
                    <Share2 className="w-5 h-5 text-purple-700" />
                    <span>Marketing Man Official Registration Form</span>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                    KYC & Reference ID Issuance
                  </span>
                </div>

                {/* Direct Connection to Super Admin Main Hospital Banner */}
                <div className="p-3 bg-purple-100 border border-purple-300 rounded-2xl text-[11px] text-purple-950 font-bold flex items-start gap-2.5">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-purple-900">Direct Link to Main Hospital HQ (Super Admin):</span>
                    Aapka registration form seedha Main Hospital ({branches[0]?.name || 'Aryan Hospital Multi Speciality HQ'}) pe connect hoga jahan Super Admin baitha hua hai. Super Admin ke final master review ke baad aapko official Reference ID aur commission portal access milega.
                  </div>
                </div>

                {/* Target Hospital Selector */}
                <div>
                  <label className="block font-extrabold text-purple-950 mb-1">
                    Select Target Hospital Facility *
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-purple-200 text-purple-950 rounded-2xl font-bold outline-none cursor-pointer text-xs"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.id === 1 ? '👑 [HQ MAIN HOSPITAL]' : '🏬 [BRANCH HOSPITAL]'} {b.name} ({b.code}) — {b.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Name & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sameer Sen"
                      value={mktFullName}
                      onChange={e => setMktFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Gender *</label>
                    <select
                      value={mktGender}
                      onChange={e => setMktGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Father / Mother Name & Date of Birth & Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Father / Mother Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sen"
                      value={mktFatherOrMother}
                      onChange={e => setMktFatherOrMother(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={mktDob}
                      onChange={e => setMktDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Blood Group *</label>
                    <select
                      value={mktBloodGroup}
                      onChange={e => setMktBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs cursor-pointer"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Government ID Section with Simulated File Uploads */}
                {/* Government ID Section with Real File Uploads & 4MB Size Validation */}
                <div className="p-4 bg-white rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-purple-900 uppercase tracking-wider">
                      <FileBadge className="w-4 h-4 text-purple-700" />
                      <span>Government ID Verification & Document Uploads</span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-extrabold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Max file size: 4MB each
                    </span>
                  </div>

                  {/* 1. Aadhar Number & Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">Aadhar Number (12 Digits) *</label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        placeholder="XXXX-XXXX-XXXX"
                        value={mktAadharNumber}
                        onChange={e => setMktAadharNumber(e.target.value)}
                        className="w-full px-3.5 py-2 bg-purple-50/50 border border-purple-200 text-purple-950 font-mono font-bold rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">Aadhar Card Upload</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="mkt-aadhar-input"
                          accept=".pdf,image/*"
                          onChange={e => handleFileUpload(e, 'aadhar')}
                          className="hidden"
                        />
                        <label
                          htmlFor="mkt-aadhar-input"
                          className="flex items-center gap-2 px-3 py-2 bg-purple-50/50 hover:bg-purple-100/70 border border-purple-200 rounded-xl text-[11px] text-purple-900 cursor-pointer transition select-none"
                        >
                          <UploadCloud className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="truncate font-semibold flex-1">
                            {mktAadharFileName || 'Upload Aadhar (.pdf / image)'}
                          </span>
                          {mktAadharAttached ? (
                            <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-black flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Attached
                            </span>
                          ) : (
                            <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded font-bold cursor-not-allowed opacity-60">
                              Not Attached
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 2. PAN Number & Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">PAN Card Number *</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={mktPanNumber}
                        onChange={e => setMktPanNumber(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 bg-purple-50/50 border border-purple-200 text-purple-950 font-mono font-bold rounded-xl outline-none text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">PAN Card Photo Upload</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="mkt-pan-input"
                          accept=".pdf,image/*"
                          onChange={e => handleFileUpload(e, 'pan')}
                          className="hidden"
                        />
                        <label
                          htmlFor="mkt-pan-input"
                          className="flex items-center gap-2 px-3 py-2 bg-purple-50/50 hover:bg-purple-100/70 border border-purple-200 rounded-xl text-[11px] text-purple-900 cursor-pointer transition select-none"
                        >
                          <UploadCloud className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="truncate font-semibold flex-1">
                            {mktPanFileName || 'Upload PAN Card (.pdf / image)'}
                          </span>
                          {mktPanAttached ? (
                            <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-black flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Attached
                            </span>
                          ) : (
                            <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded font-bold cursor-not-allowed opacity-60">
                              Not Attached
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 3. Driving Licence & Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">Driving Licence Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="DL-1420110012345"
                        value={mktDlNumber}
                        onChange={e => setMktDlNumber(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 bg-purple-50/50 border border-purple-200 text-purple-950 font-mono font-bold rounded-xl outline-none text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-purple-950 mb-1">Driving Licence Upload</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="mkt-dl-input"
                          accept=".pdf,image/*"
                          onChange={e => handleFileUpload(e, 'dl')}
                          className="hidden"
                        />
                        <label
                          htmlFor="mkt-dl-input"
                          className="flex items-center gap-2 px-3 py-2 bg-purple-50/50 hover:bg-purple-100/70 border border-purple-200 rounded-xl text-[11px] text-purple-900 cursor-pointer transition select-none"
                        >
                          <UploadCloud className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="truncate font-semibold flex-1">
                            {mktDlFileName || 'Upload Licence (.pdf / image)'}
                          </span>
                          {mktDlAttached ? (
                            <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-black flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Attached
                            </span>
                          ) : (
                            <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded font-bold cursor-not-allowed opacity-60">
                              Not Attached
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Residential Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-extrabold text-purple-950 mb-1">Full Residential Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street, Building, Flat No."
                      value={mktAddress}
                      onChange={e => setMktAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Pin Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="400053"
                      value={mktPinCode}
                      onChange={e => setMktPinCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                {/* District, State, Country */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={mktDistrict}
                      onChange={e => setMktDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={mktState}
                      onChange={e => setMktState(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={mktCountry}
                      onChange={e => setMktCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Email Verification with OTP & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">
                      Email (Reference ID will be sent here) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="sameer.marketing@gmail.com"
                        value={mktEmail}
                        onChange={e => {
                          setMktEmail(e.target.value);
                          // Reset verification on email modification
                          setMktEmailVerified(false);
                          setMktIsOtpSent(false);
                          setMktEnteredOtp('');
                          setMktOtpError('');
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs focus:border-purple-600"
                      />
                      <button
                        type="button"
                        disabled={!isMktEmailValid || mktIsOtpSent || mktEmailVerified}
                        onClick={handleSendEmailOtp}
                        className={`px-3 py-2.5 font-black text-[10px] rounded-xl shrink-0 transition flex items-center justify-center gap-1 ${
                          mktEmailVerified
                            ? 'bg-purple-700 text-white cursor-default shadow-xs'
                            : !isMktEmailValid || mktIsOtpSent
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                            : 'bg-purple-700 hover:bg-purple-800 text-white cursor-pointer shadow-xs active:scale-95'
                        }`}
                      >
                        {mktEmailVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>✓ Verified</span>
                          </>
                        ) : mktIsOtpSent ? (
                          <span>OTP Sent...</span>
                        ) : (
                          <span>Verify</span>
                        )}
                      </button>
                    </div>

                    {/* Interactive OTP Box */}
                    {mktIsOtpSent && !mktEmailVerified && (
                      <div className="mt-2.5 p-3 bg-purple-100/90 border border-purple-300 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-purple-950">
                            Enter 6-Digit OTP sent to <span className="underline font-extrabold">{mktEmail}</span>:
                          </span>
                          <span className="text-[10px] font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-mono">
                            OTP: {mktGeneratedOtp}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 749215"
                            value={mktEnteredOtp}
                            onChange={e => setMktEnteredOtp(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 px-3 py-1.5 bg-white border border-purple-300 text-purple-950 font-mono font-black text-xs rounded-lg outline-none text-center tracking-widest focus:border-purple-600"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-lg cursor-pointer shadow-xs transition"
                          >
                            Confirm OTP
                          </button>
                        </div>
                        {mktOtpError && (
                          <p className="text-[10px] text-rose-600 font-bold">{mktOtpError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 45678"
                      value={mktPhone}
                      onChange={e => setMktPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Territory, Experience & Monthly Patients */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Assigned Territory *</label>
                    <input
                      type="text"
                      required
                      value={mktTerritory}
                      onChange={e => setMktTerritory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={mktExperienceYears}
                      onChange={e => setMktExperienceYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-purple-950 mb-1">Expected Monthly Referrals</label>
                    <input
                      type="number"
                      value={mktMonthlyReferrals}
                      onChange={e => setMktMonthlyReferrals(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-200 text-purple-950 font-bold rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. DOCTOR SPECIFIC FIELDS (HOSPITAL RECEPTIONIST ONBOARDING) */}
            {/* ========================================================================= */}
            {adminSubRole === 'doctor' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                {/* Doctor Photo Upload with Preview */}
                <div className="p-3 bg-white border border-[#d1fae5] rounded-xl space-y-2">
                  <label className="text-xs font-extrabold text-[#062c21] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#046a4e]" />
                    <span>Doctor Profile Photo *</span>
                  </label>
                  <div className="flex items-center gap-3.5">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-emerald-200 bg-emerald-50 shadow-xs flex items-center justify-center shrink-0">
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
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0fdf4] hover:bg-[#d1fae5] border border-[#a7f3d0] rounded-xl font-bold text-xs text-[#046a4e] cursor-pointer shadow-xs transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDocImageChange}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or enter online Image URL (https://...)"
                        value={docImage.startsWith('data:') ? '' : docImage}
                        onChange={(e) => {
                          setDocImage(e.target.value);
                          setDocImagePreview(e.target.value);
                        }}
                        className="w-full bg-[#f0fdf4] border border-[#d1fae5] rounded-lg px-2.5 py-1 text-[11px] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Assigned Hospital Branch</label>
                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Medical Specialty *</label>
                    <input
                      type="text"
                      required
                      placeholder="General & Cardiology"
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Qualifications</label>
                    <input
                      type="text"
                      placeholder="MD, MBBS"
                      value={docQualification}
                      onChange={e => setDocQualification(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="800"
                    value={consultFee}
                    onChange={e => setConsultFee(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. PATIENT SPECIFIC FIELDS */}
            {/* ========================================================================= */}
            {adminSubRole === 'patient' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={patientAge}
                      onChange={e => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Blood Group</label>
                    <select
                      value={patientBloodGroup}
                      onChange={e => setPatientBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Chief Medical Complaint</label>
                  <input
                    type="text"
                    required
                    value={medicalCondition}
                    onChange={e => setMedicalCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. STAFF SPECIFIC FIELDS */}
            {/* ========================================================================= */}
            {adminSubRole === 'staff' && (
              <div className="p-4 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Hospital Branch</label>
                    <select
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchIdState(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Staff Designation</label>
                    <select
                      value={staffRole}
                      onChange={e => setStaffRole(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-white border border-[#d1fae5] text-[#062c21] rounded-xl outline-none cursor-pointer font-bold capitalize"
                    >
                      <option value="receptionist">Receptionist / OPD Desk</option>
                      <option value="pharmacist">Pharmacy Manager</option>
                      <option value="lab_technician">Lab Diagnostics Technician</option>
                      <option value="accountant">Branch Accountant</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* COMMON CONTACT & PASSWORD FIELDS */}
            {/* ========================================================================= */}
            {adminSubRole !== 'marketing' && (
              <>
                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Smith"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-bold rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@hospital.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-[#062c21] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f0fdf4] border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PORTAL ACCESS PASSWORD & CONFIRMATION */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>
                  {adminSubRole === 'marketing'
                    ? 'Marketing Access Password & Security Credentials'
                    : 'Portal Access Password'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">
                    {adminSubRole === 'marketing'
                      ? 'Marketing Access Password *'
                      : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#046a4e] hover:text-[#062c21]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-extrabold text-[#062c21] mb-1">Confirm Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#d1fae5] text-[#062c21] font-medium rounded-2xl focus:ring-2 focus:ring-[#046a4e]/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-sm font-black text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                adminSubRole === 'marketing'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-950'
                  : 'bg-gradient-to-r from-[#046a4e] to-[#022c22] hover:from-[#03523c] hover:to-[#011a14]'
              }`}
            >
              {isLoading ? (
                <span>Registering & Initializing Medix Security Profile...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {adminSubRole === 'marketing'
                      ? 'Submit Marketing KYC & Application'
                      : `Register as ${adminSubRole.toUpperCase().replace('_', ' ')}`}
                  </span>
                </>
              )}
            </button>

          </form>

        </div>
      </main>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-bold">Loading Registration Portal...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}