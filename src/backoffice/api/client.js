const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'
const TOKEN_KEY = 'minka_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function adminRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers,
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(body.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }

  return body
}

export async function adminUpload(path, formData) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}/admin${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(body.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }

  return body
}
