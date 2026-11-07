import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    dni: user.dni,
    avatar: user.avatarUrl,
    verified: user.kycStatus === 'verified',
    roles: user.roles,
  }
}

router.get('/me', async (req, res) => {
  res.json({ data: serializeUser(req.user) })
})

router.patch('/me', async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'dni', 'avatarUrl']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).lean()

    res.json({ data: serializeUser(user) })
  } catch (err) {
    next(err)
  }
})

export default router
