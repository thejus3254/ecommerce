<template>
    <div class="admin-card">
        <h3>Add New Product</h3>
        <form @submit.prevent="handleCreateProduct">
            <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="newProduct.name" required />
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" v-model="newProduct.category" required />
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" step="0.01" v-model="newProduct.price" required />
            </div>
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" v-model="newProduct.image_url" />
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" v-model="newProduct.description" />
            </div>
            <div class="form-group">
                <label>Stock</label>
                <input type="number" v-model="newProduct.stock" required />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loadingProduct">
                {{ loadingProduct ? 'Adding...' : 'Add Product' }}
            </button>
            <div v-if="productMsg" class="success-msg">{{ productMsg }}</div>
            <div v-if="productError" class="error-msg">{{ productError }}</div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api';
import { mainStore } from '../../store';

const store = mainStore();

const newProduct = ref({
    name: '',
    category: '',
    price: '',
    image_url: 'https://placehold.co/400x300?text=New+Supply',
    description: '',
    stock: 10
});

const loadingProduct = ref(false);
const productMsg = ref('');
const productError = ref('');

const handleCreateProduct = async () => {
    loadingProduct.value = true;
    productMsg.value = '';
    productError.value = '';

    try {
        await api.post('/products', newProduct.value);
        productMsg.value = 'Product created successfully!';
        newProduct.value = {
            name: '', category: '', price: '', image_url: 'https://placehold.co/400x300?text=New+Supply', description: '', stock: 10
        };
        // Refresh products in store
        store.fetchProducts();
    } catch (err) {
        productError.value = err.response?.data?.msg || 'Failed to create product';
    } finally {
        loadingProduct.value = false;
        setTimeout(() => productMsg.value = '', 3000);
    }
};
</script>

<style scoped>
.admin-card {
    background: var(--surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
}

.admin-card h3 {
    margin-bottom: 1.5rem;
    color: var(--primary-dark);
}

.success-msg {
    color: var(--success);
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
}

.error-msg {
    color: var(--danger);
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
}
</style>
