export default function BottomSheet({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-[24px] px-5 pt-6 pb-8 animate-slide-up">
        {children}
      </div>
    </div>
  )
}
