<template>
    <header class="navbar glass neo-surface">
        <div class="container nav-content">
            <div class="brand-group">
                <router-link to="/" class="brand">Art Supplies 🎨</router-link>
                <div v-if="isAuthenticated" class="user-greeting">
                    <span>Hi, {{ store.user?.name }}!</span>
                    <span v-if="store.user?.role === 'admin'" class="admin-badge">Admin</span>
                </div>
            </div>
            <nav class="nav-links">
                <router-link to="/">Shop</router-link>
                <router-link v-if="isAuthenticated && store.user?.role !== 'admin'" to="/favorites"
                    class="nav-link">Favorites</router-link>
                <router-link v-if="store.user?.role !== 'admin'" to="/cart" class="cart-link">
                    Cart <span class="cart-badge" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
                </router-link>
                <template v-if="!isAuthenticated">
                    <router-link to="/login" class="nav-link">Login</router-link>
                    <router-link to="/register" class="btn btn-primary"
                        style="padding: 8px 18px; margin-left:10px;">Sign Up</router-link>
                </template>
                <template v-else>
                    <router-link v-if="store.user?.role !== 'admin'" to="/orders" class="nav-link">My
                        Orders</router-link>
                    <router-link v-if="store.user?.role === 'admin'" to="/admin" class="nav-link">Admin
                        Dashboard</router-link>
                    <a href="#" @click.prevent="handleLogout" class="nav-link">Logout</a>
                </template>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '../store';

const store = mainStore();
const router = useRouter();

const isAuthenticated = computed(() => store.isAuthenticated);
const cartItemsCount = computed(() => store.cart.reduce((total, item) => total + item.quantity, 0));

const handleLogout = () => {
    store.logout();
    router.push('/login');
};
</script>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 1rem 0;
    border-bottom: none;
    /* Remove old shadow, rely on neo-surface */
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-group {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.brand {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: -0.01em;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1.8rem;
    font-weight: 400;
    font-size: 0.85rem;
}

.nav-links a {
    color: var(--text-main);
    transition: color 0.2s;
}

.nav-links a:hover {
    color: var(--primary);
}

.cart-link {
    position: relative;
}

.cart-badge {
    position: absolute;
    top: -8px;
    right: -12px;
    background: var(--danger);
    color: white;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: bold;
}

.user-greeting {
    color: var(--text-light);
}

.admin-badge {
    background: #424245;
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 5px;
    vertical-align: super;
}

@media (max-width: 768px) {
    .brand {
        font-size: 1.1rem;
    }

    .nav-links {
        gap: 0.8rem;
        font-size: 0.75rem;
    }

    .user-greeting {
        display: none;
        /* Hide greeting on small screens to save space */
    }

    .btn-primary {
        padding: 6px 12px !important;
    }
}
</style>
