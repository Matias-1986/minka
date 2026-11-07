import { Router } from 'express'
import { Investment } from '../models/Investment.js'
import { Opportunity } from '../models/Opportunity.js'
import { requireAuth } from '../middleware/auth.js'
import { serializeHolding, serializePortfolioSummary } from '../serializers/portfolio.js'
import { serializeOpportunityDetail } from '../serializers/opportunity.js'

const router = Router()

router.use(requireAuth)

async function loadHoldings(userId) {
  const investments = await Investment.find({
    userId,
    status: { $in: ['active', 'completed'] },
  }).sort({ createdAt: -1 })

  const oppIds = investments.map((i) => i.opportunityId)
  const opportunities = await Opportunity.find({ _id: { $in: oppIds } }).populate('managerId')
  const oppMap = new Map(opportunities.map((o) => [String(o._id), o]))

  return investments.map((inv) => {
    const opp = oppMap.get(String(inv.opportunityId))
    const holding = serializeHolding(inv, opp)
    if (opp) holding.opportunity = { ...holding.opportunity, tnaPercent: opp.tnaPercent }
    return holding
  })
}

router.get('/summary', async (req, res, next) => {
  try {
    const holdings = await loadHoldings(req.userId)
    res.json({ data: serializePortfolioSummary(holdings) })
  } catch (err) {
    next(err)
  }
})

router.get('/holdings', async (req, res, next) => {
  try {
    const holdings = await loadHoldings(req.userId)
    res.json({ data: holdings })
  } catch (err) {
    next(err)
  }
})

router.get('/holdings/:id', async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!investment) {
      return res.status(404).json({ error: 'Inversión no encontrada' })
    }

    const opportunity = await Opportunity.findById(investment.opportunityId).populate('managerId')
    res.json({
      data: {
        holding: serializeHolding(investment, opportunity),
        opportunity: opportunity ? serializeOpportunityDetail(opportunity) : null,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
