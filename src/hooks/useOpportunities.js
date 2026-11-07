import { useEffect, useState } from 'react'
import { getOpportunities } from '../api/index.js'

const MOBILE_TAB_MAP = {
  abiertas: 'open',
  proximas: 'upcoming',
  favoritas: 'favorites',
}

export function resolveOpportunityTab(tab) {
  return MOBILE_TAB_MAP[tab] || tab
}

export function useOpportunities({ tab = 'open', category = 'todas', enabled = true } = {}) {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiTab = resolveOpportunityTab(tab)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getOpportunities({ tab: apiTab, category })
      .then((res) => {
        if (!cancelled) setOpportunities(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiTab, category, enabled])

  return { opportunities, loading, error }
}
