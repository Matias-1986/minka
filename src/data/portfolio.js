export const PORTFOLIO_SUMMARY = {
  totalUsd: 90500,
  accumulatedReturnUsd: 1270.2,
  returnPercent: 1.4,
  activeCount: 2,
  avgTna: 9.8,
  avgTermMonths: 18,
}

export const PORTFOLIO_HOLDINGS = [
  {
    id: 'inv-1',
    opportunityId: 1,
    status: 'active',
    investedUsd: 80500,
    accumulatedReturnUsd: 1258.2,
    returnPercent: 1.4,
    monthsElapsed: 18,
    termMonths: 24,
    nextPayoutDate: '15 de mayo 2026',
    nextPayoutUsd: 12,
    operationRef: 'INV-2026-06-11-00284',
    payouts: [
      { date: '15 feb 2026', amount: 12, status: 'Acreditado' },
      { date: '15 ene 2026', amount: 12, status: 'Acreditado' },
      { date: '15 dic 2025', amount: 12, status: 'Acreditado' },
    ],
  },
  {
    id: 'inv-2',
    opportunityId: 4,
    status: 'active',
    investedUsd: 1000,
    accumulatedReturnUsd: 0,
    returnPercent: 0,
    monthsElapsed: 1,
    termMonths: 18,
    nextPayoutDate: 'enero 2027',
    nextPayoutUsd: 95,
    operationRef: 'INV-2026-05-20-00198',
    payouts: [],
    noReturnsYet: true,
  },
]
