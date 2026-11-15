<script setup>
import { riel, saleTotal, saleUnit } from "./format";

defineProps({ sales: Array, canUpdate: Boolean, canDelete: Boolean });
defineEmits(["adjust", "remove"]);
</script>

<template>
  <table class="db-table">
    <thead>
      <tr>
        <th>PRICE</th>
        <th>CUPS SOLD</th>
        <th>TOTAL</th>
        <th class="db-th-right">ACTIONS</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!sales.length">
        <td colspan="4" class="db-empty-cell">
          No sales recorded for this date.
        </td>
      </tr>
      <tr v-for="(s, i) in sales" :key="s.id ?? i" class="db-sale-row">
        <td class="db-price-cell">{{ riel(saleUnit(s)) }}</td>
        <td>
          <div class="db-qty-control">
            <button
              class="db-qty-btn"
              :disabled="!canUpdate || s.quantity <= 1"
              @click="$emit('adjust', s, -1)"
            >
              −
            </button>
            <span class="db-qty-num">{{ s.quantity }}</span>
            <button
              class="db-qty-btn"
              :disabled="!canUpdate"
              @click="$emit('adjust', s, 1)"
            >
              +
            </button>
          </div>
        </td>
        <td class="db-total-cell">{{ riel(saleTotal(s)) }}</td>
        <td class="db-action-cell">
          <button
            v-if="canDelete"
            class="db-icon-btn danger"
            title="Delete sale"
            @click="$emit('remove', s)"
          >
            🗑
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.db-sale-row:hover {
  background: #f8fafc;
}
.db-price-cell {
  font-weight: 700;
  font-size: 15px;
  color: var(--heading, #2a3547);
}
.db-total-cell {
  color: #1a73e8;
  font-weight: 700;
  font-size: 15px;
}
.db-qty-control {
  display: inline-flex;
  align-items: center;
}
.db-qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #dfe5ef;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--heading, #2a3547);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
  line-height: 1;
}
.db-qty-btn:first-child {
  border-radius: 6px 0 0 6px;
}
.db-qty-btn:last-child {
  border-radius: 0 6px 6px 0;
}
.db-qty-btn:hover:not(:disabled) {
  background: #f0f4f9;
}
.db-qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.db-qty-num {
  min-width: 40px;
  height: 30px;
  border-top: 1px solid #dfe5ef;
  border-bottom: 1px solid #dfe5ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: var(--heading, #2a3547);
  background: #fff;
}
</style>
