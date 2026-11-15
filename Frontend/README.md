# NCMS Frontend (Vue 3 + Vite)

A modern, responsive Single Page Application (SPA) for **Nine Cafe Management System (V2)** built with **Vue 3**, **Vite**, and **Pinia**.

---

## 🚀 Quick Start

```bash
cd Frontend
npm install
npm run dev        # Starts dev server on http://localhost:5173
```

The dev server forwards `/api` to the .NET API (default `http://localhost:5256`, customize via `VITE_API_PROXY` in `.env`). In GitHub Codespaces or remote containers, port 5173 is forwarded while keeping the API running on 5256.

---

## 📁 Architecture Overview

- **State & Auth (`src/stores/auth.js`):** Pinia store managing JWT sessions, token storage (`localStorage`), user profiles, and permission verification (`can(perm)`).
- **Routing & RBAC (`src/router/index.js`, `src/nav.js`):** Client-side navigation guards verifying permissions for each view, redirecting unauthorized users to `/forbidden` and unauthenticated users to `/login`.
- **API Client (`src/api/`):** Fetch client with automatic Bearer token injection, uniform error handling, and 401 token invalidation.
- **Reusable CRUD Pattern (`src/components/CrudPage.vue`, `BaseModal.vue`):** Declarative component powering standard management views (Prices, Debts, Expenses, Suppliers).

---

## 🧭 Implemented Views & Routes

| Route | View Component | Permission | Status |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginView.vue` | *Public* | ✅ Fully Implemented |
| `/dashboard` | `DashboardView.vue` | `dashboard.read` | ✅ Fully Implemented |
| `/debts` | `DebtsView.vue` | `debt.read` | ✅ Fully Implemented |
| `/prices` | `PricesView.vue` | `price.read` | ✅ Fully Implemented |
| `/expenses` | `ExpensesView.vue` | `expense.read` | ✅ Fully Implemented |
| `/suppliers` | `SuppliersView.vue` | `supplier.read` | ✅ Fully Implemented |
| `/reports` | `ReportsView.vue` | `report.read` | ✅ Fully Implemented |
| `/users` | `UsersView.vue` | `user.read` | ✅ Fully Implemented |
| `/roles` | `RolesView.vue` | `role.read` | ✅ Fully Implemented |
| `/permissions` | `PermissionsView.vue` | `permission.read` | ✅ Fully Implemented |
| `/modules` | `ModulesView.vue` | `module.read` | ✅ Fully Implemented |
| `/audit-logs` | `AuditLogsView.vue` | `audit.read` | ✅ Fully Implemented |
| `/forbidden` | `ForbiddenView.vue` | *Authenticated* | ✅ Fully Implemented |

---

## 🛠️ Build & Scripts

```bash
npm run dev        # Run Vite development server with HMR
npm run build      # Compile and bundle production assets to dist/
npm run preview    # Preview production build locally
```
