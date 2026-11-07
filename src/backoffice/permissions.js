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
}

export function can(user, permission) {
  const allowed = PERMISSIONS[permission]
  if (!allowed) return false
  return (user?.roles || []).some((r) => allowed.includes(r))
}

export function isAdmin(user) {
  return user?.roles?.includes('admin')
}
