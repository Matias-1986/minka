export default function DesktopFloatingBar({ active, onExplore, onPortfolio }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center bg-[#1A1A1A] rounded-full shadow-xl shadow-black/25 p-1.5 gap-1">
        <button
          type="button"
          onClick={onExplore}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-semibold transition-colors ${
            active === 'explore'
              ? 'bg-white text-[#1A1A1A]'
              : 'text-white/80 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          Explorar
        </button>
        <button
          type="button"
          onClick={onPortfolio}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-semibold transition-colors ${
            active === 'portfolio'
              ? 'bg-white text-[#1A1A1A]'
              : 'text-white/80 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-7" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
          Mi Cartera
        </button>
      </div>
    </div>
  )
}
