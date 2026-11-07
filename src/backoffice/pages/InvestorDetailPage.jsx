import { useEffect, useState } from 'react'
import { getInvestor, updateInvestor } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const KYC_LABEL = {
  verified: 'Verificado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
}

function formatUsd(n) {
  return `USD ${Number(n || 0).toLocaleString('es-AR')}`
}

export default function InvestorDetailPage({ id, onBack }) {
  const { user } = useAuth()
  const canWrite = can(user, 'investors:write')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getInvestor(id)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  const patch = async (updates) => {
    if (!canWrite) return
    setSaving(true)
    try {
      const res = await updateInvestor(id, updates)
      setData((prev) => ({ ...prev, ...res.data }))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-[#6B7280]">Cargando inversor…</p>
  if (!data) return <p className="text-[#DC2626]">Inversor no encontrado</p>

  return (
    <div className="max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="text-[14px] text-[#6B7280] hover:text-[#111827] mb-6"
      >
        ← Volver al listado
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[22px] font-bold text-[#111827]">
                {data.firstName} {data.lastName}
              </h2>
              <p className="text-[14px] text-[#6B7280] mt-1">{data.email}</p>
              {data.phone && <p className="text-[13px] text-[#9CA3AF]">{data.phone}</p>}
              {data.dni && <p className="text-[13px] text-[#9CA3AF]">DNI {data.dni}</p>}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                data.isActive ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'
              }`}
            >
              {data.isActive ? 'Cuenta activa' : 'Cuenta inactiva'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[14px]">
            <div className="p-4 rounded-xl bg-[#F9FAFB]">
              <p className="text-[12px] text-[#6B7280] mb-1">Capital invertido</p>
              <p className="text-[20px] font-bold">{formatUsd(data.totalInvestedUsd)}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F9FAFB]">
              <p className="text-[12px] text-[#6B7280] mb-1">Retorno acumulado</p>
              <p className="text-[20px] font-bold text-[#059669]">
                +{formatUsd(data.accumulatedReturnUsd)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#F9FAFB]">
              <p className="text-[12px] text-[#6B7280] mb-1">Inversiones activas</p>
              <p className="text-[20px] font-bold">{data.activeInvestments}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F9FAFB]">
              <p className="text-[12px] text-[#6B7280] mb-1">Métodos de pago</p>
              <p className="text-[20px] font-bold">{data.paymentMethodsCount}</p>
            </div>
          </div>
        </div>

        {canWrite && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
            <h3 className="text-[15px] font-bold text-[#111827]">Acciones</h3>

            <div>
              <label className="text-[12px] text-[#6B7280] mb-1.5 block">Estado KYC</label>
              <select
                value={data.kycStatus}
                disabled={saving}
                onChange={(e) => patch({ kycStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[14px]"
              >
                <option value="pending">Pendiente</option>
                <option value="verified">Verificado</option>
                <option value="rejected">Rechazado</option>
              </select>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Actual: {KYC_LABEL[data.kycStatus]}
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => patch({ isActive: !data.isActive })}
              className={`w-full py-2.5 rounded-xl text-[14px] font-semibold ${
                data.isActive
                  ? 'border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEF2F2]'
                  : 'bg-[#111827] text-white hover:bg-[#1F2937]'
              }`}
            >
              {data.isActive ? 'Desactivar cuenta' : 'Activar cuenta'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F3F4F6]">
          <h3 className="text-[16px] font-bold text-[#111827]">Historial de inversiones</h3>
        </div>
        {data.investments?.length ? (
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
              <tr>
                <th className="px-5 py-3">Referencia</th>
                <th className="px-5 py-3">Proyecto</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Retorno</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {data.investments.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-5 py-4 font-mono text-[12px]">{inv.operationRef}</td>
                  <td className="px-5 py-4">{inv.opportunityTitle}</td>
                  <td className="px-5 py-4 font-medium">{formatUsd(inv.investedUsd)}</td>
                  <td className="px-5 py-4 text-[#059669]">
                    +{formatUsd(inv.accumulatedReturnUsd)}
                  </td>
                  <td className="px-5 py-4 text-[#6B7280]">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-10 text-[14px] text-[#9CA3AF] text-center">
            Este inversor aún no tiene inversiones registradas.
          </p>
        )}
      </div>
    </div>
  )
}
