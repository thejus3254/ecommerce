<template>
    <div class="summary-section">
        <div class="mini-cart">
            <h3>In Your Cart</h3>
            <div class="mini-item" v-for="item in cart" :key="item.id">
                <img :src="item.image_url" alt="" class="mini-img" />
                <div class="mini-info">
                    <span class="mini-name">{{ item.name }}</span>
                    <span class="mini-qty">Qty: {{ item.quantity }}</span>
                </div>
                <span class="mini-price">${{ Number(item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span class="total-price">${{ Number(total).toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * MiniCart.vue
 * 
 * A stateless presentation component that displays the items in the cart
 * and the calculated total. It receives its data strictly via props.
 */
defineProps({
    cart: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});
</script>

<style scoped>
.mini-cart {
    background: #ffffff;
    padding: 2rem;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 100px;
}

.mini-cart h3 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
}

.mini-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.mini-img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    background: white;
    border-radius: 8px;
    margin-right: 1rem;
}

.mini-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.mini-name {
    font-size: 0.9rem;
    font-weight: 600;
}

.mini-qty {
    font-size: 0.8rem;
    color: var(--text-light);
}

.mini-price {
    font-weight: 600;
    font-size: 0.95rem;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
    padding-top: 1rem;
}

.total-price {
    font-weight: bold;
    font-size: 1.2rem;
}
</style>
