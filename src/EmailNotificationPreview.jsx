import { MincaLogo } from './components/AppChrome'
import { useAppData } from './context/AppDataContext'

export default function EmailNotificationPreview({ notification, onBack, onViewReport }) {
  const { user } = useAppData()

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white">
        <header className="flex items-center px-5 pt-12 pb-4 border-b border-[#F0F0F0]">
          <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2" aria-label="Volver">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-[14px] text-[#888] ml-2">Vista previa del mail (ensayo)</span>
        </header>

        <div className="px-5 py-4 border-b border-[#F0F0F0] bg-[#FAFAFA]">
          <p className="text-[13px] font-semibold text-[#1A1A1A] mb-1">Nuevo informe disponible</p>
          <p className="text-[12px] text-[#888]">de: hola@minca.com</p>
        </div>

        <div className="px-5 py-8">
          <div className="mb-6">
            <MincaLogo />
          </div>
          <p className="text-[16px] text-[#1A1A1A] mb-4">
            Hola {user?.firstName}!
          </p>
          <p className="text-[15px] text-[#666] leading-relaxed mb-6">
            Tenemos novedades sobre tu inversión en{' '}
            <strong>{notification.title}</strong>. Ya podés consultar el nuevo informe de avance de obra.
          </p>
          <img
            src={notification.image}
            alt=""
            className="w-full h-40 rounded-xl object-cover mb-6"
          />
          <button
            type="button"
            onClick={() => onViewReport(notification.opportunityId)}
            className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
          >
            Ver informe
          </button>
          <p className="text-[12px] text-[#AAA] text-center mt-6 leading-relaxed">
            Este botón abriría la app directamente en el detalle de tu inversión.
          </p>
        </div>
      </div>
    </div>
  )
}
