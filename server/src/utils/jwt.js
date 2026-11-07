import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const EXPIRES_IN = '8h'

export function signAdminToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      roles: user.roles,
    },
    env.jwtSecret,
    { expiresIn: EXPIRES_IN },
  )
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.jwtSecret)
}
