import { useEffect, useState } from 'react'
import { getOpportunities, getPortfolioHoldings, getPortfolioSummary } from '../api/index.js'

export function usePortfolio({ enabled = true } = {}) {
  const [summary, setSummary] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [newOpportunities, setNewOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      getPortfolioSummary(),
      getPortfolioHoldings(),
      getOpportunities({ tab: 'open' }),
    ])
      .then(([summaryRes, holdingsRes, oppsRes]) => {
        if (cancelled) return
        const holdingItems = holdingsRes.data.map((h) => ({
          holding: h,
          opportunity: h.opportunity,
        }))
        const holdingOppIds = new Set(holdingsRes.data.map((h) => h.opportunityId))
        setSummary(summaryRes.data)
        setHoldings(holdingItems)
        setNewOpportunities(oppsRes.data.filter((o) => !holdingOppIds.has(o.id)))
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
  }, [enabled])

  return { summary, holdings, newOpportunities, loading, error }
}
