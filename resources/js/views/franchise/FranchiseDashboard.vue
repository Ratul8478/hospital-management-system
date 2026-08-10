<template>
  <AppShell>
    <div class="franchise-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Franchise & Channel Partner Ecosystem</h1>
          <p class="page-subtitle">Track patient referrals, commission rules, wallet balance, and submit withdrawal requests.</p>
        </div>
        <button class="btn btn-primary" @click="showWithdrawalModal = true">
          💸 Request Wallet Withdrawal
        </button>
      </div>

      <!-- Partner Wallet Metrics -->
      <div class="kpi-grid">
        <div class="kpi-card card">
          <div class="kpi-icon-wrap bg-success">💰</div>
          <div class="kpi-content">
            <span class="kpi-label">Available Wallet Balance</span>
            <span class="kpi-value">${{ (dashboardData.wallet?.available_balance || 0).toLocaleString() }}</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-icon-wrap bg-warning">⏳</div>
          <div class="kpi-content">
            <span class="kpi-label">Pending Payouts</span>
            <span class="kpi-value">${{ (dashboardData.wallet?.pending_balance || 0).toLocaleString() }}</span>
          </div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-icon-wrap bg-info">🏆</div>
          <div class="kpi-content">
            <span class="kpi-label">Lifetime Commission Earned</span>
            <span class="kpi-value">${{ (dashboardData.wallet?.lifetime_earnings || 0).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Referrals Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Partner Code</th>
              <th>Referred Patient</th>
              <th>Service Module</th>
              <th>Billed Amount</th>
              <th>Commission Rate</th>
              <th>Earned Commission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ref in dashboardData.referrals" :key="ref.id">
              <td><span class="code-badge">{{ dashboardData.franchise?.partner_code }}</span></td>
              <td><strong>{{ ref.patient?.first_name }} {{ ref.patient?.last_name }}</strong></td>
              <td><span class="module-tag">{{ ref.service_type.toUpperCase() }}</span></td>
              <td>${{ ref.bill_amount }}</td>
              <td>{{ dashboardData.franchise?.commission_rate }}% ({{ dashboardData.franchise?.commission_type }})</td>
              <td><strong class="earned-text">+${{ ref.commission_amount }}</strong></td>
              <td><span class="badge badge-success">{{ ref.status.toUpperCase() }}</span></td>
            </tr>
            <tr v-if="!dashboardData.referrals?.length">
              <td colspan="7" class="empty-cell">No patient referrals registered yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Withdrawal Modal -->
      <div v-if="showWithdrawalModal" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Request Wallet Payout Withdrawal</h3>
            <button class="close-btn" @click="showWithdrawalModal = false">×</button>
          </div>

          <p class="modal-subtitle">
            Eligible Available Balance: <strong>${{ dashboardData.wallet?.available_balance || 0 }}</strong>
          </p>

          <form @submit.prevent="submitWithdrawal" class="form-grid">
            <div class="form-group full-width">
              <label>Withdrawal Amount ($) *</label>
              <input type="number" step="0.01" v-model.number="withdrawAmount" :max="dashboardData.wallet?.available_balance" required class="input-field"/>
            </div>

            <div class="form-group full-width">
              <label>Bank Account / Payment Details *</label>
              <input type="text" v-model="bankDetails" placeholder="e.g. Chase Bank — Acc #: 992019482, Routing #: 021000021" required class="input-field"/>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="showWithdrawalModal = false">Cancel</button>
              <button type="submit" :disabled="submitting" class="btn btn-primary">
                {{ submitting ? 'Validating Balance...' : 'Submit Withdrawal Request' }}
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

const dashboardData = ref({});
const showWithdrawalModal = ref(false);
const withdrawAmount = ref(100.00);
const bankDetails = ref('');
const submitting = ref(false);

async function loadFranchiseDashboard() {
  try {
    const res = await axios.get('/api/v1/franchise/dashboard');
    if (res.data.success) {
      dashboardData.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load franchise dashboard:', err);
  }
}

async function submitWithdrawal() {
  submitting.value = true;
  try {
    const res = await axios.post('/api/v1/franchise/withdraw', {
      amount: withdrawAmount.value,
      bank_details: { details: bankDetails.value }
    });
    if (res.data.success) {
      showWithdrawalModal.value = false;
      loadFranchiseDashboard();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Withdrawal submission failed.');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadFranchiseDashboard();
});
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-navy); }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card { display: flex; align-items: center; gap: 16px; padding: 18px; }
.kpi-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.kpi-content { display: flex; flex-direction: column; }
.kpi-label { font-size: 12px; color: var(--color-text-muted); font-weight: 600; }
.kpi-value { font-size: 22px; font-weight: 700; color: var(--color-text-primary); }

.code-badge { background: var(--color-navy); color: #ffffff; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.module-tag { background: #EBF4FC; color: var(--color-action-blue); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.earned-text { color: var(--color-success); font-weight: 700; }

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

.modal-card { width: 100%; max-width: 500px; background: #ffffff; padding: 24px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.close-btn { background: transparent; border: none; font-size: 24px; cursor: pointer; }
.form-grid { display: flex; flex-direction: column; gap: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
</style>
