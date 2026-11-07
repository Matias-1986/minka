import { Router } from 'express'
import { Manager } from '../../models/Manager.js'
import { Opportunity } from '../../models/Opportunity.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { serializeManagerAdmin } from '../../serializers/master.js'

const router = Router()

router.use(requireAdminAuth)

router.get('/', requirePermission('managers:read'), async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.active === 'true') filter.isActive = true
    if (req.query.q) {
      const q = req.query.q.trim()
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { slug: new RegExp(q, 'i') },
      ]
    }

    const managers = await Manager.find(filter).sort({ name: 1 }).lean()
    res.json({
      data: managers.map(serializeManagerAdmin),
      meta: { total: managers.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requirePermission('managers:read'), async (req, res, next) => {
  try {
    const manager = await Manager.findById(req.params.id).lean()
    if (!manager) return res.status(404).json({ error: 'Gestor no encontrado' })
    res.json({ data: serializeManagerAdmin(manager) })
  } catch (err) {
    next(err)
  }
})

router.post('/', requirePermission('managers:write'), async (req, res, next) => {
  try {
    const { slug, initials, name, subtitle, role, stats, foundedYear, about } = req.body
    if (!slug || !initials || !name) {
      return res.status(400).json({ error: 'slug, initials y name son requeridos' })
    }

    const manager = await Manager.create({
      slug: slug.trim().toLowerCase(),
      initials,
      name,
      subtitle,
      role,
      stats,
      foundedYear,
      about,
      hasPlatformHistory: Boolean(req.body.hasPlatformHistory),
      cuit: req.body.cuit,
      yearsOperating: req.body.yearsOperating,
      deliveredProjects: req.body.deliveredProjects,
      documentationStatus: req.body.documentationStatus,
    })

    res.status(201).json({ data: serializeManagerAdmin(manager) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El slug ya existe' })
    }
    next(err)
  }
})

router.patch('/:id', requirePermission('managers:write'), async (req, res, next) => {
  try {
    const allowed = [
      'slug', 'initials', 'name', 'subtitle', 'role', 'stats', 'foundedYear', 'about',
      'hasPlatformHistory', 'cuit', 'yearsOperating', 'deliveredProjects',
      'documentationStatus', 'platformStats', 'otherProjects', 'isActive',
    ]
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    const manager = await Manager.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean()

    if (!manager) return res.status(404).json({ error: 'Gestor no encontrado' })
    res.json({ data: serializeManagerAdmin(manager) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El slug ya existe' })
    }
    next(err)
  }
})

router.delete('/:id', requirePermission('managers:write'), async (req, res, next) => {
  try {
    const inUse = await Opportunity.countDocuments({ managerId: req.params.id })
    if (inUse > 0) {
      return res.status(400).json({
        error: `No se puede eliminar: ${inUse} oportunidad(es) usan este gestor`,
      })
    }

    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    )
    if (!manager) return res.status(404).json({ error: 'Gestor no encontrado' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
