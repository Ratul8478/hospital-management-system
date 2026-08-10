<template>
  <AppShell>
    <div class="appointments-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Appointment & Token Queue</h1>
          <p class="page-subtitle">Real-time daily consultation queue, walk-in token generation, and integrated lab/pharmacy workflows.</p>
        </div>
        <div class="action-header-buttons">
          <button class="btn btn-primary" @click="showBookingModal = true">
            + Book New Appointment
          </button>
          <router-link to="/laboratory" class="btn btn-secondary">
            🔬 Order Lab Test
          </router-link>
          <router-link to="/pharmacy" class="btn btn-secondary">
            💊 Dispense Medicine
          </router-link>
        </div>
      </div>

      <!-- Queue Controls -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="form-group">
            <label>Filter Date</label>
            <input type="date" v-model="filterDate" @change="loadAppointments" class="input-field"/>
          </div>
          <div class="form-group">
            <label>Filter Status</label>
            <select v-model="filterStatus" @change="loadAppointments" class="input-field">
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="waiting">Waiting</option>
              <option value="in_consultation">In Consultation</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Daily Token Queue Grid -->
      <div class="queue-grid">
        <div v-for="apt in appointments" :key="apt.id" class="token-card card">
          <div class="token-card-header">
            <span class="big-token">#{{ apt.token_number }}</span>
            <span class="badge" :class="getStatusBadgeClass(apt.status)">{{ apt.status.toUpperCase() }}</span>
          </div>

          <div class="token-card-body">
            <p class="patient-name">{{ apt.patient?.first_name }} {{ apt.patient?.last_name }}</p>
            <p class="uhid-text">{{ apt.patient?.uhid }} | 📞 {{ apt.patient?.phone }}</p>
            <div class="doctor-tag">
              👨‍⚕️ Dr. {{ apt.doctor?.user?.name }} ({{ apt.department?.name }})
            </div>
            <p class="reason-text" v-if="apt.reason_for_visit">Reason: {{ apt.reason_for_visit }}</p>
          </div>

          <div class="token-card-actions">
            <button v-if="apt.status === 'scheduled'" class="btn btn-secondary btn-xs" @click="updateStatus(apt.id, 'waiting')">Mark Waiting</button>
            <button v-if="apt.status === 'waiting'" class="btn btn-primary btn-xs" @click="updateStatus(apt.id, 'in_consultation')">Start Consultation</button>
            <button v-if="apt.status === 'in_consultation'" class="btn btn-success btn-xs" @click="updateStatus(apt.id, 'completed')">Complete Consultation</button>
            <button v-if="['scheduled', 'waiting'].includes(apt.status)" class="btn btn-danger btn-xs" @click="updateStatus(apt.id, 'cancelled')">Cancel</button>

            <!-- Connected ERP Modules -->
            <router-link to="/billing" class="btn btn-secondary btn-xs" title="Generate Bill">💳 Bill</router-link>
            <router-link to="/laboratory" class="btn btn-secondary btn-xs" title="Order Lab">🔬 Lab</router-link>
          </div>
        </div>

        <div v-if="!appointments.length" class="empty-queue card full-width">
          No appointments found for the selected date and filters.
        </div>
      </div>

      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Book Appointment & Generate Token</h3>
            <button class="close-btn" @click="showBookingModal = false">×</button>
          </div>

          <form @submit.prevent="submitBooking" class="form-grid">
            <div class="form-group full-width">
              <label>Select Registered Patient *</label>
              <select v-model="form.patient_id" required class="input-field">
                <option v-for="p in patientOptions" :key="p.id" :value="p.id">
                  {{ p.first_name }} {{ p.last_name }} ({{ p.uhid }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Department *</label>
              <select v-model="form.department_id" required class="input-field">
                <option value="1">Cardiology (CARD)</option>
                <option value="2">Neurology (NEUR)</option>
                <option value="3">Orthopedics (ORTH)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Doctor *</label>
              <select v-model="form.doctor_id" required class="input-field">
                <option value="1">Dr. Robert Chen (Cardiology)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Appointment Date *</label>
              <input type="date" v-model="form.appointment_date" required class="input-field"/>
            </div>

            <div class="form-group">
              <label>Type</label>
              <select v-model="form.type" class="input-field">
                <option value="walk_in">Walk-in</option>
                <option value="online">Online</option>
                <option value="referral">Referral</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Reason for Visit</label>
              <input type="text" v-model="form.reason_for_visit" placeholder="e.g. Chest tightness checkup" class="input-field"/>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="showBookingModal = false">Cancel</button>
              <button type="submit" :disabled="booking" class="btn btn-primary">
                {{ booking ? 'Locking Token...' : 'Book & Issue Token' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AppShell from '../../layouts/AppShell.vue';

const appointments = ref([]);
const patientOptions = ref([]);
const filterDate = ref(new Date().toISOString().split('T')[0]);
const filterStatus = ref('');
const showBookingModal = ref(false);
const booking = ref(false);

const form = ref({
  patient_id: 1,
  doctor_id: 1,
  department_id: 1,
  appointment_date: new Date().toISOString().split('T')[0],
  type: 'walk_in',
  reason_for_visit: '',
});

function getStatusBadgeClass(status) {
  switch (status) {
    case 'completed': return 'badge-success';
    case 'in_consultation': return 'badge-info';
    case 'waiting': return 'badge-warning';
    case 'cancelled': return 'badge-danger';
    default: return 'badge-info';
  }
}

async function loadAppointments() {
  try {
    const res = await axios.get('/api/v1/appointments', {
      params: { date: filterDate.value, status: filterStatus.value }
    });
    if (res.data.success) {
      appointments.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load queue:', err);
  }
}

async function loadPatients() {
  try {
    const res = await axios.get('/api/v1/patients');
    if (res.data.success) {
      patientOptions.value = res.data.data;
      if (patientOptions.value.length > 0) {
        form.value.patient_id = patientOptions.value[0].id;
      }
    }
  } catch (err) {}
}

async function updateStatus(id, newStatus) {
  try {
    const res = await axios.patch(`/api/v1/appointments/${id}/status`, { status: newStatus });
    if (res.data.success) {
      loadAppointments();
    }
  } catch (err) {
    alert('Failed to update status.');
  }
}

async function submitBooking() {
  booking.value = true;
  try {
    const res = await axios.post('/api/v1/appointments', form.value);
    if (res.data.success) {
      showBookingModal.value = false;
      loadAppointments();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Booking failed.');
  } finally {
    booking.value = false;
  }
}

onMounted(() => {
  loadAppointments();
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

.queue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.token-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.token-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.big-token {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-navy);
}

.patient-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.uhid-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.doctor-tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-action-blue);
  background: #EBF4FC;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.reason-text {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
  font-style: italic;
}

.token-card-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(18, 59, 93, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 550px;
  background: #ffffff;
  padding: 24px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
