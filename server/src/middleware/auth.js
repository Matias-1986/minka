import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import { verifyAdminToken } from '../utils/jwt.js'

async function loadUserFromBearer(header) {
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = verifyAdminToken(header.slice(7))
    const user = await User.findById(payload.sub).lean()
    if (!user?.isActive) return null
    return user
  } catch {
    return null
  }
}

const allowDevIdentityHeaders = env.nodeEnv !== 'production'

/**
 * Autenticación de la app inversor.
 * - Preferido: `Authorization: Bearer <JWT>`
 * - Solo en desarrollo: header `X-User-Id` o `DEMO_USER_ID` del entorno
 */
export async function optionalAuth(req, res, next) {
  try {
    const bearerUser = await loadUserFromBearer(req.headers.authorization)
    if (bearerUser) {
      req.user = bearerUser
      req.userId = bearerUser._id
      return next()
    }

    if (allowDevIdentityHeaders) {
      const userId = req.headers['x-user-id']
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const user = await User.findById(userId).lean()
        if (user?.isActive) {
          req.user = user
          req.userId = user._id
        }
      }
    }

    next()
  } catch (err) {
    next(err)
  }
}

export async function requireAuth(req, res, next) {
  try {
    const bearerUser = await loadUserFromBearer(req.headers.authorization)
    if (bearerUser) {
      req.user = bearerUser
      req.userId = bearerUser._id
      return next()
    }

    let userId = null
    if (allowDevIdentityHeaders) {
      userId = req.headers['x-user-id'] || env.demoUserId
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        error: 'No autorizado',
        hint: 'Iniciá sesión o enviá un token válido',
      })
    }

    const user = await User.findById(userId).lean()
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' })
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || []
    if (!roles.some((r) => userRoles.includes(r))) {
      return res.status(403).json({ error: 'Sin permisos' })
    }
    next()
  }
}
