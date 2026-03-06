import { defineStore } from 'pinia';
import api from '../api';

export const mainStore = defineStore('main', {
    /**
     * STATE
     * The central source of truth for the application's data.
     * All components reactively update when these values change.
     */
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        products: [],
        myOrders: [],
        favorites: []
    }),
    /**
     * GETTERS
     * Derived state computation. Similar to computed properties in components.
     * These automatically re-evaluate when their dependencies (state) change.
     */
    getters: {
        isAuthenticated: (state) => !!state.token,
        cartTotal: (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    /**
     * ACTIONS
     * Methods used to mutate the state. They can be synchronous or asynchronous.
     * This is where API calls belong to keep components clean.
     */
    actions: {
        async login(email, password) {
            try {
                const res = await api.post('/auth/login', { email, password });
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('token', this.token);
                return true;
            } catch (error) {
                console.error("Login Error:", error.response?.data?.msg || error.message);
                throw error;
            }
        },
        async googleLogin(credential) {
            try {
                const res = await api.post('/auth/google', { credential });
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('token', this.token);
                return true;
            } catch (error) {
                console.error("Google Login Error:", error.response?.data?.msg || error.message);
                throw error;
            }
        },
        async register(name, email, password) {
            try {
                const res = await api.post('/auth/register', { name, email, password });
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('token', this.token);
                return true;
            } catch (error) {
                console.error("Registration Error:", error.response?.data?.msg || error.message);
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            this.cart = [];
            localStorage.removeItem('cart');
            this.favorites = [];
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const res = await api.get('/auth/user');
                this.user = res.data;
            } catch (error) {
                this.logout();
            }
        },
        async fetchProducts() {
            try {
                const res = await api.get('/products');
                this.products = res.data;
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        async fetchMyOrders() {
            if (!this.token) return;
            try {
                const res = await api.get('/orders/myorders');
                this.myOrders = res.data;
            } catch (error) {
                console.error("Error fetching my orders:", error);
            }
        },
        async fetchFavorites() {
            if (!this.token) return;
            try {
                const res = await api.get('/favorites/myfavorites');
                this.favorites = res.data;
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        },
        async toggleFavorite(product) {
            if (!this.token) {
                return; // Optionally redirect to login or throw error depending on component needs
            }

            const isFav = this.favorites.some(f => f.id === product.id);
            try {
                if (isFav) {
                    await api.delete(`/favorites/${product.id}`);
                    this.favorites = this.favorites.filter(f => f.id !== product.id);
                } else {
                    await api.post(`/favorites/${product.id}`);
                    this.favorites.push(product);
                }
            } catch (error) {
                console.error("Error toggling favorite:", error);
            }
        },
        addToCart(product) {
            const item = this.cart.find(i => i.id === product.id);
            if (item) {
                item.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        removeFromCart(productId) {
            const index = this.cart.findIndex(i => i.id === productId);
            if (index !== -1) {
                if (this.cart[index].quantity > 1) {
                    this.cart[index].quantity--;
                } else {
                    this.cart.splice(index, 1);
                }
                localStorage.setItem('cart', JSON.stringify(this.cart));
            }
        },
        clearCart() {
            this.cart = [];
            localStorage.removeItem('cart');
        }
    }
});
