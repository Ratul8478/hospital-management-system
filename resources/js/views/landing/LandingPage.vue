<template>
  <div class="medisystem-landing">
    <!-- Top Navigation Header -->
    <header class="top-navbar">
      <div class="container navbar-container">
        <!-- Brand Logo with Medix Logo Image -->
        <router-link to="/" class="brand-logo-wrap">
          <div class="brand-logo-circle">
            <img :src="logoUrl" alt="Medix Logo" class="brand-logo-img" />
          </div>
          <div class="brand-text-wrap">
            <span class="brand-name">MediSystem</span>
          </div>
        </router-link>

        <!-- Navbar Menu Links -->
        <nav class="nav-menu">
          <a href="#features" class="nav-link active">Features</a>
          <a href="#solutions" class="nav-link">Solutions</a>
          <a href="#about" class="nav-link">About</a>
          <a href="#contact" class="nav-link">Contact</a>
        </nav>

        <!-- Navbar Right Action Button -->
        <div class="nav-actions">
          <router-link to="/login" class="btn btn-navy">
            Get Started
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg-accent"></div>
      <div class="container hero-grid">
        <!-- Hero Left Column Text -->
        <div class="hero-left">
          <h1 class="hero-headline">
            Precision in Care,<br />
            <span class="text-blue">Efficiency in</span><br />
            <span class="text-blue">Management.</span>
          </h1>
          <p class="hero-description">
            Empower your clinical staff with our all-in-one HMS. Streamline workflows, improve patient outcomes, and manage operations with ease.
          </p>

          <div class="hero-cta-buttons">
            <router-link to="/login" class="btn btn-navy btn-lg">
              Get Started for Free
            </router-link>
            <router-link to="/dashboard" class="btn btn-outline btn-lg">
              <span class="info-icon">ℹ️</span> See How It Works
            </router-link>
          </div>
        </div>

        <!-- Hero Right Column Desktop Mockup Photo -->
        <div class="hero-right">
          <div class="hero-image-frame">
            <img :src="heroHospitalUrl" alt="Hospital Management Desktop Dashboard Mockup" class="hero-hospital-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- Trust & Metrics Bar -->
    <section class="trust-bar-section">
      <div class="container trust-grid">
        <div class="trust-item">
          <div class="trust-icon-box">🏥</div>
          <div class="trust-text">
            <span class="trust-num">500+</span>
            <span class="trust-label">HOSPITALS TRUST US</span>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon-box">⚡</div>
          <div class="trust-text">
            <span class="trust-num">99.9%</span>
            <span class="trust-label">UPTIME</span>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon-box">🛡️</div>
          <div class="trust-text">
            <span class="trust-num">HIPAA</span>
            <span class="trust-label">COMPLIANT</span>
          </div>
        </div>
      </div>
    </section>

    <!-- "Comprehensive Clinical Tools" Grid Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-center-header">
          <h2 class="section-title-dark">Comprehensive Clinical Tools</h2>
          <p class="section-subtitle-muted">
            Everything you need to manage your healthcare facility efficiently and securely.
          </p>
        </div>

        <div class="clinical-tools-grid">
          <router-link to="/patients" class="tool-card card">
            <div class="tool-icon-box">📋</div>
            <h3>EHR</h3>
            <p>Secure and accessible digital patient records, instantly available to authorized personnel.</p>
          </router-link>

          <router-link to="/appointments" class="tool-card card">
            <div class="tool-icon-box">📅</div>
            <h3>Smart Scheduling</h3>
            <p>Automated appointment booking and intelligent reminders to reduce no-shows.</p>
          </router-link>

          <router-link to="/billing" class="tool-card card">
            <div class="tool-icon-box">💳</div>
            <h3>Financial Management</h3>
            <p>Integrated billing, insurance claims processing, and complete revenue cycle management.</p>
          </router-link>

          <router-link to="/pharmacy" class="tool-card card">
            <div class="tool-icon-box">🔬</div>
            <h3>Pharmacy & Lab</h3>
            <p>End-to-end management of inventory, prescriptions, and synchronized lab reports.</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- "Featured Solutions" Section -->
    <section id="solutions" class="solutions-section">
      <div class="container">
        <div class="section-center-header">
          <h2 class="section-title-dark">Featured Solutions</h2>
          <p class="section-subtitle-muted">
            Discover how our advanced tools empower your medical staff and improve patient outcomes.
          </p>
        </div>

        <div class="solutions-stack">
          <!-- Solution 1 -->
          <div class="solution-row">
            <div class="solution-photo-frame">
              <img :src="diagnosticsUrl" alt="Precision Diagnostics Laboratory Device" class="solution-photo-img" />
            </div>
            <div class="solution-content">
              <h3>Precision Diagnostics</h3>
              <p>
                AI-driven insights for faster decision making. Empower your diagnostic teams with cutting-edge tools that improve accuracy and elevate the standard of patient care.
              </p>
              <router-link to="/laboratory" class="solution-link">
                Learn more ➔
              </router-link>
            </div>
          </div>

          <!-- Solution 2 (Alternating) -->
          <div class="solution-row reverse">
            <div class="solution-content">
              <h3>Seamless Collaboration</h3>
              <p>
                Real-time communication for clinical teams. Break down silos, share vital information instantly, and ensure that every care provider is on the exact same page.
              </p>
              <router-link to="/admin/users" class="solution-link">
                Learn more ➔
              </router-link>
            </div>
            <div class="solution-media-box">
              <span class="big-solution-icon">👥</span>
            </div>
          </div>

          <!-- Solution 3 -->
          <div class="solution-row">
            <div class="solution-media-box">
              <span class="big-solution-icon">💙</span>
            </div>
            <div class="solution-content">
              <h3>Patient-Centric Care</h3>
              <p>
                Tools designed to improve the patient journey. Keep patients engaged, informed, and comfortable throughout their entire care pathway with personalized experiences.
              </p>
              <router-link to="/patients" class="solution-link">
                Learn more ➔
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call To Action (CTA) Banner -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-banner-box">
          <h2>Ready to Transform Your Healthcare Facility?</h2>
          <p>
            Join hundreds of leading hospitals upgrading their management systems for better patient care.
          </p>
          <router-link to="/login" class="btn btn-white-pill">
            Schedule a Demo
          </router-link>
        </div>
      </div>
    </section>

    <!-- Multi-Column Footer -->
    <footer id="about" class="main-footer">
      <div class="container footer-grid">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <div class="brand-logo-circle footer-logo-circle">
              <img :src="logoUrl" alt="Medix" class="footer-logo-img"/>
            </div>
            <span class="footer-brand-title">MediSystem</span>
          </div>
          <p class="footer-motto">Precision in Care.</p>
          <p class="footer-copy">© 2026 MediSystem HMS. All rights reserved.</p>
        </div>

        <div class="footer-col">
          <h4>PRODUCT</h4>
          <router-link to="/dashboard">Executive Dashboard</router-link>
          <router-link to="/patients">Patient Directory</router-link>
          <router-link to="/appointments">Consultation Queue</router-link>
          <router-link to="/beds">IPD Bed Matrix</router-link>
          <router-link to="/billing">Billing & Accounting</router-link>
        </div>

        <div class="footer-col">
          <h4>SOLUTIONS</h4>
          <router-link to="/pharmacy">Pharmacy Inventory</router-link>
          <router-link to="/laboratory">Laboratory Reports</router-link>
          <router-link to="/franchise">Franchise Partner Portal</router-link>
          <router-link to="/admin/users">Super Admin RBAC</router-link>
        </div>

        <div class="footer-col">
          <h4>LEGAL</h4>
          <a href="#security">Privacy Policy</a>
          <a href="#security">Terms of Service</a>
          <a href="#security">Security Compliance</a>
          <a href="#security">Documentation</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const logoUrl = '/images/logo.png';
