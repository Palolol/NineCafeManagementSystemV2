<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { dashboardApi, pricesApi } from '../api/endpoints'
import { useAuth } from '../stores/auth'

const auth = useAuth()

// ─── Date navigation ───────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10)
const date = ref(todayStr())

function prevDay() {
  const d = new Date(date.value)
  d.setDate(d.getDate() - 1)
  date.value = d.toISOString().slice(0, 10)
  load()
}
function nextDay() {
  const d = new Date(date.value)
  d.setDate(d.getDate() + 1)
  const next = d.toISOString().slice(0, 10)
  if (next <= todayStr()) { date.value = next; load() }
}
function goToday() { date.value = todayStr(); load() }

const isToday = computed(() => date.value === todayStr())

const displayDate = computed(() => {
  const [y, m, d] = date.value.split('-')
  return `${m}/${d}/${y}`
})

// ─── Dashboard data ─────────────────────────────────────────────────────────
const data = ref(null)
const loading = ref(false)
const error = ref('')

const sales = computed(() => data.value?.todaySales || data.value?.sales || [])
const withdrawals = computed(() => data.value?.withdrawals || [])
const totalCups = computed(() => data.value?.totalCupSold || 0)
const totalIncome = computed(() => data.value?.dailyIncome || 0)
const totalWithdrawn = computed(() => data.value?.totalWithdrawnToday || 0)

