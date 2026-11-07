const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'
const TOKEN_KEY = 'minka_token'

let onUnauthorized = null

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function handleUnauthorized(status, message) {
  if (status === 401 && onUnauthorized) {
    onUnauthorized(message)
  }
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(body.error || `Error ${res.status}`)
    err.status = res.status
    if (!options.skipAuthRedirect && getToken()) {
      handleUnauthorized(res.status, body.error)
    }
    throw err
  }

  return body
}
