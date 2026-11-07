import { Router } from 'express'
import { Investment } from '../../models/Investment.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { serializeAdminInvestment } from '../../serializers/admin.js'

const router = Router()

router.use(requireAdminAuth, requirePermission('investments:read'))

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const investments = await Investment.find(filter)
      .populate('userId', 'email firstName lastName')
      .populate('opportunityId', 'title legacyId')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()

    res.json({
      data: investments.map(serializeAdminInvestment),
      meta: { total: investments.length },
    })
  } catch (err) {
    next(err)
  }
})

export default router
