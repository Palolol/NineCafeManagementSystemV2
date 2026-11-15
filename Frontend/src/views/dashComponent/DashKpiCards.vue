<script setup>
import { riel, usd } from "./format";

defineProps({
  displayDate: String,
  cups: Number,
  income: Number,
  withdrawn: Number,
});
</script>

<template>
  <h2 class="db-section-heading">Sales for {{ displayDate }}</h2>
  <div class="db-kpi-grid">
    <div class="db-kpi blue">
      <div class="db-kpi-label">TOTAL CUPS SOLD</div>
      <div class="db-kpi-value">{{ cups }}</div>
    </div>
    <div class="db-kpi green">
      <div class="db-kpi-label">TOTAL INCOME</div>
      <div class="db-kpi-value">{{ riel(income) }}</div>
      <div class="db-kpi-sub">{{ usd(income) }}</div>
    </div>
    <div class="db-kpi red">
      <div class="db-kpi-label">TOTAL WITHDRAWN</div>
      <div class="db-kpi-value">{{ riel(withdrawn) }}</div>
      <div class="db-kpi-sub">{{ usd(withdrawn) }}</div>
    </div>
  </div>
</template>

<style scoped>
.db-section-heading {
  font-size: 18px;
  font-weight: 700;
  color: var(--heading, #2a3547);
  margin: 0 0 14px 0;
}
.db-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .db-kpi-grid {
    grid-template-columns: 1fr;
  }
}
.db-kpi {
  border-radius: 14px;
  padding: 24px 20px;
  color: #fff;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.db-kpi.blue {
  background: linear-gradient(135deg, #1a73e8 0%, #0f52ba 100%);
}
.db-kpi.green {
  background: linear-gradient(135deg, #2ec4a7 0%, #1a9c82 100%);
}
.db-kpi.red {
  background: linear-gradient(135deg, #f4694e 0%, #d94e35 100%);
}
.db-kpi-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 10px;
}
.db-kpi-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}
.db-kpi-sub {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 5px;
  font-weight: 500;
}
</style>
