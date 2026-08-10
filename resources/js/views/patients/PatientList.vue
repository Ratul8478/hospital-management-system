<template>
  <AppShell>
    <div class="patients-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Patient Management Directory</h1>
          <p class="page-subtitle">Search, register new patients, inspect clinical timelines, and jump to bookings or billing.</p>
        </div>
        <div class="action-header-buttons">
          <button class="btn btn-primary" @click="showRegisterModal = true">
            + Register New Patient
          </button>
          <router-link to="/appointments" class="btn btn-secondary">
            📅 Book Appointment
          </router-link>
          <router-link to="/billing" class="btn btn-secondary">
            💳 Generate Invoice
          </router-link>
        </div>
      </div>

      <!-- Filter and Search Bar -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="search-wrap">
            <input type="text" v-model="searchQuery" @input="loadPatients" placeholder="Search by UHID, Patient Name, Phone..." class="input-field"/>
          </div>
          <select v-model="genderFilter" @change="loadPatients" class="input-field select-field">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>UHID</th>
              <th>Patient Name</th>
              <th>Gender / Age</th>
              <th>Contact Phone</th>
              <th>Blood Group</th>
              <th>Emergency Contact</th>
              <th>Registered Date</th>
              <th>Quick Workflows</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in patients" :key="patient.id">
              <td><span class="uhid-badge">{{ patient.uhid }}</span></td>
              <td><strong>{{ patient.first_name }} {{ patient.last_name }}</strong></td>
              <td>{{ patient.gender.toUpperCase() }} ({{ calculateAge(patient.dob) }} yrs)</td>
              <td>{{ patient.phone }}</td>
              <td><span class="blood-badge">{{ patient.blood_group || 'N/A' }}</span></td>
              <td>{{ patient.emergency_contact || 'N/A' }}</td>
              <td>{{ formatDate(patient.created_at) }}</td>
              <td>
                <div class="action-buttons-group">
                  <button class="btn btn-secondary btn-xs" @click="viewHistory(patient)" title="Clinical History">📜 Timeline</button>
                  <router-link to="/appointments" class="btn btn-primary btn-xs" title="Book Token">📅 Appointment</router-link>
                  <router-link to="/billing" class="btn btn-success btn-xs" title="Create Invoice">💳 Billing</router-link>
                </div>
              </td>
            </tr>
            <tr v-if="!patients.length">
              <td colspan="8" class="empty-cell">No patients found matching query.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Patient Registration Modal -->
      <div v-if="showRegisterModal" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>New Patient Registration</h3>
            <button class="close-btn" @click="showRegisterModal = false">×</button>
          </div>

          <div v-if="duplicateWarning" class="alert-box alert-warning">
            ⚠️ {{ duplicateWarningMessage }}
            <div class="modal-footer" style="margin-top: 10px;">
              <button class="btn btn-warning btn-sm" @click="confirmDuplicateRegister">Confirm & Force Register</button>
            </div>
          </div>

          <form @submit.prevent="submitPatient" class="form-grid">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" v-model="form.first_name" required class="input-field"/>
            </div>

            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" v-model="form.last_name" required class="input-field"/>
            </div>

            <div class="form-group">
              <label>Gender *</label>
              <select v-model="form.gender" required class="input-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" v-model="form.dob" required class="input-field"/>
            </div>

            <div class="form-group">
              <label>Contact Phone *</label>
              <input type="text" v-model="form.phone" required class="input-field"/>
            </div>

            <div class="form-group">
              <label>Blood Group</label>
              <select v-model="form.blood_group" class="input-field">
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Address</label>
              <textarea v-model="form.address" rows="2" class="input-field"></textarea>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="showRegisterModal = false">Cancel</button>
              <button type="submit" :disabled="submitting" class="btn btn-primary">
                {{ submitting ? 'Generating UHID...' : 'Register Patient' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Patient Clinical History Modal -->
      <div v-if="selectedPatientHistory" class="modal-backdrop">
        <div class="modal-card card large-modal">
          <div class="modal-header">
            <div>
              <h3>Clinical Timeline: {{ selectedPatientHistory.first_name }} {{ selectedPatientHistory.last_name }}</h3>
              <span class="uhid-badge">{{ selectedPatientHistory.uhid }}</span>
            </div>
            <button class="close-btn" @click="selectedPatientHistory = null">×</button>
          </div>

          <div class="history-content">
            <div class="history-section">
              <h4>Past Prescriptions ({{ selectedPatientHistory.prescriptions?.length || 0 }})</h4>
              <div class="history-list">
                <div v-for="p in selectedPatientHistory.prescriptions" :key="p.id" class="history-card">
                  <div class="history-card-header">
                    <strong>Dr. {{ p.doctor?.user?.name }}</strong> — {{ formatDate(p.created_at) }}
                  </div>
                  <p><strong>Diagnosis:</strong> {{ p.diagnosis }}</p>
                  <p><strong>Clinical Notes:</strong> {{ p.clinical_notes }}</p>
                </div>
              </div>
            </div>

            <div class="history-section">
              <h4>IPD Admissions ({{ selectedPatientHistory.ipd_admissions?.length || 0 }})</h4>
              <div class="history-list">
                <div v-for="adm in selectedPatientHistory.ipd_admissions" :key="adm.id" class="history-card">
                  <div class="history-card-header">
                    <strong>Bed: {{ adm.bed?.bed_number }} ({{ adm.bed?.ward_type }})</strong>
                  </div>
                  <p>Admitted: {{ formatDate(adm.admission_date) }} | Status: {{ adm.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import AppShell from '../../layouts/AppShell.vue';

const route = useRoute();
const patients = ref([]);
const searchQuery = ref('');
const genderFilter = ref('');
const showRegisterModal = ref(false);
const submitting = ref(false);
const duplicateWarning = ref(false);
const duplicateWarningMessage = ref('');
const selectedPatientHistory = ref(null);

const form = ref({
  first_name: '',
  last_name: '',
  gender: 'male',
  dob: '1990-01-01',
  phone: '',
  blood_group: 'O+',
  address: '',
});

function calculateAge(dob) {
  if (!dob) return 'N/A';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString();
}

async function loadPatients() {
  try {
    const res = await axios.get('/api/v1/patients', {
      params: { search: searchQuery.value, gender: genderFilter.value }
    });
    if (res.data.success) {
      patients.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load patients:', err);
  }
}

async function submitPatient(confirmDuplicate = false) {
  submitting.value = true;
  duplicateWarning.value = false;
  try {
    const payload = { ...form.value };
    if (confirmDuplicate) payload.confirm_duplicate = true;

    const res = await axios.post('/api/v1/patients', payload);
    if (res.data.success) {
      showRegisterModal.value = false;
      loadPatients();
      alert(`Patient successfully registered! Generated UHID: ${res.data.data.uhid}`);
    }
  } catch (err) {
    if (err.response?.status === 409) {
      duplicateWarning.value = true;
      duplicateWarningMessage.value = err.response.data.message;
    } else {
      alert(err.response?.data?.message || 'Failed to register patient.');
    }
  } finally {
    submitting.value = false;
  }
}

function confirmDuplicateRegister() {
  submitPatient(true);
}

async function viewHistory(patient) {
  try {
    const res = await axios.get(`/api/v1/patients/${patient.id}/history`);
    if (res.data.success) {
      selectedPatientHistory.value = res.data.data;
    }
  } catch (err) {
    alert('Failed to load clinical history.');
  }
}

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch;
    loadPatients();
  }
}, { immediate: true });

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  loadPatients();
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.action-header-buttons {
  display: flex;
  gap: 10px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-navy);
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.filter-card {
  margin-bottom: 20px;
  padding: 16px;
}

.filter-row {
  display: flex;
  gap: 16px;
}

.search-wrap {
  flex: 1;
}

.select-field {
  width: 180px;
}

.uhid-badge {
  background: var(--color-navy-dark);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.blood-badge {
  background: #FDE8E8;
  color: var(--color-danger);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
}

.action-buttons-group {
  display: flex;
  gap: 6px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 59, 93, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  padding: 24px;
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.alert-box {
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.alert-warning {
  background: #FFF7E6;
  border: 1px solid var(--color-warning);
  color: #8A5A00;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.history-section h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 8px;
}

.history-card {
  background: var(--color-app-bg);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 8px;
  font-size: 13px;
}
</style>
