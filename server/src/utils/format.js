export function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

export function formatUsdLabel(value) {
  return `USD ${formatUsd(value)}`
}

export function parseUsdLabel(label) {
  const digits = String(label).replace(/[^\d]/g, '')
  return Number(digits) || 0
}

export function relativeTimeEs(date) {
  const diffMs = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`
  const weeks = Math.floor(days / 7)
  return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
}

export function generateOperationRef() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(now.getTime()).slice(-5)
  return `INV-${date}-${seq}`
}

export const COMMISSION_RATE = 0.005
