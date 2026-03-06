<template>
    <div class="product-card animate-fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="product-image-container">
            <div class="product-image" :style="{ backgroundImage: `url(${product.image_url})` }"></div>
        </div>
        <div class="product-info">
            <span class="category">{{ product.category }}</span>
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="product-footer">
                <span class="price">${{ Number(product.price).toFixed(2) }}</span>
                <button v-if="store.user?.role !== 'admin'" class="btn btn-primary btn-sm"
                    @click="$emit('add-to-cart', product)">
                    Buy
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { mainStore } from '../store';

const store = mainStore();

defineProps({
    product: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    }
});

defineEmits(['add-to-cart']);
</script>

<style scoped>
.product-card {
    background: #ffffff;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    border: none;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hover);
}

.product-image-container {
    height: 250px;
    overflow: hidden;
    padding: 2rem;
    background: #ffffff;
}

.product-image {
    height: 100%;
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.5s ease;
}

.product-card:hover .product-image {
    transform: scale(1.08);
}

.product-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.category {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary);
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.product-info h3 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
    color: var(--text-main);
}

.description {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    flex: 1;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.price {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
}

.btn-sm {
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .product-image-container {
        height: 180px;
        padding: 1rem;
    }

    .product-info {
        padding: 1rem;
    }

    .product-info h3 {
        font-size: 1.25rem;
    }

    .price {
        font-size: 1.3rem;
    }
}
</style>
