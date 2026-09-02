"use client";

import React from 'react';
import { Heart } from 'lucide-react';

interface PatientDetailsSectionProps {
  patientAge: string;
  setPatientAge: (val: string) => void;
  patientGender: string;
  setPatientGender: (val: string) => void;
  patientBloodGroup: string;
  setPatientBloodGroup: (val: string) => void;
  medicalCondition: string;
  setMedicalCondition: (val: string) => void;
}

export default function PatientDetailsSection({
  patientAge,
  setPatientAge,
  patientGender,
  setPatientGender,
  patientBloodGroup,
  setPatientBloodGroup,
  medicalCondition,
  setMedicalCondition,
}: PatientDetailsSectionProps) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
        <Heart className="w-4 h-4" />
        <span>Patient Demographics & Medical Profile</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Age (Years) *
          </label>
          <input
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="35"
            min="1"
            max="125"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Gender *
          </label>
          <select
            value={patientGender}
            onChange={(e) => setPatientGender(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Blood Group *
          </label>
          <select
            value={patientBloodGroup}
            onChange={(e) => setPatientBloodGroup(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Chief Medical Complaint / Reason for Registration *
        </label>
        <input
          type="text"
          value={medicalCondition}
          onChange={(e) => setMedicalCondition(e.target.value)}
          placeholder="e.g. Chest pain evaluation, routine checkup, diabetes management"
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
        />
      </div>
    </div>
  );
}
