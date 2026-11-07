import crypto from 'crypto'

const KEYLEN = 64

/** Hash with per-password salt (scrypt). Format: `saltHex:hashHex`. */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) return false

  // Legacy seed hashes (SHA-256, no salt) — accepted until re-seed
  if (!passwordHash.includes(':')) {
    const legacy = crypto.createHash('sha256').update(password).digest('hex')
    return timingSafeEqualHex(legacy, passwordHash)
  }

  const [salt, stored] = passwordHash.split(':')
  if (!salt || !stored) return false

  const computed = crypto.scryptSync(password, salt, KEYLEN).toString('hex')
  return timingSafeEqualHex(computed, stored)
}

function timingSafeEqualHex(a, b) {
  try {
    const bufA = Buffer.from(a, 'hex')
    const bufB = Buffer.from(b, 'hex')
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}
