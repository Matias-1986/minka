import { useAppData } from '../../context/AppDataContext'
import { usePortfolio } from '../../hooks/usePortfolio'
import DesktopFloatingBar from './DesktopFloatingBar'
import PortfolioEmptyIllustration from './PortfolioEmptyIllustration'

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

function SummaryCard({ label, value, accent, sub }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[#EFEFEF]">
      <p className="text-[13px] text-[#888] mb-2">{label}</p>
      <p className={`text-[28px] font-bold leading-none ${accent ? 'text-[#16A34A]' : 'text-[#1A1A1A]'}`}>
        {value}
      </p>
      {sub && <p className="text-[13px] text-[#AAA] mt-2">{sub}</p>}
    </div>
  )
}

function HoldingRow({ holding, opportunity, onSelect }) {
  const progress = Math.round((holding.monthsElapsed / holding.termMonths) * 100)

  return (
    <button
      type="button"
      onClick={() => onSelect({ holding, opportunity })}
      className="w-full grid grid-cols-[minmax(0,2fr)_1fr_1fr_120px_40px] gap-4 items-center p-4 rounded-2xl border border-[#EFEFEF] bg-white text-left hover:border-[#CCC] hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={opportunity.image}
          alt=""
          className="w-14 h-14 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#888] uppercase mb-0.5">
            {opportunity.categoryLabel}
          </p>
          <p className="text-[16px] font-semibold text-[#1A1A1A] truncate">{opportunity.title}</p>
        </div>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#1A1A1A]">USD {formatUsd(holding.investedUsd)}</p>
        <p className="text-[12px] text-[#888]">invertido</p>
      </div>
      <div>
        <p
          className={`text-[15px] font-semibold ${
            holding.accumulatedReturnUsd > 0 ? 'text-[#16A34A]' : 'text-[#1A1A1A]'
          }`}
        >
          {holding.accumulatedReturnUsd > 0 ? '+' : ''}USD {formatUsd(holding.accumulatedReturnUsd)}
        </p>
        <p className="text-[12px] text-[#888]">acumulado</p>
      </div>
      <div>
        <div className="flex items-center justify-between text-[12px] text-[#888] mb-1.5">
          <span>Plazo</span>
          <span className="text-[#1A1A1A] font-medium">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#EFEFEF] overflow-hidden">
          <div className="h-full rounded-full bg-[#4ADE80]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <svg
        className="w-5 h-5 text-[#CCC] group-hover:text-[#888] transition-colors justify-self-end"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}

function HoldingCardMobile({ holding, opportunity, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect({ holding, opportunity })}
      className="flex gap-4 p-5 rounded-[20px] border border-[#EFEFEF] bg-white text-left hover:shadow-md transition-shadow md:hidden"
    >
      <img src={opportunity.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-[#888] uppercase mb-1">{opportunity.categoryLabel}</p>
        <p className="text-[17px] font-semibold text-[#1A1A1A] mb-2">{opportunity.title}</p>
        <p className="text-[14px] text-[#1A1A1A]">
          USD {formatUsd(holding.investedUsd)} <span className="text-[#888]">invertido</span>
        </p>
        <p className="text-[13px] text-[#16A34A] mt-1">
          + USD {formatUsd(holding.accumulatedReturnUsd)} acumulado
        </p>
      </div>
    </button>
  )
}

function OpportunityCarouselCard({ opportunity, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(opportunity)}
      className="relative w-[220px] h-[260px] rounded-2xl overflow-hidden shrink-0 text-left group"
    >
      <img src={opportunity.image} alt={opportunity.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm">
        <span className="text-white text-[11px] font-medium">{opportunity.tna}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-[15px] font-semibold leading-tight">{opportunity.title}</p>
        <p className="text-white/70 text-[12px] mt-1">{opportunity.location}</p>
      </div>
    </button>
  )
}

export default function DesktopPortfolioPage({
  onSelectHolding,
  onSelectOpportunity,
  onExplore,
  onGoToPortfolio,
}) {
  const { ready } = useAppData()
  const { summary, holdings, newOpportunities, loading, error } = usePortfolio({ enabled: ready })

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-16 pb-24 text-center">
        <p className="text-[15px] text-[#888]">Cargando cartera…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-16 pb-24 text-center">
        <p className="text-[15px] text-[#DC2626]">{error}</p>
      </main>
    )
  }

  const portfolioValue = (summary?.totalUsd || 0) + (summary?.accumulatedReturnUsd || 0)
  const isEmpty = holdings.length === 0

  if (isEmpty) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-16 pb-24 text-center">
        <PortfolioEmptyIllustration />
        <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-3">Tu cartera está vacía</h1>
        <p className="text-[16px] text-[#666] max-w-md mx-auto mb-8 leading-relaxed">
          Explorá oportunidades de inversión en real estate, agro y energía para empezar a construir tu cartera.
        </p>
        <button
          type="button"
          onClick={onExplore}
          className="px-8 py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors"
        >
          Explorar oportunidades
        </button>
        <DesktopFloatingBar
          active="portfolio"
          onExplore={onExplore}
          onPortfolio={onGoToPortfolio || onExplore}
        />
      </main>
    )
  }

  return (
    <main className="max-w-[1200px] mx-auto px-8 py-8 pb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-[#1A1A1A] tracking-tight">Mi Cartera</h1>
          <p className="text-[15px] text-[#888] mt-1">Resumen de tus inversiones activas</p>
        </div>
        <p className="text-[13px] text-[#AAA] hidden md:block">Actualizado al 11 jun 2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Capital invertido" value={`USD ${formatUsd(summary?.totalUsd || 0)}`} />
        <SummaryCard
          label="Rendimientos totales"
          value={`+ USD ${formatUsd(summary?.accumulatedReturnUsd || 0)}`}
          accent
          sub={`+${summary?.returnPercent || 0}% sobre capital`}
        />
        <SummaryCard label="Valor de la cartera" value={`USD ${formatUsd(portfolioValue)}`} />
      </div>

      <div className="p-6 rounded-2xl bg-[#1A1A1A] text-white mb-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-[13px] text-white/60 mb-1">Cartera total</p>
          <p className="text-[36px] font-bold leading-none">USD {formatUsd(portfolioValue)}</p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-[22px] font-bold">{summary?.activeCount || 0}</p>
            <p className="text-[12px] text-white/60">Activas</p>
          </div>
          <div>
            <p className="text-[22px] font-bold">{summary?.avgTna || 0}%</p>
            <p className="text-[12px] text-white/60">TNA prom.</p>
          </div>
          <div>
            <p className="text-[22px] font-bold">{summary?.avgTermMonths || 0}</p>
            <p className="text-[12px] text-white/60">meses plazo</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">Mis inversiones</h2>

        <div className="hidden md:block space-y-3">
          <div className="grid grid-cols-[minmax(0,2fr)_1fr_1fr_120px_40px] gap-4 px-4 text-[11px] font-semibold tracking-[0.06em] text-[#AAA] uppercase">
            <span>Proyecto</span>
            <span>Invertido</span>
            <span>Retorno</span>
            <span>Avance</span>
            <span />
          </div>
          {holdings.map(({ holding, opportunity }) => (
            <HoldingRow
              key={holding.id}
              holding={holding}
              opportunity={opportunity}
              onSelect={onSelectHolding}
            />
          ))}
        </div>

        <div className="md:hidden space-y-3">
          {holdings.map(({ holding, opportunity }) => (
            <HoldingCardMobile
              key={holding.id}
              holding={holding}
              opportunity={opportunity}
              onSelect={onSelectHolding}
            />
          ))}
        </div>
      </div>

      {newOpportunities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">Nuevas oportunidades</h2>
            <button
              type="button"
              onClick={onExplore}
              className="text-[14px] font-medium text-[#666] hover:text-[#1A1A1A]"
            >
              Ver todas →
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {newOpportunities.map((opp) => (
              <OpportunityCarouselCard
                key={opp.id}
                opportunity={opp}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </section>
      )}

      <DesktopFloatingBar
        active="portfolio"
        onExplore={onExplore}
        onPortfolio={onGoToPortfolio || onExplore}
      />
    </main>
  )
}
