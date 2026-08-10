<template>
  <AppShell>
    <div class="pharmacy-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Pharmacy Inventory & Stock Tracking</h1>
          <p class="page-subtitle">Barcode lookup, low-stock threshold warnings, and medicine dispensing.</p>
        </div>
      </div>

      <!-- Barcode Search and Filters -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="search-wrap">
            <input type="text" v-model="searchQuery" @input="loadInventory" placeholder="Scan Barcode or Search Medicine Name / Generic..." class="input-field"/>
          </div>
          <button class="btn" :class="lowStockOnly ? 'btn-danger' : 'btn-secondary'" @click="toggleLowStockFilter">
            ⚠️ {{ lowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock' }}
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Medicine Name</th>
              <th>Generic Name</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Stock Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="med in medicines" :key="med.id">
              <td><span class="barcode-badge">📷 {{ med.barcode }}</span></td>
              <td><strong>{{ med.name }}</strong></td>
              <td>{{ med.generic_name || 'N/A' }}</td>
              <td><span class="cat-tag">{{ med.category }}</span></td>
              <td>{{ med.unit }}</td>
              <td>${{ med.purchase_price }}</td>
              <td><strong>${{ med.selling_price }}</strong></td>
              <td>
                <span class="stock-badge" :class="med.stock_quantity <= med.min_stock_level ? 'stock-low' : 'stock-ok'">
                  {{ med.stock_quantity }} {{ med.unit }}
                </span>
              </td>
              <td><span class="badge badge-success">{{ med.status.toUpperCase() }}</span></td>
            </tr>
            <tr v-if="!medicines.length">
              <td colspan="9" class="empty-cell">No medicines found in pharmacy database matching query.</td>
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

const medicines = ref([]);
const searchQuery = ref('');
const lowStockOnly = ref(false);

async function loadInventory() {
  try {
    const res = await axios.get('/api/v1/pharmacy/medicines', {
      params: { search: searchQuery.value, low_stock: lowStockOnly.value }
    });
    if (res.data.success) {
      medicines.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load inventory:', err);
  }
}

function toggleLowStockFilter() {
  lowStockOnly.value = !lowStockOnly.value;
  loadInventory();
}

onMounted(() => {
  loadInventory();
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

.filter-card {
  margin-bottom: 20px;
  padding: 16px;
}

.filter-row {
  display: flex;
  gap: 16px;
}

.search-wrap { flex: 1; }

.barcode-badge {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 3px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
}

.cat-tag {
  background: #EBF4FC;
  color: var(--color-action-blue);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.stock-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
}

.stock-ok { background: #E6F6F0; color: var(--color-success); }
.stock-low { background: #FDE8E8; color: var(--color-danger); }
</style>
