import { formatUsd, formatUsdLabel } from '../utils/format.js'

export function serializeHolding(investment, opportunity) {
  const inv = investment.toObject ? investment.toObject() : investment
  const opp = opportunity?.toObject ? opportunity.toObject() : opportunity

  return {
    id: inv._id,
    opportunityId: opp?.legacyId ?? opp?._id,
    opportunity_id: opp?._id,
    status: inv.status === 'active' ? 'active' : inv.status,
    investedUsd: inv.investedUsd,
    accumulatedReturnUsd: inv.accumulatedReturnUsd,
    returnPercent: inv.returnPercent,
    monthsElapsed: inv.monthsElapsed,
    termMonths: inv.termMonths,
    nextPayoutDate: inv.nextPayoutDateLabel || inv.nextPayoutDate,
    nextPayoutUsd: inv.nextPayoutUsd,
    operationRef: inv.operationRef,
    payouts: (inv.payouts || []).map((p) => ({
      date: p.dateLabel || p.date,
      amount: p.amountUsd,
      status: p.statusLabel || p.status,
    })),
    noReturnsYet: !inv.payouts?.length,
    opportunity: opp
      ? {
          id: opp.legacyId ?? opp._id,
          title: opp.title,
          category: opp.category,
          categoryLabel: opp.categoryLabel,
          image: opp.imageUrl,
          tnaValue: `${opp.tnaPercent}%`,
          location: opp.location,
        }
      : null,
  }
}

export function serializePortfolioSummary(holdings) {
  const active = holdings.filter((h) => h.status === 'active')
  const totalUsd = active.reduce((s, h) => s + (h.investedUsd || 0), 0)
  const accumulatedReturnUsd = active.reduce((s, h) => s + (h.accumulatedReturnUsd || 0), 0)
  const returnPercent = totalUsd > 0 ? Math.round((accumulatedReturnUsd / totalUsd) * 1000) / 10 : 0

  const avgTna =
    active.length > 0
      ? Math.round(
          (active.reduce((s, h) => s + (h.opportunity?.tnaPercent || 0), 0) / active.length) * 10,
        ) / 10
      : 0

  const avgTermMonths =
    active.length > 0
      ? Math.round(active.reduce((s, h) => s + (h.termMonths || 0), 0) / active.length)
      : 0

  return {
    totalUsd,
    accumulatedReturnUsd,
    returnPercent,
    activeCount: active.length,
    avgTna,
    avgTermMonths,
    totalUsdLabel: formatUsdLabel(totalUsd),
    accumulatedReturnLabel: `+ USD ${formatUsd(accumulatedReturnUsd)}`,
  }
}
