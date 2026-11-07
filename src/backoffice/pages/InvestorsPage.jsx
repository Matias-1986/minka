import { useEffect, useState } from 'react'
import { createInvestor, getInvestors } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const KYC_BADGE = {
  verified: 'bg-[#D1FAE5] text-[#065F46]',
  pending: 'bg-[#FEF3C7] text-[#92400E]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B]',
}

const KYC_LABEL = {
  verified: 'Verificado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
}

function formatUsd(n) {
  return `USD ${Number(n || 0).toLocaleString('es-AR')}`
}

export default function InvestorsPage({ onSelect }) {
  const { user } = useAuth()
  const canWrite = can(user, 'investors:write')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [kycFilter, setKycFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dni: '',
    kycStatus: 'pending',
  })

  const load = () => {
    setLoading(true)
    const params = {}
    if (query) params.q = query
    if (kycFilter) params.kycStatus = kycFilter
    getInvestors(params)
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(t)
  }, [query, kycFilter])

  const handleCreate = async (e) => {
    e.preventDefault()
    await createInvestor(form)
    setShowForm(false)
    setForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dni: '',
      kycStatus: 'pending',
    })
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, email o DNI…"
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px]"
        />
        <select
          value={kycFilter}
          onChange={(e) => setKycFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px]"
        >
          <option value="">Todos los KYC</option>
          <option value="verified">Verificado</option>
          <option value="pending">Pendiente</option>
          <option value="rejected">Rechazado</option>
        </select>
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl bg-[#111827] text-white text-[14px] font-semibold"
          >
            + Nuevo inversor
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6 grid grid-cols-2 gap-4"
        >
          {[
            { key: 'firstName', label: 'Nombre' },
            { key: 'lastName', label: 'Apellido' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'password', label: 'Contraseña', type: 'password' },
            { key: 'phone', label: 'Teléfono' },
            { key: 'dni', label: 'DNI / CUIL' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-[12px] text-[#6B7280] mb-1 block">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required={['firstName', 'lastName', 'email', 'password'].includes(field.key)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB]"
              />
            </div>
          ))}
          <div>
            <label className="text-[12px] text-[#6B7280] mb-1 block">Estado KYC</label>
            <select
              value={form.kycStatus}
              onChange={(e) => setForm((f) => ({ ...f, kycStatus: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB]"
            >
              <option value="pending">Pendiente</option>
              <option value="verified">Verificado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>
          <button
            type="submit"
            className="col-span-2 py-3 rounded-xl bg-[#111827] text-white font-semibold"
          >
            Crear inversor
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-[#6B7280]">Cargando inversores…</p>
      ) : items.length === 0 ? (
        <p className="text-[#6B7280]">No hay inversores que coincidan con el filtro.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
              <tr>
                <th className="px-5 py-3">Inversor</th>
                <th className="px-5 py-3">KYC</th>
                <th className="px-5 py-3">Invertido</th>
                <th className="px-5 py-3">Activas</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {items.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#111827]">
                      {inv.firstName} {inv.lastName}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF]">{inv.email}</p>
                    {inv.dni && (
                      <p className="text-[11px] text-[#9CA3AF]">DNI {inv.dni}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${KYC_BADGE[inv.kycStatus] || 'bg-[#F3F4F6]'}`}
                    >
                      {KYC_LABEL[inv.kycStatus] || inv.kycStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium">{formatUsd(inv.totalInvestedUsd)}</td>
                  <td className="px-5 py-4 text-[#6B7280]">
                    {inv.activeInvestments} / {inv.investmentCount}
                  </td>
                  <td className="px-5 py-4">
                    <span className={inv.isActive ? 'text-[#059669]' : 'text-[#DC2626]'}>
                      {inv.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(inv.id)}
                      className="text-[13px] font-medium text-[#2563EB] hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
