import { adminRequest, adminUpload } from './client.js'

export function login(email, password) {
  return adminRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getMe() {
  return adminRequest('/auth/me')
}

export function getDashboardStats() {
  return adminRequest('/dashboard/stats')
}

export function getOpportunities(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/opportunities${q ? `?${q}` : ''}`)
}

export function getOpportunity(id) {
  return adminRequest(`/opportunities/${id}`)
}

export function createOpportunity(data) {
  return adminRequest('/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateOpportunity(id, data) {
  return adminRequest(`/opportunities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function publishOpportunity(id, listingStatus = 'open') {
  return adminRequest(`/opportunities/${id}/publish`, {
    method: 'POST',
    body: JSON.stringify({ listingStatus }),
  })
}

export function archiveOpportunity(id) {
  return adminRequest(`/opportunities/${id}`, { method: 'DELETE' })
}

export function getUsers(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/users${q ? `?${q}` : ''}`)
}

export function getInvestors(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/investors${q ? `?${q}` : ''}`)
}

export function getInvestor(id) {
  return adminRequest(`/investors/${id}`)
}

export function createInvestor(data) {
  return adminRequest('/investors', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateInvestor(id, data) {
  return adminRequest(`/investors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function updateUser(id, data) {
  return adminRequest(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function createUser(data) {
  return adminRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getInvestments(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/investments${q ? `?${q}` : ''}`)
}

export function getManagers(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/managers${q ? `?${q}` : ''}`)
}

export function getManager(id) {
  return adminRequest(`/managers/${id}`)
}

export function createManager(data) {
  return adminRequest('/managers', { method: 'POST', body: JSON.stringify(data) })
}

export function updateManager(id, data) {
  return adminRequest(`/managers/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export function deleteManager(id) {
  return adminRequest(`/managers/${id}`, { method: 'DELETE' })
}

export function getMasters(params = {}) {
  const q = new URLSearchParams(params).toString()
  return adminRequest(`/masters${q ? `?${q}` : ''}`)
}

export function createMaster(data) {
  return adminRequest('/masters', { method: 'POST', body: JSON.stringify(data) })
}

export function updateMaster(id, data) {
  return adminRequest(`/masters/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export function deleteMaster(id) {
  return adminRequest(`/masters/${id}`, { method: 'DELETE' })
}

export function uploadOpportunityImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return adminUpload('/uploads/opportunity-image', formData)
}
