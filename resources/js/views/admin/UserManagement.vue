<template>
  <AppShell>
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Super Admin Control Center</h1>
          <p class="page-subtitle">User provisioning, hospital branch management, branch central admin hire/fire control, RBAC, and security audit logs.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'branches' }" @click="activeTab = 'branches'">
          🏥 Branch Directory ({{ branches.length }})
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          👥 User Accounts ({{ users.length }})
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'roles' }" @click="activeTab = 'roles'">
          🛡️ Roles & Permissions
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'audit' }" @click="activeTab = 'audit'">
          📋 Audit Logs
        </button>
      </div>

      <!-- Tab 1: Hospital Branches & Admins Directory -->
      <div v-if="activeTab === 'branches'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Branch Code</th>
              <th>Branch Name</th>
              <th>Location</th>
              <th>Contact Phone & Email</th>
              <th>Assigned Central Admin(s)</th>
              <th>Staff / Patients</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="branch in branches" :key="branch.id">
              <td><span class="branch-code-pill">{{ branch.code }}</span></td>
              <td>
                <strong>{{ branch.name }}</strong>
              </td>
              <td>{{ branch.city || 'N/A' }}, {{ branch.state || '' }}</td>
              <td>
                <div>{{ branch.phone || 'N/A' }}</div>
                <div class="sub-text">{{ branch.email || 'N/A' }}</div>
              </td>
              <td>
                <div v-if="branch.branch_admins && branch.branch_admins.length" class="admin-list-wrap">
                  <div v-for="adm in branch.branch_admins" :key="adm.id" class="admin-chip">
                    <span>👔 <strong>{{ adm.name }}</strong> ({{ adm.email }})</span>
                    <span class="badge" :class="adm.account_status === 'active' ? 'badge-success' : 'badge-danger'">
                      {{ adm.account_status.toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div v-else class="unassigned-text">
                  ⚠️ No Admin Assigned
                </div>
              </td>
              <td>
                <span class="metric-tag">{{ branch.users_count || 0 }} Staff</span>
                <span class="metric-tag">{{ branch.patients_count || 0 }} Patients</span>
              </td>
              <td>
                <span class="badge" :class="branch.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ (branch.status || 'ACTIVE').toUpperCase() }}
                </span>
              </td>
            </tr>
            <tr v-if="!branches.length">
              <td colspan="7" class="empty-cell">No hospital branches registered yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab 2: User Accounts Table -->
      <div v-if="activeTab === 'users'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Contact Phone</th>
              <th>Assigned Branch</th>
              <th>System Role</th>
              <th>Account Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>#{{ user.id }}</td>
              <td><strong>{{ user.name }}</strong></td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || 'N/A' }}</td>
              <td>
                <span v-if="user.branch" class="branch-tag">🏥 {{ user.branch.code }}</span>
                <span v-else class="global-tag">🌐 Global HQ</span>
              </td>
              <td>
                <span class="role-badge" v-for="role in user.roles" :key="role.id">
                  {{ role.display_name }}
                </span>
              </td>
              <td>
                <span class="badge" :class="user.account_status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ user.account_status.toUpperCase() }}
                </span>
              </td>
              <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab 3: Roles & Permissions Breakdown -->
      <div v-if="activeTab === 'roles'" class="roles-grid">
        <div v-for="role in roles" :key="role.id" class="role-card card">
          <div class="role-card-header">
            <h3>{{ role.display_name }}</h3>
            <span class="role-key">{{ role.name }}</span>
          </div>
          <p class="role-desc">{{ role.description }}</p>
          <div class="permissions-wrap">
            <span v-for="perm in role.permissions" :key="perm.id" class="perm-chip">
              {{ perm.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tab 4: System Audit Logs -->
      <div v-if="activeTab === 'audit'" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User</th>
              <th>Module</th>
              <th>Action</th>
              <th>IP Address</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in auditLogs" :key="log.id">
              <td>#{{ log.id }}</td>
              <td><strong>{{ log.user?.name || 'System' }}</strong></td>
              <td><span class="module-tag">{{ log.module.toUpperCase() }}</span></td>
              <td><code>{{ log.action }}</code></td>
              <td>{{ log.request_ip }}</td>
              <td>{{ new Date(log.created_at).toLocaleString() }}</td>
            </tr>
            <tr v-if="!auditLogs.length">
              <td colspan="6" class="empty-cell">No audit log entries recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AppShell from '../../layouts/AppShell.vue';

const activeTab = ref('branches');
const branches = ref([]);
const users = ref([]);
const roles = ref([]);
const auditLogs = ref([]);

async function loadAdminData() {
  try {
    const [bRes, uRes, rRes, aRes] = await Promise.all([
      axios.get('/api/v1/branches'),
      axios.get('/api/v1/admin/users'),
      axios.get('/api/v1/admin/roles'),
      axios.get('/api/v1/admin/audit-logs'),
    ]);

    if (bRes.data.success) branches.value = bRes.data.data;
    if (uRes.data.success) users.value = uRes.data.data;
    if (rRes.data.success) roles.value = rRes.data.data.roles;
    if (aRes.data.success) auditLogs.value = aRes.data.data;
  } catch (err) {
    console.error('Failed to load admin data:', err);
  }
}

onMounted(() => {
  loadAdminData();
});
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 800; color: var(--color-text-heading); }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); }

.admin-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.tab-btn {
  padding: 10px 18px; font-size: 13px; font-weight: 700;
  border-radius: 20px; border: 1px solid var(--color-border);
  background: #ffffff; cursor: pointer; transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #F0F9FF; border-color: var(--color-action-blue);
}

.tab-btn.active {
  background: var(--color-action-blue); color: #ffffff; border-color: var(--color-action-blue);
  box-shadow: 0 4px 12px var(--color-action-glow);
}

.branch-code-pill {
  background: #0C4A6E; color: #ffffff; font-size: 11px; font-weight: 800;
  padding: 3px 8px; border-radius: 6px;
}

.sub-text { font-size: 12px; color: var(--color-text-muted); }

.admin-list-wrap { display: flex; flex-direction: column; gap: 4px; }
.admin-chip {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  background: #F1F5F9; padding: 4px 8px; border-radius: 6px; font-size: 12px;
}

.unassigned-text { font-size: 12px; color: #D97706; font-weight: 700; }

.metric-tag {
  font-size: 11px; font-weight: 700; background: #E0F2FE; color: #0369A1;
  padding: 2px 6px; border-radius: 4px; margin-right: 4px;
}

.branch-tag {
  font-size: 11px; font-weight: 800; color: #0369A1; background: #E0F2FE;
  padding: 2px 8px; border-radius: 6px;
}

.global-tag {
  font-size: 11px; font-weight: 800; color: #475569; background: #F1F5F9;
  padding: 2px 8px; border-radius: 6px;
}

.role-badge {
  background: #EBF4FC; color: var(--color-action-blue);
  padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 700;
}

.roles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

.role-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.role-card-header h3 { font-size: 16px; font-weight: 700; color: var(--color-text-heading); }
.role-key { font-size: 12px; color: var(--color-text-muted); font-family: monospace; }
.role-desc { font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px; }

.permissions-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
.perm-chip { background: #F0F4F8; color: var(--color-text-body); font-size: 11px; padding: 2px 6px; border-radius: 4px; font-family: monospace; }

.module-tag { background: #EBF4FC; color: var(--color-action-blue); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; }
</style>

