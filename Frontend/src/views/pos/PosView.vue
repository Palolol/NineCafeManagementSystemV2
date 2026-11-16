<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCart } from '../../stores/cart'
import { mockPosApi } from '../../api/mock/posMock'
import { riel } from '../../utils/format'
import './posComponent/pos.css'
import CategoryTabs from './posComponent/CategoryTabs.vue'
import ItemGrid from './posComponent/ItemGrid.vue'
import CartPanel from './posComponent/CartPanel.vue'
import CheckoutModal from './posComponent/CheckoutModal.vue'

const cart = useCart()

// ── Menu data ─────────────────────────────────────────────
const categories = ref([])
const items = ref([])
const loading = ref(true)
const error = ref('')
const activeCategory = ref(null) // null = All

const filteredItems = computed(() => {
  if (activeCategory.value == null) return items.value
  return items.value.filter((i) => i.categoryId === activeCategory.value)
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [cats, its] = await Promise.all([
      mockPosApi.getCategories(),
      mockPosApi.getItems(),
    ])
    categories.value = cats
    items.value = its
  } catch (e) {
    error.value = e.message || 'Failed to load menu'
  } finally {
    loading.value = false
  }
}

// ── Payment flow (mirrors original Payment + ResetAll) ────
const checkoutOpen = ref(false)
const saving = ref(false)
const checkoutError = ref('')
const lastBillId = ref('')

function openPayment() {
  if (!cart.lines.length) return
  checkoutError.value = ''
  lastBillId.value = ''
  checkoutOpen.value = true
}

async function confirmPayment() {
  saving.value = true
  checkoutError.value = ''
  try {
    const payload = {
      lines: cart.lines.map((l, idx) => ({
        rowNo: idx + 1,
        itemId: l.id,
        name: l.name,
        price: l.price,
        qty: l.qty,
        lineTotal: l.price * l.qty,
      })),
      subtotal: cart.subtotal,
      discount: Number(cart.discount) || 0,
      grandTotal: cart.grandTotal,
      cashReceived: Number(cart.cashReceived) || 0,
      balance: cart.balance,
    }
    const bill = await mockPosApi.createBill(payload)
    lastBillId.value = bill.id
    // After success the modal shows the bill ID;
    // cart is cleared when user clicks "New Order"
  } catch (e) {
    checkoutError.value = e.message || 'Transaction failed'
  } finally {
    saving.value = false
  }
}

function closeCheckout() {
  if (lastBillId.value) {
    // Successful payment → reset like original ResetAll()
    cart.clear()
  }
  checkoutOpen.value = false
  lastBillId.value = ''
}

function cancelBill() {
  if (!cart.lines.length) return
  if (confirm('Cancel current transaction and clear the bill?')) {
    cart.clear()
  }
}

// Simple print – opens a minimal receipt window (like GeneratePrint in the original)
function printBill() {
  if (!cart.lines.length) return

  const rows = cart.lines
    .map(
      (l, i) =>
        `<tr>
          <td>${i + 1}</td>
          <td>${l.name}</td>
          <td style="text-align:right">${riel(l.price)}</td>
          <td style="text-align:center">${l.qty}</td>
          <td style="text-align:right">${riel(l.price * l.qty)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 13px; padding: 16px; max-width: 320px; margin: 0 auto; }
        h2 { text-align: center; margin: 0 0 4px; }
        .meta { text-align: center; color: #555; margin-bottom: 12px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td { padding: 3px 4px; }
        th { border-bottom: 1px solid #000; text-align: left; font-size: 11px; }
        .totals td { padding-top: 4px; }
        .grand { font-weight: bold; border-top: 1px dashed #000; }
        .center { text-align: center; margin-top: 16px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h2>Nine Cafe</h2>
      <div class="meta">${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr><th>#</th><th>Item</th><th style="text-align:right">Price</th><th style="text-align:center">Qty</th><th style="text-align:right">Total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <table class="totals">
        <tr><td>Subtotal</td><td style="text-align:right">${riel(cart.subtotal)}</td></tr>
        <tr><td>Discount</td><td style="text-align:right">− ${riel(cart.discount)}</td></tr>
        <tr class="grand"><td>Grand Total</td><td style="text-align:right">${riel(cart.grandTotal)}</td></tr>
        <tr><td>Cash</td><td style="text-align:right">${riel(cart.cashReceived)}</td></tr>
        <tr><td>Change</td><td style="text-align:right">${riel(cart.balance)}</td></tr>
      </table>
      <div class="center">Thank you!</div>
      <\/script>window.onload = () => { window.print(); }<\/script>
    </body>
    </html>
  `

  const w = window.open('', '_blank', 'width=360,height=600')
  w.document.write(html)
  w.document.close()
}

onMounted(load)
</script>

<template>
  <div v-if="error" class="alert error">{{ error }}</div>

  <div v-if="loading" class="empty">Loading menu…</div>

  <div v-else class="pos-layout">
    <!-- Left: categories + item grid (same idea as original) -->
    <div class="pos-main">
      <CategoryTabs v-model="activeCategory" :categories="categories" />
      <ItemGrid :items="filteredItems" @add="cart.addItem" />
    </div>

    <!-- Right: Bill table + Discount / Cash / Balance / Payment (like WPF) -->
    <CartPanel
      @pay="openPayment"
      @cancel="cancelBill"
      @print="printBill"
    />
  </div>

  <CheckoutModal
    :open="checkoutOpen"
    :saving="saving"
    :error="checkoutError"
    :last-bill-id="lastBillId"
    @close="closeCheckout"
    @confirm="confirmPayment"
  />
</template>