<template>
  <div class="container animate-fade-in">
    <div class="hero">
      <h1>Premium Art Supplies</h1>
      <p>Elevate your creativity with our curated collection of professional tools.</p>
    </div>

    <div class="products-grid" v-if="products.length > 0">
      <ProductCard v-for="(product, index) in products" :key="product.id" :product="product" :index="index"
        @add-to-cart="addToCart" />
    </div>

    <div v-else class="loading">
      <h2>Loading supplies...</h2>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { mainStore } from '../store';
import ProductCard from '../components/ProductCard.vue';

const store = mainStore();

const products = computed(() => store.products);

onMounted(() => {
  store.fetchProducts();
});

const addToCart = (product) => {
  store.addToCart(product);
  // Optional: add a tiny toast notification here
};
</script>

<style scoped>
.hero {
  text-align: center;
  margin: 6rem 0 5rem 0;
}

.hero h1 {
  font-size: 4.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.hero p {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
}
</style>
