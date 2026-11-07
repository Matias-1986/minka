import { useEffect, useState } from 'react'
import { archiveOpportunity, getOpportunities, publishOpportunity } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_BADGE = {
  draft: 'bg-[#FEF3C7] text-[#92400E]',
  published: 'bg-[#D1FAE5] text-[#065F46]',
  archived: 'bg-[#F3F4F6] text-[#6B7280]',
}

const LISTING_BADGE = {
  open: 'Abierta',
  upcoming: 'Próxima',
  closed: 'Cerrada',
}

export default function OpportunitiesPage({ onEdit, onCreate }) {
  const { user } = useAuth()
  const canWrite = can(user, 'opportunities:write')
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getOpportunities(filter ? { publicationStatus: filter } : {})
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter])

  const handlePublish = async (id) => {
    await publishOpportunity(id)
    load()
  }

  const handleArchive = async (id) => {
    if (!confirm('¿Archivar esta oportunidad?')) return
    await archiveOpportunity(id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[14px] bg-white"
        >
          <option value="">Todas</option>
          <option value="draft">Borradores</option>
          <option value="published">Publicadas</option>
          <option value="archived">Archivadas</option>
        </select>

        {canWrite && (
          <button
            type="button"
            onClick={onCreate}
            className="ml-auto px-5 py-2.5 rounded-xl bg-[#111827] text-white text-[14px] font-semibold"
          >
            + Nueva oportunidad
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-[#6B7280]">Cargando…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 font-semibold">Proyecto</th>
                <th className="px-5 py-3 font-semibold">Categoría</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Listado</th>
                <th className="px-5 py-3 font-semibold">TNA</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {items.map((opp) => (
                <tr key={opp.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#111827]">{opp.title}</p>
                    <p className="text-[12px] text-[#9CA3AF]">{opp.managerName}</p>
                  </td>
                  <td className="px-5 py-4 text-[#6B7280]">{opp.categoryLabel}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_BADGE[opp.publicationStatus]}`}>
                      {opp.publicationStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#6B7280]">{LISTING_BADGE[opp.listingStatus]}</td>
                  <td className="px-5 py-4 font-medium">{opp.tnaPercent}%</td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onEdit(opp.id)}
                      className="text-[13px] font-medium text-[#2563EB] hover:underline"
                    >
                      {canWrite ? 'Editar' : 'Ver'}
                    </button>
                    {canWrite && opp.publicationStatus === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handlePublish(opp.id)}
                        className="text-[13px] font-medium text-[#059669] hover:underline"
                      >
                        Publicar
                      </button>
                    )}
                    {canWrite && opp.publicationStatus !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleArchive(opp.id)}
                        className="text-[13px] font-medium text-[#DC2626] hover:underline"
                      >
                        Archivar
                      </button>
                    )}
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
