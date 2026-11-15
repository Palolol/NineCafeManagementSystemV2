<script setup>
import { riel } from './format'

defineProps({ prices: Array, disabled: Boolean, error: String })
defineEmits(['sale'])
</script>

<template>
  <div class="db-quick-sale">
    <div class="db-quick-label">QUICK SALE (RECORD 1 CUP):</div>
    <div class="db-quick-btns">
      <button v-for="p in prices" :key="p.id" class="db-quick-btn" :disabled="disabled" @click="$emit('sale', p)">
        {{ riel(p.priceRiel) }}
      </button>
    </div>
    <div v-if="error" class="db-inline-error" style="padding-left: 0">{{ error }}</div>
  </div>
</template>

<style scoped>
.db-quick-sale { padding: 14px 20px 10px; border-bottom: 1px solid #ebf1f6; }
.db-quick-label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #707a82; margin-bottom: 10px; }
.db-quick-btns { display: flex; flex-wrap: wrap; gap: 8px; }
.db-quick-btn { background: #1a73e8; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s, transform .1s; }
.db-quick-btn:hover:not(:disabled) { background: #1558b0; transform: translateY(-1px); }
.db-quick-btn:active { transform: translateY(0); }
.db-quick-btn:disabled { opacity: .55; cursor: not-allowed; }
</style>
