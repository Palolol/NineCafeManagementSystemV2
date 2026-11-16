<script setup>
import { riel } from '../../../utils/format'
import { useCart } from '../../../stores/cart'

const cart = useCart()

defineEmits(['pay', 'cancel', 'print'])
</script>

<template>
  <aside class="pos-bill">
    <!-- Header -->
    <div class="pos-bill-header">
      <h3>Current Bill</h3>
      <span v-if="cart.itemCount" class="pos-bill-count">{{ cart.itemCount }} items</span>
    </div>

    <!-- Bill table (like the original WPF DataGrid) -->
    <div class="pos-bill-table-wrap">
      <table v-if="cart.lines.length" class="pos-bill-table">
        <thead>
          <tr>
            <th class="col-no">#</th>
            <th>Item</th>
            <th class="col-price">Price</th>
            <th class="col-qty">Qty</th>
            <th class="col-total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(line, idx) in cart.lines" :key="line.id">
            <td class="col-no">{{ idx + 1 }}</td>
            <td>{{ line.name }}</td>
            <td class="col-price">{{ riel(line.price) }}</td>
            <td class="col-qty">
              <div class="pos-qty-ctrl">
                <button class="pos-qty-btn" @click="cart.decrement(line.id)">−</button>
                <span class="pos-qty-val">{{ line.qty }}</span>
                <button class="pos-qty-btn" @click="cart.increment(line.id)">+</button>
              </div>
            </td>
            <td class="col-total">{{ riel(line.price * line.qty) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="pos-bill-empty">
        Tap items on the left to start a bill
      </div>
    </div>

    <!-- Payment section (Discount + Cash + Balance + buttons) -->
    <div class="pos-payment">
      <div class="pos-pay-row">
        <label for="discount">Discount (៛)</label>
        <input
          id="discount"
          v-model.number="cart.discount"
          type="number"
          min="0"
          step="100"
          placeholder="0"
        />
      </div>

      <div class="pos-pay-row">
        <label for="cash">Cash Received (៛)</label>
        <input
          id="cash"
          v-model.number="cart.cashReceived"
          type="number"
          min="0"
          step="100"
          placeholder="0"
        />
      </div>

      <div class="pos-pay-totals">
        <div class="pos-pay-row">
          <span>Subtotal</span>
          <span>{{ riel(cart.subtotal) }}</span>
        </div>
        <div class="pos-pay-row">
          <span>Discount</span>
          <span>− {{ riel(cart.discount) }}</span>
        </div>
        <div class="pos-pay-row grand">
          <span>Grand Total</span>
          <span>{{ riel(cart.grandTotal) }}</span>
        </div>
        <div
          class="pos-pay-row balance"
          :class="cart.balance >= 0 ? 'ok' : 'owed'"
        >
          <span>Balance / Change</span>
          <span>{{ riel(cart.balance) }}</span>
        </div>
      </div>

      <div class="pos-actions">
        <button
          class="btn btn-full"
          :disabled="!cart.lines.length"
          @click="$emit('pay')"
        >
          Payment
        </button>
        <button
          class="btn light"
          :disabled="!cart.lines.length"
          @click="$emit('print')"
        >
          Print
        </button>
        <button
          class="btn danger"
          :disabled="!cart.lines.length"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </aside>
</template>