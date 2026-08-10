import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('hms_token') || null,
    user: JSON.parse(localStorage.getItem('hms_user') || 'null'),
    currentBranchId: localStorage.getItem('hms_branch_id') || 'all',
    branches: [],
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRoles: (state) => state.user?.roles || [],
    userPermissions: (state) => state.user?.permissions || [],
    isSuperAdmin: (state) => state.user?.roles?.includes('super_admin') || false,
    isBranchAdmin: (state) => state.user?.roles?.includes('branch_admin') || false,
    userBranchName: (state) => state.user?.branch?.name || 'Global Headquarters',
  },
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/v1/auth/login', { email, password });
        if (response.data.success) {
          this.token = response.data.data.token;
          this.user = response.data.data.user;
          this.currentBranchId = this.user.branch_id || 'all';
          localStorage.setItem('hms_token', this.token);
          localStorage.setItem('hms_user', JSON.stringify(this.user));
          localStorage.setItem('hms_branch_id', this.currentBranchId);
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          await this.fetchBranches();
          return true;
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Please check credentials.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async fetchBranches() {
      if (!this.token) return;
      try {
        const res = await axios.get('/api/v1/branches');
        if (res.data.success) {
          this.branches = res.data.data;
        }
      } catch (e) {
        console.error('Failed to load branches', e);
      }
    },
    setBranch(branchId) {
      this.currentBranchId = branchId;
      localStorage.setItem('hms_branch_id', branchId);
    },
    hasPermission(permissionName) {
      if (this.isSuperAdmin) return true;
      return this.userPermissions.includes(permissionName);
    },
    hasRole(roleName) {
      return this.userRoles.includes(roleName);
    },
    logout() {
      if (this.token) {
        axios.post('/api/v1/auth/logout').catch(() => {});
      }
      this.token = null;
      this.user = null;
      this.branches = [];
      this.currentBranchId = 'all';
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      localStorage.removeItem('hms_branch_id');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
});
