import DesktopModal from './DesktopModal'

export default function DesktopParticipantsModal({ participants, open, onClose }) {
  return (
    <DesktopModal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="px-8 pt-8 pb-6 overflow-y-auto max-h-[70vh]">
        <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1 pr-8">Participantes del proyecto</h2>
        <p className="text-[14px] text-[#888] mb-6">
          Entidades e individuos involucrados en la estructura del proyecto.
        </p>

        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.name}
              className="flex items-center gap-4 p-4 rounded-2xl border border-[#EFEFEF] hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0 text-[#666] font-bold text-[13px]">
                {participant.initials || participant.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{participant.name}</p>
                <p className="text-[13px] text-[#888]">{participant.role}</p>
              </div>
              {participant.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B7F3A] bg-[#E6F7ED] px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                  Verificado
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-8 pb-8 pt-2 border-t border-[#F0F0F0]">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-full border-2 border-[#1A1A1A] text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors"
        >
          Cerrar
        </button>
      </div>
    </DesktopModal>
  )
}
