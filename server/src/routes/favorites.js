import { Router } from 'express'
import { Favorite } from '../models/Favorite.js'
import { Opportunity } from '../models/Opportunity.js'
import { requireAuth } from '../middleware/auth.js'
import { serializeOpportunityListItem } from '../serializers/opportunity.js'

const router = Router()

router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const favs = await Favorite.find({ userId: req.userId }).lean()
    const oppIds = favs.map((f) => f.opportunityId)
    const opportunities = await Opportunity.find({ _id: { $in: oppIds } }).populate('managerId')

    res.json({
      data: opportunities.map((o) => serializeOpportunityListItem(o, { isFavorite: true })),
    })
  } catch (err) {
    next(err)
  }
})

router.put('/:opportunityId', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    const query = /^\d+$/.test(opportunityId)
      ? { legacyId: Number(opportunityId) }
      : { _id: opportunityId }

    const opportunity = await Opportunity.findOne(query)
    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    await Favorite.findOneAndUpdate(
      { userId: req.userId, opportunityId: opportunity._id },
      { userId: req.userId, opportunityId: opportunity._id },
      { upsert: true, new: true },
    )

    res.json({ ok: true, opportunityId: opportunity.legacyId ?? opportunity._id })
  } catch (err) {
    next(err)
  }
})

router.delete('/:opportunityId', async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    const query = /^\d+$/.test(opportunityId)
      ? { legacyId: Number(opportunityId) }
      : { _id: opportunityId }

    const opportunity = await Opportunity.findOne(query)
    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no encontrada' })
    }

    await Favorite.deleteOne({ userId: req.userId, opportunityId: opportunity._id })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
