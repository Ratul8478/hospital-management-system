<template>
  <div class="app-shell">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <div class="brand-logo-circle">
          <img :src="logoUrl" alt="Medix Logo" class="hms-app-logo-img" />
        </div>
        <button class="toggle-btn" @click="isCollapsed = !isCollapsed" title="Toggle Navigation">
          {{ isCollapsed ? '❯' : '❮' }}
        </button>
      </div>

      <div class="sidebar-section-label" v-if="!isCollapsed">MAIN CLINICAL SERVICES</div>

      <nav class="sidebar-menu">
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span v-if="!isCollapsed" class="nav-text">Executive Dashboard</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('patients.view')" to="/patients" class="nav-item">
          <span class="nav-icon">👥</span>
          <span v-if="!isCollapsed" class="nav-text">Patient Directory</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('appointments.view')" to="/appointments" class="nav-item">
          <span class="nav-icon">📅</span>
          <span v-if="!isCollapsed" class="nav-text">Consultation Queue</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('beds.view')" to="/beds" class="nav-item">
          <span class="nav-icon">🛏️</span>
          <span v-if="!isCollapsed" class="nav-text">Bed & IPD Matrix</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('billing.view')" to="/billing" class="nav-item">
          <span class="nav-icon">💳</span>
          <span v-if="!isCollapsed" class="nav-text">Billing & Accounting</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('pharmacy.view')" to="/pharmacy" class="nav-item">
          <span class="nav-icon">💊</span>
          <span v-if="!isCollapsed" class="nav-text">Pharmacy Inventory</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('laboratory.view')" to="/laboratory" class="nav-item">
          <span class="nav-icon">🔬</span>
          <span v-if="!isCollapsed" class="nav-text">Laboratory Queue</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('franchise.view')" to="/franchise" class="nav-item">
          <span class="nav-icon">🤝</span>
          <span v-if="!isCollapsed" class="nav-text">Franchise Partners</span>
        </router-link>

        <router-link v-if="authStore.hasPermission('admin.manage')" to="/admin/users" class="nav-item">
          <span class="nav-icon">⚙️</span>
          <span v-if="!isCollapsed" class="nav-text">Administration & Users</span>
        </router-link>
      </nav>

      <!-- Sidebar User Card -->
      <div class="sidebar-footer" v-if="!isCollapsed">
        <div class="user-card">
          <div class="user-avatar">{{ authStore.user?.name?.charAt(0) || 'U' }}</div>
          <div class="user-details">
            <p class="user-name">{{ authStore.user?.name }}</p>
            <p class="user-role-badge">{{ formatRole(authStore.userRoles[0]) }}</p>
            <p class="user-branch-tag" v-if="authStore.user?.branch">
              🏥 {{ authStore.user.branch.code }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Workspace Area -->
    <div class="main-wrapper">
      <!-- Topbar Header -->
      <header class="topbar">
        <!-- Global Search -->
        <div class="topbar-search">
          <span class="search-icon">🔍</span>
          <input type="text" v-model="globalQuery" placeholder="Global Search (UHID, Patient Name, Invoice #)..." @keyup.enter="handleGlobalSearch" class="search-input"/>
          <span class="search-shortcut">⌘K</span>
        </div>

        <!-- Branch Selector Dropdown for Super Admin & Active Branch Badge -->
        <div class="topbar-actions">
          <!-- Super Admin Branch Context Switcher -->
          <div class="branch-selector-wrap" v-if="authStore.isSuperAdmin">
            <span class="branch-label">Active Scope:</span>
            <select :value="authStore.currentBranchId" @change="onBranchChange($event)" class="branch-select-dropdown">
              <option value="all">🌐 All Hospital Branches (Global)</option>
              <option v-for="b in authStore.branches" :key="b.id" :value="b.id">
                🏥 {{ b.name }} ({{ b.code }})
              </option>
            </select>
          </div>

          <!-- Non-Super-Admin Branch Badge -->
          <div class="branch-badge-chip" v-else>
            <span class="branch-icon">🏥</span>
            <span class="branch-name">{{ authStore.userBranchName }}</span>
          </div>

          <div class="system-status-chip">
            <span class="pulse-dot"></span> System Live • v2.0 Multi-Branch
          </div>

          <button class="btn btn-secondary btn-sm logout-btn" @click="handleLogout">
            <span>Logout</span> ➔
          </button>
        </div>
      </header>

      <!-- Workspace Render Area -->
      <main class="content-workspace">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const logoUrl = '/images/logo.png';
const isCollapsed = ref(false);
const globalQuery = ref('');
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.fetchBranches();
});

function formatRole(role) {
  if (!role) return 'System User';
  return role.replace('_', ' ').toUpperCase();
}

function onBranchChange(e) {
  authStore.setBranch(e.target.value);
}

function handleGlobalSearch() {
  if (globalQuery.value.trim()) {
    router.push({ path: '/patients', query: { search: globalQuery.value } });
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-app-bg);
}

.sidebar {
  width: 260px;
  background: #ffffff;
  color: var(--color-text-heading);
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
  border-right: 1px solid var(--color-border);
  z-index: 10;
}

.sidebar.collapsed {
  width: 76px;
}

.sidebar-header {
  height: 90px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.brand-logo-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--color-border);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4px;
  flex-shrink: 0;
}

.hms-app-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.toggle-btn {
  background: #F1F5F9;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--color-action-blue);
  color: #ffffff;
}

.sidebar-section-label {
  font-size: 10px;
  font-weight: 800;
  color: #94A3B8;
  letter-spacing: 1px;
  padding: 16px 20px 8px;
}

.sidebar-menu {
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  color: #475569;
  text-decoration: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #F1F5F9;
  color: var(--color-text-heading);
}

.nav-item.router-link-active {
  background: var(--color-action-blue);
  color: #ffffff;
  box-shadow: 0 4px 14px var(--color-action-glow);
}

.nav-icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border);
  background: #F8FAFC;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-action-blue), var(--color-clinical-teal));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-heading);
}

.user-role-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-action-blue);
}

.user-branch-tag {
  font-size: 10px;
  font-weight: 800;
  color: #0369A1;
  background: #E0F2FE;
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 2px;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-subtle);
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-app-bg);
  padding: 9px 16px;
  border-radius: 30px;
  border: 1px solid var(--color-border);
  width: 360px;
  transition: all 0.2s ease;
}

.topbar-search:focus-within {
  border-color: var(--color-action-blue);
  background: #ffffff;
  box-shadow: 0 0 0 4px var(--color-action-glow);
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: var(--color-text-heading);
}

.search-shortcut {
  font-size: 10px;
  font-weight: 700;
  background: #E2E8F0;
  color: var(--color-text-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Branch Selector Styling */
.branch-selector-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F0F9FF;
  border: 1px solid #BAE6FD;
  padding: 4px 12px;
  border-radius: 10px;
}

.branch-label {
  font-size: 11px;
  font-weight: 800;
  color: #0369A1;
  text-transform: uppercase;
}

.branch-select-dropdown {
  border: 1px solid #7DD3FC;
  background: #ffffff;
  color: #0C4A6E;
  font-weight: 700;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

.branch-badge-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #E0F2FE;
  border: 1px solid #BAE6FD;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #0369A1;
}

.system-status-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-success);
  background: var(--color-success-bg);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--color-success);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.logout-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.content-workspace {
  padding: 28px;
  flex: 1;
  overflow-y: auto;
}
</style>
