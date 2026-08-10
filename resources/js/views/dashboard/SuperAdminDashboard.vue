<template>
  <AppShell>
    <div class="dashboard-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Clinical & Branch Operations Dashboard</h1>
          <p class="page-subtitle">Real-time multi-branch operational overview, branch central admin roster, bed occupancy matrix, and live consultation queue.</p>
        </div>
        <div class="quick-action-bar">
          <button v-if="authStore.isSuperAdmin" class="btn btn-primary" @click="showAddBranchModal = true">
            + Add New Branch
          </button>
          <button v-if="authStore.isSuperAdmin" class="btn btn-primary bg-accent" @click="openHireAdminModal(null)">
            👔 Hire Branch Admin
          </button>
          <router-link to="/patients" class="btn btn-secondary">+ Register Patient</router-link>
          <router-link to="/appointments" class="btn btn-secondary">+ Book Appointment</router-link>
          <router-link to="/billing" class="btn btn-secondary">+ Issue Invoice</router-link>
        </div>
      </div>

      <!-- Toast Alert Notification -->
      <div v-if="toastMessage" class="toast-alert" :class="toastType">
        <span>{{ toastMessage }}</span>
        <button class="toast-close" @click="toastMessage = ''">✕</button>
      </div>

      <!-- Active Branch Scope Banner -->
      <div class="branch-scope-banner" v-if="authStore.isSuperAdmin">
        <span class="banner-icon">🌐</span>
        <span class="banner-text">
          Currently Viewing: <strong>{{ activeScopeLabel }}</strong> ({{ stats.total_branches || 0 }} Hospital Branches Monitored)
        </span>
      </div>

      <!-- Elevated Stat Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">TOTAL PATIENTS</span>
            <div class="kpi-icon bg-info">👥</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.kpis?.total_patients || 0 }}</span>
            <span class="trend-badge trend-up">↑ Scoped Patient Directory</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">TODAY'S APPOINTMENTS</span>
            <div class="kpi-icon bg-success">📅</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.kpis?.today_appointments || 0 }}</span>
            <span class="trend-badge trend-up">↑ Live Token Queue Active</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">BED OCCUPANCY</span>
            <div class="kpi-icon bg-warning">🛏️</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.kpis?.occupied_beds || 0 }} / {{ stats.kpis?.total_beds || 0 }}</span>
            <span class="trend-badge trend-warn">{{ stats.kpis?.bed_occupancy_percentage || 0 }}% Wards Capacity</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">TOTAL REVENUE COLLECTIONS</span>
            <div class="kpi-icon bg-info">💳</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">${{ (stats.kpis?.total_revenue || 0).toLocaleString() }}</span>
            <span class="trend-badge trend-up">↑ Audited & Ledger Synced</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">PENDING LAB REPORTS</span>
            <div class="kpi-icon bg-danger">🔬</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.kpis?.pending_lab_reports || 0 }}</span>
            <span class="trend-badge trend-neutral">Processing Queue</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-header">
            <span class="kpi-label">LOW STOCK ALERTS</span>
            <div class="kpi-icon bg-warning">💊</div>
          </div>
          <div class="kpi-body">
            <span class="kpi-value">{{ stats.kpis?.low_stock_alerts || 0 }}</span>
            <span class="trend-badge trend-warn">Requires Re-order</span>
          </div>
        </div>
      </div>

      <!-- SUPER ADMIN BRANCH & BRANCH ADMIN CONTROL SECTION -->
      <div v-if="authStore.isSuperAdmin" class="branches-control-section">
        <div class="section-title-bar">
          <div>
            <h2>Hospital Branches & Central Admin Roster</h2>
            <p class="section-subtitle">Super Admin command center for managing hospital locations, hiring branch central admins, and tracking branch metrics.</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary btn-sm" @click="showAddBranchModal = true">
              + Add Hospital Branch
            </button>
            <button class="btn btn-secondary btn-sm" @click="openHireAdminModal(null)">
              👔 Hire Branch Admin
            </button>
          </div>
        </div>

        <!-- Branches Cards Grid -->
        <div class="branches-grid">
          <div v-for="branch in branchesList" :key="branch.id" class="branch-card card">
            <div class="branch-card-header">
              <div>
                <span class="branch-code-badge">{{ branch.code }}</span>
                <h3 class="branch-name">{{ branch.name }}</h3>
              </div>
              <span class="badge" :class="branch.status === 'active' ? 'badge-success' : 'badge-danger'">
                {{ (branch.status || 'ACTIVE').toUpperCase() }}
              </span>
            </div>

            <div class="branch-details">
              <p class="detail-line">📍 <span>{{ branch.address || 'Address not set' }}, {{ branch.city }}, {{ branch.state }}</span></p>
              <p class="detail-line">📞 <span>{{ branch.phone || 'N/A' }}</span></p>
              <p class="detail-line">✉️ <span>{{ branch.email || 'N/A' }}</span></p>
            </div>

            <!-- Operational Resource Counters -->
            <div class="branch-stats-pills">
              <span class="stat-pill">👥 {{ branch.users_count || 0 }} Users</span>
              <span class="stat-pill">🩺 {{ branch.doctors_count || 0 }} Doctors</span>
              <span class="stat-pill">🏥 {{ branch.patients_count || 0 }} Patients</span>
              <span class="stat-pill">🛏️ {{ branch.beds_count || 0 }} Beds</span>
            </div>

            <!-- Branch Admins Section -->
            <div class="branch-admins-box">
              <div class="box-header">
                <span class="box-title">ASSIGNED BRANCH ADMINS</span>
                <span class="admin-count-tag">{{ branch.branch_admins?.length || 0 }} Admin(s)</span>
              </div>

              <!-- Admin List -->
              <div v-if="branch.branch_admins && branch.branch_admins.length" class="admins-list">
                <div v-for="admin in branch.branch_admins" :key="admin.id" class="admin-row">
                  <div class="admin-info">
                    <div class="admin-avatar">{{ admin.name.charAt(0) }}</div>
                    <div>
                      <strong class="admin-name">{{ admin.name }}</strong>
                      <div class="admin-email">{{ admin.email }} | {{ admin.phone || 'No phone' }}</div>
                    </div>
                  </div>
                  <div class="admin-row-actions">
                    <span class="badge" :class="admin.account_status === 'active' ? 'badge-success' : 'badge-danger'">
                      {{ admin.account_status.toUpperCase() }}
                    </span>
                    <button class="btn btn-danger btn-xs" title="Fire or Deactivate Admin" @click="openFireAdminModal(admin, branch)">
                      🚫 Fire Admin
                    </button>
                  </div>
                </div>
              </div>

              <!-- No Admin Warning Banner -->
              <div v-else class="no-admin-alert">
                <span>⚠️ No Central Admin assigned for this branch.</span>
                <button class="btn btn-primary btn-xs" @click="openHireAdminModal(branch.id)">
                  + Hire Admin Now
                </button>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="branch-card-footer">
              <button class="btn btn-secondary btn-xs" @click="openHireAdminModal(branch.id)">
                👔 Hire Admin for Branch
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Operational Layout -->
      <div class="dashboard-workspace-grid">
        <!-- Today's Consultation Queue -->
        <div class="card workspace-card">
          <div class="card-header">
            <div>
              <h3>Today's Consultation Token Queue</h3>
              <p class="section-desc">Real-time status of waiting and in-consultation patients</p>
            </div>
            <router-link to="/appointments" class="view-all-link">Full Queue ➔</router-link>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Name & UHID</th>
                  <th>Branch</th>
                  <th>Attending Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="apt in stats.recent_appointments" :key="apt.id">
                  <td><span class="token-chip">#{{ apt.token_number }}</span></td>
                  <td>
                    <strong>{{ apt.patient?.first_name }} {{ apt.patient?.last_name }}</strong>
                    <br/><span class="sub-uhid">{{ apt.patient?.uhid }}</span>
                  </td>
                  <td><span class="branch-tag">🏥 {{ apt.branch?.code || 'MAIN' }}</span></td>
                  <td>Dr. {{ apt.doctor?.user?.name }}</td>
                  <td><span class="dept-tag">{{ apt.doctor?.department?.name || 'General' }}</span></td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(apt.status)">
                      {{ apt.status.toUpperCase() }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!stats.recent_appointments?.length">
                  <td colspan="6" class="empty-cell">No appointments scheduled for today yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Real-Time Ward Bed Matrix -->
        <div class="card workspace-card">
          <div class="card-header">
            <div>
              <h3>Ward Occupancy Matrix</h3>
              <p class="section-desc">Real-time availability across ICU, General, Private, & Deluxe</p>
            </div>
            <router-link to="/beds" class="view-all-link">Manage Beds ➔</router-link>
          </div>

          <div class="bed-type-grid">
            <div class="bed-type-card" v-for="(typeData, wardName) in stats.bed_matrix" :key="wardName">
              <div class="ward-header">
                <span class="ward-title">{{ wardName.toUpperCase() }} WARD</span>
                <span class="ward-pct">{{ typeData.total > 0 ? roundPct((typeData.occupied / typeData.total) * 100) : 0 }}%</span>
              </div>
              <div class="ward-numbers">
                <span class="occupied-count">{{ typeData.occupied }} Occupied</span>
                <span class="total-count">of {{ typeData.total }} Total Beds</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (typeData.total > 0 ? (typeData.occupied / typeData.total) * 100 : 0) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL 1: ADD NEW HOSPITAL BRANCH -->
      <div v-if="showAddBranchModal" class="modal-backdrop" @click.self="showAddBranchModal = false">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>🏥 Add New Hospital Branch</h3>
            <button class="close-btn" @click="showAddBranchModal = false">✕</button>
          </div>
          <form @submit.prevent="handleCreateBranch" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Branch Code *</label>
                <input type="text" v-model="newBranchForm.code" required placeholder="e.g. WEST-04" class="input-field" />
              </div>
              <div class="form-group">
                <label>Branch Name *</label>
                <input type="text" v-model="newBranchForm.name" required placeholder="e.g. Medix West General Hospital" class="input-field" />
              </div>
            </div>

            <div class="form-group">
              <label>Street Address</label>
              <input type="text" v-model="newBranchForm.address" placeholder="e.g. 500 West Avenue" class="input-field" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input type="text" v-model="newBranchForm.city" placeholder="e.g. Westville" class="input-field" />
              </div>
              <div class="form-group">
                <label>State / Region</label>
                <input type="text" v-model="newBranchForm.state" placeholder="e.g. NY" class="input-field" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Contact Phone</label>
                <input type="text" v-model="newBranchForm.phone" placeholder="+18005550400" class="input-field" />
              </div>
              <div class="form-group">
                <label>Official Email</label>
                <input type="email" v-model="newBranchForm.email" placeholder="west@medixhospitals.com" class="input-field" />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showAddBranchModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Creating Branch...' : 'Create Hospital Branch' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL 2: HIRE BRANCH ADMIN -->
      <div v-if="showHireAdminModal" class="modal-backdrop" @click.self="showHireAdminModal = false">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>👔 Hire Branch Central Admin</h3>
            <button class="close-btn" @click="showHireAdminModal = false">✕</button>
          </div>

          <form @submit.prevent="handleHireAdmin" class="modal-form">
            <!-- Hire Type Selector -->
            <div class="form-group">
              <label>Hiring Method</label>
              <div class="segmented-control">
                <button type="button" class="seg-btn" :class="{ active: hireForm.hire_type === 'new' }" @click="hireForm.hire_type = 'new'">
                  ✨ Register & Hire New Admin
                </button>
                <button type="button" class="seg-btn" :class="{ active: hireForm.hire_type === 'existing' }" @click="hireForm.hire_type = 'existing'">
                  🔄 Promote Existing Registered User
                </button>
              </div>
            </div>

            <!-- Target Branch Dropdown -->
            <div class="form-group">
              <label>Target Hospital Branch *</label>
              <select v-model="hireForm.branch_id" required class="input-field">
                <option value="" disabled>Select Target Branch</option>
                <option v-for="b in branchesList" :key="b.id" :value="b.id">
                  🏥 {{ b.name }} ({{ b.code }})
                </option>
              </select>
            </div>

            <!-- Fields for NEW User Hire -->
            <template v-if="hireForm.hire_type === 'new'">
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" v-model="hireForm.name" required placeholder="e.g. Sarah Jenkins" class="input-field" />
                </div>
                <div class="form-group">
                  <label>Email Address *</label>
                  <input type="email" v-model="hireForm.email" required placeholder="sarah.jenkins@medix.com" class="input-field" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="text" v-model="hireForm.phone" placeholder="+18005559988" class="input-field" />
                </div>
                <div class="form-group">
                  <label>Account Password *</label>
                  <input type="password" v-model="hireForm.password" required minlength="6" placeholder="Min 6 characters" class="input-field" />
                </div>
              </div>
            </template>

            <!-- Fields for EXISTING User Hire -->
            <template v-else>
              <div class="form-group">
                <label>Select User to Promote as Branch Admin *</label>
                <select v-model="hireForm.user_id" required class="input-field">
                  <option value="" disabled>Select Registered User</option>
                  <option v-for="u in existingUsersList" :key="u.id" :value="u.id">
                    👤 {{ u.name }} ({{ u.email }}) — {{ u.branch?.code || 'Unassigned' }}
                  </option>
                </select>
              </div>
            </template>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showHireAdminModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Processing Hire...' : 'Confirm Admin Hire' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL 3: FIRE / ACTION BRANCH ADMIN -->
      <div v-if="showFireAdminModal" class="modal-backdrop" @click.self="showFireAdminModal = false">
        <div class="modal-card card">
          <div class="modal-header">
            <h3 class="danger-title">⚠️ Fire / Deactivate Branch Admin</h3>
            <button class="close-btn" @click="showFireAdminModal = false">✕</button>
          </div>

          <div v-if="selectedAdmin" class="modal-form">
            <div class="target-admin-banner">
              <div class="admin-avatar avatar-lg">{{ selectedAdmin.name.charAt(0) }}</div>
              <div>
                <h4>{{ selectedAdmin.name }}</h4>
                <p>{{ selectedAdmin.email }} • {{ selectedAdminBranch?.name }}</p>
              </div>
            </div>

            <div class="form-group">
              <label>Select Action to Execute *</label>
              <div class="action-options">
                <label class="radio-option">
                  <input type="radio" v-model="fireForm.action" value="deactivate" />
                  <div>
                    <strong>Suspend / Deactivate Account</strong>
                    <p class="option-desc">Immediately block user login and suspend access while maintaining records.</p>
                  </div>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="fireForm.action" value="unassign" />
                  <div>
                    <strong>Unassign Branch Admin Role</strong>
                    <p class="option-desc">Remove branch admin privileges and unlink user from this hospital branch.</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showFireAdminModal = false">Cancel</button>
              <button type="button" class="btn btn-danger" :disabled="submitting" @click="handleFireAdmin">
                {{ submitting ? 'Executing Action...' : 'Confirm Fire Action' }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import AppShell from '../../layouts/AppShell.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const stats = ref({});
const branchesList = ref([]);
const existingUsersList = ref([]);

// Toast Notifications
const toastMessage = ref('');
const toastType = ref('toast-success');

// Modal Flags
const showAddBranchModal = ref(false);
const showHireAdminModal = ref(false);
const showFireAdminModal = ref(false);
const submitting = ref(false);

// Forms
const newBranchForm = ref({
  code: '',
  name: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  email: '',
});

const hireForm = ref({
  hire_type: 'new',
  branch_id: '',
  user_id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
});

const selectedAdmin = ref(null);
const selectedAdminBranch = ref(null);
const fireForm = ref({
  action: 'deactivate',
});

const activeScopeLabel = computed(() => {
  if (authStore.currentBranchId === 'all') return 'All Hospital Branches (Global View)';
  const found = authStore.branches.find(b => b.id == authStore.currentBranchId);
  return found ? `${found.name} (${found.code})` : `Branch ID ${authStore.currentBranchId}`;
});

function triggerToast(msg, type = 'toast-success') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = '';
  }, 5000);
}

