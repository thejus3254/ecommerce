<template>
  <div class="container animate-fade-in" style="margin-top: 2rem;">
    <div class="admin-header">
      <h2>Admin Dashboard</h2>
      <p>Manage products and view all platform orders.</p>
    </div>

    <div class="admin-sections">
      <div class="tab-container">
        <button :class="['tab-btn', { active: activeTab === 'orders' }]" @click="activeTab = 'orders'">Orders</button>
        <button :class="['tab-btn', { active: activeTab === 'products' }]" @click="activeTab = 'products'">Manage
          Products</button>
      </div>

      <transition name="page" mode="out-in">
        <OrderList v-if="activeTab === 'orders'" />
        <ManageProducts v-else-if="activeTab === 'products'" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ManageProducts from '../components/admin/ManageProducts.vue';
import OrderList from '../components/admin/OrderList.vue';

const activeTab = ref('orders');
</script>

<style scoped>
.admin-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-container {
  display: inline-flex;
  background: #e5e5ea;
  border-radius: 980px;
  padding: 4px;
  margin: 0 auto;
  gap: 4px;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 980px;
  background: transparent;
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn.active {
  background: #ffffff;
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}
</style>
