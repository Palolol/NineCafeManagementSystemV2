<script setup>
import { riel } from '../../../utils/format'

defineProps({
  items: { type: Array, default: () => [] },
})
defineEmits(['add'])
</script>

<template>
  <div class="pos-items">
    <div
      v-for="item in items"
      :key="item.id"
      class="pos-item-card"
      @click="$emit('add', item)"
    >
      <div class="pos-item-emoji">{{ item.emoji || '📦' }}</div>
      <div class="pos-item-name">{{ item.name }}</div>
      <div class="pos-item-price">{{ riel(item.price) }}</div>
    </div>
    <div v-if="!items.length" class="empty" style="grid-column: 1 / -1">
      No items in this category
    </div>
  </div>
</template>