<template>
  <div class="container animate-fade-in">
    <div class="cart-header">
      <h2>Your Cart</h2>
    </div>

    <div v-if="cart.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Looks like you haven't added any art supplies yet.</p>
      <router-link to="/" class="btn btn-primary mt-2">Start Shopping</router-link>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <CartItem v-for="(item, index) in cart" :key="item.id" :item="item" :index="index" @add="store.addToCart(item)"
          @remove="store.removeFromCart(item.id)" />
      </div>

      <CartSummary />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { mainStore } from '../store';
import CartItem from '../components/CartItem.vue';
import CartSummary from '../components/CartSummary.vue';

const store = mainStore();

const cart = computed(() => store.cart);
</script>

<style scoped>
.cart-header {
  margin: 2rem 0;
  border-bottom: 2px solid var(--border);
  padding-bottom: 1rem;
}

.cart-header h2 {
  font-size: 2rem;
  color: var(--text-main);
}

.empty-cart {
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

.empty-cart h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
