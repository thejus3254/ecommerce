<template>
    <div class="container animate-fade-in" style="margin-top: 2rem;">
        <div class="orders-header">
            <h2>My Orders</h2>
            <p>View your past purchases and track their delivery status.</p>
        </div>

        <div v-if="loading" class="loading">
            <h2>Loading your orders...</h2>
        </div>
        <div v-else-if="orders.length === 0" class="empty-orders">
            <div class="empty-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start exploring our supplies today!</p>
            <router-link to="/" class="btn btn-primary mt-2">Shop Now</router-link>
        </div>

        <div v-else class="orders-list">
            <OrderCard v-for="(order, index) in orders" :key="order.id" :order="order" :index="index" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { mainStore } from '../store';
import OrderCard from '../components/OrderCard.vue';

const store = mainStore();
const loading = ref(true);

const orders = computed(() => store.myOrders);

onMounted(async () => {
    loading.value = true;
    await store.fetchMyOrders();
    loading.value = false;
});
</script>

<style scoped>
.orders-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.orders-header h2 {
    font-size: 2rem;
    color: var(--primary-dark);
}

.orders-header p {
    color: var(--text-light);
}

.loading,
.empty-orders {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--surface);
    border-radius: var(--radius-lg);
    border: 1px dashed var(--text-light);
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.empty-orders h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.empty-orders p {
    color: var(--text-light);
    margin-bottom: 1.5rem;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
</style>
