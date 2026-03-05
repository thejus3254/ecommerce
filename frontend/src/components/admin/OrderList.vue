<template>
    <div class="admin-card" style="grid-column: span 2;">
        <h3>All Orders</h3>
        <div class="admin-controls" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
            <button class="btn btn-secondary" @click="fetchOrders" :disabled="loadingOrders">
                Refresh Orders
            </button>
            <div class="filter-group">
                <label for="statusFilter" style="margin-right:0.5rem; font-weight:600;">Filter Status:</label>
                <select id="statusFilter" v-model="statusFilter" class="status-select">
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>
        </div>

        <div v-if="loadingOrders">Loading...</div>
        <div v-else-if="ordersError" class="error-msg">{{ ordersError }}</div>

        <div class="orders-table-wrapper" v-else>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td>#{{ order.id }}</td>
                        <td>
                            {{ order.customer_name }}
                            <br><small>{{ order.customer_email }}</small>
                        </td>
                        <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
                        <td>
                            <select v-model="order.status" @change="updateStatus(order.id, order.status)"
                                :class="['status-select', order.status]" :disabled="updatingOrderId === order.id">
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </td>
                        <td><strong>${{ Number(order.total_amount).toFixed(2) }}</strong></td>
                    </tr>
                    <tr v-if="filteredOrders.length === 0">
                        <td colspan="5" style="text-align: center;">No orders found matching the filter.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';

const orders = ref([]);
const loadingOrders = ref(false);
const ordersError = ref('');
const updatingOrderId = ref(null);
const statusFilter = ref('all');

const filteredOrders = computed(() => {
    if (statusFilter.value === 'all') return orders.value;
    return orders.value.filter(order => order.status === statusFilter.value);
});

const fetchOrders = async () => {
    loadingOrders.value = true;
    ordersError.value = '';
    try {
        const res = await api.get('/orders/all');
        orders.value = res.data;
    } catch (err) {
        ordersError.value = err.response?.data?.msg || 'Failed to load orders';
    } finally {
        loadingOrders.value = false;
    }
};

const updateStatus = async (orderId, newStatus) => {
    updatingOrderId.value = orderId;
    try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });
        // Optional: Show a subtle toast or success indicator
    } catch (err) {
        alert(err.response?.data?.msg || 'Failed to update order status');
        // Revert on error by refetching
        await fetchOrders();
    } finally {
        updatingOrderId.value = null;
    }
};

onMounted(() => {
    fetchOrders();
});
</script>

<style scoped>
.admin-card {
    background: #ffffff;
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: none;
}

.admin-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
}

.error-msg {
    color: var(--danger);
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
}

.orders-table-wrapper {
    overflow-x: auto;
}

.orders-table {
    width: 100%;
    border-collapse: collapse;
}

.orders-table th,
.orders-table td {
    padding: 10px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 14px;
    letter-spacing: -0.01em;
}

.orders-table th {
    color: var(--text-light);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.status-select {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: capitalize;
    border: 1px solid var(--border);
    background-color: white;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: center;
}

.status-select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.status-select.completed {
    background: rgba(46, 204, 113, 0.1);
    color: #27ae60;
    border-color: rgba(46, 204, 113, 0.3);
}

.status-select.failed {
    background: rgba(231, 76, 60, 0.1);
    color: #c0392b;
    border-color: rgba(231, 76, 60, 0.3);
}

.status-select.pending {
    background: rgba(241, 196, 15, 0.1);
    color: #f39c12;
    border-color: rgba(241, 196, 15, 0.3);
}

.status-select.shipped {
    background: rgba(52, 152, 219, 0.1);
    color: #2980b9;
    border-color: rgba(52, 152, 219, 0.3);
}

.status-select.delivered {
    background: rgba(155, 89, 182, 0.1);
    color: #8e44ad;
    border-color: rgba(155, 89, 182, 0.3);
}
</style>
