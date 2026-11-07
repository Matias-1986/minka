import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAuthMe, login as apiLogin } from '../api/index.js'
import { clearToken, getToken, setToken, setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requireLogin, setRequireLogin] = useState(false)

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setRequireLogin(true)
  }, [])

  const loadSession = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await getAuthMe()
      setUser(res.data)
      setRequireLogin(false)
    } catch {
      clearToken()
      setUser(null)
      setRequireLogin(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      clearToken()
      setUser(null)
      if (
        message === 'Usuario no encontrado o inactivo' ||
        message === 'Token inválido o expirado' ||
        message === 'No autorizado'
      ) {
        setRequireLogin(true)
      }
    })
    loadSession()
    return () => setUnauthorizedHandler(null)
  }, [loadSession])

  const login = useCallback(async (email, password) => {
    const res = await apiLogin(email, password)
    setToken(res.data.token)
    setUser(res.data.user)
    setRequireLogin(false)
    return res.data.user
  }, [])

  const dismissLogin = useCallback(() => {
    setRequireLogin(false)
  }, [])

  const promptLogin = useCallback(() => {
    setRequireLogin(true)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      requireLogin,
      login,
      logout,
      dismissLogin,
      promptLogin,
      reload: loadSession,
    }),
    [user, loading, requireLogin, login, logout, dismissLogin, promptLogin, loadSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
