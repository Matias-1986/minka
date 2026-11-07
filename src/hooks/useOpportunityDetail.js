import { useEffect, useState } from 'react'
import { getOpportunity } from '../api/index.js'

export function useOpportunityDetail(opportunityId) {
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(Boolean(opportunityId))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!opportunityId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getOpportunity(opportunityId)
      .then((res) => {
        if (!cancelled) setOpportunity(res.data)
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
  }, [opportunityId])

  return { opportunity, loading, error }
}
