// Temporary fake data until the real Items / Categories / Bills API exists.
// All mutations live in memory so the POS screen and management pages stay in sync.

let nextCategoryId = 10
let nextItemId = 600

export let MOCK_CATEGORIES = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
  { id: 3, name: 'Pastries' },
  { id: 4, name: 'Drinks' },
  { id: 5, name: 'Snacks' },
]

export let MOCK_ITEMS = [
  { id: 101, name: 'Espresso',       price: 6000,  categoryId: 1, category: 'Coffee',   emoji: '☕' },
  { id: 102, name: 'Americano',      price: 7000,  categoryId: 1, category: 'Coffee',   emoji: '☕' },
  { id: 103, name: 'Cappuccino',     price: 9000,  categoryId: 1, category: 'Coffee',   emoji: '☕' },
  { id: 104, name: 'Latte',          price: 10000, categoryId: 1, category: 'Coffee',   emoji: '🥛' },
  { id: 105, name: 'Mocha',          price: 11000, categoryId: 1, category: 'Coffee',   emoji: '🍫' },
  { id: 106, name: 'Iced Latte',     price: 11000, categoryId: 1, category: 'Coffee',   emoji: '🧊' },
  { id: 201, name: 'Green Tea',      price: 5000,  categoryId: 2, category: 'Tea',      emoji: '🍵' },
  { id: 202, name: 'Black Tea',      price: 5000,  categoryId: 2, category: 'Tea',      emoji: '🍵' },
  { id: 203, name: 'Milk Tea',       price: 8000,  categoryId: 2, category: 'Tea',      emoji: '🧋' },
  { id: 204, name: 'Thai Tea',       price: 9000,  categoryId: 2, category: 'Tea',      emoji: '🧋' },
  { id: 301, name: 'Croissant',      price: 7000,  categoryId: 3, category: 'Pastries', emoji: '🥐' },
  { id: 302, name: 'Chocolate Cake', price: 12000, categoryId: 3, category: 'Pastries', emoji: '🍰' },
  { id: 303, name: 'Muffin',         price: 6000,  categoryId: 3, category: 'Pastries', emoji: '🧁' },
  { id: 304, name: 'Cookie',         price: 4000,  categoryId: 3, category: 'Pastries', emoji: '🍪' },
  { id: 401, name: 'Orange Juice',   price: 8000,  categoryId: 4, category: 'Drinks',   emoji: '🍊' },
  { id: 402, name: 'Lemonade',       price: 7000,  categoryId: 4, category: 'Drinks',   emoji: '🍋' },
  { id: 403, name: 'Soft Drink',     price: 5000,  categoryId: 4, category: 'Drinks',   emoji: '🥤' },
  { id: 404, name: 'Mineral Water',  price: 3000,  categoryId: 4, category: 'Drinks',   emoji: '💧' },
  { id: 501, name: 'French Fries',   price: 9000,  categoryId: 5, category: 'Snacks',   emoji: '🍟' },
  { id: 502, name: 'Sandwich',       price: 15000, categoryId: 5, category: 'Snacks',   emoji: '🥪' },
  { id: 503, name: 'Salad',          price: 14000, categoryId: 5, category: 'Snacks',   emoji: '🥗' },
]

const delay = (ms = 160) => new Promise((r) => setTimeout(r, ms))

function categoryName(id) {
  return MOCK_CATEGORIES.find((c) => c.id === Number(id))?.name || ''
}

export const mockPosApi = {
  // ── Categories CRUD ─────────────────────────────────────
  async getCategories() {
    await delay()
    return MOCK_CATEGORIES.map((c) => ({ ...c }))
  },
  async createCategory(body) {
    await delay()
    const name = String(body.name || '').trim()
    if (!name) throw new Error('Category name is required')
    if (MOCK_CATEGORIES.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Category already exists')
    }
    const row = { id: nextCategoryId++, name }
    MOCK_CATEGORIES.push(row)
    return { ...row }
  },
  async updateCategory(id, body) {
    await delay()
    const idx = MOCK_CATEGORIES.findIndex((c) => c.id === Number(id))
    if (idx < 0) throw new Error('Category not found')
    const name = String(body.name || '').trim()
    if (!name) throw new Error('Category name is required')
    MOCK_CATEGORIES[idx] = { ...MOCK_CATEGORIES[idx], name }
    // keep item.category string in sync
    MOCK_ITEMS.forEach((it) => {
      if (it.categoryId === Number(id)) it.category = name
    })
    return { ...MOCK_CATEGORIES[idx] }
  },
  async removeCategory(id) {
    await delay()
    const used = MOCK_ITEMS.some((it) => it.categoryId === Number(id))
    if (used) throw new Error('Cannot delete: category still has items')
    MOCK_CATEGORIES = MOCK_CATEGORIES.filter((c) => c.id !== Number(id))
  },

  // ── Items CRUD ──────────────────────────────────────────
  async getItems() {
    await delay()
    return MOCK_ITEMS.map((it) => ({ ...it }))
  },
  async createItem(body) {
    await delay()
    const name = String(body.name || '').trim()
    const price = Number(body.price)
    const categoryId = Number(body.categoryId)
    if (!name) throw new Error('Item name is required')
    if (!price || price < 0) throw new Error('Valid price is required')
    if (!categoryId) throw new Error('Category is required')
    const row = {
      id: nextItemId++,
      name,
      price,
      categoryId,
      category: categoryName(categoryId),
      emoji: String(body.emoji || '📦').trim() || '📦',
    }
    MOCK_ITEMS.push(row)
    return { ...row }
  },
  async updateItem(id, body) {
    await delay()
    const idx = MOCK_ITEMS.findIndex((it) => it.id === Number(id))
    if (idx < 0) throw new Error('Item not found')
    const name = String(body.name || '').trim()
    const price = Number(body.price)
    const categoryId = Number(body.categoryId)
    if (!name) throw new Error('Item name is required')
    if (!price || price < 0) throw new Error('Valid price is required')
    if (!categoryId) throw new Error('Category is required')
    MOCK_ITEMS[idx] = {
      ...MOCK_ITEMS[idx],
      name,
      price,
      categoryId,
      category: categoryName(categoryId),
      emoji: String(body.emoji || MOCK_ITEMS[idx].emoji || '📦').trim() || '📦',
    }
    return { ...MOCK_ITEMS[idx] }
  },
  async removeItem(id) {
    await delay()
    MOCK_ITEMS = MOCK_ITEMS.filter((it) => it.id !== Number(id))
  },

  // ── Bills (mock) ────────────────────────────────────────
  async createBill(payload) {
    await delay(280)
    const billId = 'BILL-' + Date.now().toString(36).toUpperCase()
    console.log('[mock] Bill saved:', { billId, ...payload })
    return {
      id: billId,
      createdAt: new Date().toISOString(),
      ...payload,
    }
  },
}

// Convenience API objects shaped for CrudPage.vue
export const categoriesApi = {
  list: () => mockPosApi.getCategories(),
  create: (body) => mockPosApi.createCategory(body),
  update: (id, body) => mockPosApi.updateCategory(id, body),
  remove: (id) => mockPosApi.removeCategory(id),
}

export const itemsApi = {
  list: () => mockPosApi.getItems(),
  create: (body) => mockPosApi.createItem(body),
  update: (id, body) => mockPosApi.updateItem(id, body),
  remove: (id) => mockPosApi.removeItem(id),
}