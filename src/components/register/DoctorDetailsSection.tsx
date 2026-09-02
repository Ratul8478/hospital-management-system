"use client";

import React from 'react';
import { Stethoscope, Upload, Image as ImageIcon } from 'lucide-react';

interface DoctorDetailsSectionProps {
  specialty: string;
  setSpecialty: (val: string) => void;
  consultFee: string;
  setConsultFee: (val: string) => void;
  docQualification: string;
  setDocQualification: (val: string) => void;
  docImagePreview: string;
  handleDocImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DoctorDetailsSection({
  specialty,
  setSpecialty,
  consultFee,
  setConsultFee,
  docQualification,
  setDocQualification,
  docImagePreview,
  handleDocImageChange,
}: DoctorDetailsSectionProps) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
        <Stethoscope className="w-4 h-4" />
        <span>Medical Specialist Clinical Credentials</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Clinical Specialization *
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Cardiology & Vascular Medicine">Cardiology & Vascular Medicine</option>
            <option value="Neurology & Neuro Surgery">Neurology & Neuro Surgery</option>
            <option value="Orthopedic & Joint Replacement">Orthopedic & Joint Replacement</option>
            <option value="General & Laparoscopic Surgery">General & Laparoscopic Surgery</option>
            <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
            <option value="Dermatology & Cosmetology">Dermatology & Cosmetology</option>
            <option value="Oncology & Cancer Care">Oncology & Cancer Care</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Consultation OPD Fee (?) *
          </label>
          <input
            type="number"
            value={consultFee}
            onChange={(e) => setConsultFee(e.target.value)}
            placeholder="800"
            min="100"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Medical Qualifications & Council Reg No *
        </label>
        <input
          type="text"
          value={docQualification}
          onChange={(e) => setDocQualification(e.target.value)}
          placeholder="MBBS, MD (Cardio), Reg: WBMC-84920"
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Doctor Profile Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-300 dark:border-indigo-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
            {docImagePreview ? (
              <img src={docImagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <label className="cursor-pointer px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleDocImageChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
