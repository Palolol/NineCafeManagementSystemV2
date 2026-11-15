<script setup>
// Page container: owns the data, the API calls and the date. The pieces on screen
// live in ./dashComponent and only get props / send events.
import { computed, onMounted, reactive, ref } from 'vue'
import { dashboardApi } from '../api/endpoints'
import { useAuth } from '../stores/auth'
import './dashComponent/dashboard.css'
import DashHeader from './dashComponent/DashHeader.vue'
import DashKpiCards from './dashComponent/DashKpiCards.vue'
import DashQuickSale from './dashComponent/DashQuickSale.vue'
import DashSalesTable from './dashComponent/DashSalesTable.vue'
import DashWithdrawals from './dashComponent/DashWithdrawals.vue'
import { displayDate as formatDate, shiftDate, todayStr } from './dashComponent/format'

const auth = useAuth()
const can = (action) => auth.can(`dashboard.${action}`)

// ─── Date navigation ──────────────────────────────────────────────────────
const date = ref(todayStr())
const isToday = computed(() => date.value === todayStr())
const displayDate = computed(() => formatDate(date.value))

function go(d) { date.value = d; load() }
const prevDay = () => go(shiftDate(date.value, -1))
const nextDay = () => { const n = shiftDate(date.value, 1); if (n <= todayStr()) go(n) }
const goToday = () => go(todayStr())

// ─── Dashboard data ───────────────────────────────────────────────────────
const data = ref(null)
const error = ref('')

const prices = computed(() => data.value?.priceTiers || []) // quick-sale buttons
const sales = computed(() => data.value?.todaySales || data.value?.sales || [])
const withdrawals = computed(() => data.value?.withdrawals || [])
const totalCups = computed(() => data.value?.totalCupSold || 0)
const totalIncome = computed(() => data.value?.dailyIncome || 0)
const totalWithdrawn = computed(() => data.value?.totalWithdrawnToday || 0)

async function load() {
  error.value = ''
  try {
    data.value = await dashboardApi.get(date.value)
  } catch (e) {
    error.value = e.message
  }
}

// ─── Sales ────────────────────────────────────────────────────────────────
const saleError = ref('')
const saleLoading = ref(false)

async function quickSale(price) {
  if (!can('create')) return
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

async function adjustSale(sale, delta) {
  if (!can('update')) return
  const newQty = (sale.quantity || 1) + delta
  if (newQty < 1) return
  try {
    await dashboardApi.updateSale(sale.id, newQty)
    await load()
  } catch (e) { error.value = e.message }
}

async function deleteSale(sale) {
  if (!can('delete') || !confirm('Delete this sale record?')) return
  try {
    await dashboardApi.deleteSale(sale.id)
    await load()
  } catch (e) { error.value = e.message }
}

// ─── Withdrawals ──────────────────────────────────────────────────────────
const wForm = reactive({ amount: '', reason: '' })
const wEditingId = ref(null)
const wError = ref('')
const wSaving = ref(false)

function resetWithdrawal() {
  wEditingId.value = null
  wForm.amount = ''
  wForm.reason = ''
  wError.value = ''
}
function editWithdrawal(w) {
  wEditingId.value = w.id
  wForm.amount = w.amount
  wForm.reason = w.reason
  wError.value = ''
}

async function saveWithdrawal() {
  if (!wForm.amount || !String(wForm.reason).trim()) { wError.value = 'Amount and reason are required.'; return }
  wError.value = ''
  wSaving.value = true
  const dto = { amount: Number(wForm.amount), reason: String(wForm.reason).trim(), date: date.value }
  try {
    if (wEditingId.value) await dashboardApi.updateWithdrawal(wEditingId.value, dto)
    else await dashboardApi.addWithdrawal(dto)
    resetWithdrawal()
    await load()
  } catch (e) {
    wError.value = e.message
  } finally {
    wSaving.value = false
  }
}

async function deleteWithdrawal(w) {
  if (!can('delete') || !confirm('Delete this withdrawal?')) return
  try {
    await dashboardApi.deleteWithdrawal(w.id)
    if (wEditingId.value === w.id) resetWithdrawal()
    await load()
  } catch (e) { error.value = e.message }
}

onMounted(load)
</script>

<template>
  <div v-if="error" class="db-alert">{{ error }}</div>

  <DashHeader :display-date="displayDate" :is-today="isToday" @prev="prevDay" @next="nextDay" @today="goToday" />

  <DashKpiCards :display-date="displayDate" :cups="totalCups" :income="totalIncome" :withdrawn="totalWithdrawn" />

  <div class="db-card">
    <DashQuickSale v-if="can('create') && prices.length" :prices="prices" :disabled="saleLoading" :error="saleError" @sale="quickSale" />
    <DashSalesTable :sales="sales" :can-update="can('update')" :can-delete="can('delete')" @adjust="adjustSale" @remove="deleteSale" />
  </div>

  <DashWithdrawals
    v-model:amount="wForm.amount"
    v-model:reason="wForm.reason"
    :withdrawals="withdrawals"
    :label="isToday ? 'Today' : displayDate"
    :can-create="can('create')"
    :can-update="can('update')"
    :can-delete="can('delete')"
    :saving="wSaving"
    :editing="Boolean(wEditingId)"
    :error="wError"
    @save="saveWithdrawal"
    @cancel="resetWithdrawal"
    @edit="editWithdrawal"
    @remove="deleteWithdrawal"
  />
</template>
