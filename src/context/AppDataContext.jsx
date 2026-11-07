import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addFavorite,
  getFavorites,
  getNotifications,
  getUser,
  markAllNotificationsRead,
  markNotificationRead,
  removeFavorite,
} from '../api/index.js'
import { useAuth } from './AuthContext.jsx'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const { isAuthenticated, user: authUser } = useAuth()
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [favorites, setFavorites] = useState(() => new Set())
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  const loadInitial = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null)
      setNotifications([])
      setFavorites(new Set())
      setReady(true)
      return
    }

    setReady(false)
    setError(null)
    const [userRes, notifRes, favRes] = await Promise.allSettled([
      getUser(),
      getNotifications(),
      getFavorites(),
    ])

    if (userRes.status === 'fulfilled') {
      setUser(userRes.value.data)
    } else {
      setUser(authUser)
    }

    if (notifRes.status === 'fulfilled') {
      setNotifications(notifRes.value.data)
    } else {
      setNotifications([])
    }

    if (favRes.status === 'fulfilled') {
      setFavorites(new Set(favRes.value.data.map((o) => o.id)))
    } else {
      setFavorites(new Set())
    }

    setReady(true)
  }, [isAuthenticated, authUser])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const toggleFavorite = useCallback(async (id) => {
    const wasFavorite = favorites.has(id)
    setFavorites((prev) => {
      const next = new Set(prev)
      if (wasFavorite) next.delete(id)
      else next.add(id)
      return next
    })
    try {
      if (wasFavorite) await removeFavorite(id)
      else await addFavorite(id)
    } catch (err) {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (wasFavorite) next.add(id)
        else next.delete(id)
        return next
      })
      throw err
    }
  }, [favorites])

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    try {
      await markNotificationRead(id)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const refreshNotifications = useCallback(async () => {
    const res = await getNotifications()
    setNotifications(res.data)
  }, [])

  const value = useMemo(
    () => ({
      user,
      setUser,
      notifications,
      unreadCount,
      favorites,
      toggleFavorite,
      markRead,
      markAllRead,
      refreshNotifications,
      ready,
      isAuthenticated,
      error,
      reload: loadInitial,
    }),
    [
      user,
      notifications,
      unreadCount,
      favorites,
      toggleFavorite,
      markRead,
      markAllRead,
      refreshNotifications,
      ready,
      isAuthenticated,
      error,
      loadInitial,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData debe usarse dentro de AppDataProvider')
  return ctx
}
