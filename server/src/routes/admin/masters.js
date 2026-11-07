import { Router } from 'express'
import { Master } from '../../models/Master.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { serializeMaster } from '../../serializers/master.js'

const router = Router()

const VALID_TYPES = ['category', 'risk', 'listing_status', 'publication_status']

router.use(requireAdminAuth)

router.get('/', requirePermission('masters:read'), async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    if (req.query.active === 'true') filter.isActive = true

    const items = await Master.find(filter).sort({ sortOrder: 1, label: 1 }).lean()
    res.json({ data: items.map(serializeMaster), meta: { total: items.length } })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requirePermission('masters:read'), async (req, res, next) => {
  try {
    const item = await Master.findById(req.params.id).lean()
    if (!item) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ data: serializeMaster(item) })
  } catch (err) {
    next(err)
  }
})

router.post('/', requirePermission('masters:write'), async (req, res, next) => {
  try {
    const { type, code, label, description, sortOrder, isActive, metadata } = req.body
    if (!type || !code || !label) {
      return res.status(400).json({ error: 'type, code y label son requeridos' })
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Tipo de maestro inválido' })
    }

    const item = await Master.create({
      type,
      code: String(code).trim().toLowerCase().replace(/\s+/g, '-'),
      label,
      description,
      sortOrder,
      isActive: isActive !== false,
      metadata,
    })

    res.status(201).json({ data: serializeMaster(item) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Ya existe un registro con ese código' })
    }
    next(err)
  }
})

router.patch('/:id', requirePermission('masters:write'), async (req, res, next) => {
  try {
    const allowed = ['code', 'label', 'description', 'sortOrder', 'isActive', 'metadata']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    if (updates.code) {
      updates.code = String(updates.code).trim().toLowerCase().replace(/\s+/g, '-')
    }

    const item = await Master.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean()

    if (!item) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ data: serializeMaster(item) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Ya existe un registro con ese código' })
    }
    next(err)
  }
})

router.delete('/:id', requirePermission('masters:write'), async (req, res, next) => {
  try {
    const item = await Master.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    )
    if (!item) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
