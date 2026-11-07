export default function DesktopModal({ open, onClose, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#666]"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
