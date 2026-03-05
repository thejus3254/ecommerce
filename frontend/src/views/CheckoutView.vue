<template>
  <div class="container animate-fade-in" style="margin-top: 2rem;">
    <div class="checkout-header">
      <h2>Secure Checkout</h2>
      <p>Please enter your details to complete your order.</p>
    </div>

    <div v-if="cart.length === 0" class="empty-checkout">
      <h3>Your cart is empty</h3>
      <router-link to="/" class="btn btn-secondary mt-2">Return to Shop</router-link>
    </div>

    <div v-else class="checkout-layout">
      <!-- Left: Payment Form Component Composition -->
      <div class="payment-section">
        <form @submit.prevent="processPayment">
          <!-- Imported modular pieces -->
          <ShippingForm v-model="shipping" />
          <PaymentMethod :total="cartTotal" />

          <button type="submit" class="btn btn-primary w-100" style="margin-top:2rem; font-size:1.1rem; padding: 15px;"
            :disabled="isProcessing">
            {{ isProcessing ? 'Verifying Payment...' : 'I have completed the payment' }}
          </button>

          <div v-if="errorMsg" class="error-msg" style="margin-top:1rem; text-align:center;">{{ errorMsg }}</div>
        </form>
      </div>

      <!-- Right: Order Summary Component -->
      <MiniCart :cart="cart" :total="cartTotal" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '../store';
import api from '../api';

// Child Components
import ShippingForm from '../components/checkout/ShippingForm.vue';
import PaymentMethod from '../components/checkout/PaymentMethod.vue';
import MiniCart from '../components/checkout/MiniCart.vue';

const store = mainStore();
const router = useRouter();

const cart = computed(() => store.cart);
const cartTotal = computed(() => store.cartTotal);

const isProcessing = ref(false);
const errorMsg = ref('');

const shipping = ref({
  name: store.user?.username || '',
  address: '',
  city: '',
  zip: ''
});

const processPayment = async () => {
  isProcessing.value = true;
  errorMsg.value = '';

  try {
    // Step 1: Simulate Payment Verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Create Order on backend
    const orderData = {
      total_amount: cartTotal.value,
      items: cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    await api.post('/orders', orderData);

    // Step 3: Clear Vuex cart and go to Orders page
    store.clearCart();
    await store.fetchOrders();
    router.push('/orders');

  } catch (err) {
    console.error(err);
    errorMsg.value = err.response?.data?.msg || 'Payment failed securely. Please try again.';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.checkout-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.checkout-header h2 {
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.error-msg {
  color: var(--danger);
  font-weight: 600;
}
</style>
