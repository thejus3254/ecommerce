<template>
  <div class="auth-container animate-fade-in">
    <div class="auth-card">
      <h2>Welcome Back</h2>
      <p class="subtitle">Log in to your account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" v-model="email" required placeholder="you@example.com" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required placeholder="••••••••" />
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>

        <div class="divider"><span>OR</span></div>

        <div class="google-auth">
          <GoogleLogin :callback="callback" />
        </div>
      </form>

      <div class="auth-footer">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '../store';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const store = mainStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await store.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    errorMsg.value = err.response?.data?.msg || 'Failed to login';
  } finally {
    loading.value = false;
  }
};

const callback = async (response) => {
  errorMsg.value = '';
  try {
    await store.googleLogin(response.credential);
    router.push('/');
  } catch (err) {
    errorMsg.value = 'Google Login failed. Please try again.';
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-card {
  background: var(--surface);
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hover);
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border);
}

h2 {
  text-align: center;
  color: var(--primary-dark);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.w-100 {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-light);
}

.auth-footer a {
  color: var(--primary);
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-msg {
  color: var(--danger);
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: var(--radius);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: var(--text-light);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border);
}

.divider span {
  padding: 0 10px;
  font-size: 0.9rem;
}

.google-auth {
  display: flex;
  justify-content: center;
}
</style>
