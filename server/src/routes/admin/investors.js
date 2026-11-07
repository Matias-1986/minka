import { Router } from 'express'
import { User } from '../../models/User.js'
import { Investment } from '../../models/Investment.js'
import { PaymentMethod } from '../../models/PaymentMethod.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import {
  serializeAdminInvestor,
  serializeAdminInvestorDetail,
  serializeAdminInvestment,
} from '../../serializers/admin.js'
import { hashPassword } from '../../utils/password.js'

const router = Router()

router.use(requireAdminAuth)

async function investmentStatsByUser(userIds) {
  const rows = await Investment.aggregate([
    { $match: { userId: { $in: userIds } } },
    {
      $group: {
        _id: '$userId',
        totalInvestedUsd: { $sum: '$investedUsd' },
        accumulatedReturnUsd: { $sum: '$accumulatedReturnUsd' },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
        },
        investmentCount: { $sum: 1 },
      },
    },
  ])
  return new Map(rows.map((r) => [String(r._id), r]))
}

router.get('/', requirePermission('investors:read'), async (req, res, next) => {
  try {
    const filter = { roles: 'investor' }

    if (req.query.kycStatus) filter.kycStatus = req.query.kycStatus
    if (req.query.isActive === 'true') filter.isActive = true
    if (req.query.isActive === 'false') filter.isActive = false

    if (req.query.q) {
      const q = req.query.q.trim()
      filter.$or = [
        { email: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { dni: new RegExp(q, 'i') },
      ]
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).lean()
    const statsMap = await investmentStatsByUser(users.map((u) => u._id))

    res.json({
      data: users.map((u) =>
        serializeAdminInvestor(u, statsMap.get(String(u._id))),
      ),
      meta: { total: users.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requirePermission('investors:read'), async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      roles: 'investor',
    }).lean()

    if (!user) {
      return res.status(404).json({ error: 'Inversor no encontrado' })
    }

    const [investments, paymentMethodsCount, statsMap] = await Promise.all([
      Investment.find({ userId: user._id })
        .populate('opportunityId', 'title legacyId categoryLabel')
        .sort({ createdAt: -1 })
        .lean(),
      PaymentMethod.countDocuments({ userId: user._id, isActive: true }),
      investmentStatsByUser([user._id]),
    ])

    const stats = statsMap.get(String(user._id))

    res.json({
      data: serializeAdminInvestorDetail(user, stats, {
        investments: investments.map(serializeAdminInvestment),
        paymentMethodsCount,
      }),
    })
  } catch (err) {
    next(err)
  }
})

router.post('/', requirePermission('investors:write'), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, dni, kycStatus } = req.body
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Campos requeridos incompletos' })
    }

    const user = await User.create({
      email,
      passwordHash: hashPassword(password),
      firstName,
      lastName,
      phone,
      dni,
      roles: ['investor'],
      kycStatus: kycStatus || 'pending',
    })

    res.status(201).json({ data: serializeAdminInvestor(user.toObject()) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }
    next(err)
  }
})

router.patch('/:id', requirePermission('investors:write'), async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'dni', 'kycStatus', 'isActive']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    if (req.body.password) {
      updates.passwordHash = hashPassword(req.body.password)
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, roles: 'investor' },
      updates,
      { new: true, runValidators: true },
    ).lean()

    if (!user) {
      return res.status(404).json({ error: 'Inversor no encontrado' })
    }

    const statsMap = await investmentStatsByUser([user._id])
    res.json({
      data: serializeAdminInvestor(user, statsMap.get(String(user._id))),
    })
  } catch (err) {
    next(err)
  }
})

export default router
