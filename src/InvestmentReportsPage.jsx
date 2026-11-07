import { useEffect, useState } from 'react'
import { getOpportunity, getOpportunityReports, getPortfolioHoldings } from './api/index.js'

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

export default function InvestmentReportsPage({ opportunityId, onBack }) {
  const [opportunity, setOpportunity] = useState(null)
  const [holding, setHolding] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getOpportunity(opportunityId),
      getPortfolioHoldings(),
      getOpportunityReports(opportunityId),
    ])
      .then(([oppRes, holdingsRes, reportsRes]) => {
        if (cancelled) return
        setOpportunity(oppRes.data)
        setHolding(holdingsRes.data.find((h) => h.opportunityId === Number(opportunityId)))
        setReports(reportsRes.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [opportunityId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[14px] text-[#888]">Cargando informes…</p>
      </div>
    )
  }

  if (!opportunity) return null

  const invested = holding?.investedUsd || 2500
  const estimatedReturn = invested * 0.048

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen pb-10">
        <header className="flex items-center justify-between px-5 pt-12 pb-4">
          <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2" aria-label="Volver">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-[12px] font-semibold tracking-[0.1em] text-[#888] uppercase">
            Detalle inversión
          </span>
          <button type="button" className="w-10 h-10 flex items-center justify-center -mr-2 text-[#666]" aria-label="Compartir">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
        </header>

        <div className="px-5">
          <img
            src={opportunity.image}
            alt={opportunity.title}
            className="w-full h-48 rounded-2xl object-cover mb-5"
          />
          <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-1">{opportunity.title}</h1>
          <p className="text-[14px] text-[#888] mb-6">{opportunity.location}</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-white border border-[#EFEFEF]">
              <p className="text-[12px] text-[#888] mb-1">Invertido</p>
              <p className="text-[18px] font-bold text-[#1A1A1A]">USD {formatUsd(invested)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EFEFEF]">
              <p className="text-[12px] text-[#888] mb-1">Retorno estimado</p>
              <p className="text-[18px] font-bold text-[#16A34A]">+ USD {formatUsd(estimatedReturn)}</p>
            </div>
          </div>

          <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">Informes del proyecto</h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EFEFEF] text-left"
              >
                <div>
                  <p className="text-[15px] font-semibold text-[#1A1A1A]">{report.label}</p>
                  {report.isNew && (
                    <span className="text-[11px] font-semibold text-[#16A34A] uppercase">Nuevo</span>
                  )}
                </div>
                <svg className="w-5 h-5 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
