import { User } from '../models/User.js'
import { hasPermission, isBackofficeUser } from '../permissions.js'
import { verifyAdminToken } from '../utils/jwt.js'

export async function requireAdminAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' })
    }

    const token = header.slice(7)
    const payload = verifyAdminToken(token)
    const user = await User.findById(payload.sub).lean()

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' })
    }

    if (!isBackofficeUser(user)) {
      return res.status(403).json({ error: 'Sin acceso al backoffice' })
    }

    req.user = user
    req.userId = user._id
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({
        error: 'Sin permisos para esta acción',
        permission,
      })
    }
    next()
  }
}
