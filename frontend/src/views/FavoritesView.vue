<template>
    <div class="container animate-fade-in-up">
        <div class="header-section">
            <h1>My Favorites 🤍</h1>
            <p>Your curated collection of premium art supplies.</p>
        </div>

        <div v-if="loading" class="loading">
            <h2>Loading favorites...</h2>
        </div>
        <div v-else-if="favorites.length === 0" class="empty-state">
            <h2>You haven't added any favorites yet.</h2>
            <p>Browse the shop and click the heart icon to save products here!</p>
            <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Go to Shop</router-link>
        </div>
        <div class="products-grid" v-else>
            <ProductCard v-for="(product, index) in favorites" :key="product.id" :product="product" :index="index"
                @add-to-cart="store.addToCart" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { mainStore } from '../store';
import ProductCard from '../components/ProductCard.vue';

const store = mainStore();
const loading = ref(true);

const favorites = computed(() => store.favorites);

onMounted(async () => {
    await store.fetchFavorites();
    loading.value = false;
});
</script>

<style scoped>
.header-section {
    margin: 3rem 0;
    text-align: center;
}

.header-section h1 {
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
}

.header-section p {
    color: var(--text-light);
    font-size: 1.1rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2.5rem;
    margin-bottom: 4rem;
}

.empty-state {
    text-align: center;
    padding: 5rem 1rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    max-width: 600px;
    margin: 0 auto;
}

.empty-state h2 {
    font-weight: 600;
    margin-bottom: 1rem;
}

.empty-state p {
    color: var(--text-light);
    margin-bottom: 2rem;
}

.loading {
    text-align: center;
    padding: 4rem;
    color: var(--text-light);
}

@media (max-width: 768px) {
    .header-section h1 {
        font-size: 2rem;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
    }
}
</style>
