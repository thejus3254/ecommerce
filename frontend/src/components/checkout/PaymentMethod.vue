<template>
    <div class="form-section">
        <h3>Payment Method</h3>
        <div class="upi-container">
            <p class="upi-instructions">Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to complete your
                payment.</p>

            <div class="qr-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=mock@upi&pn=PremiumArtSupplies&am=1&cu=INR"
                    alt="UPI QR Code" class="qr-image" />
            </div>

            <p class="upi-amount">Total to pay: <strong>${{ Number(total).toFixed(2) }}</strong></p>

            <div class="scan-apps-icons">
                <span class="app-badge">GPay</span>
                <span class="app-badge">PhonePe</span>
                <span class="app-badge">Paytm</span>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * PaymentMethod.vue
 * 
 * Displays the UPI QR scanner and total amount.
 * Receives the calculated `total` as a prop from the parent CheckoutView.
 */
defineProps({
    total: {
        type: Number,
        required: true
    }
});
</script>

<style scoped>
.form-section {
    background: #ffffff;
    padding: 2rem;
    border-radius: var(--radius-lg);
    margin-bottom: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: var(--shadow-sm);
}

.form-section h3 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: var(--text-main);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 0.5rem;
}

.upi-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
    background: #fdfdfd;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.upi-instructions {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
}

.qr-box {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0, 0, 0, 0.08);
    margin-bottom: 1.5rem;
    display: inline-block;
}

.qr-image {
    width: 200px;
    height: 200px;
    display: block;
}

.upi-amount {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.scan-apps-icons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.app-badge {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-main);
}
</style>
