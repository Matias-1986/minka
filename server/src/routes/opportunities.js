import { Router } from 'express'
import { Opportunity } from '../models/Opportunity.js'
import { OpportunityReport } from '../models/OpportunityReport.js'
import { Favorite } from '../models/Favorite.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'
import {
  serializeOpportunityDetail,
  serializeOpportunityListItem,
} from '../serializers/opportunity.js'

const router = Router()

function buildListFilter(query) {
  const filter = { publicationStatus: 'published' }

  if (query.category && query.category !== 'todas') {
    const cat = query.category === 'industria' ? 'logistica' : query.category
    filter.category = cat
  }

  if (query.listingStatus) {
    filter.listingStatus = query.listingStatus
  } else if (query.tab === 'upcoming') {
    filter.listingStatus = 'upcoming'
  } else if (query.tab === 'open' || !query.tab) {
    filter.listingStatus = { $in: ['open', 'closed'] }
  }

  if (query.tab === 'favorites') {
    return { filter, favoritesOnly: true }
  }

  return { filter, favoritesOnly: false }
}

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { filter, favoritesOnly } = buildListFilter(req.query)

    let opportunityIds = null
    if (favoritesOnly) {
      if (!req.userId) {
        return res.json({ data: [], meta: { total: 0 } })
      }
      const favs = await Favorite.find({ userId: req.userId }).select('opportunityId').lean()
      opportunityIds = favs.map((f) => f.opportunityId)
      if (!opportunityIds.length) {
        return res.json({ data: [], meta: { total: 0 } })
      }
      filter._id = { $in: opportunityIds }
    }

    const opportunities = await Opportunity.find(filter)
      .populate('managerId')
      .sort({ featured: -1, createdAt: -1 })
      .lean()

    const favSet = req.userId
      ? new Set(
          (
            await Favorite.find({ userId: req.userId }).select('opportunityId').lean()
          ).map((f) => String(f.opportunityId)),
        )
      : new Set()

    const data = opportunities.map((o) =>
      serializeOpportunityListItem(
        { ...o, managerId: o.managerId },
        { isFavorite: favSet.has(String(o._id)) },
      ),
    )

    res.json({ data, meta: { total: data.length } })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const query = /^\d+$/.test(id) ? { legacyId: Number(id) } : { _id: id }

    const opportunity = await Opportunity.findOne({
      ...query,
      publicationStatus: 'published',
    }).populate('managerId')

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    const isFavorite = req.userId
      ? Boolean(
          await Favorite.findOne({ userId: req.userId, opportunityId: opportunity._id }),
        )
      : false

    res.json({ data: serializeOpportunityDetail(opportunity, { isFavorite }) })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/reports', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const query = /^\d+$/.test(id) ? { legacyId: Number(id) } : { _id: id }
    const opportunity = await Opportunity.findOne(query).select('_id legacyId')

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    const reports = await OpportunityReport.find({ opportunityId: opportunity._id })
      .sort({ publishedAt: -1 })
      .lean()

    res.json({
      data: reports.map((r) => ({
        id: r._id,
        label: r.label,
        isNew: r.badgeNew,
        fileUrl: r.fileUrl,
        publishedAt: r.publishedAt,
      })),
    })
  } catch (err) {
    next(err)
  }
})

export default router