function roundPct(val) {
  return Math.round(val);
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'completed': return 'badge-success';
    case 'in_consultation': return 'badge-info';
    case 'waiting': return 'badge-warning';
    case 'cancelled': return 'badge-danger';
    default: return 'badge-info';
  }
}

async function loadStats() {
  try {
    const res = await axios.get('/api/v1/dashboard/stats', {
      params: { branch_id: authStore.currentBranchId }
    });
    if (res.data.success) {
      stats.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
  }
}

async function loadBranches() {
  if (!authStore.isSuperAdmin) return;
  try {
    const res = await axios.get('/api/v1/branches');
    if (res.data.success) {
      branchesList.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load branches:', err);
  }
}

async function loadUsersForHire() {
  try {
    const res = await axios.get('/api/v1/admin/users');
    if (res.data.success) {
      existingUsersList.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

async function handleCreateBranch() {
  submitting.value = true;
  try {
    const res = await axios.post('/api/v1/branches', newBranchForm.value);
    if (res.data.success) {
      triggerToast(res.data.message || 'Hospital branch created successfully!');
      showAddBranchModal.value = false;
      newBranchForm.value = { code: '', name: '', address: '', city: '', state: '', phone: '', email: '' };
      await Promise.all([loadBranches(), loadStats(), authStore.fetchBranches()]);
    }
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to create branch.', 'toast-error');
  } finally {
    submitting.value = false;
  }
}

function openHireAdminModal(branchId = null) {
  hireForm.value = {
    hire_type: 'new',
    branch_id: branchId || (branchesList.value[0]?.id || ''),
    user_id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
  };
  loadUsersForHire();
  showHireAdminModal.value = true;
}

async function handleHireAdmin() {
  submitting.value = true;
  try {
    const res = await axios.post('/api/v1/admin/hire-branch-admin', hireForm.value);
    if (res.data.success) {
      triggerToast(res.data.message || 'Branch admin hired successfully!');
      showHireAdminModal.value = false;
      await Promise.all([loadBranches(), loadStats()]);
    }
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to hire branch admin.', 'toast-error');
  } finally {
    submitting.value = false;
  }
}

function openFireAdminModal(admin, branch) {
  selectedAdmin.value = admin;
  selectedAdminBranch.value = branch;
  fireForm.value.action = 'deactivate';
  showFireAdminModal.value = true;
}

async function handleFireAdmin() {
  if (!selectedAdmin.value) return;
  submitting.value = true;
  try {
    const res = await axios.post('/api/v1/admin/fire-branch-admin', {
      user_id: selectedAdmin.value.id,
      action: fireForm.value.action,
    });
    if (res.data.success) {
      triggerToast(res.data.message || 'Fire action executed successfully!');
      showFireAdminModal.value = false;
      selectedAdmin.value = null;
      await Promise.all([loadBranches(), loadStats()]);
    }
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to fire branch admin.', 'toast-error');
  } finally {
    submitting.value = false;
  }
}

watch(() => authStore.currentBranchId, () => {
  loadStats();
  loadBranches();
});

onMounted(() => {
  loadStats();
  loadBranches();
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-heading);
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.quick-action-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.bg-accent {
  background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%) !important;
}

.toast-alert {
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
}

.toast-success {
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #A7F3D0;
}

.toast-error {
  background: #FEF2F2;
  color: #991B1B;
  border: 1px solid #FCA5A5;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 800;
  color: inherit;
}

.branch-scope-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #E0F2FE;
  border: 1px solid #BAE6FD;
  padding: 10px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #0369A1;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.kpi-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.kpi-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
}

.kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--color-action-light);
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-text-heading);
  letter-spacing: -0.5px;
}

.trend-badge {
  font-size: 11px;
  font-weight: 700;
}

.trend-up { color: var(--color-success); }
.trend-warn { color: var(--color-warning); }
.trend-neutral { color: var(--color-action-blue); }

/* BRANCHES CONTROL SECTION */
.branches-control-section {
  margin-bottom: 28px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.section-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title-bar h2 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-heading);
}

