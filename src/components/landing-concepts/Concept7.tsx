"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Smile,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  Building2,
  Lock,
  ChevronDown,
  ChevronUp,
  Activity,
  Award,
  FileCheck,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Zap,
  Microscope,
  BedDouble,
  Shield,
  HelpCircle
} from 'lucide-react';
import ConceptHeader from './ConceptHeader';
import HeroScrollCanvasBackground from '../HeroScrollCanvasBackground';

export default function Concept7() {
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const clinicalPillars = [
    {
      title: '24/7 Emergency & ICU Care',
      desc: 'Round-the-clock emergency triage, acute cardiac resuscitation, and ventilator-equipped critical care.',
      icon: Activity,
      badge: 'Immediate Triage',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      title: 'Universal Digital Health ID (UHID)',
      desc: 'Single permanent health identity connecting your consultations, digital prescriptions, and lab history.',
      icon: ShieldCheck,
      badge: 'Encrypted Records',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Multidisciplinary Medical Faculty',
      desc: 'Board-certified specialists across Cardiology, Neurology, Orthopedics, and Maternal-Fetal medicine.',
      icon: Stethoscope,
      badge: 'Verified Specialists',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      title: 'In-House NABL Diagnostics',
      desc: 'Automated high-throughput biochemistry, hematology, and digital pathology with rapid reporting.',
      icon: Microscope,
      badge: 'NABL Certified',
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
  ];

  const clinicalSpecialties = [
    {
      title: 'Cardiology & Heart Center',
      tagline: 'Comprehensive coronary care, non-invasive cardiac diagnostics, ECG telemetry & emergency triage.',
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-50',
      badge: '24/7 Cath Lab Ready',
    },
    {
      title: 'Neurology & Brain Spine',
      tagline: 'Advanced neuro-navigation, acute stroke intervention protocols & structured clinical rehabilitation.',
      icon: Activity,
      iconColor: 'text-purple-600 bg-purple-50',
      badge: 'Specialized Neuro ICU',
    },
    {
      title: 'Orthopedics & Trauma Care',
      tagline: 'Joint replacement, arthroscopic interventions, fracture reduction & comprehensive trauma resuscitation.',
      icon: Stethoscope,
      iconColor: 'text-teal-600 bg-teal-50',
      badge: 'Level-1 Trauma Center',
    },
    {
      title: 'Mother & Child Care',
      tagline: 'High-risk obstetrics, gentle birthing suites, fetal monitoring & neonatal intensive care (NICU).',
      icon: Smile,
      iconColor: 'text-pink-600 bg-pink-50',
      badge: 'Advanced NICU Care',
    },
    {
      title: 'Oncology & Daycare Care',
      tagline: 'Targeted medical oncology, surgical evaluations & dedicated sterile chemotherapy daycare wards.',
      icon: Award,
      iconColor: 'text-amber-600 bg-amber-50',
      badge: 'Molecular Tumor Board',
    },
    {
      title: 'Diagnostic Pathology & Imaging',
      tagline: 'High-throughput biochemistry, automated histopathology, digital radiology & rapid clinical telemetry.',
      icon: FileCheck,
      iconColor: 'text-cyan-600 bg-cyan-50',
      badge: 'NABL Certified Labs',
    },
  ];

  const careSteps = [
    {
      step: '01',
      title: 'Create Your Care Profile',
      desc: 'Register online in under 2 minutes. Receive your permanent digital Universal Health ID (UHID) instantly.',
    },
    {
      step: '02',
      title: 'Select Doctor & Consultation Mode',
      desc: 'Browse verified faculty across our clinical departments. Choose between In-Clinic OPD or encrypted HD Telehealth.',
    },
    {
      step: '03',
      title: 'Consult & Access E-Prescriptions',
      desc: 'Experience zero administrative waiting. Instant digital prescriptions and diagnostic orders synchronize directly to your care portal.',
    },
  ];

  const hospitalSafeguards = [
    {
      title: 'NABH-Aligned Infection Control',
      desc: 'Stringent sterilization protocols across all operating theaters, ICUs, and general wards.',
      icon: Shield,
    },
    {
      title: '256-Bit Encrypted EHR Privacy',
      desc: 'Health records and clinical telemetry are protected under standard digital healthcare privacy guidelines.',
      icon: Lock,
    },
    {
      title: 'Transparent E-Billing & Estimates',
      desc: 'Clear itemized billing for procedures, diagnostics, and pharmacy with zero hidden charges.',
      icon: FileCheck,
    },
    {
      title: '24/7 On-Site Emergency Pharmacy',
      desc: 'Fully stocked critical care medications, antibiotics, and essential therapeutic inventory.',
      icon: Zap,
    },
  ];

  const faqItems = [
    {
      question: 'How do I access doctor appointments and live consultation tokens?',
      answer: 'Live doctor appointments and consultation token tracking are managed inside our authenticated Care Portal. Please Sign In or Register to view verified specialist schedules and reserve your OPD slot.',
    },
    {
      question: 'How does the Universal Health ID (UHID) work?',
      answer: 'Your UHID is a unique, permanent healthcare identifier. Once generated, your doctor visit notes, e-prescriptions, diagnostic lab results, and discharge summaries are unified under your profile with secure online access.',
    },
    {
      question: 'How do Hospital Administrators and Doctors join the Medix Network?',
      answer: 'Licensed physicians and hospital branch administrators can submit applications via the Registration Portal. Super Admin verifies medical council registrations and certifications before provisioning isolated dashboard access.',
    },
    {
      question: 'Are remote telehealth consultations available?',
      answer: 'Yes. Board-certified specialists offer secure, end-to-end encrypted video consultations with instant digital prescriptions accessible directly in your patient care portal and via WhatsApp.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-emerald-950 font-sans selection:bg-emerald-300 selection:text-emerald-950">
      
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="pastels" />

      {/* HERO SECTION: VIDEO CANVAS WITH REFINED PRODUCTION OVERLAY */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] bg-[#f0fdf4] overflow-hidden flex flex-col justify-between">
        
        {/* Full Screen Crystal Clear Canvas Video Layer */}
        <div className="absolute inset-0 z-0">
          <HeroScrollCanvasBackground totalFrames={102} framePrefix="/hero-frames/" fps={24} />
        </div>

        {/* Subtle Readability Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:via-white/70 lg:via-white/50 z-10 pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24 flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            
            {/* Top Facility Accreditation Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#046a4e] text-xs font-black tracking-wide shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#046a4e]" />
              <span>ARIYAN HOSPITAL MULTISPECIALITY • 24/7 EMERGENCY READY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.1]">
              Advanced Clinical Care &amp; Unified Digital Health Records
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-emerald-900 font-medium leading-relaxed max-w-xl">
              Experience compassionate clinical consultations, real-time consultation token tracking, and unified health records at Ariyan Hospital Multispeciality.
            </p>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/20 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer btn-premium-3d"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Consultation / Register</span>
              </Link>

              <a
                href="#features"
                className="px-5 py-3.5 rounded-full bg-white/90 hover:bg-white text-emerald-950 font-extrabold text-xs sm:text-sm border border-emerald-300 shadow-md backdrop-blur-md transition-all hover:border-emerald-500 flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-[#046a4e]" />
                <span>Explore Specialties</span>
              </a>

              <a
                href="tel:+919144376971"
                className="px-4 py-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs sm:text-sm border border-rose-200 shadow-xs transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-rose-700" />
                <span>Emergency: +91 9144376971</span>
              </a>
            </div>

            {/* Quick Micro-Features */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-bold text-emerald-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#046a4e]" />
                <span>Permanent Digital UHID</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#046a4e]" />
                <span>Zero OPD Waiting Lines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#046a4e]" />
                <span>Encrypted EHR Records</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 4 CORE CLINICAL PILLARS RIBBON */}
      <section className="relative z-20 -mt-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clinicalPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-md hover:border-[#046a4e] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-emerald-950">{pillar.title}</h3>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: CLINICAL SPECIALTIES MATRIX */}
      <section id="features" className="py-20 mt-12 bg-white border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              CENTERS OF CLINICAL EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              Specialized Medical Care Across Every Discipline
            </h2>
            <p className="text-emerald-800 text-sm font-medium">
              From advanced coronary interventions to dedicated maternal care, our hospital campuses provide state-of-the-art diagnostics and compassionate therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalSpecialties.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${spec.iconColor} shrink-0 shadow-xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {spec.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-emerald-950">{spec.title}</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      {spec.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-[#046a4e]">
                    <Link href="/register" className="flex items-center gap-1 hover:underline">
                      Consult Specialists <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: 3-STEP DIGITAL CARE JOURNEY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#046a4e] bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            EFFORTLESS DIGITAL PATIENT JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">How Medix Care Works</h2>
          <p className="text-xs text-emerald-800 font-medium">Experience zero administrative friction from registration to recovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careSteps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className="text-4xl font-black text-emerald-200 tracking-tight">
                {item.step}
              </div>

              <h3 className="font-black text-xl text-emerald-950">{item.title}</h3>
              
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: NATIONWIDE 9-CAMPUS NETWORK PREVIEW */}
      <section id="about" className="py-20 bg-white border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#046a4e]">CONNECTED HEALTHCARE INFRASTRUCTURE</span>
              <h2 className="text-3xl font-black text-emerald-950">Ariyan Hospital Multispeciality Campus</h2>
              <p className="text-xs text-emerald-800 font-medium">Integrated electronic health records, surgical wards, and digital pharmacy network.</p>
            </div>
            
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow transition-all flex items-center gap-2 w-fit cursor-pointer btn-premium-3d"
            >
              <Building2 className="w-4 h-4" /> Join Hospital Network
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                  <MapPin className="w-3.5 h-3.5 fill-rose-600 text-white shrink-0" />
                  <span>Kolkata, West Bengal (HQ Campus)</span>
                </div>
                
                <h3 className="font-black text-base text-emerald-950 leading-snug">ARIYAN HOSPITAL MULTISPECIALITY</h3>
                <p className="text-xs text-emerald-800 font-medium">Multispeciality Hospital, Emergency Trauma &amp; Diagnostic Center</p>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-[#046a4e]">
                <span>Active Care Campus</span>
                <span className="text-emerald-700 font-extrabold">● Live Node</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#046a4e]">
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Telehealth Network Hub</span>
                </div>
                
                <h3 className="font-black text-base text-emerald-950 leading-snug">Medix Digital Care Network</h3>
                <p className="text-xs text-emerald-800 font-medium">Encrypted video consultations and instant e-prescription delivery</p>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-[#046a4e]">
                <span>Online OPD Active</span>
                <span className="text-emerald-700 font-extrabold">● 24/7 Available</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Branch Expansion</span>
                </div>
                
                <h3 className="font-black text-base text-emerald-950 leading-snug">Hospital Partner Program</h3>
                <p className="text-xs text-emerald-800 font-medium">Empowering nursing homes and diagnostic centers with Medix cloud EHR</p>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-[#046a4e]">
                <Link href="/register" className="hover:underline flex items-center gap-1">
                  Apply for Network Affiliation <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: CLINICAL QUALITY & DATA SAFEGUARDS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#046a4e] bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            CLINICAL EXCELLENCE &amp; PATIENT GOVERNANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">Patient Safety &amp; Quality Commitments</h2>
          <p className="text-xs text-emerald-800 font-medium">Stringent clinical standards, encrypted medical telemetry, and transparent operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalSafeguards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-[#046a4e] w-fit border border-emerald-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-emerald-950">{item.title}</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-100 text-[11px] font-bold text-[#046a4e] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Standard Protocol</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section className="py-20 bg-white border-y border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#046a4e] bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-black text-emerald-950">Got Questions? We&apos;ve Got Answers.</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-emerald-200 bg-[#f0fdf4] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-black text-sm text-emerald-950 flex items-center justify-between cursor-pointer hover:text-[#046a4e]"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#046a4e]" /> : <ChevronDown className="w-4 h-4 text-emerald-600" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-emerald-800 leading-relaxed font-medium border-t border-emerald-200/60 pt-3 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: DIRECT 24/7 HELPLINE & CONTACT */}
      <section id="contact" className="py-16 bg-[#f0fdf4] border-t border-emerald-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#046a4e] bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-xs">
              DIRECT 24/7 PATIENT SUPPORT &amp; CONTACT
            </span>
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">Connect with Medix Care Team</h2>
            <p className="text-xs text-emerald-800 font-medium">Instant helpline and WhatsApp connection to our patient triage desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* CARD 1: DIRECT PHONE CALL */}
            <div className="flex flex-col items-start justify-between p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 hover:border-[#046a4e] transition-all">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#046a4e] text-white flex items-center justify-center shrink-0 shadow-md">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[#046a4e] font-extrabold uppercase tracking-wider">Reception Call Helpline</div>
                  <div className="text-base font-black text-emerald-950">+91 9144376971</div>
                </div>
              </div>

              <a
                href="tel:+919144376971"
                className="w-full py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-extrabold text-xs rounded-full shadow-md text-center transition-all flex items-center justify-center gap-2 cursor-pointer btn-premium-3d"
              >
                <PhoneCall className="w-4 h-4" /> Call +91 9144376971 Now
              </a>
            </div>

            {/* CARD 2: INSTANT WHATSAPP CHAT */}
            <div className="flex flex-col items-start justify-between p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 hover:border-emerald-600 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider">Reception WhatsApp</div>
                  <div className="text-base font-black text-emerald-950">+91 7810900370</div>
                </div>
              </div>

              <a
                href="https://wa.me/917810900370?text=Hello%20Ariyan%20Hospital%20Multispeciality%20Reception%2C%20I%20would%20like%20to%20inquire%20about%20doctor%20appointments%20and%20hospital%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md text-center transition-all flex items-center justify-center gap-2 cursor-pointer btn-premium-3d"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-900 font-semibold">
            <div>
              © 2026 ARIYAN HOSPITAL MULTISPECIALITY • Newtown, Kolkata 700157. All Rights Reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-emerald-800">
              <Link href="/privacy-policy" className="hover:text-emerald-950 transition-colors">
                Privacy Policy &amp; Data Safety
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-emerald-950 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/doctor-app" className="hover:text-emerald-950 transition-colors">
                Doctor Companion App
              </Link>
              <span>•</span>
              <Link href="/login" className="hover:text-emerald-950 transition-colors">
                Staff Login
              </Link>
              <span>•</span>
              <Link href="/register" className="hover:text-emerald-950 transition-colors">
                Patient Registration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING DIRECT CONTACT PILLS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/917810900370?text=Hello%20Ariyan%20Hospital%20Multispeciality%20Reception%2C%20I%20would%20like%20to%20inquire%20about%20doctor%20appointments%20and%20hospital%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-2xl transition-all hover:scale-105 cursor-pointer btn-premium-3d"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp: +91 7810900370</span>
        </a>

        <a
          href="tel:+919144376971"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow-2xl transition-all hover:scale-105 cursor-pointer btn-premium-3d"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call: +91 9144376971</span>
        </a>
      </div>

    </div>
  );
}
