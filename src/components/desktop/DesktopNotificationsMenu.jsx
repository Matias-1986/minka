import { useEffect, useRef } from 'react'
import { useAppData } from '../../context/AppDataContext'

function NotificationIcon({ type }) {
  const cls = 'w-9 h-9 rounded-full flex items-center justify-center shrink-0'
  if (type === 'return') {
    return (
      <div className={`${cls} bg-[#E6F7ED] text-[#16A34A]`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    )
  }
  return (
    <div className={`${cls} bg-[#E8F0FE] text-[#3B82F6]`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    </div>
  )
}

export default function DesktopNotificationsMenu({
  open,
  onClose,
  notifications,
  onViewAll,
  onOpenAccount,
}) {
  const { user } = useAppData()
  const ref = useRef(null)
  const unread = notifications.filter((n) => !n.read)
  const preview = notifications.slice(0, 3)
  const isEmpty = unread.length === 0

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

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EFEFEF] z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase">
          Notificaciones
        </p>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              onViewAll()
              onClose()
            }}
            className="text-[13px] font-medium text-[#1A1A1A] hover:underline"
          >
            Ver todas
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="px-6 py-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-[#1A1A1A] mb-2">¡Estás al día!</p>
          <p className="text-[13px] text-[#888] leading-relaxed">
            No tenés notificaciones pendientes por el momento.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F5F5F5] max-h-[280px] overflow-y-auto">
          {preview.map((notif) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => {
                onViewAll()
                onClose()
              }}
              className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-[#FAFAFA] transition-colors"
            >
              <NotificationIcon type={notif.description?.includes('retorno') ? 'return' : 'report'} />
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] leading-snug ${notif.read ? 'text-[#666]' : 'text-[#1A1A1A] font-medium'}`}>
                  {notif.description}
                </p>
                <p className="text-[12px] text-[#AAA] mt-0.5">{notif.time}</p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-2" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-[#F0F0F0] px-4 py-3 flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center gap-3 min-w-0">
          <img src={user?.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onOpenAccount()
            onClose()
          }}
          className="text-[13px] font-medium text-[#666] hover:text-[#1A1A1A] shrink-0"
        >
          Mi cuenta
        </button>
      </div>
    </div>
  )
}
