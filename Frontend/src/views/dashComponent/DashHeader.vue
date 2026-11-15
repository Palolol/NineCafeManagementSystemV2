<script setup>
defineProps({ displayDate: String, isToday: Boolean });
defineEmits(["prev", "next", "today"]);
</script>

<template>
  <div class="db-title-row">
    <h1 class="db-title">Nine Cafe – Management System</h1>
    <div class="db-date-nav">
      <button class="db-nav-btn" @click="$emit('prev')">&#8249;</button>
      <span class="db-date-display"
        ><span class="db-cal-icon">📅</span>{{ displayDate }}</span
      >
      <button class="db-nav-btn" :disabled="isToday" @click="$emit('next')">
        &#8250;
      </button>
      <button
        class="db-today-btn"
        :class="{ active: isToday }"
        @click="$emit('today')"
      >
        🕐 Today
      </button>
    </div>
  </div>
</template>

<style scoped>
.db-title-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  text-align: center;
}
.db-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--heading, #2a3547);
  margin: 0;
}
.db-date-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.db-nav-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #dfe5ef;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: var(--heading, #2a3547);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.db-nav-btn:hover:not(:disabled) {
  background: #f0f4f9;
}
.db-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.db-date-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid #dfe5ef;
  border-radius: 8px;
  background: #fff;
  font-weight: 600;
  font-size: 14px;
  color: var(--heading, #2a3547);
  min-width: 130px;
  justify-content: center;
}
.db-cal-icon {
  font-size: 15px;
}
.db-today-btn {
  padding: 6px 14px;
  border: 1px solid #dfe5ef;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--heading, #2a3547);
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.db-today-btn:hover {
  background: #f0f4f9;
}
.db-today-btn.active {
  background: var(--primary, #0085db);
  color: #fff;
  border-color: var(--primary, #0085db);
}
</style>
