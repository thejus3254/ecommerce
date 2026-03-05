<template>
    <div class="password-strength">
        <div class="strength-meter">
            <div class="strength-bar" :class="strengthClass" :style="{ width: `${strengthPercentage}%` }"></div>
        </div>
        <div class="strength-label">
            {{ strengthLabel }}
        </div>
        <ul class="requirements-list">
            <li :class="{ 'met': hasLength }">✔ At least 8 characters</li>
            <li :class="{ 'met': hasUppercase }">✔ At least one uppercase letter</li>
            <li :class="{ 'met': hasLowercase }">✔ At least one lowercase letter</li>
            <li :class="{ 'met': hasNumber }">✔ At least one number</li>
            <li :class="{ 'met': hasSpecial }">✔ At least one special character (!@#$%^&*)</li>
        </ul>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
    password: {
        type: String,
        required: true,
        default: ''
    }
});

const emit = defineEmits(['validityChange']);

const hasLength = computed(() => props.password.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(props.password));
const hasLowercase = computed(() => /[a-z]/.test(props.password));
const hasNumber = computed(() => /[0-9]/.test(props.password));
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(props.password));

const score = computed(() => {
    let s = 0;
    if (hasLength.value) s++;
    if (hasUppercase.value) s++;
    if (hasLowercase.value) s++;
    if (hasNumber.value) s++;
    if (hasSpecial.value) s++;
    return s;
});

const isValid = computed(() => score.value === 5);

watch(isValid, (newVal) => {
    emit('validityChange', newVal);
});

const strengthPercentage = computed(() => (score.value / 5) * 100);

const strengthLabel = computed(() => {
    if (props.password.length === 0) return 'Enter a password';
    if (score.value <= 2) return 'Weak';
    if (score.value <= 4) return 'Moderate';
    return 'Strong';
});

const strengthClass = computed(() => {
    if (score.value <= 2) return 'weak';
    if (score.value <= 4) return 'moderate';
    return 'strong';
});
</script>

<style scoped>
.password-strength {
    margin-top: 0.5rem;
}

.strength-meter {
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    margin-bottom: 0.5rem;
    overflow: hidden;
}

.strength-bar {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-bar.weak {
    background-color: var(--danger);
}

.strength-bar.moderate {
    background-color: #f39c12;
}

.strength-bar.strong {
    background-color: var(--success);
}

.strength-label {
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-light);
}

.requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.75rem;
}

.requirements-list li {
    color: var(--text-light);
    margin-bottom: 0.2rem;
    transition: color 0.2s ease;
}

.requirements-list li.met {
    color: var(--success);
}
</style>
