import { BottomNav, MincaLogo, ProfileAvatar } from './components/AppChrome'
import { useAppData } from './context/AppDataContext'
import { usePortfolio } from './hooks/usePortfolio'

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

function CategoryDot({ category }) {
  const color =
    category === 'agro' ? 'bg-[#F59E0B]' : category === 'energia' ? 'bg-[#3B82F6]' : 'bg-[#22C55E]'
  return <div className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
}

function InvestmentCard({ holding, opportunity, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect({ holding, opportunity })}
      className="w-full flex gap-3 p-4 rounded-2xl border border-[#EFEFEF] bg-white text-left hover:bg-[#FAFAFA] transition-colors"
    >
      <img
        src={opportunity.image}
        alt={opportunity.title}
        className="w-14 h-14 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryDot category={opportunity.category} />
          <p className="text-[11px] font-medium text-[#888] uppercase tracking-wide">
            {opportunity.categoryLabel}
          </p>
        </div>
        <p className="text-[16px] font-semibold text-[#1A1A1A] mb-2 truncate">{opportunity.title}</p>
        <p className="text-[14px] text-[#1A1A1A] mb-0.5">
          USD {formatUsd(holding.investedUsd)} <span className="text-[#888] font-normal">invertido</span>
        </p>
        <p className="text-[13px] text-[#888]">
          Retorno acumulado:{' '}
          <span className={holding.accumulatedReturnUsd > 0 ? 'text-[#16A34A] font-medium' : ''}>
            USD {formatUsd(holding.accumulatedReturnUsd)}
          </span>
        </p>
      </div>
      <svg className="w-5 h-5 text-[#CCC] shrink-0 self-center" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}

function OpportunityCarouselCard({ opportunity, onSelect }) {
  const { title, tna, image } = opportunity

  return (
    <button
      type="button"
      onClick={() => onSelect(opportunity)}
      className="relative w-[200px] h-[240px] rounded-[18px] overflow-hidden shrink-0 text-left"
    >
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm">
        <span className="text-white text-[11px] font-medium">{tna}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12 bg-gradient-to-t from-black/75 to-transparent">
        <p className="text-white text-[15px] font-semibold leading-tight">{title}</p>
      </div>
    </button>
  )
}

export default function PortfolioPage({
  onExplore,
  onSelectHolding,
  onSelectOpportunity,
  onOpenAccount,
  hasNotification,
}) {
  const { ready } = useAppData()
  const { summary, holdings: holdingsWithOpportunity, newOpportunities, loading, error } =
    usePortfolio({ enabled: ready })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center">
        <p className="text-[14px] text-[#888]">Cargando cartera…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center">
        <p className="text-[14px] text-[#DC2626]">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#FAFAFA] relative pb-28">
        <header className="flex items-center justify-between px-5 pt-12 pb-4">
          <MincaLogo />
          <ProfileAvatar onClick={onOpenAccount} hasNotification={hasNotification} />
        </header>

        <h1 className="px-5 text-[32px] font-bold text-[#1A1A1A] tracking-tight mb-5">
          Cartera total
        </h1>

        <div className="mx-5 mb-8 p-5 rounded-2xl bg-[#1A1A1A] text-white">
          <p className="text-[28px] font-bold mb-2">USD {formatUsd(summary?.totalUsd || 0)}</p>
          <p className="text-[14px] text-[#4ADE80] mb-5">
            Retorno acumulado: USD {formatUsd(summary?.accumulatedReturnUsd || 0)} (+{summary?.returnPercent || 0}%)
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
            <div>
              <p className="text-[18px] font-bold">{summary?.activeCount || 0}</p>
              <p className="text-[11px] text-white/60">Activas</p>
            </div>
            <div>
              <p className="text-[18px] font-bold">{summary?.avgTna || 0}%</p>
              <p className="text-[11px] text-white/60">TNA promedio</p>
            </div>
            <div>
              <p className="text-[18px] font-bold">{summary?.avgTermMonths || 0}</p>
              <p className="text-[11px] text-white/60">meses Plazo prom.</p>
            </div>
          </div>
        </div>

        <div className="px-5 mb-8">
          <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">Mis inversiones</h2>
          <div className="flex flex-col gap-3">
            {holdingsWithOpportunity.map(({ holding, opportunity }) => (
              <InvestmentCard
                key={holding.id}
                holding={holding}
                opportunity={opportunity}
                onSelect={onSelectHolding}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="px-5 flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">Nuevas oportunidades</h2>
            <button
              type="button"
              onClick={onExplore}
              className="text-[14px] font-medium text-[#888]"
            >
              Ver todas ›
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {newOpportunities.map((opp) => (
              <OpportunityCarouselCard
                key={opp.id}
                opportunity={opp}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </div>

        <BottomNav active="portfolio" onExplore={onExplore} onPortfolio={() => {}} />
      </div>
    </div>
  )
}
