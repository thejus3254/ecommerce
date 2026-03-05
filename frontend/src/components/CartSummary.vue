<template>
    <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-line">
            <span>Subtotal</span>
            <span>${{ Number(cartTotal).toFixed(2) }}</span>
        </div>
        <div class="summary-line">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>${{ Number(cartTotal).toFixed(2) }}</span>
        </div>

        <router-link to="/checkout" class="btn btn-primary w-100">
            Proceed to Checkout
        </router-link>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { mainStore } from '../store';

const store = mainStore();
const cartTotal = computed(() => store.cartTotal);
</script>

<style scoped>
.cart-summary {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    height: fit-content;
    position: sticky;
    top: 100px;
}

.cart-summary h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    color: var(--text-light);
    font-size: 1.1rem;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--border);
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-main);
    margin-bottom: 2rem;
}

.w-100 {
    width: 100%;
    padding: 15px;
    font-size: 1.1rem;
    text-align: center;
}
</style>
