<template>
    <div class="form-section neo-surface">
        <h3>Shipping Details</h3>
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" :value="modelValue.name" @input="updateField('name', $event.target.value)" required />
        </div>
        <div class="form-group">
            <label>Address</label>
            <input type="text" :value="modelValue.address" @input="updateField('address', $event.target.value)"
                required />
        </div>
        <div class="form-row">
            <div class="form-group" style="flex: 2;">
                <label>City</label>
                <input type="text" :value="modelValue.city" @input="updateField('city', $event.target.value)"
                    required />
            </div>
            <div class="form-group" style="flex: 1;">
                <label>ZIP</label>
                <input type="text" :value="modelValue.zip" @input="updateField('zip', $event.target.value)" required />
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * ShippingForm.vue
 * 
 * A reusable child component responsible strictly for collecting user delivery details.
 * It uses the `v-model` pattern in Vue 3, accepting `modelValue` and emitting `update:modelValue`.
 */
const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    });
};
</script>

<style scoped>
.form-section {
    background: var(--surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    margin-bottom: 1.5rem;
    border: none;
}

.form-section h3 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: var(--text-main);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 0.5rem;
}

.form-row {
    display: flex;
    gap: 1rem;
}

</style>