.section-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

.branch-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid var(--color-border);
  background: #F8FAFC;
}

.branch-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.branch-code-badge {
  font-size: 11px;
  font-weight: 800;
  background: #0C4A6E;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  display: inline-block;
}

.branch-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-heading);
}

.detail-line {
  font-size: 12px;
  color: var(--color-text-body);
  margin-bottom: 2px;
}

.branch-stats-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stat-pill {
  font-size: 11px;
  font-weight: 700;
  background: #E0F2FE;
  color: #0369A1;
  padding: 3px 8px;
  border-radius: 6px;
}

.branch-admins-box {
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-title {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
}

.admin-count-tag {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-action-blue);
  background: var(--color-action-light);
  padding: 1px 6px;
  border-radius: 4px;
}

.admins-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: #F1F5F9;
  border-radius: 8px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0284C7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
}

.avatar-lg {
  width: 44px;
  height: 44px;
  font-size: 18px;
}

.admin-name {
  font-size: 13px;
  color: var(--color-text-heading);
}

.admin-email {
  font-size: 11px;
  color: var(--color-text-muted);
}

.admin-row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.no-admin-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #92400E;
}

.branch-card-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

.dashboard-workspace-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .dashboard-workspace-grid {
    grid-template-columns: 1fr;
  }
}

