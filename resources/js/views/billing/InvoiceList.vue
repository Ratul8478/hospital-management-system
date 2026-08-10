<template>
  <AppShell>
    <div class="billing-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Billing & Accounting Invoices</h1>
          <p class="page-subtitle">Server-calculated GST invoices, payment processing, and double-entry ledger integration.</p>
        </div>
        <button class="btn btn-primary" @click="showInvoiceModal = true">
          + Create New Invoice
        </button>
      </div>

      <!-- Invoices Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient Name</th>
              <th>Module</th>
              <th>Subtotal</th>
              <th>GST Tax</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Due Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id">
              <td><span class="inv-badge">{{ inv.invoice_number }}</span></td>
              <td><strong>{{ inv.patient?.first_name }} {{ inv.patient?.last_name }}</strong></td>
              <td><span class="module-tag">{{ inv.module.toUpperCase() }}</span></td>
              <td>${{ inv.subtotal }}</td>
              <td>${{ inv.tax_amount }}</td>
              <td><strong>${{ inv.total_amount }}</strong></td>
              <td><span class="paid-text">${{ inv.paid_amount }}</span></td>
              <td><span :class="inv.due_amount > 0 ? 'due-text' : 'zero-due'">${{ inv.due_amount }}</span></td>
              <td><span class="badge" :class="inv.status === 'posted' ? 'badge-success' : 'badge-warning'">{{ inv.status.toUpperCase() }}</span></td>
              <td>
                <button v-if="inv.due_amount > 0" class="btn btn-success btn-xs" @click="openPaymentModal(inv)">
                  💳 Post Payment
                </button>
              </td>
            </tr>
            <tr v-if="!invoices.length">
              <td colspan="10" class="empty-cell">No billing invoices generated yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Invoice Modal -->
      <div v-if="showInvoiceModal" class="modal-backdrop">
        <div class="modal-card card large-modal">
          <div class="modal-header">
            <h3>Generate Server-Calculated Invoice</h3>
            <button class="close-btn" @click="showInvoiceModal = false">×</button>
          </div>

          <form @submit.prevent="submitInvoice" class="form-grid">
            <div class="form-group">
              <label>Patient *</label>
              <select v-model="form.patient_id" required class="input-field">
                <option v-for="p in patientOptions" :key="p.id" :value="p.id">
                  {{ p.first_name }} {{ p.last_name }} ({{ p.uhid }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Module Category *</label>
              <select v-model="form.module" required class="input-field">
                <option value="opd">OPD Consultation</option>
                <option value="ipd">IPD Room & Treatment</option>
                <option value="pharmacy">Pharmacy Dispensing</option>
                <option value="laboratory">Laboratory Diagnostics</option>
                <option value="package">Healthcare Package</option>
              </select>
            </div>

            <!-- Line Items Header -->
            <div class="full-width line-items-section">
              <h4>Line Items</h4>
              <div v-for="(item, idx) in form.items" :key="idx" class="line-item-row">
                <input type="text" v-model="item.item_name" placeholder="Item Name (e.g. Consultation Fee)" required class="input-field"/>
                <input type="number" v-model.number="item.quantity" placeholder="Qty" min="1" required class="input-field small-input"/>
                <input type="number" step="0.01" v-model.number="item.unit_price" placeholder="Price ($)" min="0" required class="input-field small-input"/>
                <input type="number" step="0.01" v-model.number="item.discount" placeholder="Disc ($)" min="0" class="input-field small-input"/>
                <input type="number" step="0.01" v-model.number="item.tax_rate" placeholder="GST %" min="0" class="input-field small-input"/>
                <button type="button" class="btn btn-danger btn-xs" @click="removeItem(idx)" v-if="form.items.length > 1">✕</button>
              </div>
              <button type="button" class="btn btn-secondary btn-xs add-item-btn" @click="addItem">+ Add Line Item</button>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="showInvoiceModal = false">Cancel</button>
              <button type="submit" :disabled="submitting" class="btn btn-primary">
                {{ submitting ? 'Calculating Taxes...' : 'Generate Invoice' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="selectedInvoiceForPayment" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Post Payment for {{ selectedInvoiceForPayment.invoice_number }}</h3>
            <button class="close-btn" @click="selectedInvoiceForPayment = null">×</button>
          </div>

          <p class="modal-subtitle">
            Remaining Due Amount: <strong>${{ selectedInvoiceForPayment.due_amount }}</strong>
          </p>

          <form @submit.prevent="submitPayment" class="form-grid">
            <div class="form-group full-width">
              <label>Payment Amount ($) *</label>
              <input type="number" step="0.01" v-model.number="paymentForm.amount" :max="selectedInvoiceForPayment.due_amount" required class="input-field"/>
            </div>

            <div class="form-group full-width">
              <label>Payment Mode *</label>
              <select v-model="paymentForm.payment_mode" required class="input-field">
                <option value="cash">Cash</option>
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI / Digital Wallet</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Transaction Reference / Txn ID</label>
              <input type="text" v-model="paymentForm.transaction_reference" placeholder="e.g. TXN-99201" class="input-field"/>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="selectedInvoiceForPayment = null">Cancel</button>
              <button type="submit" :disabled="postingPayment" class="btn btn-success">
                {{ postingPayment ? 'Writing Ledger...' : 'Confirm & Write to Ledger' }}
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

const invoices = ref([]);
const patientOptions = ref([]);
const showInvoiceModal = ref(false);
const submitting = ref(false);
const selectedInvoiceForPayment = ref(null);
const postingPayment = ref(false);

const form = ref({
  patient_id: 1,
  module: 'opd',
  items: [
    { item_name: 'OPD Doctor Consultation Fee', quantity: 1, unit_price: 150.00, discount: 0, tax_rate: 18.0 }
  ]
});

const paymentForm = ref({
  amount: 0,
  payment_mode: 'cash',
  transaction_reference: '',
});

async function loadInvoices() {
  try {
    const res = await axios.get('/api/v1/invoices');
    if (res.data.success) {
      invoices.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load invoices:', err);
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

function addItem() {
  form.value.items.push({ item_name: '', quantity: 1, unit_price: 0, discount: 0, tax_rate: 0 });
}

function removeItem(idx) {
  form.value.items.splice(idx, 1);
}

async function submitInvoice() {
  submitting.value = true;
  try {
    const res = await axios.post('/api/v1/invoices', form.value);
    if (res.data.success) {
      showInvoiceModal.value = false;
      loadInvoices();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Invoice generation failed.');
  } finally {
    submitting.value = false;
  }
}

function openPaymentModal(inv) {
  selectedInvoiceForPayment.value = inv;
  paymentForm.value.amount = inv.due_amount;
}

async function submitPayment() {
  postingPayment.value = true;
  try {
    const res = await axios.post(`/api/v1/invoices/${selectedInvoiceForPayment.value.id}/pay`, paymentForm.value);
    if (res.data.success) {
      selectedInvoiceForPayment.value = null;
      loadInvoices();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Payment posting failed.');
  } finally {
    postingPayment.value = false;
  }
}

onMounted(() => {
  loadInvoices();
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

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-navy);
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.inv-badge {
  background: var(--color-navy);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.module-tag {
  background: #EBF4FC;
  color: var(--color-action-blue);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.paid-text { color: var(--color-success); font-weight: 700; }
.due-text { color: var(--color-danger); font-weight: 700; }
.zero-due { color: var(--color-text-muted); }

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

.large-modal { max-width: 750px; }

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

.full-width { grid-column: 1 / -1; }

.line-items-section {
  background: var(--color-bg);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.line-item-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}

.small-input { width: 90px; }

.add-item-btn { margin-top: 10px; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
