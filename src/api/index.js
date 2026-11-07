import { apiRequest } from './client.js'

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuthRedirect: true,
  })
}

export function getAuthMe() {
  return apiRequest('/auth/me')
}

export function getOpportunities({ tab = 'open', category } = {}) {
  const params = new URLSearchParams({ tab })
  if (category && category !== 'todas') params.set('category', category)
  return apiRequest(`/opportunities?${params}`)
}

export function getOpportunity(id) {
  return apiRequest(`/opportunities/${id}`)
}

export function getOpportunityReports(id) {
  return apiRequest(`/opportunities/${id}/reports`)
}

export function getPortfolioSummary() {
  return apiRequest('/portfolio/summary')
}

export function getPortfolioHoldings() {
  return apiRequest('/portfolio/holdings')
}

export function getPortfolioHolding(id) {
  return apiRequest(`/portfolio/holdings/${id}`)
}

export function getNotifications({ unread } = {}) {
  const q = unread ? '?unread=true' : ''
  return apiRequest(`/notifications${q}`)
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead() {
  return apiRequest('/notifications/read-all', { method: 'POST' })
}

export function getUser() {
  return apiRequest('/users/me')
}

export function updateUser(data) {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dni: data.dni,
      avatarUrl: data.avatar,
    }),
  })
}

export function getPaymentMethods() {
  return apiRequest('/payment-methods')
}

export function addPaymentMethod(data) {
  return apiRequest('/payment-methods', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deletePaymentMethod(id) {
  return apiRequest(`/payment-methods/${id}`, { method: 'DELETE' })
}

export function getFavorites() {
  return apiRequest('/favorites')
}

export function addFavorite(opportunityId) {
  return apiRequest(`/favorites/${opportunityId}`, { method: 'PUT' })
}

export function removeFavorite(opportunityId) {
  return apiRequest(`/favorites/${opportunityId}`, { method: 'DELETE' })
}

export function createInvestment(opportunityId, amountUsd) {
  return apiRequest('/investments', {
    method: 'POST',
    body: JSON.stringify({ opportunityId, amountUsd }),
  })
}

export function createPayment(investmentId, data) {
  return apiRequest(`/investments/${investmentId}/payments`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function confirmPayment(investmentId, paymentId, body = {}) {
  return apiRequest(`/investments/${investmentId}/payments/${paymentId}/confirm`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
