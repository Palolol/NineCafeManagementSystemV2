# ☕ Nine Cafe Management System — Frontend (V2)

A modern, responsive Single Page Application (SPA) for cafe operations, sales ledger, cash flow tracking, and role-based administration built with **Vue 3 (Composition API)**, **Vite**, and **Pinia**.

Designed specifically for daily cafe operations in Cambodia—featuring dual-currency tracking (Cambodian Riel `៛` & USD `$`), real-time daily sales and cash withdrawal dashboards, customer debt ledger, staff operational expenses, supplier directories, monthly profit/loss reports, granular permission-based routing (RBAC), and full JSON audit log visualization.

---

## 📁 Repository Structure

```text
Frontend/
├── public/
│   └── favicon.png            # Application favicon
├── src/
│   ├── api/
│   │   ├── client.js          # Fetch HTTP client with Bearer token injection, error parsing & 401 handling
│   │   ├── endpoints.js       # Centralized REST API endpoints & generic CRUD resource factories
│   │   └── session.js         # LocalStorage session serializer ('ncms_session')
│   ├── components/
│   │   ├── BaseModal.vue      # Reusable modal dialog with ESC/backdrop dismissal & action slots
│   │   └── CrudPage.vue       # Generic CRUD page engine (table, search, modal form, RBAC actions)
│   ├── layouts/
│   │   └── AppShell.vue       # Responsive main layout with mobile drawer, dynamic sidebar & topbar
│   ├── router/
│   │   └── index.js           # Vue Router with client-side RBAC guards & fallback redirects
│   ├── stores/
│   │   └── auth.js            # Pinia authentication store (session, token, user profile & can(perm) helper)
│   ├── utils/
│   │   └── format.js          # Currency formatting (KHR ៛, USD conversion @ 4,000 KHR/USD, dates)
│   ├── views/
│   │   ├── AuditLogsView.vue  # System audit trail with entity/action filters & JSON diff formatting
│   │   ├── ComingSoonView.vue # Fallback view for unmapped routes
│   │   ├── DashboardView.vue  # Daily sales overview, cup count, cash withdrawals & date filter
│   │   ├── DebtsView.vue      # Customer debt/credit ledger with one-click payment settlement
│   │   ├── ExpensesView.vue   # Operational expense tracker with user attribution
│   │   ├── ForbiddenView.vue  # 403 Forbidden access denied view
│   │   ├── LoginView.vue      # JWT authentication form with return redirect support
│   │   ├── ModulesView.vue    # Permission module category administration
│   │   ├── PermissionsView.vue# Granular permission dictionary management
│   │   ├── PricesView.vue     # KHR pricing tier management with live USD preview
│   │   ├── ReportsView.vue    # Monthly financial breakdown, revenue vs expense bar metrics
│   │   ├── RolesView.vue      # Role management & interactive module-grouped permission checklist
│   │   ├── SuppliersView.vue  # Vendor & supplier contact directory
│   │   └── UsersView.vue      # Staff user accounts, role assignment & status management
│   ├── App.vue                # Root application component (<RouterView />)
│   ├── main.js                # Application entrypoint (Vue, Pinia, Vue Router)
│   ├── nav.js                 # Central navigation menu configuration & required permissions
│   └── style.css              # Custom modern CSS design system & responsive UI utilities
├── .env.example               # Environment variables template for dev proxy & production API
├── index.html                 # Single page application HTML entrypoint
├── package.json               # Dependencies & build scripts
└── vite.config.js             # Vite configuration with /api reverse proxy
```

---

## ✨ Core Features & Views

### 1. 📊 Daily Operations Dashboard (`/dashboard`)
- **Real-Time KPIs:** Instant calculation of total cups sold, gross daily revenue (KHR `៛` and USD `$`), and total cash payouts/withdrawals.
- **Historical Navigation:** Interactive date picker enabling historical sales review by specific calendar day.
- **Sales Breakdown:** Itemized table displaying price tiers, units sold, and aggregate line totals.
- **Cash Withdrawal Logs:** Tracks manager/owner cash outlays with amounts and specific reasons.

