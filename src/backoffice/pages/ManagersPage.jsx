import { useEffect, useState } from 'react'
import { getManagers } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ManagersPage({ onSelect, onCreate }) {
  const { user } = useAuth()
  const canWrite = can(user, 'managers:write')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      getManagers(query ? { q: query } : {})
        .then((res) => setItems(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, query ? 300 : 0)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar gestor…"
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px]"
        />
        {canWrite && (
          <button
            type="button"
            onClick={onCreate}
            className="px-5 py-2.5 rounded-xl bg-[#111827] text-white text-[14px] font-semibold"
          >
            + Nuevo gestor
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-[#6B7280]">Cargando gestores…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
              <tr>
                <th className="px-5 py-3">Gestor</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {items.map((m) => (
                <tr key={m.id} className={!m.isActive ? 'opacity-50' : ''}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center">
                        {m.initials}
                      </span>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-[12px] text-[#9CA3AF]">{m.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[12px] text-[#6B7280]">{m.slug}</td>
                  <td className="px-5 py-4 text-[#6B7280]">{m.role || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={m.isActive ? 'text-[#059669]' : 'text-[#DC2626]'}>
                      {m.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(m.id)}
                      className="text-[13px] font-medium text-[#2563EB] hover:underline"
                    >
                      {canWrite ? 'Editar' : 'Ver'}
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
