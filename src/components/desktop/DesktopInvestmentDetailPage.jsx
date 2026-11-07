import { useState } from 'react'
import DesktopManagerModal from './DesktopManagerModal'

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

export default function DesktopInvestmentDetailPage({ holding, opportunity }) {
  const [showManager, setShowManager] = useState(false)

  if (!holding || !opportunity) return null

  const progress = (holding.monthsElapsed / holding.termMonths) * 100
  const hasReturns = holding.payouts?.length > 0

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-72px)]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-12 items-start">
          <main className="min-w-0">
            <CategoryTag label={opportunity.categoryLabel} category={opportunity.category} />
            <h1 className="text-[36px] font-bold text-[#1A1A1A] mt-3 mb-2 leading-tight">
              {opportunity.title}
            </h1>
            <p className="text-[15px] text-[#888] mb-8">{opportunity.location}</p>

            <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/7] bg-[#E8E8E8]">
              <img src={opportunity.image} alt={opportunity.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EFEFEF] flex items-center justify-between mb-8">
              <div>
                <p className="text-[13px] text-[#888] mb-0.5">
                  {hasReturns ? 'Próxima acreditación' : 'Próximo pago'}
                </p>
                <p className="text-[16px] font-semibold text-[#1A1A1A]">{holding.nextPayoutDate}</p>
              </div>
              <p className="text-[22px] font-bold text-[#16A34A]">
                + USD {formatUsd(holding.nextPayoutUsd)}
              </p>
            </div>

            <section className="mb-10">
              <SectionTitle>Retornos recibidos</SectionTitle>
              {hasReturns ? (
                <div className="rounded-2xl bg-white border border-[#EFEFEF] divide-y divide-[#F0F0F0]">
                  {holding.payouts.map((payout) => (
                    <div
                      key={payout.date}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div>
                        <p className="text-[15px] font-medium text-[#1A1A1A]">{payout.date}</p>
                        <p className="text-[12px] text-[#16A34A] font-medium">{payout.status}</p>
                      </div>
                      <p className="text-[16px] font-semibold text-[#16A34A]">
                        + USD {formatUsd(payout.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-[#EFEFEF] px-6 py-10 text-center">
                  <p className="text-[16px] font-medium text-[#1A1A1A] mb-2">
                    Todavía no hay retornos acreditados
                  </p>
                  <p className="text-[14px] text-[#888] leading-relaxed max-w-md mx-auto">
                    El primer pago está programado para {holding.nextPayoutDate}. Te avisamos cuando se acredite.
                  </p>
                </div>
              )}
            </section>

            <section className="mb-10">
              <SectionTitle>Sobre el proyecto</SectionTitle>
              <div className="rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden">
                {ABOUT_LINKS.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => link.id === 'manager' && setShowManager(true)}
                    className="w-full flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0] last:border-0 text-left hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span className="text-[15px] text-[#1A1A1A]">{link.label}</span>
                    <svg className="w-5 h-5 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5E5E5] text-[14px] font-medium text-[#1A1A1A] hover:bg-white transition-colors"
              >
                Ver último informe
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#E5E5E5] text-[14px] font-medium text-[#1A1A1A] hover:bg-white transition-colors"
              >
                Descargar comprobante
              </button>
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-[88px] space-y-4">
              <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white shadow-xl shadow-black/15">
                <p className="text-[12px] text-white/60 mb-1">Capital invertido</p>
                <p className="text-[32px] font-bold mb-5">USD {formatUsd(holding.investedUsd)}</p>

                <p className="text-[12px] text-white/60 mb-1">Retorno acumulado</p>
                <p className="text-[20px] font-semibold text-[#4ADE80] mb-6">
                  + USD {formatUsd(holding.accumulatedReturnUsd)}
                  {holding.returnPercent > 0 && (
                    <span className="text-[14px] text-[#4ADE80]/80 ml-1">
                      (+{holding.returnPercent}%)
                    </span>
                  )}
                </p>

                <div className="mb-6">
                  <div className="flex justify-between text-[12px] text-white/60 mb-2">
                    <span>Tiempo transcurrido</span>
                    <span className="text-white font-medium">
                      {holding.monthsElapsed} / {holding.termMonths} meses
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4ADE80]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-white/50">TNA estimada</span>
                    <span className="text-white/90">{opportunity.tnaValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Operación</span>
                    <span className="text-white/90 font-mono text-[11px]">{holding.operationRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Estado</span>
                    <span className="text-[#4ADE80] font-medium capitalize">{holding.status}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-full bg-white border-2 border-[#E5E5E5] text-[#888] text-[15px] font-semibold hover:bg-[#FAFAFA] transition-colors"
              >
                Solicitar salida anticipada
              </button>
            </div>
          </aside>
        </div>
      </div>

      <DesktopManagerModal
        manager={opportunity.manager}
        open={showManager}
        onClose={() => setShowManager(false)}
      />
    </div>
  )
}
