import { useEffect, useState } from 'react'
import { createManager, deleteManager, getManager, updateManager } from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY = {
  slug: '',
  initials: '',
  name: '',
  subtitle: '',
  role: '',
  stats: '',
  foundedYear: '',
  about: '',
  cuit: '',
  yearsOperating: '',
  deliveredProjects: '',
  documentationStatus: '',
  hasPlatformHistory: false,
}

export default function ManagerEditPage({ id, onBack }) {
  const { user } = useAuth()
  const canWrite = can(user, 'managers:write')
  const isNew = !id
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getManager(id)
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!canWrite) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
        yearsOperating: form.yearsOperating ? Number(form.yearsOperating) : undefined,
        deliveredProjects: form.deliveredProjects ? Number(form.deliveredProjects) : undefined,
      }
      if (isNew) await createManager(payload)
      else await updateManager(id, payload)
      onBack()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!confirm('¿Desactivar este gestor?')) return
    try {
      await deleteManager(id)
      onBack()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-[#6B7280]">Cargando…</p>

  return (
    <div className="max-w-3xl">
      <button type="button" onClick={onBack} className="text-[14px] text-[#6B7280] hover:text-[#111827] mb-6">
        ← Volver al listado
      </button>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-5">
        <h2 className="text-[20px] font-bold text-[#111827]">
          {isNew ? 'Nuevo gestor' : canWrite ? 'Editar gestor' : 'Detalle del gestor'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Nombre' },
            { key: 'initials', label: 'Iniciales (badge)' },
            { key: 'slug', label: 'Slug' },
            { key: 'subtitle', label: 'Subtítulo' },
            { key: 'role', label: 'Rol' },
            { key: 'stats', label: 'Estadísticas (texto)' },
            { key: 'cuit', label: 'CUIT' },
            { key: 'documentationStatus', label: 'Estado documentación' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">{field.label}</label>
              <input
                value={form[field.key] || ''}
                onChange={(e) => set(field.key, e.target.value)}
                disabled={!canWrite}
                required={['name', 'initials', 'slug'].includes(field.key)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'foundedYear', label: 'Año fundación' },
            { key: 'yearsOperating', label: 'Años operando' },
            { key: 'deliveredProjects', label: 'Proyectos entregados' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">{field.label}</label>
              <input
                type="number"
                value={form[field.key] || ''}
                onChange={(e) => set(field.key, e.target.value)}
                disabled={!canWrite}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Acerca de</label>
          <textarea
            value={form.about || ''}
            onChange={(e) => set('about', e.target.value)}
            disabled={!canWrite}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
          />
        </div>

        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.hasPlatformHistory}
            onChange={(e) => set('hasPlatformHistory', e.target.checked)}
            disabled={!canWrite}
          />
          Tiene historial en la plataforma
        </label>

        {error && <p className="text-[14px] text-[#DC2626]">{error}</p>}

        <div className="flex gap-3">
          {canWrite && (
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#111827] text-white font-semibold disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          )}
          {canWrite && !isNew && (
            <button
              type="button"
              onClick={handleDeactivate}
              className="px-6 py-3 rounded-xl border border-[#FCA5A5] text-[#DC2626] font-semibold"
            >
              Desactivar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
