import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/index.js'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
      <p className="text-[13px] text-[#6B7280] mb-2">{label}</p>
      <p className="text-[32px] font-bold text-[#111827] leading-none">{value}</p>
      {sub && <p className="text-[12px] text-[#9CA3AF] mt-2">{sub}</p>}
    </div>
  )
}

function formatUsd(n) {
  return `USD ${Number(n).toLocaleString('es-AR')}`
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="text-[#DC2626]">{error}</p>
  if (!stats) return <p className="text-[#6B7280]">Cargando métricas…</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatCard label="Oportunidades totales" value={stats.opportunitiesTotal} />
      <StatCard label="Publicadas" value={stats.opportunitiesPublished} />
      <StatCard label="Borradores" value={stats.opportunitiesDraft} />
      <StatCard label="Inversores" value={stats.investorsTotal} />
      <StatCard label="Inversiones activas" value={stats.investmentsActive} />
      <StatCard label="Volumen invertido" value={formatUsd(stats.totalInvestedUsd)} />
    </div>
  )
}
