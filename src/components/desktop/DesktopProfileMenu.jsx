import { useEffect, useRef } from 'react'
import { useAppData } from '../../context/AppDataContext'

export default function DesktopProfileMenu({
  open,
  onClose,
  onOpenProfile,
  onOpenPayments,
  onOpenSecurity,
  onLogout,
}) {
  const { user } = useAppData()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  const items = [
    { id: 'profile', label: 'Mi perfil', icon: 'user', onClick: onOpenProfile },
    { id: 'payments', label: 'Métodos de pago', icon: 'card', onClick: onOpenPayments },
    { id: 'security', label: 'Seguridad', icon: 'lock', onClick: onOpenSecurity },
  ]

  const icons = {
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EFEFEF] py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-[#F0F0F0]">
        <p className="text-[15px] font-semibold text-[#1A1A1A]">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-[13px] text-[#888] truncate">{user?.email}</p>
      </div>

      <div className="py-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              item.onClick()
              onClose()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors"
          >
            <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {icons[item.icon]}
            </svg>
            <span className="text-[14px] text-[#1A1A1A]">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-[#F0F0F0] pt-1">
        <button
          type="button"
          onClick={() => {
            onLogout()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FEF2F2] transition-colors"
        >
          <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {icons.logout}
          </svg>
          <span className="text-[14px] text-[#DC2626] font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
