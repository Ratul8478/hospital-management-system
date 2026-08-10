<template>
  <AppShell>
    <div class="beds-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">IPD Bed Occupancy Matrix</h1>
          <p class="page-subtitle">Real-time status across ICU, General, Private, and Deluxe wards with atomic bed transfer control.</p>
        </div>
      </div>

      <!-- Ward Type Filter Tabs -->
      <div class="ward-tabs">
        <button class="tab-btn" :class="{ active: activeWard === 'all' }" @click="activeWard = 'all'">All Wards</button>
        <button class="tab-btn" :class="{ active: activeWard === 'icu' }" @click="activeWard = 'icu'">ICU Wards</button>
        <button class="tab-btn" :class="{ active: activeWard === 'general' }" @click="activeWard = 'general'">General Wards</button>
        <button class="tab-btn" :class="{ active: activeWard === 'private' }" @click="activeWard = 'private'">Private Rooms</button>
        <button class="tab-btn" :class="{ active: activeWard === 'deluxe' }" @click="activeWard = 'deluxe'">Deluxe Suites</button>
      </div>

      <!-- Beds Grid Matrix -->
      <div class="beds-matrix-grid">
        <div 
          v-for="bed in filteredBeds" 
          :key="bed.id" 
          class="bed-card card" 
          :class="bed.status"
        >
          <div class="bed-card-header">
            <span class="bed-number">{{ bed.bed_number }}</span>
            <span class="badge" :class="getBedStatusBadgeClass(bed.status)">{{ bed.status.toUpperCase() }}</span>
          </div>

          <div class="bed-card-body">
            <p class="ward-type-text">{{ bed.ward_type.toUpperCase() }} | {{ bed.floor_room }}</p>
            <p class="daily-rate">${{ bed.daily_charge }}/day</p>

            <div v-if="bed.status === 'occupied' && bed.admissions?.length" class="occupied-details">
              <hr/>
              <p class="patient-title">Patient Admitted:</p>
              <p class="patient-name"><strong>{{ bed.admissions[0].patient?.first_name }} {{ bed.admissions[0].patient?.last_name }}</strong></p>
              <p class="uhid-text">{{ bed.admissions[0].patient?.uhid }}</p>

              <button class="btn btn-secondary btn-xs transfer-btn" @click="openTransferModal(bed.admissions[0])">
                🔁 Transfer Bed
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Atomic Bed Transfer Modal -->
      <div v-if="showTransferModal" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Execute Atomic Bed Transfer</h3>
            <button class="close-btn" @click="showTransferModal = false">×</button>
          </div>

          <p class="modal-subtitle">
            Transferring Patient: <strong>{{ selectedAdmission?.patient?.first_name }} {{ selectedAdmission?.patient?.last_name }}</strong>
            (Current Bed: {{ selectedAdmission?.bed?.bed_number }})
          </p>

          <form @submit.prevent="executeTransfer" class="form-grid">
            <div class="form-group full-width">
              <label>Select Target Available Bed *</label>
              <select v-model="transferToBedId" required class="input-field">
                <option v-for="b in availableBedsOptions" :key="b.id" :value="b.id">
                  {{ b.bed_number }} — {{ b.ward_type.toUpperCase() }} (${{ b.daily_charge }}/day)
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Reason for Transfer *</label>
              <input type="text" v-model="transferReason" required placeholder="e.g. Upgraded to Private Ward / Clinical Observation" class="input-field"/>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="showTransferModal = false">Cancel</button>
              <button type="submit" :disabled="transferring" class="btn btn-primary">
                {{ transferring ? 'Executing Transaction...' : 'Confirm Atomic Transfer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AppShell from '../../layouts/AppShell.vue';

const beds = ref([]);
const activeWard = ref('all');
const showTransferModal = ref(false);
const selectedAdmission = ref(null);
const transferToBedId = ref(null);
const transferReason = ref('');
const transferring = ref(false);

const filteredBeds = computed(() => {
  if (activeWard.value === 'all') return beds.value;
  return beds.value.filter(b => b.ward_type === activeWard.value);
});

const availableBedsOptions = computed(() => {
  return beds.value.filter(b => b.status === 'available');
});

function getBedStatusBadgeClass(status) {
  switch (status) {
    case 'available': return 'badge-success';
    case 'occupied': return 'badge-danger';
    case 'maintenance': return 'badge-warning';
    default: return 'badge-info';
  }
}

async function loadBedMatrix() {
  try {
    const res = await axios.get('/api/v1/beds/matrix');
    if (res.data.success) {
      beds.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load beds:', err);
  }
}

function openTransferModal(admission) {
  selectedAdmission.value = admission;
  if (availableBedsOptions.value.length > 0) {
    transferToBedId.value = availableBedsOptions.value[0].id;
  }
  showTransferModal.value = true;
}

async function executeTransfer() {
  transferring.value = true;
  try {
    const res = await axios.post('/api/v1/beds/transfer', {
      ipd_admission_id: selectedAdmission.value.id,
      to_bed_id: transferToBedId.value,
      reason: transferReason.value,
    });
    if (res.data.success) {
      showTransferModal.value = false;
      loadBedMatrix();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Bed transfer failed.');
  } finally {
    transferring.value = false;
  }
}

onMounted(() => {
  loadBedMatrix();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
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

.ward-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: #ffffff;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--color-navy);
  color: #ffffff;
  border-color: var(--color-navy);
}

.beds-matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.bed-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 4px solid var(--color-border);
}

.bed-card.available { border-left-color: var(--color-success); }
.bed-card.occupied { border-left-color: var(--color-danger); }
.bed-card.maintenance { border-left-color: var(--color-warning); }

.bed-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bed-number {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-navy);
}

.ward-type-text {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.daily-rate {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.occupied-details {
  margin-top: 10px;
  font-size: 12px;
}

.patient-title {
  color: var(--color-text-muted);
  font-size: 11px;
  margin-top: 6px;
}

.uhid-text {
  font-size: 11px;
  color: var(--color-teal);
  font-weight: 600;
}

.transfer-btn {
  margin-top: 10px;
  width: 100%;
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
  max-width: 500px;
  background: #ffffff;
  padding: 24px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>
