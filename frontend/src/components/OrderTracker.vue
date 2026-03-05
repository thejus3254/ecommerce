<template>
    <div class="tracker-container">
        <div class="step" :class="{ 'active': steps >= 1 }">
            <div class="icon">🛒</div>
            <p>Placed</p>
        </div>

        <div class="connector" :class="{ 'active': steps >= 2 }"></div>

        <div class="step" :class="{ 'active': steps >= 2, 'failed': isFailed }">
            <div class="icon">{{ isFailed ? '❌' : '💳' }}</div>
            <p>{{ isFailed ? 'Payment Failed' : 'Processed' }}</p>
        </div>

        <div class="connector" :class="{ 'active': steps >= 3, 'hidden': isFailed }"></div>

        <div class="step" :class="{ 'active': steps >= 3, 'hidden': isFailed }">
            <div class="icon">🚚</div>
            <p>Shipped</p>
        </div>

        <div class="connector" :class="{ 'active': steps >= 4, 'hidden': isFailed }"></div>

        <div class="step" :class="{ 'active': steps >= 4, 'hidden': isFailed }">
            <div class="icon">📦</div>
            <p>Delivered</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const steps = computed(() => {
    if (props.status === 'failed') return 2;
    if (props.status === 'pending') return 1;
    if (props.status === 'completed') return 2; // For demonstration, default to processed when completed
    if (props.status === 'shipped') return 3;
    if (props.status === 'delivered') return 4;
    return 1;
});

const isFailed = computed(() => props.status === 'failed');
</script>

<style scoped>
.tracker-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2rem 0;
    padding: 1rem;
    background: white;
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.4;
    transition: all 0.3s ease;
    width: 60px;
}

.step.active {
    opacity: 1;
}

.step.failed {
    opacity: 1;
    color: var(--danger);
}

.icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: #f1f2f6;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step.active .icon {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 8px rgba(var(--primary-rgb), 0.3);
}

.step.failed .icon {
    background: var(--danger);
    color: white;
}

.step p {
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
}

.connector {
    flex: 1;
    height: 4px;
    background: #e0e0e0;
    margin: 0 10px;
    border-radius: 2px;
    position: relative;
    top: -15px;
    transition: background 0.3s ease;
}

.connector.active {
    background: var(--primary);
}

.connector.hidden,
.step.hidden {
    display: none;
}

@media (max-width: 600px) {
    .tracker-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .step {
        flex-direction: row;
        width: 100%;
        justify-content: flex-start;
        gap: 1rem;
    }

    .connector {
        width: 4px;
        height: 30px;
        margin: -10px 0 -10px 23px;
        top: 0;
    }
}
</style>
