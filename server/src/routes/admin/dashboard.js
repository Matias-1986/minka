import { Router } from 'express'
import { Opportunity } from '../../models/Opportunity.js'
import { Investment } from '../../models/Investment.js'
import { User } from '../../models/User.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'

const router = Router()

router.use(requireAdminAuth, requirePermission('dashboard:read'))

router.get('/stats', async (_req, res, next) => {
  try {
    const [
      opportunitiesTotal,
      opportunitiesPublished,
      opportunitiesDraft,
      investorsTotal,
      investmentsActive,
      volumeResult,
    ] = await Promise.all([
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ publicationStatus: 'published' }),
      Opportunity.countDocuments({ publicationStatus: 'draft' }),
      User.countDocuments({ roles: 'investor' }),
      Investment.countDocuments({ status: 'active' }),
      Investment.aggregate([
        { $match: { status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$investedUsd' } } },
      ]),
    ])

    res.json({
      data: {
        opportunitiesTotal,
        opportunitiesPublished,
        opportunitiesDraft,
        investorsTotal,
        investmentsActive,
        totalInvestedUsd: volumeResult[0]?.total || 0,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