const unit = (s) => s.unitPrice || s.currentPriceRiel || s.price?.priceRiel || 0
const saleTotal = (s) => s.total ?? s.totalPrice ?? unit(s) * s.quantity

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = await dashboardApi.get(date.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// ─── Prices (quick-sale buttons) ─────────────────────────────────────────────
const prices = ref([])
async function loadPrices() {
  try { prices.value = await pricesApi.list() || [] } catch { /* ignore */ }
}

// ─── Quick Sale ───────────────────────────────────────────────────────────────
const saleError = ref('')
const saleLoading = ref(false)

async function quickSale(price) {
  if (!auth.can('dashboard.create')) return
  saleError.value = ''
  saleLoading.value = true
  try {
    await dashboardApi.addSale({ priceId: price.id, quantity: 1, saleDate: date.value })
    await load()
  } catch (e) {
    saleError.value = e.message
  } finally {
    saleLoading.value = false
  }
}

// ─── Sale quantity update (± buttons) ────────────────────────────────────────
async function adjustSale(sale, delta) {
  if (!auth.can('dashboard.update')) return
  const newQty = (sale.quantity || 1) + delta
  if (newQty < 1) return
  try {
    await dashboardApi.updateSale(sale.id, newQty)
    await load()
  } catch (e) { error.value = e.message }
}

async function deleteSale(sale) {
  if (!auth.can('dashboard.delete')) return
  if (!confirm('Delete this sale record?')) return
  try {
    await dashboardApi.deleteSale(sale.id)
    await load()
  } catch (e) { error.value = e.message }
}

// ─── Withdrawal form ─────────────────────────────────────────────────────────
const wForm = reactive({ amount: '', reason: '' })
const wError = ref('')
const wSaving = ref(false)
const wEditing = ref(null)   // id of withdrawal being edited (not supported by API, kept for future)

async function saveWithdrawal() {
  if (!wForm.amount || !wForm.reason.trim()) { wError.value = 'Amount and reason are required.'; return }
  wError.value = ''
  wSaving.value = true
  try {
    await dashboardApi.addWithdrawal({ amount: Number(wForm.amount), reason: wForm.reason.trim(), date: date.value })
    wForm.amount = ''
    wForm.reason = ''
    await load()
  } catch (e) {
    wError.value = e.message
  } finally {
    wSaving.value = false
  }
}

async function deleteWithdrawal(w) {
  if (!auth.can('dashboard.delete')) return
  if (!confirm('Delete this withdrawal?')) return
  try {
    await dashboardApi.deleteWithdrawal(w.id)
    await load()
  } catch (e) { error.value = e.message }
}

// ─── Formatters ──────────────────────────────────────────────────────────────
const riel = (n) => Math.round(Number(n) || 0).toLocaleString('en-US')
const usd  = (n) => '$' + ((Number(n) || 0) / 4000).toFixed(2) + ' USD'

onMounted(() => { load(); loadPrices() })
</script>

<template>
  <!-- ── Page error ── -->
  <div v-if="error" class="db-alert">{{ error }}</div>

  <!-- ── Title + Date navigator ── -->
  <div class="db-title-row">
    <h1 class="db-title">Nine Cafe – Management System</h1>
    <div class="db-date-nav">
      <button class="db-nav-btn" @click="prevDay">&#8249;</button>
      <span class="db-date-display">
        <span class="db-cal-icon">📅</span>
        {{ displayDate }}
      </span>
      <button class="db-nav-btn" :disabled="isToday" @click="nextDay">&#8250;</button>
      <button class="db-today-btn" :class="{ active: isToday }" @click="goToday">
        🕐 Today
      </button>
    </div>
  </div>

  <!-- ── KPI cards ── -->
  <h2 class="db-section-heading">Sales for {{ displayDate }}</h2>
  <div class="db-kpi-grid">
    <div class="db-kpi blue">
      <div class="db-kpi-label">TOTAL CUPS SOLD</div>
      <div class="db-kpi-value">{{ totalCups }}</div>
    </div>
    <div class="db-kpi green">
      <div class="db-kpi-label">TOTAL INCOME</div>
      <div class="db-kpi-value">{{ riel(totalIncome) }}</div>
      <div class="db-kpi-sub">{{ usd(totalIncome) }}</div>
    </div>
    <div class="db-kpi red">
      <div class="db-kpi-label">TOTAL WITHDRAWN</div>
      <div class="db-kpi-value">{{ riel(totalWithdrawn) }}</div>
      <div class="db-kpi-sub">{{ usd(totalWithdrawn) }}</div>
    </div>
  </div>

  <!-- ── Sales section ── -->
  <div class="db-card">
    <!-- Quick Sale buttons -->
    <div v-if="auth.can('dashboard.create') && prices.length" class="db-quick-sale">
      <div class="db-quick-label">QUICK SALE (RECORD 1 CUP):</div>
      <div class="db-quick-btns">
        <button
          v-for="p in prices"
          :key="p.id"
          class="db-quick-btn"
          :disabled="saleLoading"
          @click="quickSale(p)"
        >
          {{ riel(p.priceRiel) }}
        </button>
      </div>
      <div v-if="saleError" class="db-inline-error">{{ saleError }}</div>
    </div>

    <!-- Sales table -->
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
          <td colspan="4" class="db-empty-cell">No sales recorded for this date.</td>
        </tr>
        <tr v-for="(s, i) in sales" :key="s.id ?? i" class="db-sale-row">
          <td class="db-price-cell">{{ riel(unit(s)) }}</td>
          <td class="db-qty-cell">
            <div class="db-qty-control">
              <button
                class="db-qty-btn"
                :disabled="!auth.can('dashboard.update') || s.quantity <= 1"
                @click="adjustSale(s, -1)"
              >−</button>
              <span class="db-qty-num">{{ s.quantity }}</span>
              <button
                class="db-qty-btn"
                :disabled="!auth.can('dashboard.update')"
                @click="adjustSale(s, +1)"
              >+</button>
            </div>
          </td>
          <td class="db-total-cell">{{ riel(saleTotal(s)) }}</td>
          <td class="db-action-cell">
            <button
              v-if="auth.can('dashboard.delete')"
              class="db-icon-btn danger"
              title="Delete sale"
              @click="deleteSale(s)"
            >🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ── Withdrawal section ── -->
  <div class="db-card db-withdrawal-card">
    <div class="db-withdrawal-header">
      <span class="db-section-title">Record Withdrawal</span>
      <span class="db-today-pill">Today</span>
    </div>

    <div v-if="auth.can('dashboard.create')" class="db-withdrawal-form">
      <input
        v-model="wForm.amount"
        type="number"
        min="1"
        placeholder="Amount"
        class="db-input"
        @keyup.enter="saveWithdrawal"
      />
      <input
        v-model="wForm.reason"
        type="text"
        placeholder="Reason"
        class="db-input db-reason-input"
        @keyup.enter="saveWithdrawal"
      />
      <button
        class="db-save-btn"
        :disabled="wSaving"
        @click="saveWithdrawal"
      >{{ wSaving ? 'Saving…' : 'Save' }}</button>
    </div>
    <div v-if="wError" class="db-inline-error">{{ wError }}</div>

    <!-- Withdrawals table -->
    <table class="db-table db-w-table">
      <thead>
        <tr>
          <th>AMOUNT</th>
          <th>REASON</th>
          <th class="db-th-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!withdrawals.length">
          <td colspan="3" class="db-empty-cell">No cash withdrawals recorded for this date.</td>
        </tr>
        <tr v-for="(w, i) in withdrawals" :key="w.id ?? i" class="db-w-row">
          <td class="db-w-amount">{{ riel(w.amount) }}</td>
          <td>{{ w.reason }}</td>
          <td class="db-action-cell">
            <button
              v-if="auth.can('dashboard.delete')"
              class="db-icon-btn danger"
              title="Delete withdrawal"
              @click="deleteWithdrawal(w)"
            >🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* ── Layout ───────────────────────────────────────────────────────────────── */
.db-alert {
  background: #fee2e2; color: #b91c1c;
  border: 1px solid #fca5a5; border-radius: 8px;
  padding: 10px 16px; margin-bottom: 16px; font-size: 13px;
}

/* ── Title row ───────────────────────────────────────────────────────────── */
.db-title-row {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; margin-bottom: 20px; text-align: center;
}
.db-title {
  font-size: 26px; font-weight: 700;
  color: var(--heading, #2a3547); margin: 0;
}
.db-date-nav {
  display: flex; align-items: center; gap: 6px;
}
.db-nav-btn {
  width: 30px; height: 30px; border: 1px solid #dfe5ef;
  border-radius: 6px; background: #fff; cursor: pointer;
  font-size: 18px; line-height: 1; color: var(--heading, #2a3547);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.db-nav-btn:hover:not(:disabled) { background: #f0f4f9; }
.db-nav-btn:disabled { opacity: .4; cursor: not-allowed; }

.db-date-display {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border: 1px solid #dfe5ef; border-radius: 8px;
  background: #fff; font-weight: 600; font-size: 14px;
  color: var(--heading, #2a3547); min-width: 130px; justify-content: center;
}
.db-cal-icon { font-size: 15px; }

.db-today-btn {
  padding: 6px 14px; border: 1px solid #dfe5ef; border-radius: 8px;
  background: #fff; cursor: pointer; font-size: 13px; font-weight: 600;
  color: var(--heading, #2a3547); transition: all .15s;
  display: flex; align-items: center; gap: 5px;
}
.db-today-btn:hover { background: #f0f4f9; }
.db-today-btn.active { background: var(--primary, #0085db); color: #fff; border-color: var(--primary, #0085db); }

/* ── Section heading ─────────────────────────────────────────────────────── */
.db-section-heading {
  font-size: 18px; font-weight: 700; color: var(--heading, #2a3547);
  margin: 0 0 14px 0;
}

/* ── KPI Cards ───────────────────────────────────────────────────────────── */
.db-kpi-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 14px; margin-bottom: 20px;
}
@media (max-width: 640px) { .db-kpi-grid { grid-template-columns: 1fr; } }

.db-kpi {
  border-radius: 14px; padding: 24px 20px; color: #fff; min-height: 110px;
  display: flex; flex-direction: column; justify-content: center;
}
.db-kpi.blue  { background: linear-gradient(135deg, #1a73e8 0%, #0f52ba 100%); }
.db-kpi.green { background: linear-gradient(135deg, #2ec4a7 0%, #1a9c82 100%); }
.db-kpi.red   { background: linear-gradient(135deg, #f4694e 0%, #d94e35 100%); }

.db-kpi-label {
  font-size: 11px; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; opacity: .9; margin-bottom: 10px;
}
.db-kpi-value {
  font-size: 36px; font-weight: 800; line-height: 1;
}
.db-kpi-sub {
  font-size: 13px; opacity: .85; margin-top: 5px; font-weight: 500;
}

/* ── Cards ───────────────────────────────────────────────────────────────── */
.db-card {
  background: #fff; border: 1px solid #ebf1f6;
  border-radius: 14px; margin-bottom: 20px; overflow: hidden;
}

/* ── Quick Sale ──────────────────────────────────────────────────────────── */
.db-quick-sale {
  padding: 14px 20px 10px; border-bottom: 1px solid #ebf1f6;
}
.db-quick-label {
  font-size: 11px; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; color: #707a82; margin-bottom: 10px;
}
.db-quick-btns {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.db-quick-btn {
  background: #1a73e8; color: #fff; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 14px; font-weight: 700; cursor: pointer;
  transition: background .15s, transform .1s;
}
.db-quick-btn:hover:not(:disabled) { background: #1558b0; transform: translateY(-1px); }
.db-quick-btn:active { transform: translateY(0); }
.db-quick-btn:disabled { opacity: .55; cursor: not-allowed; }

/* ── Tables ──────────────────────────────────────────────────────────────── */
.db-table {
  width: 100%; border-collapse: collapse;
}
.db-table th {
  text-align: left; font-size: 11px; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  color: #707a82; padding: 12px 20px;
  background: #f8fafc; border-bottom: 1px solid #ebf1f6;
}
.db-th-right { text-align: right; }

.db-table td { padding: 14px 20px; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
.db-table tbody tr:last-child td { border-bottom: none; }

.db-sale-row:hover { background: #f8fafc; }
.db-price-cell { font-weight: 700; font-size: 15px; color: var(--heading, #2a3547); }
.db-total-cell { color: #1a73e8; font-weight: 700; font-size: 15px; }

/* ── Qty control ──────────────────────────────────────────────────────────── */
.db-qty-cell { }
.db-qty-control {
  display: inline-flex; align-items: center; gap: 0;
}
.db-qty-btn {
  width: 30px; height: 30px; border: 1px solid #dfe5ef;
  background: #fff; cursor: pointer; font-size: 16px; font-weight: 600;
  color: var(--heading, #2a3547); display: flex; align-items: center;
  justify-content: center; transition: background .12s;
  line-height: 1;
}
.db-qty-btn:first-child { border-radius: 6px 0 0 6px; }
.db-qty-btn:last-child  { border-radius: 0 6px 6px 0; }
.db-qty-btn:hover:not(:disabled) { background: #f0f4f9; }
.db-qty-btn:disabled { opacity: .4; cursor: not-allowed; }

.db-qty-num {
  min-width: 40px; height: 30px; border-top: 1px solid #dfe5ef;
  border-bottom: 1px solid #dfe5ef; display: flex; align-items: center;
  justify-content: center; font-weight: 700; font-size: 14px;
  color: var(--heading, #2a3547); background: #fff;
}

/* ── Action cells / icon buttons ─────────────────────────────────────────── */
.db-action-cell { text-align: right; white-space: nowrap; }
.db-icon-btn {
  width: 32px; height: 32px; border-radius: 6px; border: 1px solid #dfe5ef;
  background: #fff; cursor: pointer; display: inline-flex;
  align-items: center; justify-content: center; font-size: 14px;
  transition: background .12s, border-color .12s;
}
.db-icon-btn.danger { border-color: #fca5a5; color: #e53e3e; }
.db-icon-btn.danger:hover { background: #fee2e2; }
.db-icon-btn.edit { border-color: #fbd38d; color: #c8882a; }
.db-icon-btn.edit:hover { background: #fef3c7; }

/* ── Empty state ─────────────────────────────────────────────────────────── */
.db-empty-cell {
  text-align: left; color: #9ca3af; font-style: italic; font-size: 13px;
  padding: 18px 20px !important;
}

/* ── Withdrawal card ──────────────────────────────────────────────────────── */
.db-withdrawal-card { }
.db-withdrawal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 10px;
}
.db-section-title {
  font-size: 18px; font-weight: 700; color: var(--heading, #2a3547);
}
.db-today-pill {
  background: #fff0f0; color: #e06b6b; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; letter-spacing: .04em;
}

.db-withdrawal-form {
  display: flex; gap: 10px; align-items: center;
  padding: 0 20px 14px; flex-wrap: wrap;
}
.db-input {
  flex: 1; min-width: 120px; padding: 9px 14px;
  border: 1px solid #dfe5ef; border-radius: 8px;
  font: inherit; font-size: 14px; color: var(--heading, #2a3547);
  background: #fff; transition: border-color .15s;
}
.db-input:focus { outline: none; border-color: #1a73e8; box-shadow: 0 0 0 3px #dbeafe; }
.db-reason-input { flex: 2; }

.db-save-btn {
  padding: 9px 28px; border: none; border-radius: 8px;
  background: #f4694e; color: #fff; font: inherit; font-size: 14px;
  font-weight: 700; cursor: pointer; white-space: nowrap;
  transition: background .15s, transform .1s;
}
.db-save-btn:hover:not(:disabled) { background: #d94e35; transform: translateY(-1px); }
.db-save-btn:disabled { opacity: .6; cursor: not-allowed; }

/* ── Withdrawal rows ─────────────────────────────────────────────────────── */
.db-w-table { }
.db-w-row:hover { background: #f8fafc; }
.db-w-amount {
  font-weight: 700; font-size: 15px; color: #e53e3e;
}

/* ── Inline error ────────────────────────────────────────────────────────── */
.db-inline-error {
  color: #b91c1c; font-size: 12px; padding: 0 20px 10px;
}
</style>
