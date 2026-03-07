<template>
    <div class="product-card neo-surface animate-fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="product-image-container">
            <button v-if="store.user && store.user.role !== 'admin'" class="favorite-btn"
                :class="{ active: isFavorite }" @click.prevent="store.toggleFavorite(product)"
                aria-label="Toggle Favorite">
                ♥
            </button>
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
import { computed } from 'vue';
import { mainStore } from '../store';

const store = mainStore();

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    }
});

const isFavorite = computed(() => store.favorites.some(f => f.id === props.product.id));

defineEmits(['add-to-cart']);
</script>

<style scoped>
.product-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: none;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 16px 16px 30px rgba(163,177,198, 0.8), -16px -16px 30px rgba(255,255,255, 0.9);
}

.product-image-container {
    height: 250px;
    overflow: hidden;
    padding: 2rem;
    background: transparent;
    position: relative;
}

.favorite-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    z-index: 10;
    transition: var(--transition);
    color: #d2d2d7;
    font-size: 1.4rem;
    line-height: 1;
}

.favorite-btn:hover {
    transform: scale(1.1);
}

.favorite-btn.active {
    color: #ff3b30;
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
