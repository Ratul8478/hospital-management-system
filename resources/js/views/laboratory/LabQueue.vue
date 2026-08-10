<template>
  <AppShell>
    <div class="lab-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Laboratory Sample & Report Queue</h1>
          <p class="page-subtitle">Track sample collection, test processing, and generate PDF lab test reports.</p>
        </div>
      </div>

      <!-- Lab Request Queue Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Request #</th>
              <th>Patient</th>
              <th>Ordering Doctor</th>
              <th>Lab Test</th>
              <th>Category</th>
              <th>Sample Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in labRequests" :key="req.id">
              <td><span class="req-badge">{{ req.request_number }}</span></td>
              <td>
                <strong>{{ req.patient?.first_name }} {{ req.patient?.last_name }}</strong>
                <br/><span class="sub-text">{{ req.patient?.uhid }}</span>
              </td>
              <td>Dr. {{ req.doctor?.user?.name }}</td>
              <td><strong>{{ req.test?.name }}</strong></td>
              <td><span class="cat-tag">{{ req.test?.category?.name }}</span></td>
              <td>{{ req.test?.sample_type }}</td>
              <td><span class="badge" :class="getStatusBadgeClass(req.status)">{{ req.status.toUpperCase() }}</span></td>
              <td>
                <button v-if="req.status === 'pending_sample'" class="btn btn-secondary btn-xs" @click="processStatus(req, 'collected')">Collect Sample</button>
                <button v-if="req.status === 'collected'" class="btn btn-primary btn-xs" @click="processStatus(req, 'processing')">Start Processing</button>
                <button v-if="req.status === 'processing'" class="btn btn-success btn-xs" @click="openReportModal(req)">Generate PDF Report</button>
                <a v-if="req.status === 'ready' && req.report?.report_pdf_path" class="btn btn-secondary btn-xs" :href="req.report.report_pdf_path" target="_blank">📄 View PDF</a>
              </td>
            </tr>
            <tr v-if="!labRequests.length">
              <td colspan="8" class="empty-cell">No laboratory requests in queue.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Report Generation Modal -->
      <div v-if="selectedRequestForReport" class="modal-backdrop">
        <div class="modal-card card">
          <div class="modal-header">
            <h3>Generate PDF Lab Report: {{ selectedRequestForReport.test?.name }}</h3>
            <button class="close-btn" @click="selectedRequestForReport = null">×</button>
          </div>

          <p class="modal-subtitle">
            Patient: <strong>{{ selectedRequestForReport.patient?.first_name }} {{ selectedRequestForReport.patient?.last_name }}</strong>
            | Normal Range: {{ selectedRequestForReport.test?.normal_range }}
          </p>

          <form @submit.prevent="submitReport" class="form-grid">
            <div class="form-group full-width">
              <label>Observed Test Value / Findings *</label>
              <textarea v-model="reportFinding" rows="3" placeholder="e.g. Hemoglobin: 14.2 g/dL, Platelet Count: 250,000 /uL" required class="input-field"></textarea>
            </div>

            <div class="modal-footer full-width">
              <button type="button" class="btn btn-secondary" @click="selectedRequestForReport = null">Cancel</button>
              <button type="submit" :disabled="generating" class="btn btn-success">
                {{ generating ? 'Rendering PDF...' : 'Approve & Render PDF Report' }}
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

const labRequests = ref([]);
const selectedRequestForReport = ref(null);
const reportFinding = ref('');
const generating = ref(false);

function getStatusBadgeClass(status) {
  switch (status) {
    case 'ready': return 'badge-success';
    case 'processing': return 'badge-info';
    case 'collected': return 'badge-warning';
    default: return 'badge-danger';
  }
}

async function loadLabQueue() {
  try {
    const res = await axios.get('/api/v1/lab/requests');
    if (res.data.success) {
      labRequests.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load lab queue:', err);
  }
}

async function processStatus(req, newStatus) {
  try {
    const res = await axios.post(`/api/v1/lab/requests/${req.id}/report`, {
      status: newStatus,
      result_data: {},
    });
    if (res.data.success) {
      loadLabQueue();
    }
  } catch (err) {
    alert('Failed to update status.');
  }
}

function openReportModal(req) {
  selectedRequestForReport.value = req;
  reportFinding.value = '';
}

async function submitReport() {
  generating.value = true;
  try {
    const res = await axios.post(`/api/v1/lab/requests/${selectedRequestForReport.value.id}/report`, {
      status: 'ready',
      result_data: { findings: reportFinding.value },
    });
    if (res.data.success) {
      selectedRequestForReport.value = null;
      loadLabQueue();
      alert('Laboratory PDF Report approved and rendered!');
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Report generation failed.');
  } finally {
    generating.value = false;
  }
}

onMounted(() => {
  loadLabQueue();
});
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 700; color: var(--color-navy); }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); }

.req-badge {
  background: var(--color-navy);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.sub-text { font-size: 11px; color: var(--color-text-muted); }

.cat-tag {
  background: #EBF4FC;
  color: var(--color-action-blue);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
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
  margin-bottom: 12px;
}

.close-btn { background: transparent; border: none; font-size: 24px; cursor: pointer; }
.form-grid { display: flex; flex-direction: column; gap: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
</style>
