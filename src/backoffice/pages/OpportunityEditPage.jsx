import { useEffect, useState } from 'react'
import {
  createOpportunity,
  getManagers,
  getMasters,
  getOpportunity,
  updateOpportunity,
  uploadOpportunityImage,
} from '../api/index.js'
import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY = {
  title: '',
  slug: '',
  category: 'real-estate',
  categoryLabel: 'Real Estate',
  typeLabel: '',
  location: '',
  risk: 'Medio',
  termMonths: 24,
  tnaPercent: 10,
  fundedGoalUsd: 500000,
  minInvestmentUsd: 10000,
  maxInvestmentUsd: 100000,
  imageUrl: '',
  about: '',
  managerId: '',
  listingStatus: 'upcoming',
  publicationStatus: 'draft',
}

export default function OpportunityEditPage({ id, onBack }) {
  const { user } = useAuth()
  const canWrite = can(user, 'opportunities:write')
  const isNew = !id
  const [form, setForm] = useState(EMPTY)
  const [managers, setManagers] = useState([])
  const [categories, setCategories] = useState([])
  const [risks, setRisks] = useState([])
  const [listingStatuses, setListingStatuses] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getManagers({ active: 'true' }),
      getMasters({ type: 'category', active: 'true' }),
      getMasters({ type: 'risk', active: 'true' }),
      getMasters({ type: 'listing_status', active: 'true' }),
    ])
      .then(([mgr, cat, risk, listing]) => {
        setManagers(mgr.data)
        setCategories(cat.data)
        setRisks(risk.data)
        setListingStatuses(listing.data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!id) return
    getOpportunity(id)
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleCategory = (code) => {
    const cat = categories.find((c) => c.code === code)
    setForm((f) => ({ ...f, category: code, categoryLabel: cat?.label || code }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !canWrite) return
    setUploading(true)
    setError('')
    try {
      const res = await uploadOpportunityImage(file)
      set('imageUrl', res.data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!canWrite) return
    if (!form.imageUrl) {
      setError('Subí una imagen del proyecto')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        await createOpportunity(form)
      } else {
        await updateOpportunity(id, form)
      }
      onBack()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
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
          {isNew ? 'Nueva oportunidad' : canWrite ? 'Editar oportunidad' : 'Detalle de oportunidad'}
        </h2>

        <div>
          <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">
            Imagen del proyecto
          </label>
          {form.imageUrl ? (
            <div className="mb-3 relative w-full max-w-sm aspect-[4/5] rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]">
              <img
                src={form.imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-3 w-full max-w-sm aspect-[4/5] rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-center text-[13px] text-[#9CA3AF]">
              Sin imagen
            </div>
          )}
          {canWrite && (
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#374151] cursor-pointer hover:bg-[#F9FAFB]">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploading}
                onChange={handleImageChange}
              />
              {uploading ? 'Subiendo…' : form.imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
            </label>
          )}
          <p className="text-[12px] text-[#9CA3AF] mt-2">JPG, PNG, WebP o GIF · máx. 5 MB</p>
        </div>

        {[
          { key: 'title', label: 'Título' },
          { key: 'slug', label: 'Slug' },
          { key: 'typeLabel', label: 'Tipo (ej. Renta · 24 meses)' },
          { key: 'location', label: 'Ubicación' },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">{field.label}</label>
            <input
              value={form[field.key] || ''}
              onChange={(e) => set(field.key, e.target.value)}
              disabled={!canWrite}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => handleCategory(e.target.value)}
              disabled={!canWrite}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
            >
              {categories.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Gestor</label>
            <select
              value={form.managerId || ''}
              onChange={(e) => set('managerId', e.target.value)}
              disabled={!canWrite}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
            >
              <option value="">Seleccionar…</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'termMonths', label: 'Plazo (meses)', type: 'number' },
            { key: 'tnaPercent', label: 'TNA %', type: 'number', step: '0.1' },
            { key: 'fundedGoalUsd', label: 'Meta fondeo USD', type: 'number' },
            { key: 'minInvestmentUsd', label: 'Mín. inversión USD', type: 'number' },
            { key: 'maxInvestmentUsd', label: 'Máx. inversión USD', type: 'number' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">{field.label}</label>
              <input
                type={field.type}
                step={field.step}
                value={form[field.key] ?? ''}
                onChange={(e) => set(field.key, Number(e.target.value))}
                disabled={!canWrite}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Riesgo</label>
            <select
              value={form.risk}
              onChange={(e) => set('risk', e.target.value)}
              disabled={!canWrite}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
            >
              {risks.map((r) => (
                <option key={r.code} value={r.label}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Listado</label>
            <select
              value={form.listingStatus}
              onChange={(e) => set('listingStatus', e.target.value)}
              disabled={!canWrite}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
            >
              {listingStatuses.map((s) => (
                <option key={s.code} value={s.code}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Descripción</label>
          <textarea
            value={form.about || ''}
            onChange={(e) => set('about', e.target.value)}
            disabled={!canWrite}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] disabled:bg-[#F9FAFB]"
          />
        </div>

        {error && <p className="text-[14px] text-[#DC2626]">{error}</p>}

        {canWrite && (
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#111827] text-white font-semibold disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        )}
      </form>
    </div>
  )
}
