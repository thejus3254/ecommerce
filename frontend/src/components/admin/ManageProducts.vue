<template>
    <div class="admin-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h3 style="font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0;">Manage Products</h3>
            <button class="btn btn-primary" @click="openAddModal">Add New Product</button>
        </div>

        <div class="products-table-wrapper">
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <td><img :src="product.image_url" alt="Product" class="product-thumb" /></td>
                        <td><strong>{{ product.name }}</strong></td>
                        <td>{{ product.category }}</td>
                        <td>${{ Number(product.price).toFixed(2) }}</td>
                        <td>{{ product.stock }}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" @click="openEditModal(product)"
                                style="margin-right:0.5rem;">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="deleteProduct(product.id)"
                                :disabled="loadingId === product.id">Delete</button>
                        </td>
                    </tr>
                    <tr v-if="products.length === 0">
                        <td colspan="6" style="text-align: center;">No products found.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal for Add/Edit Form -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
                <form @submit.prevent="handleSaveProduct">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" v-model="formData.name" required />
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" v-model="formData.category" required />
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" step="0.01" v-model="formData.price" required />
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" v-model="formData.image_url" />
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" v-model="formData.description" />
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" v-model="formData.stock" required />
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="submit" class="btn btn-primary" :disabled="loadingForm">
                            {{ loadingForm ? 'Saving...' : 'Save Product' }}
                        </button>
                    </div>
                    <div v-if="formError" class="error-msg">{{ formError }}</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '../../api';
import { mainStore } from '../../store';

const store = mainStore();
const products = computed(() => store.products);

const showModal = ref(false);
const isEditing = ref(false);
const loadingForm = ref(false);
const formError = ref('');
const loadingId = ref(null);

const formData = ref({
    id: null,
    name: '',
    category: '',
    price: '',
    image_url: 'https://placehold.co/400x300?text=New+Supply',
    description: '',
    stock: 10
});

const openAddModal = () => {
    isEditing.value = false;
    formData.value = { id: null, name: '', category: '', price: '', image_url: 'https://placehold.co/400x300?text=New+Supply', description: '', stock: 10 };
    formError.value = '';
    showModal.value = true;
};

const openEditModal = (product) => {
    isEditing.value = true;
    formData.value = { ...product };
    formError.value = '';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const handleSaveProduct = async () => {
    loadingForm.value = true;
    formError.value = '';

    try {
        if (isEditing.value) {
            await api.put(`/products/${formData.value.id}`, formData.value);
        } else {
            await api.post('/products', formData.value);
        }
        await store.fetchProducts();
        closeModal();
    } catch (err) {
        formError.value = err.response?.data?.msg || 'Failed to save product';
    } finally {
        loadingForm.value = false;
    }
};

const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    loadingId.value = id;
    try {
        await api.delete(`/products/${id}`);
        await store.fetchProducts();
    } catch (err) {
        alert(err.response?.data?.msg || 'Failed to delete product');
    } finally {
        loadingId.value = null;
    }
};
</script>

<style scoped>
.admin-card {
    background: #ffffff;
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: none;
}

.products-table-wrapper {
    overflow-x: auto;
}

.products-table {
    width: 100%;
    border-collapse: collapse;
}

.products-table th,
.products-table td {
    padding: 10px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    vertical-align: middle;
    font-size: 14px;
    letter-spacing: -0.01em;
}

.products-table th {
    color: var(--text-light);
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.product-thumb {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    background: #e9ecef;
}

.btn-danger {
    background-color: var(--danger);
    color: white;
}

.btn-danger:hover {
    opacity: 0.9;
}

.btn-danger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: var(--surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-hover);
}

.modal-content h3 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.error-msg {
    color: var(--danger);
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
}
</style>
