"use client";

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Stethoscope, UserPlus, X, Upload, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DoctorsPage() {
  const { doctors, branches, selectedBranchId, addDoctor } = useApp();

  // Receptionist Doctor Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docFee, setDocFee] = useState('800');
  const [docContact, setDocContact] = useState('');
  const [docQualification, setDocQualification] = useState('');
  const [docBranchId, setDocBranchId] = useState<number>(
    selectedBranchId === 'all' ? 1 : selectedBranchId
  );
  const [docImage, setDocImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredDoctors = selectedBranchId === 'all'
    ? (doctors || [])
    : (doctors || []).filter(d => d && d.branchId === selectedBranchId);

  // Handle local image file upload & convert to base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDocImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const formattedName = docName.startsWith('Dr.') ? docName : `Dr. ${docName}`;
    const targetBranch = (branches || []).find(b => b.id === docBranchId) || branches[0] || { name: 'Hospital Branch' };

    addDoctor({
      branchId: docBranchId,
      name: formattedName,
      specialty: docSpecialty || 'General & Clinical Medicine',
      fee: parseFloat(docFee) || 800,
      status: 'available',
      contact: docContact || '+91 9804222142',
      image: docImage || undefined,
      qualification: docQualification || 'MD, MBBS',
      registeredBy: `Hospital Receptionist (${targetBranch?.name || 'Hospital Branch'})`,
      registrationDate: new Date().toISOString().split('T')[0],
    });

    setSuccessMsg(`Doctor registered successfully with profile photo by Hospital Receptionist!`);
    setTimeout(() => {
      setSuccessMsg('');
      setDocName('');
      setDocSpecialty('');
      setDocFee('800');
      setDocContact('');
      setDocQualification('');
      setDocImage('');
      setImagePreview('');
      setIsRegisterModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-[#046a4e]" />
            <span>Specialist Doctors & OPD Roster</span>
          </h1>
          <p className="text-xs text-slate-500">
            Registered and onboarded by individual Hospital Receptionists & Front Desk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
            {filteredDoctors.length} Active Specialists
          </span>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="py-2.5 px-4 bg-[#046a4e] hover:bg-[#03543e] text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Register Doctor (Receptionist Desk)</span>
          </button>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Doctors Added Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The doctor roster is currently empty. Doctors registered by individual hospital receptionists will automatically appear here with their profile photo in real-time.
          </p>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="mt-2 py-2.5 px-5 bg-[#046a4e] hover:bg-[#03543e] text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Register First Doctor Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const branch = branches.find(b => b.id === doc.branchId);
            return (
              <div key={doc.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Doctor Photo / Avatar */}
                    {doc.image ? (
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-md shrink-0 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-[#046a4e] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#046a4e]/20 shrink-0">
                        {doc.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">{doc.name}</h3>
                      <p className="text-xs font-bold text-[#046a4e] mt-0.5">{doc.specialty}</p>
                      {doc.qualification && (
                        <p className="text-[10px] text-slate-400 font-medium">{doc.qualification}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-900 text-white rounded shrink-0">
                    {branch?.code || 'HQ'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <div className="flex items-center justify-between">
                    <span>OPD Consultation Fee:</span>
                    <span className="font-black text-slate-900 text-sm">₹{doc.fee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Availability Status:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                      doc.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.status === 'busy'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>{doc.status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact Line:</span>
                    <span className="font-bold text-slate-700 font-mono">{doc.contact}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Onboarding Desk:</span>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{doc.registeredBy || 'Hospital Reception Desk'}</span>
                    </span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-emerald-50 text-[#046a4e] hover:bg-[#046a4e] hover:text-white font-extrabold text-xs border border-emerald-200 transition-all cursor-pointer">
                  Book OPD Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER DOCTOR WITH PHOTO (HOSPITAL RECEPTIONIST DESK) */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Hospital Reception Desk
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">Register New Doctor</h3>
              <p className="text-xs text-slate-500">
                Individual hospital reception registration with doctor profile image
              </p>
            </div>

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterDoctor} className="space-y-4 text-xs font-medium">
              {/* Doctor Image / Photo Upload Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#046a4e]" />
                  <span>Doctor Profile Image / Photo *</span>
                </label>

                <div className="flex items-center gap-4">
                  {/* Photo Preview */}
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Doctor Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-1 text-slate-400">
                        <Upload className="h-6 w-6 mx-auto mb-1 text-slate-400" />
                        <span className="text-[9px] font-bold block">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-800 cursor-pointer shadow-xs transition">
                      <Upload className="w-3.5 h-3.5 text-[#046a4e]" />
                      <span>Upload Doctor Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <input
                        type="text"
                        placeholder="Or enter online Image URL (https://...)"
                        value={docImage.startsWith('data:') ? '' : docImage}
                        onChange={(e) => {
                          setDocImage(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-medium outline-none focus:border-[#046a4e]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Branch Selector */}
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">Assigned Hospital Facility</label>
                <select
                  value={docBranchId}
                  onChange={(e) => setDocBranchId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#046a4e] cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              {/* Doctor Full Name */}
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

              {/* Specialty & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Medical Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="General & Cardiology Medicine"
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Qualifications / Degrees</label>
                  <input
                    type="text"
                    placeholder="MD, DNB, MBBS"
                    value={docQualification}
                    onChange={(e) => setDocQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              {/* Consultation Fee & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">OPD Consultation Fee (₹) *</label>
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
                  <label className="text-xs font-extrabold text-slate-900 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9804222142"
                    value={docContact}
                    onChange={(e) => setDocContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium outline-none focus:border-[#046a4e]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#046a4e] hover:bg-[#03543e] text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <UserPlus className="h-4 w-4" />
                <span>Confirm Doctor Registration & Save Photo</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
