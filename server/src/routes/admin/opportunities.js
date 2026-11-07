import { Router } from 'express'
import { Opportunity } from '../../models/Opportunity.js'
import { Manager } from '../../models/Manager.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { serializeAdminOpportunity } from '../../serializers/admin.js'

const router = Router()

router.use(requireAdminAuth)

router.get('/', requirePermission('opportunities:read'), async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.publicationStatus) filter.publicationStatus = req.query.publicationStatus
    if (req.query.listingStatus) filter.listingStatus = req.query.listingStatus
    if (req.query.category) filter.category = req.query.category

    const opportunities = await Opportunity.find(filter)
      .populate('managerId')
      .sort({ updatedAt: -1 })
      .lean()

    res.json({
      data: opportunities.map((o) => serializeAdminOpportunity(o)),
      meta: { total: opportunities.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requirePermission('opportunities:read'), async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('managerId')
    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }
    res.json({ data: serializeAdminOpportunity(opportunity) })
  } catch (err) {
    next(err)
  }
})

router.post('/', requirePermission('opportunities:write'), async (req, res, next) => {
  try {
    const body = req.body
    const manager = await Manager.findById(body.managerId)
    if (!manager) {
      return res.status(400).json({ error: 'Gestor no válido' })
    }

    const lastLegacy = await Opportunity.findOne({ legacyId: { $exists: true } })
      .sort({ legacyId: -1 })
      .select('legacyId')
    const legacyId = (lastLegacy?.legacyId || 0) + 1

    const opportunity = await Opportunity.create({
      legacyId,
      slug: body.slug || `proyecto-${legacyId}`,
      title: body.title,
      category: body.category,
      categoryLabel: body.categoryLabel,
      typeLabel: body.typeLabel,
      location: body.location,
      risk: body.risk || 'Medio',
      termMonths: body.termMonths,
      termLabel: `${body.termMonths} meses`,
      tnaPercent: body.tnaPercent,
      tnaLabel: `${body.tnaPercent}% TNA est.`,
      fundedPercent: body.fundedPercent ?? 0,
      fundedCurrentUsd: body.fundedCurrentUsd ?? 0,
      fundedGoalUsd: body.fundedGoalUsd,
      minInvestmentUsd: body.minInvestmentUsd,
      maxInvestmentUsd: body.maxInvestmentUsd ?? 100000,
      imageUrl: body.imageUrl,
      about: body.about,
      managerId: body.managerId,
      publicationStatus: 'draft',
      listingStatus: body.listingStatus || 'upcoming',
    })

    await opportunity.populate('managerId')
    res.status(201).json({ data: serializeAdminOpportunity(opportunity) })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requirePermission('opportunities:write'), async (req, res, next) => {
  try {
    const allowed = [
      'title',
      'slug',
      'category',
      'categoryLabel',
      'typeLabel',
      'location',
      'risk',
      'termMonths',
      'tnaPercent',
      'fundedPercent',
      'fundedCurrentUsd',
      'fundedGoalUsd',
      'minInvestmentUsd',
      'maxInvestmentUsd',
      'imageUrl',
      'about',
      'managerId',
      'publicationStatus',
      'listingStatus',
      'featured',
    ]

    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    if (updates.termMonths) updates.termLabel = `${updates.termMonths} meses`
    if (updates.tnaPercent) updates.tnaLabel = `${updates.tnaPercent}% TNA est.`
    if (updates.publicationStatus === 'published') {
      updates.publishedAt = new Date()
    }

    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('managerId')

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    res.json({ data: serializeAdminOpportunity(opportunity) })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/publish', requirePermission('opportunities:write'), async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      {
        publicationStatus: 'published',
        publishedAt: new Date(),
        listingStatus: req.body.listingStatus || 'open',
      },
      { new: true, runValidators: true },
    ).populate('managerId')

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    res.json({ data: serializeAdminOpportunity(opportunity) })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requirePermission('opportunities:write'), async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { publicationStatus: 'archived' },
      { new: true },
    )

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
