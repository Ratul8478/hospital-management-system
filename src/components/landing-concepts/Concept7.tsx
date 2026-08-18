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
  Star,
  Activity,
  Award,
  Video,
  FileCheck,
  UserCheck,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import ConceptHeader from './ConceptHeader';
import ScrollVideoStory from '../ScrollVideoStory';

export default function Concept7() {
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const clinicalSpecialties = [
    {
      title: 'Cardiology & Heart Center',
      tagline: 'Comprehensive coronary care, non-invasive diagnostics & emergency cardiac triage.',
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-50',
      badge: '24/7 Cath Lab Ready',
    },
    {
      title: 'Neurology & Brain Spine',
      tagline: 'Advanced neuro-navigation, stroke intervention & comprehensive rehabilitation.',
      icon: Activity,
      iconColor: 'text-purple-600 bg-purple-50',
      badge: 'Specialized Neuro ICU',
    },
    {
      title: 'Orthopedics & Trauma Care',
      tagline: 'Joint replacement, arthroscopic surgery & multi-specialty trauma resuscitation.',
      icon: Stethoscope,
      iconColor: 'text-teal-600 bg-teal-50',
      badge: 'Level-1 Trauma Center',
    },
    {
      title: 'Mother & Child Care',
      tagline: 'High-risk obstetrics, gentle birthing suites & neonatal intensive care (NICU).',
      icon: Smile,
      iconColor: 'text-pink-600 bg-pink-50',
      badge: 'Advanced NICU Care',
    },
    {
      title: 'Oncology & Daycare Care',
      tagline: 'Targeted immunotherapy, surgical oncology & dedicated chemotherapy daycare wards.',
      icon: Award,
      iconColor: 'text-amber-600 bg-amber-50',
      badge: 'Molecular Tumor Board',
    },
    {
      title: 'Diagnostic Pathology & Imaging',
      tagline: 'High-throughput biochemistry, automated histopathology & digital radiology telemetry.',
      icon: FileCheck,
      iconColor: 'text-cyan-600 bg-cyan-50',
      badge: 'NABL Certified Labs',
    },
  ];

  const campusLocations = [
    { name: 'Medix Central Multispecialty Hospital', city: 'Mumbai (Central Campus)', type: 'Tertiary Care Hospital' },
    { name: 'Medix Specialty & Trauma Center', city: 'Bengaluru (South Campus)', type: 'Trauma & Ortho Super-Specialty' },
    { name: 'Medix Mother & Child Super-Specialty', city: 'New Delhi (North Campus)', type: 'Pediatric & Maternity Center' },
    { name: 'Medix Daycare & Diagnostic Satellite Hub', city: 'Pune (West Campus)', type: 'Daycare & Pathology Center' },
    { name: 'Medix Advanced Oncology Care Center', city: 'Hyderabad (Central Campus II)', type: 'Cancer Care Institute' },
    { name: 'Medix Cardiac & Neuro Institute', city: 'Kolkata (East Campus)', type: 'Super-Specialty Hospital' },
    { name: 'Medix Regional Wellness Clinic', city: 'Guwahati (North-East Campus)', type: 'Nephrology & Wellness Clinic' },
    { name: 'Medix Coastal Orthopedic Institute', city: 'Chennai (Coastal Campus)', type: 'Orthopedic Specialty' },
    { name: 'Medix Emergency Poly-Clinic', city: 'Ahmedabad (West Corridor)', type: 'Emergency & Satellite Care' },
  ];

  const careSteps = [
    {
      step: '01',
      title: 'Register in Care Portal',
      desc: 'Create your secure profile in under 2 minutes. Receive your permanent digital Universal Health ID (UHID).',
    },
    {
      step: '02',
      title: 'Select Doctor or Specialty',
      desc: 'Browse verified faculty across our 9 hospital campuses. Choose between In-Clinic OPD or encrypted HD Telehealth.',
    },
    {
      step: '03',
      title: 'Instant Consultation & E-Prescription',
      desc: 'Attend your consultation with zero waiting. Access lab orders, digital prescriptions, and discharge summaries anytime.',
    },
  ];

  const testimonials = [
    {
      patient: 'Anjali Deshmukh',
      city: 'Mumbai',
      condition: 'Cardiology Care',
      quote: 'The digital check-in and instantaneous token dispatch saved hours. Dr. Sullivan took complete time to explain the diagnosis with empathy.',
      rating: 5,
    },
    {
      patient: 'Vikramaditya Sen',
      city: 'Bengaluru',
      condition: 'Orthopedic Rehabilitation',
      quote: 'My entire electronic health history was already loaded when I visited the Bengaluru trauma campus. World-class experience and super clean facility.',
      rating: 5,
    },
    {
      patient: 'Pooja Kashyap',
      city: 'New Delhi',
      condition: 'Maternity Care',
      quote: 'Telehealth booking made remote consults so simple during my pregnancy. The prescription link arrived on WhatsApp in 10 seconds!',
      rating: 5,
    },
  ];

  const faqItems = [
    {
      question: 'How do I access doctor appointments and live consultation tokens?',
      answer: 'To protect patient confidentiality and clinical records, live doctor consultations and token booking are accessible inside the authenticated Care Portal. Please Sign In or Register to view faculty schedules and book appointments.',
    },
    {
      question: 'Is my health history synchronized across all 9 Medix campuses?',
      answer: 'Yes. With Medix Unified EHR, your medical records, diagnostic test reports, and billing receipts are seamlessly accessible at any of our 9 campuses under your single UHID.',
    },
    {
      question: 'How do Hospital Administrators and Doctors join the Medix Network?',
      answer: 'Medical professionals and branch administrators can apply via the Registration Portal. Super Admin reviews applications to verify clinical certifications before provisioning isolated dashboard access.',
    },
    {
      question: 'Can I consult doctors remotely via Telehealth?',
      answer: 'Yes. Board-certified specialists offer secure, end-to-end encrypted video consultations with instant digital prescriptions sent directly to your registered portal and WhatsApp.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-emerald-950 font-sans selection:bg-emerald-300 selection:text-emerald-950">
      
      {/* MANDATORY UNIFIED HEADER */}
      <ConceptHeader theme="pastels" />

      {/* HERO SECTION: ULTRA-PREMIUM MINIMALISM & CLINICAL EMPOWERMENT */}
      <section className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600 live-pulse"></span>
              <Heart className="w-4 h-4 text-emerald-600 fill-emerald-500" />
              <span>HEALTH GROW INDIA • CERTIFIED DIGITAL CARE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-emerald-950 tracking-tight leading-[1.08]">
              Gentle, human-centered care management for clinics.
            </h1>

            <p className="text-lg sm:text-xl text-emerald-800 leading-relaxed max-w-2xl font-medium">
              Medix Pastel offers a serene, comforting design system that puts patient peace of mind, unified EHR, and effortless doctor consultations first.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-sm shadow-xl shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer btn-premium-3d"
              >
                Join Care Portal <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-white border border-emerald-300 text-emerald-950 font-extrabold text-sm hover:bg-emerald-50 transition-all shadow-xs"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Micro Live Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-200/80">
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#046a4e] block">9 Campuses</span>
                <span className="text-xs text-emerald-800 font-bold">Unified Network</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#046a4e] block">99.4%</span>
                <span className="text-xs text-emerald-800 font-bold">Patient Trust Score</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#046a4e] block">24 / 7</span>
                <span className="text-xs text-emerald-800 font-bold">Helpline & OPD Care</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Scroll-Scrubbed Video Storyboard */}
          <div className="lg:col-span-5">
            <ScrollVideoStory />
          </div>

        </div>
      </section>

      {/* SECTION 2: CLINICAL SPECIALTIES MATRIX */}
      <section id="features" className="py-20 bg-white border-y border-emerald-100">
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
                  className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] hover:shadow-xl transition-all space-y-4 card-3d flex flex-col justify-between"
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
              className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 card-3d relative overflow-hidden"
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
              <h2 className="text-3xl font-black text-emerald-950">9 Connected Hospital Campuses</h2>
              <p className="text-xs text-emerald-800 font-medium">Integrated electronic health records, surgical wards, and digital pharmacy networks across India.</p>
            </div>
            
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow transition-all flex items-center gap-2 w-fit cursor-pointer btn-premium-3d"
            >
              <Building2 className="w-4 h-4" /> Join Hospital Network
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusLocations.map((campus, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#f0fdf4] border border-emerald-200 shadow-xs hover:border-[#046a4e] transition-all space-y-3 card-3d flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700">
                    <MapPin className="w-3.5 h-3.5 fill-rose-600 text-white shrink-0" />
                    <span>{campus.city}</span>
                  </div>
                  
                  <h3 className="font-black text-base text-emerald-950 leading-snug">{campus.name}</h3>
                  <p className="text-xs text-emerald-800 font-medium">{campus.type}</p>
                </div>

                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-[#046a4e]">
                  <span>Active Care Campus</span>
                  <span className="text-slate-400">● Live Node</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: VERIFIED PATIENT TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#046a4e] bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            PATIENT VOICES & TRUST
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950">Patient Stories of Healing</h2>
          <p className="text-xs text-emerald-800 font-medium">Read genuine feedback from patients and families treated across our 9 campuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-emerald-950 block">{review.patient}</span>
                  <span className="text-[11px] text-slate-500">{review.city} • {review.condition}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
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
              DIRECT 24/7 PATIENT SUPPORT & CONTACT
            </span>
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">Connect with Medix Care Team</h2>
            <p className="text-xs text-emerald-800 font-medium">Instant helpline and WhatsApp connection to our patient triage desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* CARD 1: DIRECT PHONE CALL */}
            <div className="flex flex-col items-start justify-between p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 hover:border-[#046a4e] transition-all card-3d">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#046a4e] text-white flex items-center justify-center shrink-0 shadow-md">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[#046a4e] font-extrabold uppercase tracking-wider">Direct Call Helpline</div>
                  <div className="text-base font-black text-emerald-950">+91 91443 76971</div>
                </div>
              </div>

              <a
                href="tel:+919144376971"
                className="w-full py-3 bg-[#046a4e] hover:bg-[#03523c] text-white font-extrabold text-xs rounded-full shadow-md text-center transition-all flex items-center justify-center gap-2 cursor-pointer btn-premium-3d"
              >
                <PhoneCall className="w-4 h-4" /> Call +91 91443 76971 Now
              </a>
            </div>

            {/* CARD 2: INSTANT WHATSAPP CHAT */}
            <div className="flex flex-col items-start justify-between p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 hover:border-emerald-600 transition-all card-3d">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider">WhatsApp Support</div>
                  <div className="text-base font-black text-emerald-950">+91 91443 76971</div>
                </div>
              </div>

              <a
                href="https://wa.me/919144376971?text=Hello%20Medix%20Hospital%20System,%20I%20would%20like%20to%20inquire%20about%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md text-center transition-all flex items-center justify-center gap-2 cursor-pointer btn-premium-3d"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>

          </div>

          <div className="text-center pt-6 border-t border-emerald-200/80 text-xs text-emerald-800 font-bold">
            © 2026 Medix Hospital Management System • Health Grow India. All Rights Reserved.
          </div>
        </div>
      </section>

      {/* FLOATING DIRECT CONTACT PILLS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/919144376971?text=Hello%20Medix%20Hospital%20System,%20I%20would%20like%20to%20inquire%20about%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-2xl transition-all hover:scale-105 cursor-pointer btn-premium-3d"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp: +91 91443 76971</span>
        </a>

        <a
          href="tel:+919144376971"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#046a4e] hover:bg-[#03523c] text-white font-black text-xs shadow-2xl transition-all hover:scale-105 cursor-pointer btn-premium-3d"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call: +91 91443 76971</span>
        </a>
      </div>

    </div>
  );
}
