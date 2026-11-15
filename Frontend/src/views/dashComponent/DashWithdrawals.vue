<script setup>
import { riel } from "./format";

defineProps({
  withdrawals: Array,
  label: String, // "Today" or the selected date
  canCreate: Boolean,
  canUpdate: Boolean,
  canDelete: Boolean,
  saving: Boolean,
  editing: Boolean, // true while an existing withdrawal is being edited
  error: String,
});
defineEmits(["save", "cancel", "edit", "remove"]);

// The form fields live in the parent (v-model:amount / v-model:reason).
const amount = defineModel("amount");
const reason = defineModel("reason");
</script>

<template>
  <div class="db-card">
    <div class="db-withdrawal-header">
      <span class="db-section-title">Record Withdrawal</span>
      <span class="db-today-pill">{{ label }}</span>
    </div>

    <div v-if="canCreate" class="db-withdrawal-form">
      <input
        v-model="amount"
        type="number"
        min="1"
        placeholder="Amount"
        class="db-input"
        @keyup.enter="$emit('save')"
      />
      <input
        v-model="reason"
        type="text"
        placeholder="Reason"
        class="db-input db-reason-input"
        @keyup.enter="$emit('save')"
      />
      <button class="db-save-btn" :disabled="saving" @click="$emit('save')">
        {{ saving ? "Saving…" : editing ? "Update" : "Save" }}
      </button>
      <button v-if="editing" class="db-cancel-btn" @click="$emit('cancel')">
        Cancel
      </button>
    </div>
    <div v-if="error" class="db-inline-error">{{ error }}</div>

    <table class="db-table">
      <thead>
        <tr>
          <th>AMOUNT</th>
          <th>REASON</th>
          <th class="db-th-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!withdrawals.length">
          <td colspan="3" class="db-empty-cell">
            No cash withdrawals recorded for this date.
          </td>
        </tr>
        <tr v-for="(w, i) in withdrawals" :key="w.id ?? i" class="db-w-row">
          <td class="db-w-amount">{{ riel(w.amount) }}</td>
          <td>{{ w.reason }}</td>
          <td class="db-action-cell">
            <button
              v-if="canUpdate"
              class="db-icon-btn edit"
              title="Edit withdrawal"
              @click="$emit('edit', w)"
            >
              ✎
            </button>
            <button
              v-if="canDelete"
              class="db-icon-btn danger"
              title="Delete withdrawal"
              @click="$emit('remove', w)"
            >
              🗑
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.db-withdrawal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px;
}
.db-section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--heading, #2a3547);
}
.db-today-pill {
  background: #fff0f0;
  color: #e06b6b;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}
.db-withdrawal-form {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 20px 14px;
  flex-wrap: wrap;
}
.db-input {
  flex: 1;
  min-width: 120px;
  padding: 9px 14px;
  border: 1px solid #dfe5ef;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  color: var(--heading, #2a3547);
  background: #fff;
  transition: border-color 0.15s;
}
.db-input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px #dbeafe;
}
.db-reason-input {
  flex: 2;
}
.db-save-btn {
  padding: 9px 28px;
  border: none;
  border-radius: 8px;
  background: #f4694e;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s,
    transform 0.1s;
}
.db-save-btn:hover:not(:disabled) {
  background: #d94e35;
  transform: translateY(-1px);
}
.db-save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.db-cancel-btn {
  padding: 9px 16px;
  border: 1px solid #dfe5ef;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}
.db-w-row:hover {
  background: #f8fafc;
}
.db-w-amount {
  font-weight: 700;
  font-size: 15px;
  color: #e53e3e;
}
</style>
