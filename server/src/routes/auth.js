import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { verifyPassword } from '../utils/password.js'
import { signAdminToken } from '../utils/jwt.js'

const router = Router()

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

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    if (!user.roles?.includes('investor')) {
      return res.status(403).json({ error: 'Esta cuenta no es de inversor' })
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Cuenta desactivada' })
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = signAdminToken(user)
    res.json({
      data: {
        token,
        user: serializeUser(user.toObject()),
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ data: serializeUser(req.user) })
})

export default router
