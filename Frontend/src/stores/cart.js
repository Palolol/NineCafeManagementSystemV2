import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCart = defineStore('cart', () => {
  // lines: { id, name, price, qty }
  const lines = ref([])
  const discount = ref(0)       // absolute amount in ៛
  const cashReceived = ref(0)   // amount customer paid

  const subtotal = computed(() =>
    lines.value.reduce((sum, l) => sum + l.price * l.qty, 0)
  )

  // After discount (never negative)
  const afterDiscount = computed(() => Math.max(0, subtotal.value - (Number(discount.value) || 0)))

  // Grand total (no separate tax – matches the original WPF POS)
  const grandTotal = computed(() => afterDiscount.value)

  const balance = computed(() => {
    const cash = Number(cashReceived.value) || 0
    return cash - grandTotal.value
  })

  const itemCount = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))

  function addItem(item) {
    const existing = lines.value.find((l) => l.id === item.id)
    if (existing) {
      existing.qty += 1
    } else {
      lines.value.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
      })
    }
  }

  function increment(id) {
    const line = lines.value.find((l) => l.id === id)
    if (line) line.qty += 1
  }

  function decrement(id) {
    const line = lines.value.find((l) => l.id === id)
    if (!line) return
    if (line.qty <= 1) removeLine(id)
    else line.qty -= 1
  }

  function removeLine(id) {
    lines.value = lines.value.filter((l) => l.id !== id)
  }

  function clear() {
    lines.value = []
    discount.value = 0
    cashReceived.value = 0
  }

  return {
    lines,
    discount,
    cashReceived,
    subtotal,
    afterDiscount,
    grandTotal,
    balance,
    itemCount,
    addItem,
    increment,
    decrement,
    removeLine,
    clear,
  }
})