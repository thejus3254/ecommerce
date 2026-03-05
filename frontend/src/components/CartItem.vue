<template>
    <div class="cart-item animate-fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="item-image" :style="{ backgroundImage: `url(${item.image_url})` }"></div>
        <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="category">{{ item.category }}</p>
        </div>
        <div class="item-actions">
            <div class="quantity-controls">
                <button @click="$emit('remove')">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="$emit('add')">+</button>
            </div>
            <div class="item-total">
                ${{ (item.price * item.quantity).toFixed(2) }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    }
});

defineEmits(['add', 'remove']);
</script>

<style scoped>
.cart-item {
    display: flex;
    background: var(--surface);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    align-items: center;
}

.item-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    border-radius: var(--radius);
    margin-right: 1.5rem;
}

.item-details {
    flex: 1;
}

.item-details h3 {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
}

.category {
    color: var(--text-light);
    font-size: 0.9rem;
}

.item-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #f1f2f6;
    padding: 5px 10px;
    border-radius: 20px;
}

.quantity-controls button {
    background: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: var(--primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
}

.item-total {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--primary-dark);
    min-width: 80px;
    text-align: right;
}
</style>
