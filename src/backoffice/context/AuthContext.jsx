import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearToken, getToken, setToken } from '../api/client.js'
import { getMe, login as apiLogin } from '../api/index.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadSession = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const res = await getMe()
      setUser(res.data)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const login = useCallback(async (email, password) => {
    const res = await apiLogin(email, password)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout, reload: loadSession }),
    [user, loading, login, logout, loadSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth requiere AuthProvider')
  return ctx
}