### 2. 💳 Customer Debt & Credit Ledger (`/debts`)
- **Customer Account Tracking:** Logs outstanding customer tabs (`CustomerName`, `Amount`, `Date`).
- **Payment Status Badges:** Visual badges for `Paid` vs `Unpaid` debt statuses.
- **One-Click Settlement:** Instant "Mark paid" action utilizing `PATCH /api/debts/{id}/pay` with live UI reloads.

### 3. 💸 Operational Expenses (`/expenses`)
- **Daily Expense Logging:** Record daily cafe operational costs (`Date`, `Description`, `Amount`, `Other`).
- **User Attribution:** Automatically associates logged expenses with the active staff user (`userPublicId`) while preserving original authorship on updates.

### 4. 🏷️ KHR Pricing Tiers (`/prices`)
- **Cambodian Riel Base Rates:** Configure base cup/item prices in Riel (`min 100 ៛`, `step 100 ៛`).
- **Live Currency Conversion:** Automatically calculates and displays USD dollar equivalents alongside KHR values based on standard 4,000 KHR/USD exchange rate.

### 5. 🚚 Supplier Directory (`/suppliers`)
- **Vendor Directory:** Maintain vendor profiles (`Name`, `Product`, `Contact info`, `Address`, `Note`) for coffee bean roasters, dairy suppliers, packaging, and ingredients.

### 6. 📈 Monthly Financial Reports (`/reports`)
- **Monthly Summary Cards:** Aggregate monthly metrics for gross income, operational expenses, and net profit.
- **Day-by-Day Visualizer:** Monthly day-by-day table breakdown comparing daily sales revenue against expenses with inline proportion bar indicators.

### 7. 👤 Staff & User Management (`/users`)
- **User Administration:** Complete CRUD operations for staff accounts (`Username`, `FullName`, `Email`, `PhoneNumber`, `Role`).
- **Account Status Toggles:** Enable or deactivate staff accounts (`Active` / `Inactive`).
- **Credential Provisioning:** Secure password input on user creation and role assignments.

### 8. 🛡️ Roles & Permission Matrix (`/roles`)
- **Role Definition:** Create and manage application job roles (e.g. `Admin`, `Manager`, `Cashier`).
- **Module-Grouped Permission Picker:** Interactive modal displaying all system permissions categorized by module with granular multi-select checkboxes for bulk assignment.

### 9. 🔑 Permissions & Modules Administration (`/permissions`, `/modules`)
- **Permission Dictionary:** Manage granular permission codes (`user.read`, `dashboard.create`, `report.read`, etc.) linked to parent modules.
- **Module Categories:** Organize permissions into logical business units (`USER`, `DASHBOARD`, `EXPENSE`, `DEBT`, etc.).

### 10. 📜 System Audit Trail Viewer (`/audit-logs`)
- **Activity Stream:** Inspect real-time audit entries across all operational entities (`DailySale`, `Debt`, `Expense`, `Price`, `Supplier`, etc.).
- **Search & Filters:** Filter audit logs by specific entity type and action (`create`, `update`, `delete`).
- **JSON Diff Viewer:** Expandable log rows featuring formatted, syntax-highlighted `BeforeData` and `AfterData` snapshots.

---

## 🛡️ Architecture & Security Highlights

### 1. Granular Role-Based Access Control (RBAC)
- **Central Navigation Table (`nav.js`):** Sidebar items declare their required permission constant (e.g. `dashboard.read`, `user.read`).
- **Dynamic Sidebar:** `AppShell.vue` filters sidebar navigation links through `auth.can(perm)`, ensuring users only see pages they are permitted to view.
- **Route Guards (`router.beforeEach`):** Validates authentication and verifies route metadata (`to.meta.perm`) before allowing navigation; unauthorized access redirects automatically to `/forbidden`.
- **In-Page Action Security:** Component buttons (Create, Edit, Delete, Mark Paid) are conditionally rendered based on active permissions (e.g., `v-if="auth.can('user.create')"`). Admin role automatically bypasses all permission checks.

### 2. Stateless JWT Session Management
- **Token Persistence:** Stored in browser `localStorage` under `ncms_session` with user profile and claim metadata.
- **Automatic Authorization Header:** `client.js` transparently attaches `Authorization: Bearer <token>` to all outbound API requests.
- **Graceful Token Expiry (401 Handling):** Receiving HTTP 401 triggers immediate session clearing and broadcasts an `ncms:unauthorized` event to redirect the user back to `/login` with the current path preserved in `?redirect=...`.
- **Stateless Logout:** `useAuth().logout()` calls the backend logout endpoint to blacklist the active JWT token, cleans local storage, and resets store state.

