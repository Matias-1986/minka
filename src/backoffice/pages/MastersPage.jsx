import { useEffect, useState } from 'react'
import { createMaster, deleteMaster, getMasters, updateMaster } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const TABS = [
  { id: 'category', label: 'Categorías' },
  { id: 'risk', label: 'Riesgos' },
  { id: 'listing_status', label: 'Estados de listado' },
  { id: 'publication_status', label: 'Estados de publicación' },
]

const EMPTY = { code: '', label: '', description: '', sortOrder: 0 }

export default function MastersPage() {
  const { user } = useAuth()
  const canWrite = can(user, 'masters:write')
  const [tab, setTab] = useState('category')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    getMasters({ type: tab })
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY)
  }, [tab])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, sortOrder: items.length + 1 })
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item.id)
    setForm({
      code: item.code,
      label: item.label,
      description: item.description || '',
      sortOrder: item.sortOrder || 0,
    })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { ...form, type: tab, sortOrder: Number(form.sortOrder) }
    if (editing) {
      await updateMaster(editing, payload)
    } else {
      await createMaster(payload)
    }
    setShowForm(false)
    load()
  }

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este registro?')) return
    await deleteMaster(id)
    load()
  }

  const activeItems = items.filter((i) => i.isActive)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-[14px] font-medium ${
              tab === t.id ? 'bg-[#111827] text-white' : 'bg-white border border-[#E5E7EB] text-[#374151]'
            }`}
          >
            {t.label}
          </button>
        ))}
        {canWrite && (
          <button
            type="button"
            onClick={openCreate}
            className="ml-auto px-5 py-2 rounded-xl bg-[#111827] text-white text-[14px] font-semibold"
          >
            + Agregar
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Código"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            required
            disabled={!!editing}
            className="px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
          />
          <input
            placeholder="Etiqueta"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            required
            className="px-4 py-3 rounded-xl border border-[#E5E7EB]"
          />
          <input
            placeholder="Orden"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-[#E5E7EB]"
          />
          <input
            placeholder="Descripción (opcional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-[#E5E7EB] col-span-2"
          />
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#111827] text-white font-semibold">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB]"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-[#6B7280]">Cargando…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
              <tr>
                <th className="px-5 py-3">Orden</th>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Etiqueta</th>
                <th className="px-5 py-3">Descripción</th>
                {canWrite && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {activeItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 text-[#6B7280]">{item.sortOrder}</td>
                  <td className="px-5 py-4 font-mono text-[13px]">{item.code}</td>
                  <td className="px-5 py-4 font-medium">{item.label}</td>
                  <td className="px-5 py-4 text-[#6B7280]">{item.description || '—'}</td>
                  {canWrite && (
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-[#2563EB] hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(item.id)}
                        className="text-[#DC2626] hover:underline"
                      >
                        Desactivar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
