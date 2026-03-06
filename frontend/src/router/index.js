import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import AdminView from '../views/AdminView.vue';
import OrdersView from '../views/OrdersView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import { mainStore } from '../store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/cart',
            name: 'cart',
            component: CartView
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: CheckoutView,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView,
            meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
            path: '/orders',
            name: 'orders',
            component: OrdersView,
            meta: { requiresAuth: true }
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: FavoritesView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const store = mainStore();

    // If we have a token but haven't loaded the user yet, fetch it before deciding
    if (store.token && !store.user) {
        await store.fetchUser();
    }

    const isAuthenticated = store.isAuthenticated;
    const isAdmin = store.user?.role === 'admin';

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresAdmin && !isAdmin) {
        console.warn('Blocked! User missing Admin role.');
        next('/'); // Redirect to home if not admin
    } else {
        next();
    }
});

export default router;
