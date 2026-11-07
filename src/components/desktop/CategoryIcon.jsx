const ICONS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  building: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  cow: (
    <>
      <path d="M4 12c0-3 2-5 5-5h6c3 0 5 2 5 5v4H4v-4z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </>
  ),
  bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  warehouse: (
    <>
      <path d="M3 21h18M5 21V9l7-5 7 5v12" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
}

const CATEGORY_ICON = {
  'real-estate': 'building',
  agro: 'cow',
  energia: 'bolt',
  logistica: 'warehouse',
}

export default function CategoryIcon({ category, className = 'w-4 h-4' }) {
  const type = CATEGORY_ICON[category] || 'grid'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {ICONS[type]}
    </svg>
  )
}
