<script setup>
import { riel } from '../../../utils/format.js'
import { useCart } from '../../../stores/cart.js'
import BaseModal from '../../../components/BaseModal.vue'

defineProps({
  open: Boolean,
  saving: Boolean,
  error: String,
  lastBillId: String,
})
defineEmits(['close', 'confirm'])

const cart = useCart()
</script>

<template>
  <BaseModal
    v-if="open"
    :title="lastBillId ? 'Transaction Successful' : 'Confirm Payment'"
    @close="$emit('close')"
  >
    <!-- Success -->
    <div v-if="lastBillId" class="checkout-success">
      <div style="font-size: 42px; line-height: 1">✅</div>
      <div class="bill-id">{{ lastBillId }}</div>
      <p class="muted" style="margin: 0 0 12px">Bill saved (mock). Ready for next customer.</p>
      <div class="modal-actions" style="justify-content: center">
        <button class="btn" @click="$emit('close')">New Order</button>
      </div>
    </div>

    <!-- Confirm -->
    <template v-else>
      <div class="checkout-summary">
        <div class="pos-pay-row">
          <span>Items</span>
          <span>{{ cart.itemCount }}</span>
        </div>
        <div class="pos-pay-row">
          <span>Subtotal</span>
          <span>{{ riel(cart.subtotal) }}</span>
        </div>
        <div class="pos-pay-row">
          <span>Discount</span>
          <span>− {{ riel(cart.discount) }}</span>
        </div>
        <div class="pos-pay-row" style="font-weight: 700; margin-top: 4px">
          <span>Grand Total</span>
          <span>{{ riel(cart.grandTotal) }}</span>
        </div>
        <div class="pos-pay-row">
          <span>Cash Received</span>
          <span>{{ riel(cart.cashReceived) }}</span>
        </div>
        <div class="pos-pay-row" :style="{ color: cart.balance >= 0 ? '#0b9e82' : '#c8553a', fontWeight: 700 }">
          <span>Change</span>
          <span>{{ riel(cart.balance) }}</span>
        </div>
      </div>

      <div v-if="error" class="alert error" style="margin-top: 10px">{{ error }}</div>

      <div class="modal-actions">
        <button type="button" class="btn light" :disabled="saving" @click="$emit('close')">Cancel</button>
        <button class="btn" :disabled="saving" @click="$emit('confirm')">
          {{ saving ? 'Saving…' : 'Confirm Payment' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>