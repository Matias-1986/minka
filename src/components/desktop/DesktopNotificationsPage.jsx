import { useAppData } from '../../context/AppDataContext'

export default function DesktopNotificationsPage({ notifications, onBack, onSelectNotification }) {
  const { user } = useAppData()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-[720px] mx-auto px-8 py-10">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[14px] text-[#888] hover:text-[#1A1A1A] mb-6"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Volver
      </button>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A]">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-[14px] text-[#888] mt-1">{unreadCount} sin leer</p>
          )}
        </div>
        <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
      </div>

      <div className="rounded-2xl border border-[#EFEFEF] bg-white overflow-hidden divide-y divide-[#F0F0F0]">
        {notifications.map((notif) => (
          <button
            key={notif.id}
            type="button"
            onClick={() => onSelectNotification(notif)}
            className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#FAFAFA] transition-colors"
          >
            <img
              src={notif.image}
              alt=""
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] mb-0.5 ${notif.read ? 'text-[#666]' : 'text-[#1A1A1A] font-semibold'}`}>
                {notif.description}
              </p>
              <p className="text-[13px] text-[#888] truncate">{notif.title}</p>
              <p className="text-[12px] text-[#AAA] mt-1">{notif.time}</p>
            </div>
            {!notif.read && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
