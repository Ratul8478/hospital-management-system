"use client";

import React, { useState } from 'react';
import {
  Share2,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Mail,
  Check,
} from 'lucide-react';
import StateDistrictSelector from '@/components/StateDistrictSelector';

interface MarketingKycSectionProps {
  mktFullName: string;
  setMktFullName: (val: string) => void;
  mktGender: 'Male' | 'Female' | 'Other';
  setMktGender: (val: 'Male' | 'Female' | 'Other') => void;
  mktFatherOrMother: string;
  setMktFatherOrMother: (val: string) => void;
  mktDob: string;
  setMktDob: (val: string) => void;
  mktBloodGroup: string;
  setMktBloodGroup: (val: string) => void;
  mktAadharNumber: string;
  setMktAadharNumber: (val: string) => void;
  mktAadharFileName: string;
  mktAadharAttached: boolean;
  mktPanNumber: string;
  setMktPanNumber: (val: string) => void;
  mktPanFileName: string;
  mktPanAttached: boolean;
  mktDlNumber: string;
  setMktDlNumber: (val: string) => void;
  mktDlFileName: string;
  mktDlAttached: boolean;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'aadhar' | 'pan' | 'dl'
  ) => void;
  mktAddress: string;
  setMktAddress: (val: string) => void;
  mktPinCode: string;
  setMktPinCode: (val: string) => void;
  mktState: string;
  setMktState: (val: string) => void;
  mktDistrict: string;
  setMktDistrict: (val: string) => void;
  mktEmail: string;
  setMktEmail: (val: string) => void;
  mktPhone: string;
  setMktPhone: (val: string) => void;
  mktEmailVerified: boolean;
  setMktEmailVerified: (val: boolean) => void;
  mktTerritory: string;
  setMktTerritory: (val: string) => void;
  mktExperienceYears: string;
  setMktExperienceYears: (val: string) => void;
  mktMonthlyReferrals: string;
  setMktMonthlyReferrals: (val: string) => void;
  mktNotes: string;
  setMktNotes: (val: string) => void;
  setError: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function MarketingKycSection(props: MarketingKycSectionProps) {
  // Email OTP state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Phone SMS OTP state
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState('');
  const [phoneOtpToken, setPhoneOtpToken] = useState('');
  const [phoneOtpError, setPhoneOtpError] = useState('');
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.mktEmail.trim());

  const handleSendEmailOtp = () => {
    if (!isEmailValid) {
      props.setError('Please enter a valid email address first.');
      return;
    }
    props.setError('');
    setOtpError('');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setIsOtpSent(true);
    props.setMktEmailVerified(false);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === generatedOtp.trim()) {
      props.setMktEmailVerified(true);
      setIsOtpSent(false);
      setOtpError('');
      props.setSuccessMsg('Email verified successfully!');
      setTimeout(() => props.setSuccessMsg(''), 2500);
    } else {
      setOtpError('Invalid OTP. Please check and enter the 6-digit OTP correctly.');
    }
  };

  // Direct Phone SMS OTP Dispatch Handler
  const handleSendPhoneSmsOtp = async () => {
    const clean = props.mktPhone.trim().replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      props.setError('Please enter a valid 10-digit mobile number before requesting SMS OTP.');
      return;
    }

    props.setError('');
    setPhoneOtpError('');
    setIsSendingPhoneOtp(true);

    try {
      const res = await fetch('/api/v1/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: props.mktPhone, purpose: 'registration' }),
      });
      const data = await res.json();
      setIsSendingPhoneOtp(false);

      if (res.ok && data.success) {
        setIsPhoneOtpSent(true);
        setPhoneOtpToken(data.data?.otpToken || '');
        props.setSuccessMsg(`📱 ${data.data?.message || 'SMS OTP sent to mobile number!'}`);
        setTimeout(() => props.setSuccessMsg(''), 3000);
      } else {
        props.setError(data.error?.message || 'Failed to dispatch SMS OTP.');
      }
    } catch {
      setIsSendingPhoneOtp(false);
      props.setError('Network error while requesting phone SMS OTP.');
    }
  };

  // Direct Phone SMS OTP Verification Handler
  const handleVerifyPhoneSmsOtp = async () => {
    if (enteredPhoneOtp.trim().length !== 6) {
      setPhoneOtpError('Please enter all 6 digits of the SMS OTP.');
      return;
    }

    setPhoneOtpError('');
    setIsVerifyingPhoneOtp(true);

    try {
      const res = await fetch('/api/v1/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: props.mktPhone,
          otp: enteredPhoneOtp.trim(),
          otpToken: phoneOtpToken,
        }),
      });
      const data = await res.json();
      setIsVerifyingPhoneOtp(false);

      if (res.ok && data.success) {
        setPhoneVerified(true);
        setIsPhoneOtpSent(false);
        setPhoneOtpError('');
        props.setSuccessMsg('🎉 Mobile number verified successfully!');
        setTimeout(() => props.setSuccessMsg(''), 3000);
      } else {
        setPhoneOtpError(data.error?.message || 'Invalid SMS OTP code. Please check your SMS.');
      }
    } catch {
      setIsVerifyingPhoneOtp(false);
      setPhoneOtpError('Network error while verifying SMS OTP.');
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
        <Share2 className="w-4 h-4" />
        <span>Marketing Representative KYC & Territorial Details</span>
      </div>

      {/* Basic Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Legal Name *
          </label>
          <input
            type="text"
            value={props.mktFullName}
            onChange={(e) => props.setMktFullName(e.target.value)}
            placeholder="As per Aadhaar Card"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Father / Mother / Spouse Name *
          </label>
          <input
            type="text"
            value={props.mktFatherOrMother}
            onChange={(e) => props.setMktFatherOrMother(e.target.value)}
            placeholder="Guardian name"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            value={props.mktDob}
            onChange={(e) => props.setMktDob(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* KYC Documents */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Government Identification Documents (Aadhaar / PAN / DL)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aadhaar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Aadhaar Number (12 Digits) *
            </label>
            <input
              type="text"
              value={props.mktAadharNumber}
              onChange={(e) => props.setMktAadharNumber(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{props.mktAadharAttached ? props.mktAadharFileName : 'Upload Aadhaar PDF/Image (Max 4MB)'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => props.handleFileUpload(e, 'aadhar')}
                className="hidden"
              />
            </label>
          </div>

          {/* PAN */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              PAN Number (10 Characters) *
            </label>
            <input
              type="text"
              value={props.mktPanNumber}
              onChange={(e) => props.setMktPanNumber(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase"
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{props.mktPanAttached ? props.mktPanFileName : 'Upload PAN PDF/Image (Max 4MB)'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => props.handleFileUpload(e, 'pan')}
                className="hidden"
              />
            </label>
          </div>

          {/* Driving Licence */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Driving Licence No (Optional)
            </label>
            <input
              type="text"
              value={props.mktDlNumber}
              onChange={(e) => props.setMktDlNumber(e.target.value.toUpperCase())}
              placeholder="MH-02-20150001234"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase"
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{props.mktDlAttached ? props.mktDlFileName : 'Upload DL PDF/Image (Max 4MB)'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => props.handleFileUpload(e, 'dl')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* State & District Selector */}
      <StateDistrictSelector
        selectedState={props.mktState}
        selectedDistrict={props.mktDistrict}
        onStateChange={(st) => props.setMktState(st)}
        onDistrictChange={(dist) => props.setMktDistrict(dist)}
      />

      {/* Address & Pin Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Residential Address *
          </label>
          <input
            type="text"
            value={props.mktAddress}
            onChange={(e) => props.setMktAddress(e.target.value)}
            placeholder="House/Flat No, Street, Landmark"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pin Code (6 Digits) *
          </label>
          <input
            type="text"
            value={props.mktPinCode}
            onChange={(e) => props.setMktPinCode(e.target.value)}
            placeholder="400050"
            maxLength={6}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Mobile Phone Number & Real-Time SMS OTP Verification */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Contact Mobile Number (Direct SMS OTP Verification) *
          </label>
          {phoneVerified && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mobile Number Verified</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="tel"
              value={props.mktPhone}
              onChange={(e) => {
                props.setMktPhone(e.target.value);
                setPhoneVerified(false);
              }}
              placeholder="+91 98200 45678"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {!phoneVerified && (
            <button
              type="button"
              disabled={isSendingPhoneOtp || !props.mktPhone.trim()}
              onClick={handleSendPhoneSmsOtp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              {isSendingPhoneOtp ? 'Sending SMS...' : isPhoneOtpSent ? 'Resend SMS OTP' : 'Send Phone SMS OTP'}
            </button>
          )}
        </div>

        {isPhoneOtpSent && !phoneVerified && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={enteredPhoneOtp}
              onChange={(e) => setEnteredPhoneOtp(e.target.value)}
              placeholder="Enter 6-Digit SMS OTP"
              maxLength={6}
              className="w-48 px-3 py-1.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              disabled={isVerifyingPhoneOtp || enteredPhoneOtp.length < 6}
              onClick={handleVerifyPhoneSmsOtp}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isVerifyingPhoneOtp ? 'Verifying...' : 'Verify Phone'}</span>
            </button>
            {phoneOtpError && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{phoneOtpError}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Email & OTP Verification */}
      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email ID for Account Communications *
          </label>
          {props.mktEmailVerified && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Email Verified</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={props.mktEmail}
              onChange={(e) => {
                props.setMktEmail(e.target.value);
                props.setMktEmailVerified(false);
              }}
              placeholder="representative@gmail.com"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {!props.mktEmailVerified && (
            <button
              type="button"
              onClick={handleSendEmailOtp}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {isOtpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
          )}
        </div>

        {isOtpSent && !props.mktEmailVerified && (
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter 6-Digit OTP"
              maxLength={6}
              className="w-44 px-3 py-1.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
            {otpError && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{otpError}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Target Territory & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Marketing Territory *
          </label>
          <input
            type="text"
            value={props.mktTerritory}
            onChange={(e) => props.setMktTerritory(e.target.value)}
            placeholder="e.g. South & West Suburbs Healthcare Hub"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Field Healthcare Experience (Years) *
          </label>
          <input
            type="number"
            value={props.mktExperienceYears}
            onChange={(e) => props.setMktExperienceYears(e.target.value)}
            placeholder="5"
            min="0"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expected Monthly Patient Referrals *
          </label>
          <input
            type="number"
            value={props.mktMonthlyReferrals}
            onChange={(e) => props.setMktMonthlyReferrals(e.target.value)}
            placeholder="30"
            min="1"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
