import '../css/app.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import axios from 'axios';
import { useAuthStore } from './stores/auth';

import App from './App.vue';

// Set default Axios headers
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = localStorage.getItem('hms_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize Auth store from LocalStorage
const authStore = useAuthStore();
if (token && !authStore.user) {
  axios.get('/api/v1/auth/me').then(res => {
    if (res.data.success) {
      authStore.user = res.data.data.user;
    }
  }).catch(() => {
    authStore.logout();
  });
}

app.mount('#app');
