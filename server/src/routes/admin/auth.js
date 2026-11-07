import { Router } from 'express'
import { User } from '../../models/User.js'
import { requireAdminAuth } from '../../middleware/adminAuth.js'
import { isBackofficeUser } from '../../permissions.js'
import { serializeAdminUser } from '../../serializers/admin.js'
import { verifyPassword } from '../../utils/password.js'
import { signAdminToken } from '../../utils/jwt.js'

const router = Router()

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

    if (!isBackofficeUser(user)) {
      return res.status(403).json({ error: 'Sin acceso al backoffice' })
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
        user: serializeAdminUser(user.toObject()),
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAdminAuth, (req, res) => {
  res.json({ data: serializeAdminUser(req.user) })
})

export default router
