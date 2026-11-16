<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: [Number, String, null], default: null }, // null = All
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="pos-categories">
    <button
      class="pos-cat-btn"
      :class="{ active: modelValue === null }"
      @click="$emit('update:modelValue', null)"
    >
      All
    </button>
    <button
      v-for="c in categories"
      :key="c.id"
      class="pos-cat-btn"
      :class="{ active: modelValue === c.id }"
      @click="$emit('update:modelValue', c.id)"
    >
      {{ c.name }}
    </button>
  </div>
</template>