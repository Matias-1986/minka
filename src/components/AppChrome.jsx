export function MincaLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid grid-cols-3 gap-[3px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-[5px] h-[5px] rounded-[1px] bg-[#1A1A1A]" />
        ))}
      </div>
      <span className="text-[17px] font-bold tracking-tight text-[#1A1A1A]">MINCA</span>
    </div>
  )
}

export function ProfileAvatar({ onClick, hasNotification }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-9 h-9 rounded-full overflow-visible ring-2 ring-white shadow-sm shrink-0"
      aria-label="Mi cuenta"
    >
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
        alt="Perfil"
        className="w-full h-full rounded-full object-cover"
      />
      {hasNotification && (
        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#F97316] ring-2 ring-white" />
      )}
    </button>
  )
}

export function BottomNav({ active, onExplore, onPortfolio }) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[390px] z-20">
      <div className="flex items-center bg-[#1A1A1A] rounded-full p-1.5 shadow-xl shadow-black/20">
        <button
          type="button"
          onClick={onExplore}
          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 text-[14px] font-medium transition-colors ${
            active === 'explore'
              ? 'bg-white text-[#1A1A1A]'
              : 'text-white'
          }`}
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          Explorar
        </button>
        <button
          type="button"
          onClick={onPortfolio}
          className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 text-[14px] font-medium transition-colors ${
            active === 'portfolio'
              ? 'bg-white text-[#1A1A1A]'
              : 'text-white'
          }`}
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          Mi Cartera
        </button>
      </div>
    </nav>
  )
}
