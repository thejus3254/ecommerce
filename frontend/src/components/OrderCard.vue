<template>
    <div class="order-card animate-fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="order-header">
            <div>
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ formattedDate }}</span>
            </div>
            <div class="order-status-total">
                <span :class="['status-badge', order.status]">{{ order.status }}</span>
                <span class="order-total">${{ Number(order.total_amount).toFixed(2) }}</span>
            </div>
        </div>

        <OrderTracker :status="order.status" />

        <div class="order-items">
            <h4>Items in this order</h4>
            <div class="item-list">
                <div class="item" v-for="item in order.items" :key="item.product_id">
                    <div class="item-product">
                        <img :src="item.image_url || 'https://placehold.co/100x100?text=Item'" alt="Product Image"
                            class="item-img" />
                        <span class="item-name">{{ item.name || `Product ID: ${item.product_id}` }}</span>
                    </div>
                    <div class="item-details">
                        <span class="item-qty">Qty: {{ item.quantity }}</span>
                        <span class="item-price">${{ Number(item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import OrderTracker from './OrderTracker.vue';

const props = defineProps({
    order: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    }
});

const formattedDate = computed(() => {
    return new Date(props.order.created_at).toLocaleDateString();
});
</script>

<style scoped>
.order-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
}

.order-id {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--primary-dark);
    margin-right: 1rem;
}

.order-date {
    color: var(--text-light);
    font-size: 0.9rem;
}

.order-status-total {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: capitalize;
}

.status-badge.completed {
    background: rgba(46, 204, 113, 0.2);
    color: #27ae60;
}

.status-badge.failed {
    background: rgba(231, 76, 60, 0.2);
    color: #c0392b;
}

.status-badge.pending {
    background: rgba(241, 196, 15, 0.2);
    color: #f39c12;
}

.status-badge.shipped {
    background: rgba(52, 152, 219, 0.2);
    color: #2980b9;
}

.status-badge.delivered {
    background: rgba(155, 89, 182, 0.2);
    color: #8e44ad;
}

.order-total {
    font-size: 1.25rem;
    font-weight: bold;
}

.order-items h4 {
    margin-bottom: 1rem;
    color: var(--secondary);
}

.item-list {
    background: #f8f9fa;
    border-radius: var(--radius);
    padding: 1rem;
}

.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
}

.item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.item:first-child {
    padding-top: 0;
}

.item-product {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.item-img {
    width: 50px;
    height: 50px;
    border-radius: var(--radius);
    object-fit: cover;
    background: #e9ecef;
}

.item-name {
    font-weight: 600;
    color: var(--text-main);
}

.item-details {
    display: flex;
    align-items: center;
    gap: 2rem;
    text-align: right;
}

.item-qty {
    color: var(--text-light);
    font-size: 0.9rem;
}

.item-price {
    font-weight: bold;
    color: var(--primary-dark);
    min-width: 60px;
}
</style>
