import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import LandingPage from '../views/landing/LandingPage.vue';
import Login from '../views/auth/Login.vue';
import SuperAdminDashboard from '../views/dashboard/SuperAdminDashboard.vue';
import PatientList from '../views/patients/PatientList.vue';
import AppointmentQueue from '../views/appointments/AppointmentQueue.vue';
import BedMatrix from '../views/beds/BedMatrix.vue';
import InvoiceList from '../views/billing/InvoiceList.vue';
import InventoryList from '../views/pharmacy/InventoryList.vue';
import LabQueue from '../views/laboratory/LabQueue.vue';
import FranchiseDashboard from '../views/franchise/FranchiseDashboard.vue';
import UserManagement from '../views/admin/UserManagement.vue';

const routes = [
  { path: '/', name: 'Landing', component: LandingPage, meta: { public: true } },
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/dashboard', name: 'Dashboard', component: SuperAdminDashboard, meta: { requiresAuth: true } },
  { path: '/patients', name: 'Patients', component: PatientList, meta: { requiresAuth: true, permission: 'patients.view' } },
  { path: '/appointments', name: 'Appointments', component: AppointmentQueue, meta: { requiresAuth: true, permission: 'appointments.view' } },
  { path: '/beds', name: 'Beds', component: BedMatrix, meta: { requiresAuth: true, permission: 'beds.view' } },
  { path: '/billing', name: 'Billing', component: InvoiceList, meta: { requiresAuth: true, permission: 'billing.view' } },
  { path: '/pharmacy', name: 'Pharmacy', component: InventoryList, meta: { requiresAuth: true, permission: 'pharmacy.view' } },
  { path: '/laboratory', name: 'Laboratory', component: LabQueue, meta: { requiresAuth: true, permission: 'laboratory.view' } },
  { path: '/franchise', name: 'Franchise', component: FranchiseDashboard, meta: { requiresAuth: true, permission: 'franchise.view' } },
  { path: '/admin/users', name: 'UserManagement', component: UserManagement, meta: { requiresAuth: true, permission: 'admin.manage' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (!to.meta.public && !authStore.isAuthenticated) {
    return next({ name: 'Login' });
  }
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    return next({ name: 'Dashboard' });
  }
  next();
});

export default router;