const heroHospitalUrl = '/images/hero_hospital.png';
const diagnosticsUrl = '/images/precision_diagnostics.png';
</script>

<style scoped>
.medisystem-landing {
  min-height: 100vh;
  background-color: #FFFFFF;
  color: #0F172A;
  font-family: var(--font-family);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Top Navbar */
.top-navbar {
  height: 76px;
  background: #ffffff;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #E2E8F0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 3px;
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.brand-name {
  font-size: 22px;
  font-weight: 800;
  color: #0B2545;
  letter-spacing: -0.5px;
}

.nav-menu {
  display: flex;
  gap: 36px;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link.active {
  color: #0B2545;
  font-weight: 700;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: #0B2545;
  border-radius: 2px;
}

.nav-link:hover {
  color: #0B2545;
}

.btn-navy {
  background-color: #0B2545;
  color: #ffffff;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-navy:hover {
  background-color: #003893;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 80px 0 60px;
  background: #ffffff;
  overflow: hidden;
}

.hero-bg-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
  background: radial-gradient(circle at 10% 20%, #EBF4FE 0%, #F5F9FF 50%, transparent 80%);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.hero-headline {
  font-size: 50px;
  font-weight: 800;
  line-height: 1.15;
  color: #0B2545;
  letter-spacing: -1.2px;
}

.text-blue {
  color: #003893;
}

.hero-description {
  font-size: 16px;
  color: #64748B;
  line-height: 1.6;
  max-width: 480px;
}

.hero-cta-buttons {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 15px;
  border-radius: 8px;
}

.btn-outline {
  background: #ffffff;
  border: 1px solid #CBD5E1;
  color: #0F172A;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
}

.btn-outline:hover {
  background: #F8FAFC;
  border-color: #94A3B8;
}

.info-icon {
  font-size: 14px;
}

/* Hero Right Image Frame */
.hero-right {
  position: relative;
  z-index: 2;
}

.hero-image-frame {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(11, 37, 69, 0.15);
  border: 1px solid #E2E8F0;
}

.hero-hospital-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Trust Bar */
.trust-bar-section {
  padding: 36px 0;
  background: #ffffff;
  border-top: 1px solid #E2E8F0;
  border-bottom: 1px solid #E2E8F0;
}

.trust-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trust-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #EEF5FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #0B2545;
}

.trust-text {
  display: flex;
  flex-direction: column;
}

.trust-num {
  font-size: 20px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1;
}

.trust-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Features Section */
.features-section {
  padding: 90px 0;
  background: #ffffff;
}

.section-center-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 60px;
}

.section-title-dark {
  font-size: 32px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.5px;
}

.section-subtitle-muted {
  font-size: 15px;
  color: #64748B;
  margin-top: 10px;
  line-height: 1.5;
}

.clinical-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.tool-card {
  background: #ffffff;
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: #003893;
  box-shadow: 0 12px 28px rgba(11, 37, 69, 0.08);
}

.tool-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #EEF5FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 20px;
}

