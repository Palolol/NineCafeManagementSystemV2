<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { navItems } from '../nav'

const auth   = useAuth()
const route  = useRoute()
const router = useRouter()

// ── Sidebar (mobile drawer) ──────────────────────────────────────────────────
const sidebarOpen = ref(false)
watch(() => route.fullPath, () => { sidebarOpen.value = false })

// ── User dropdown ────────────────────────────────────────────────────────────
const dropdownOpen = ref(false)
const dropdownRef  = ref(null)

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }

function handleOutsideClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(()       => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))

// Close dropdown on route change
watch(() => route.fullPath, () => { dropdownOpen.value = false })

// ── Logout ───────────────────────────────────────────────────────────────────
async function logout() {
  dropdownOpen.value = false
  await auth.logout()
  router.push({ name: 'login' })
}

// ── Nav grouping ─────────────────────────────────────────────────────────────
const DASHBOARD_PATHS  = ['/dashboard']
const MANAGEMENT_PATHS = ['/debts', '/prices', '/expenses', '/suppliers', '/reports']
const ACCESS_PATHS     = ['/users', '/roles', '/permissions', '/modules', '/audit-logs']

const visibleItems = computed(() => navItems.filter((n) => auth.can(n.perm)))

function groupItems(paths) {
  return visibleItems.value.filter((n) => paths.includes(n.to))
}

const dashboardItems  = computed(() => groupItems(DASHBOARD_PATHS))
const managementItems = computed(() => groupItems(MANAGEMENT_PATHS))
const accessItems     = computed(() => groupItems(ACCESS_PATHS))

// ── User avatar initial ───────────────────────────────────────────────────────
const avatarInitial = computed(() => {
  const name = auth.user?.fullName || auth.user?.username || '?'
  return name.charAt(0).toUpperCase()
})

const displayName = computed(() => auth.user?.fullName || auth.user?.username || '')
const username    = computed(() => auth.user?.username ? `@${auth.user.username}` : '')
const roleName    = computed(() => auth.user?.role || '')
</script>

<template>
  <div class="shell">

    <!-- ═══════════════════ SIDEBAR ═══════════════════ -->
    <!-- Mobile overlay backdrop -->
    <div
      v-if="sidebarOpen"
      class="sidebar-backdrop"
      @click="sidebarOpen = false"
    />

    <aside class="sidebar" :class="{ open: sidebarOpen }">

      <!-- Brand -->
      <div class="sidebar-brand">
        <img src="/favicon.png" alt="Nine Cafe logo" class="sidebar-logo" />
        <div class="sidebar-brand-text">
          <span class="sidebar-brand-name">Nine Cafe</span>
          <span class="sidebar-brand-sub">MANAGEMENT SYSTEM</span>
        </div>
      </div>

      <!-- Nav groups -->
      <nav class="sidebar-nav">

        <template v-if="dashboardItems.length">
          <div class="nav-group-label">DASHBOARD</div>
          <RouterLink
            v-for="n in dashboardItems"
            :key="n.to"
            :to="n.to"
            class="nav-link"
          >
            <span class="nav-icon">{{ n.icon }}</span>
            <span>{{ n.label }}</span>
          </RouterLink>
        </template>

        <template v-if="managementItems.length">
          <div class="nav-group-label">MANAGEMENT</div>
          <RouterLink
            v-for="n in managementItems"
            :key="n.to"
            :to="n.to"
            class="nav-link"
          >
            <span class="nav-icon">{{ n.icon }}</span>
            <span>{{ n.label }}</span>
          </RouterLink>
        </template>

        <template v-if="accessItems.length">
          <div class="nav-group-label">ACCESS CONTROL</div>
          <RouterLink
            v-for="n in accessItems"
            :key="n.to"
            :to="n.to"
            class="nav-link"
          >
            <span class="nav-icon">{{ n.icon }}</span>
            <span>{{ n.label }}</span>
          </RouterLink>
        </template>

      </nav>
    </aside>

    <!-- ═══════════════════ MAIN AREA ═══════════════════ -->
    <div class="main">

      <!-- ── Topbar ── -->
      <header class="topbar">

        <!-- Left: hamburger + page title -->
        <div class="topbar-left">
          <button class="menu-toggle" aria-label="Toggle menu" @click="sidebarOpen = !sidebarOpen">
            <span class="hamburger-line" />
            <span class="hamburger-line" />
            <span class="hamburger-line" />
          </button>
          <span class="topbar-title">{{ route.meta.title }}</span>
        </div>

        <!-- Right: API status + user dropdown -->
        <div class="topbar-right">

          <!-- API Online pill -->
          <div class="api-status">
            <span class="api-dot" />
            API Online
          </div>

          <!-- User dropdown trigger -->
          <div ref="dropdownRef" class="user-menu-wrap">
            <button class="user-trigger" @click="toggleDropdown">
              <div class="user-avatar">{{ avatarInitial }}</div>
              <div class="user-trigger-info">
                <span class="user-trigger-name">{{ displayName }}</span>
                <span class="user-trigger-role">{{ roleName }}</span>
              </div>
              <span class="chevron" :class="{ rotated: dropdownOpen }">&#8964;</span>
            </button>

            <!-- Dropdown panel -->
            <Transition name="dropdown">
              <div v-if="dropdownOpen" class="user-dropdown">

                <!-- User header -->
                <div class="dropdown-user-header">
                  <div class="dropdown-avatar">{{ avatarInitial }}</div>
                  <div>
                    <div class="dropdown-display-name">{{ displayName }}</div>
                    <div class="dropdown-username">{{ username }}</div>
                    <span class="dropdown-role-badge">{{ roleName }}</span>
                  </div>
                </div>

                <div class="dropdown-divider" />

                <!-- Menu items -->
                <button class="dropdown-item" @click="dropdownOpen = false">
                  <span class="dropdown-item-icon">👤</span>
                  My Profile
                </button>
                <button class="dropdown-item" @click="dropdownOpen = false">
                  <span class="dropdown-item-icon">🔑</span>
                  Change Password
                </button>
                <button class="dropdown-item" @click="dropdownOpen = false">
                  <span class="dropdown-item-icon">⚙️</span>
                  API Server Settings
                </button>

                <div class="dropdown-divider" />

                <button class="dropdown-item logout" @click="logout">
                  <span class="dropdown-item-icon">🚪</span>
                  Logout
                </button>

              </div>
            </Transition>
          </div>

        </div>
      </header>

      <!-- ── Page content ── -->
      <main class="content">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
