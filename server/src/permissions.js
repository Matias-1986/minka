/**
 * Permisos del backoffice por rol.
 * - admin: lectura y escritura
 * - viewer: solo lectura
 */
export const PERMISSIONS = {
  'dashboard:read': ['admin', 'viewer'],
  'opportunities:read': ['admin', 'viewer'],
  'opportunities:write': ['admin'],
  'users:read': ['admin', 'viewer'],
  'users:write': ['admin'],
  'investors:read': ['admin', 'viewer'],
  'investors:write': ['admin'],
  'investments:read': ['admin', 'viewer'],
  'managers:read': ['admin', 'viewer'],
  'managers:write': ['admin'],
  'masters:read': ['admin', 'viewer'],
  'masters:write': ['admin'],
  'reports:write': ['admin'],
}

export const BACKOFFICE_ROLES = ['admin', 'viewer']

export function hasPermission(user, permission) {
  const allowed = PERMISSIONS[permission]
  if (!allowed) return false
  const roles = user?.roles || []
  return allowed.some((r) => roles.includes(r))
}

export function isBackofficeUser(user) {
  return BACKOFFICE_ROLES.some((r) => user?.roles?.includes(r))
}