.tool-card h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 8px;
}

.tool-card p {
  font-size: 14px;
  color: #64748B;
  line-height: 1.6;
}

/* Solutions Section */
.solutions-section {
  padding: 90px 0;
  background: #ffffff;
}

.solutions-stack {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.solution-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.solution-photo-frame {
  height: 260px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.solution-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.solution-media-box {
  height: 260px;
  background: #E0EBFF;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-solution-icon {
  font-size: 64px;
  color: #0B2545;
}

.solution-content h3 {
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 14px;
}

.solution-content p {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
  margin-bottom: 20px;
}

.solution-link {
  font-size: 15px;
  font-weight: 700;
  color: #003893;
  text-decoration: none;
}

.solution-link:hover {
  text-decoration: underline;
}

/* CTA Banner */
.cta-banner-section {
  padding: 60px 0;
}

.cta-banner-box {
  background: linear-gradient(135deg, #0B2545 0%, #0047AB 100%);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: #ffffff;
  box-shadow: 0 20px 40px rgba(11, 37, 69, 0.2);
}

.cta-banner-box h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-banner-box p {
  font-size: 16px;
  color: #E2E8F0;
  max-width: 600px;
  margin: 0 auto 30px;
}

.btn-white-pill {
  background: #ffffff;
  color: #0B2545;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 800;
  border-radius: 30px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.btn-white-pill:hover {
  background: #F8FAFC;
  transform: translateY(-2px);
}

/* Main Footer */
.main-footer {
  padding: 80px 0 40px;
  background: #FAFAFA;
  border-top: 1px solid #E2E8F0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.footer-logo-circle {
  width: 38px;
  height: 38px;
}

.footer-brand-title {
  font-size: 18px;
  font-weight: 800;
  color: #0B2545;
}

.footer-motto {
  font-size: 14px;
  color: #64748B;
  font-weight: 600;
}

.footer-copy {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 24px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col h4 {
  font-size: 12px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.footer-col a {
  font-size: 14px;
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-col a:hover {
  color: #0B2545;
}
</style>