/* ══════════════════════════════════════════════════════
   SHELL
══════════════════════════════════════════════════════ */
.shell {
  display: flex;
  min-height: 100vh;
  background: #f5f8fb;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR BACKDROP (mobile)
══════════════════════════════════════════════════════ */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 28, 45, 0.45);
  z-index: 19;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #ebf1f6;
  position: fixed;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

/* ── Brand ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #ebf1f6;
  flex-shrink: 0;
}
.sidebar-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
  flex-shrink: 0;
}
.sidebar-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.sidebar-brand-name {
  font-size: 16px;
  font-weight: 800;
  color: #2a3547;
  letter-spacing: -0.01em;
}
.sidebar-brand-sub {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9eaabf;
  text-transform: uppercase;
  margin-top: 2px;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 10px 10px 20px;
  overflow-y: auto;
}
.nav-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9eaabf;
  text-transform: uppercase;
  padding: 14px 8px 6px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  color: #5a6a85;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 1px;
  transition: background 0.13s, color 0.13s;
}
.nav-link:hover {
  background: #f5f8fb;
  color: #2a3547;
}
.nav-link.router-link-active {
  background: #e5f3fb;
  color: #0085db;
}
.nav-icon {
  font-size: 17px;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  line-height: 1;
}

/* ══════════════════════════════════════════════════════
   MAIN AREA
══════════════════════════════════════════════════════ */
.main {
  flex: 1;
  margin-left: 220px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* ── Topbar ── */
.topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #ebf1f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 12px;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.topbar-title {
  font-size: 17px;
  font-weight: 700;
  color: #2a3547;
}

/* Hamburger (hidden on desktop) */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border: 1px solid #ebf1f6;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  padding: 7px 8px;
  flex-shrink: 0;
}
.hamburger-line {
  display: block;
  height: 2px;
  background: #2a3547;
  border-radius: 2px;
  width: 100%;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* ── API Online pill ── */
.api-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1px solid #c6f6d5;
  border-radius: 20px;
  background: #f0fff4;
  font-size: 12px;
  font-weight: 700;
  color: #276749;
  white-space: nowrap;
}
.api-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38a169;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* ══════════════════════════════════════════════════════
   USER DROPDOWN
══════════════════════════════════════════════════════ */
.user-menu-wrap {
  position: relative;
}

/* Trigger button */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border: 1px solid #ebf1f6;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: background 0.13s, border-color 0.13s;
  min-width: 0;
}
.user-trigger:hover { background: #f5f8fb; border-color: #d0dae8; }

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a73e8, #0f52ba);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-trigger-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.user-trigger-name {
  font-size: 13px;
  font-weight: 700;
  color: #2a3547;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-trigger-role {
  font-size: 11px;
  color: #9eaabf;
  font-weight: 500;
}

.chevron {
  font-size: 16px;
  color: #9eaabf;
  transition: transform 0.18s;
  line-height: 1;
  display: inline-block;
}
.chevron.rotated { transform: rotate(180deg); }

/* Dropdown panel */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 230px;
  background: #fff;
  border: 1px solid #ebf1f6;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(17, 28, 45, 0.14);
  z-index: 100;
  overflow: hidden;
  padding: 6px 0;
}

/* Dropdown header */
.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 12px;
}
.dropdown-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a73e8, #0f52ba);
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dropdown-display-name {
  font-size: 14px;
  font-weight: 700;
  color: #2a3547;
}
.dropdown-username {
  font-size: 12px;
  color: #9eaabf;
  margin-top: 1px;
}
.dropdown-role-badge {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 10px;
  background: #e5f3fb;
  color: #0085db;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
}

/* Divider */
.dropdown-divider {
  height: 1px;
  background: #ebf1f6;
  margin: 4px 0;
}

/* Dropdown items */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #2a3547;
  text-align: left;
  transition: background 0.12s;
}
.dropdown-item:hover { background: #f5f8fb; }
.dropdown-item.logout { color: #e53e3e; }
.dropdown-item.logout:hover { background: #fff5f5; }

.dropdown-item-icon {
  font-size: 15px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
  line-height: 1;
}

/* ══════════════════════════════════════════════════════
   DROPDOWN TRANSITION
══════════════════════════════════════════════════════ */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* ══════════════════════════════════════════════════════
   PAGE CONTENT
══════════════════════════════════════════════════════ */
.content {
  flex: 1;
  padding: 24px;
}

/* ══════════════════════════════════════════════════════
   RESPONSIVE (mobile ≤ 900px)
══════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: none;
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.18);
  }
  .main {
    margin-left: 0;
  }
  .menu-toggle {
    display: flex;
  }
  .content {
    padding: 14px;
  }
  .user-trigger-info {
    display: none;
  }
  .api-status {
    display: none;
  }
}
</style>
