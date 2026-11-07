import { useMemo, useState } from 'react'

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'Sin leer' },
]

function ScreenHeader({ title, onBack }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-12 pb-4">
      <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2" aria-label="Volver">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="text-[22px] font-bold text-[#1A1A1A]">{title}</h1>
    </header>
  )
}

function NotificationRow({ notification, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={`w-full flex gap-3 p-4 text-left border-b border-[#F0F0F0] last:border-0 transition-colors ${
        !notification.read ? 'bg-[#FAFAFA]' : 'bg-white hover:bg-[#FAFAFA]'
      }`}
    >
      <img
        src={notification.image}
        alt=""
        className="w-14 h-14 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-[15px] font-semibold text-[#1A1A1A] truncate">{notification.subtitle}</p>
          <span className="text-[12px] text-[#AAA] shrink-0">{notification.time}</span>
        </div>
        <p className="text-[14px] text-[#666] leading-snug">{notification.description}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-2" />
      )}
    </button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6 text-3xl">
        🔔
      </div>
      <p className="text-[20px] font-bold text-[#1A1A1A] mb-2">¡Estás al día!</p>
      <p className="text-[15px] text-[#888] leading-relaxed max-w-[280px]">
        No tenés notificaciones nuevas por el momento. Te avisamos cuando haya novedades de tus inversiones.
      </p>
    </div>
  )
}

export default function NotificationsPage({ notifications, onBack, onSelect }) {
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const visible = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read)
    return notifications
  }, [notifications, filter])

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white">
        <ScreenHeader title="Notificaciones" onBack={onBack} />

        <div className="px-5 flex gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                filter === f.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F5F5] text-[#666]'
              }`}
            >
              {f.label}
              {f.id === 'all' && unreadCount > 0 && (
                <span className="ml-1.5 opacity-80">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="border-t border-[#F0F0F0]">
            {visible.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