### 3. Reusable Generic CRUD Architecture (`CrudPage.vue`)
- Standardizes list tables, empty states, loading indicators, search/filters, create modals, edit forms, validation errors, and delete confirmations into a single declarative component.
- Individual view files (`PricesView.vue`, `DebtsView.vue`, `ExpensesView.vue`, `SuppliersView.vue`) only require column definitions, form field schemas, and API bindings.

### 4. Dual-Currency Support (Cambodian Riel & USD)
- Standardized currency helpers in `src/utils/format.js`:
  - `riel(n)`: Formats integers with thousands separators and the official Khmer Riel symbol (`10,000 ៛`).
  - `usd(n)`: Computes USD equivalent using the standard cafe exchange rate ($4,000\text{ KHR} = 1\text{ USD}$).

---

## 🧭 Routes & Permission Matrix

| Path | View Component | Required Permission | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginView.vue` | *Public* | Staff & Admin JWT login |
| `/dashboard` | `DashboardView.vue` | `dashboard.read` | Daily KPI cards, sales breakdown, and cash withdrawals |
| `/debts` | `DebtsView.vue` | `debt.read` | Customer credit tabs and one-click payment settlement |
| `/prices` | `PricesView.vue` | `price.read` | KHR pricing tiers with live USD equivalent preview |
| `/expenses` | `ExpensesView.vue` | `expense.read` | Daily operational expense tracking |
| `/suppliers` | `SuppliersView.vue` | `supplier.read` | Vendor and supplier directory |
| `/reports` | `ReportsView.vue` | `report.read` | Monthly financial summaries and profit/loss reports |
| `/users` | `UsersView.vue` | `user.read` | Staff account creation, role assignment, and status |
| `/roles` | `RolesView.vue` | `role.read` | Role creation and module-grouped permission matrix |
| `/permissions` | `PermissionsView.vue` | `permission.read` | Granular permission dictionary management |
| `/modules` | `ModulesView.vue` | `module.read` | Permission module category management |
| `/audit-logs` | `AuditLogsView.vue` | `audit.read` | Activity audit trail with expandable JSON before/after snapshots |
| `/forbidden` | `ForbiddenView.vue` | *Authenticated* | 403 Access Denied notification screen |

---

## 💻 Tech Stack & Dependencies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Vue.js](https://vuejs.org/) | `^3.5.0` | Progressive JavaScript framework (Composition API, `<script setup>`) |
| **Build Tool** | [Vite](https://vite.dev/) | `^6.0.0` | Next-generation frontend tooling and lightning-fast HMR dev server |
| **State Management**| [Pinia](https://pinia.vuejs.org/) | `^2.3.0` | Intuitive, modular state store for auth sessions and permissions |
| **Routing** | [Vue Router](https://router.vuejs.org/) | `^4.5.0` | Declarative client-side routing with navigation guards |
| **Styling** | Modern CSS | Vanilla | Custom lightweight design system with CSS custom properties & responsive shell |
| **Plugin** | `@vitejs/plugin-vue` | `^5.2.0` | Official Vue 3 Single File Component compiler plugin for Vite |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Running instance of **NineCafeApi** (default: `http://localhost:5256`)

### Setup & Run

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional):**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   *(By default, Vite proxies `/api` requests to `http://localhost:5256`.)*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will be live at: **`http://localhost:5173`**

5. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in `Frontend/dist/`.

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## ⚙️ Environment Configuration

The frontend provides two configuration options via environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_PROXY` | `http://localhost:5256` | Target URL for Vite dev reverse proxy. Forwards all `/api/*` browser calls to the backend, avoiding CORS and Codespaces port forwarding issues. |
| `VITE_API_BASE` | `/api` | Base API URL used in production environments when serving built assets directly or connecting to an external API origin. |

---

## 🔑 Default Administrator Credentials

Use the default administrator account seeded by the backend to log in with full privileges:

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `Abcd1234%` |
| **Assigned Role** | `Admin` |
| **Access Rights** | Unrestricted bypass across all views and actions |
