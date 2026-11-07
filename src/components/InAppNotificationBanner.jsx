export default function InAppNotificationBanner({ notification, onView, onDismiss }) {
  if (!notification) return null

  return (
    <div className="mx-5 mb-4 p-4 rounded-2xl bg-[#1A1A1A] text-white shadow-lg">
      <div className="flex gap-3">
        <img
          src={notification.image}
          alt=""
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold mb-0.5 leading-snug">
            {notification.description}
          </p>
          <p className="text-[12px] text-white/70 truncate">{notification.title}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-white/50 hover:text-white shrink-0 -mt-1 -mr-1 w-8 h-8 flex items-center justify-center"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        onClick={onView}
        className="mt-3 w-full py-2.5 rounded-full bg-white text-[#1A1A1A] text-[13px] font-semibold"
      >
        Ver informe
      </button>
    </div>
  )
}
