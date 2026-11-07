import { useState } from 'react'
import { ProfileAvatar } from './components/AppChrome'
import ManagerProfileSheet from './ManagerProfileSheet'

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

function CategoryTag({ label, category }) {
  const styles =
    category === 'agro'
      ? 'bg-[#FEF3C7] text-[#B45309]'
      : category === 'energia'
        ? 'bg-[#DBEAFE] text-[#1D4ED8]'
        : 'bg-[#E6F7ED] text-[#1B7F3A]'

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles}`}>
      {label}
    </span>
  )
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5 text-[#CCC] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
      {children}
    </h2>
  )
}

const ABOUT_LINKS = [
  { id: 'manager', label: 'Quién gestiona' },
  { id: 'conditions', label: 'Condiciones de la inversión' },
  { id: 'risks', label: 'Riesgos a considerar' },
  { id: 'exit', label: 'Salida anticipada' },
]

export default function InvestmentDetailPage({
  holding,
  opportunity,
  onBack,
  onOpenAccount,
  hasNotification,
}) {
  const [showManager, setShowManager] = useState(false)

  if (!holding || !opportunity) return null

  const progress = (holding.monthsElapsed / holding.termMonths) * 100
  const hasReturns = holding.payouts?.length > 0

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#FAFAFA] pb-10">
        <header className="flex items-center justify-between px-5 pt-12 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-[12px] font-semibold tracking-[0.1em] text-[#888] uppercase">
            Mi inversión
          </span>
          <ProfileAvatar onClick={onOpenAccount} hasNotification={hasNotification} />
        </header>

        <div className="px-5 mb-5">
          <CategoryTag label={opportunity.categoryLabel} category={opportunity.category} />
          <h1 className="text-[28px] font-bold text-[#1A1A1A] mt-2 leading-tight">{opportunity.title}</h1>
        </div>

        <div className="mx-5 mb-5 p-5 rounded-2xl bg-[#1A1A1A] text-white">
          <div className="mb-4">
            <p className="text-[12px] text-white/60 mb-1">Capital invertido</p>
            <p className="text-[26px] font-bold">USD {formatUsd(holding.investedUsd)}</p>
          </div>
          <div className="mb-5">
            <p className="text-[12px] text-white/60 mb-1">Retorno acumulado</p>
            <p className="text-[18px] font-semibold text-[#4ADE80]">
              + USD {formatUsd(holding.accumulatedReturnUsd)}
              {holding.returnPercent > 0 && (
                <span className="text-[14px] font-medium text-[#4ADE80]/80 ml-1">
                  (+{holding.returnPercent}%)
                </span>
              )}
            </p>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-white/60 mb-2">
              <span>Tiempo transcurrido</span>
              <span className="text-white font-medium">
                {holding.monthsElapsed} / {holding.termMonths} meses
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4ADE80] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mx-5 mb-6 p-4 rounded-2xl bg-white border border-[#EFEFEF] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#888] mb-0.5">
              {hasReturns ? 'Próxima acreditación' : 'Próximo pago'}
            </p>
            <p className="text-[15px] font-semibold text-[#1A1A1A]">{holding.nextPayoutDate}</p>
          </div>
          <p className="text-[18px] font-bold text-[#1A1A1A]">
            + USD {formatUsd(holding.nextPayoutUsd)}
          </p>
        </div>

        <div className="px-5 mb-8">
          <SectionTitle>Retornos recibidos</SectionTitle>
          {hasReturns ? (
            <div className="rounded-2xl bg-white border border-[#EFEFEF] divide-y divide-[#F0F0F0]">
              {holding.payouts.map((payout) => (
                <div key={payout.date} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium text-[#1A1A1A]">{payout.date}</p>
                    <p className="text-[12px] text-[#16A34A] font-medium">{payout.status}</p>
                  </div>
                  <p className="text-[15px] font-semibold text-[#16A34A]">
                    + USD {formatUsd(payout.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#EFEFEF] px-4 py-8 text-center">
              <p className="text-[15px] font-medium text-[#1A1A1A] mb-2">
                Todavía no hay retornos acreditados
              </p>
              <p className="text-[13px] text-[#888] leading-relaxed max-w-[280px] mx-auto">
                El primer pago está programado para {holding.nextPayoutDate}. Te avisamos cuando se acredite en tu cuenta.
              </p>
            </div>
          )}
        </div>

        <div className="px-5 mb-8">
          <SectionTitle>Sobre el proyecto</SectionTitle>
          <div className="rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden">
            {ABOUT_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => link.id === 'manager' && setShowManager(true)}
                className="w-full flex items-center justify-between px-4 py-4 border-b border-[#F0F0F0] last:border-0 text-left hover:bg-[#FAFAFA]"
              >
                <span className="text-[15px] text-[#1A1A1A]">{link.label}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 space-y-4">
          <button
            type="button"
            className="w-full flex items-center gap-3 text-[14px] font-medium text-[#1A1A1A]"
          >
            <svg className="w-5 h-5 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Ver último informe del proyecto
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 text-[14px] font-medium text-[#1A1A1A]"
          >
            <svg className="w-5 h-5 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Descargar comprobante de inversión
          </button>
          <button
            type="button"
            className="w-full py-3.5 rounded-full bg-[#F0F0F0] text-[#888] text-[15px] font-semibold"
          >
            Solicitar salida anticipada
          </button>
        </div>

        {showManager && (
          <ManagerProfileSheet
            manager={opportunity.manager}
            onClose={() => setShowManager(false)}
          />
        )}
      </div>
    </div>
  )
}
