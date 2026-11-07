export default function NotificationDetailPage({ notification, onBack, onViewReport, onViewEmail }) {
  const isReport = notification.description.toLowerCase().includes('informe')

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col">
        <header className="flex items-center px-5 pt-12 pb-4">
          <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2" aria-label="Volver">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </header>

        <div className="flex-1 px-5 pb-8">
          <div className="rounded-2xl overflow-hidden mb-6 h-52">
            <img
              src={notification.image}
              alt={notification.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-[12px] font-medium text-[#888] mb-2">{notification.time}</p>
          <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-4 leading-tight">
            {notification.description}
          </h1>
          <p className="text-[15px] text-[#666] leading-relaxed mb-8">{notification.body}</p>

          {isReport && onViewReport && (
            <button
              type="button"
              onClick={() => onViewReport(notification.opportunityId)}
              className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold mb-4"
            >
              Ver informe
            </button>
          )}

          {isReport && onViewEmail && (
            <button
              type="button"
              onClick={onViewEmail}
              className="w-full text-[13px] text-[#888] underline"
            >
              Ver cómo llega por mail (ensayo)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
