import { Router } from 'express'
import { User } from '../../models/User.js'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { serializeAdminUser } from '../../serializers/admin.js'
import { hashPassword } from '../../utils/password.js'

const router = Router()

router.use(requireAdminAuth)

router.get('/', requirePermission('users:read'), async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.scope === 'backoffice') {
      filter.roles = { $in: ['admin', 'viewer'] }
    } else if (req.query.role) {
      filter.roles = req.query.role
    }
    if (req.query.q) {
      const q = req.query.q.trim()
      filter.$or = [
        { email: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
      ]
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).lean()
    res.json({
      data: users.map(serializeAdminUser),
      meta: { total: users.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requirePermission('users:read'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean()
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ data: serializeAdminUser(user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requirePermission('users:write'), async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'dni', 'roles', 'kycStatus', 'isActive']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    if (req.body.password) {
      updates.passwordHash = hashPassword(req.body.password)
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean()

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ data: serializeAdminUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post('/', requirePermission('users:write'), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, roles, phone } = req.body
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Campos requeridos incompletos' })
    }

    const user = await User.create({
      email,
      passwordHash: hashPassword(password),
      firstName,
      lastName,
      phone,
      roles: roles?.length ? roles : ['viewer'],
    })

    res.status(201).json({ data: serializeAdminUser(user.toObject()) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }
    next(err)
  }
})

export default router