.workspace-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text-heading);
}

.section-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

.view-all-link {
  font-size: 13px;
  color: var(--color-action-blue);
  text-decoration: none;
  font-weight: 700;
}

.token-chip {
  background: #0C4A6E;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
}

.branch-tag {
  font-size: 11px;
  font-weight: 800;
  color: #0369A1;
  background: #E0F2FE;
  padding: 2px 8px;
  border-radius: 6px;
}

.sub-uhid {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.dept-tag {
  background: #F1F5F9;
  color: var(--color-text-body);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.bed-type-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bed-type-card {
  background: #F8FAFC;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.ward-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ward-title {
  font-size: 12px;
  font-weight: 800;
  color: #0C4A6E;
}

.ward-pct {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-danger);
}

.ward-numbers {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
}

.occupied-count { font-weight: 700; color: var(--color-danger); }
.total-count { color: var(--color-text-muted); }

.progress-bar {
  height: 8px;
  background: #E2E8F0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-warning), var(--color-danger));
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* MODALS */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(12, 74, 110, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-modal);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-heading);
}

.danger-title {
  color: var(--color-danger) !important;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--color-text-muted);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-heading);
}

.segmented-control {
  display: flex;
  background: #F1F5F9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}

.seg-btn {
  flex: 1;
  padding: 8px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-muted);
}

.seg-btn.active {
  background: #ffffff;
  color: var(--color-action-blue);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.target-admin-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  padding: 12px;
  border-radius: 10px;
}

.target-admin-banner h4 {
  font-size: 15px;
  color: #991B1B;
}

.target-admin-banner p {
  font-size: 12px;
  color: #7F1D1D;
}

.action-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #F8FAFC;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
}

.radio-option input {
  margin-top: 4px;
}

.option-desc {
  font-size: 11px;
  color: var(--color-text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>

