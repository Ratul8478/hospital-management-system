<template>
  <div class="login-container">
    <div class="login-card card">
      <div class="login-header">
        <div class="brand-logo-circle-login">
          <img :src="logoUrl" alt="Medix Health Grow India Logo" class="login-brand-logo-img" />
        </div>
        <h2>Medix Hospital ERP</h2>
        <p class="subtitle">Enter your credentials to access the HMS multi-branch portal.</p>
      </div>

      <div v-if="authStore.error" class="alert-box alert-danger">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" required placeholder="admin@hms.com" class="input-field"/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required placeholder="••••••••" class="input-field"/>
        </div>

        <button type="submit" :disabled="authStore.loading" class="btn btn-primary btn-block">
          {{ authStore.loading ? 'Authenticating...' : 'Sign In to HMS' }}
        </button>
      </form>

      <div class="quick-credentials">
        <p class="quick-title">Quick Demo Login Presets:</p>
        <div class="preset-section-label">GLOBAL & BRANCH CENTRAL ADMINS:</div>
        <div class="preset-buttons">
          <button @click="fillPreset('admin@hms.com')" class="preset-chip chip-super">Global Super Admin</button>
          <button @click="fillPreset('admin.main@hms.com')" class="preset-chip chip-admin">Main Branch Admin</button>
          <button @click="fillPreset('admin.north@hms.com')" class="preset-chip chip-admin">North Branch Admin</button>
          <button @click="fillPreset('admin.east@hms.com')" class="preset-chip chip-admin">East Branch Admin</button>
        </div>

        <div class="preset-section-label" style="margin-top: 10px;">BRANCH CLINICAL STAFF (MAIN BRANCH):</div>
        <div class="preset-buttons">
          <button @click="fillPreset('reception.main@hms.com')" class="preset-chip">Receptionist</button>
          <button @click="fillPreset('doctor.main@hms.com')" class="preset-chip">Doctor</button>
          <button @click="fillPreset('accountant.main@hms.com')" class="preset-chip">Accountant</button>
          <button @click="fillPreset('pharmacy.main@hms.com')" class="preset-chip">Pharmacist</button>
          <button @click="fillPreset('lab.main@hms.com')" class="preset-chip">Lab Technician</button>
          <button @click="fillPreset('partner.main@hms.com')" class="preset-chip">Franchise Partner</button>
        </div>
      </div>

      <div class="back-home-link">
        <router-link to="/">← Back to Landing Page</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const logoUrl = '/images/logo.png';
const email = ref('admin@hms.com');
const password = ref('Password@123');
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email;
    password.value = 'Password@123';
  }
});

function fillPreset(presetEmail) {
  email.value = presetEmail;
  password.value = 'Password@123';
}

async function handleLogin() {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push('/dashboard');
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EBF5FF 0%, #F0F9FF 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(2, 132, 199, 0.15);
  border: 1px solid #BAE6FD;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo-circle-login {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--color-border);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6px;
  margin: 0 auto 16px;
}

.login-brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

h2 {
  font-size: 20px;
  font-weight: 800;
  color: #0C4A6E;
}

.subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.btn-block {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
}

.alert-box {
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.alert-danger {
  background: #FDE8E8;
  color: var(--color-danger);
  border: 1px solid #F8B4B4;
}

.quick-credentials {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.quick-title {
  font-size: 12px;
  font-weight: 800;
  color: #0369A1;
  margin-bottom: 10px;
}

.preset-section-label {
  font-size: 10px;
  font-weight: 800;
  color: #64748B;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-chip {
  padding: 5px 10px;
  font-size: 11px;
  background: #F0F4F8;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.chip-super {
  background: #0284C7;
  color: #ffffff;
}

.chip-admin {
  background: #E0F2FE;
  color: #0369A1;
  border-color: #7DD3FC;
}

.preset-chip:hover {
  background: var(--color-action-blue);
  color: #ffffff;
}

.back-home-link {
  text-align: center;
  margin-top: 18px;
  font-size: 13px;
}

.back-home-link a {
  color: var(--color-action-blue);
  text-decoration: none;
  font-weight: 600;
}
</style>
