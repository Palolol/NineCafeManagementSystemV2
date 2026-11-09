import { api } from './client'

const crud = (base) => ({
  list: () => api.get(base),
  get: (id) => api.get(`${base}/${id}`),
  create: (dto) => api.post(base, dto),
  update: (id, dto) => api.put(`${base}/${id}`, dto),
  remove: (id) => api.delete(`${base}/${id}`),
})

export const authApi = {
  login: (username, password) => api.post('auth/login', { username, password }),
  logout: () => api.post('auth/logout', {}),
}
export const dashboardApi = { get: (date) => api.get('dashboard', date ? { date } : null) }

export const usersApi = { ...crud('users'), changePassword: (id, dto) => api.put(`users/${id}/change-password`, dto) }
export const modulesApi = crud('modules')
export const rolesApi = crud('roles')

// Ready for the second half of the build:
export const permissionsApi = crud('permissions')
export const debtsApi = crud('debts')
export const pricesApi = crud('prices')
export const expensesApi = crud('expenses')
export const suppliersApi = crud('suppliers')
