import { useState } from 'react'
import { useOpportunities } from '../../hooks/useOpportunities'
import CategoryIcon from './CategoryIcon'
import DesktopFloatingBar from './DesktopFloatingBar'
import DesktopOpportunityCard from './DesktopOpportunityCard'

const LIST_TABS = [
  { id: 'open', label: 'Abiertas' },
  { id: 'upcoming', label: 'Próximas' },
  { id: 'favorites', label: 'Favoritas' },
]

const CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'agro', label: 'Agro' },
  { id: 'energia', label: 'Energía' },
  { id: 'industria', label: 'Industria' },
  { id: 'empresas', label: 'Empresas' },
]

export default function DesktopExplorePage({
  favorites,
  onToggleFavorite,
  onSelectOpportunity,
  onGoToPortfolio,
}) {
  const [activeTab, setActiveTab] = useState('open')
  const [activeCategory, setActiveCategory] = useState('todas')
  const { opportunities, loading, error } = useOpportunities({
    tab: activeTab,
    category: activeCategory,
  })

  return (
    <>
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#EFEFEF]">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight mb-4">
            Oportunidades
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-[#F5F5F5] rounded-full p-1 shrink-0">
              {LIST_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#666] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#666] border border-[#E5E5E5] hover:border-[#CCC]'
                  }`}
                >
                  {cat.id !== 'todas' && (
                    <CategoryIcon
                      category={cat.id === 'industria' ? 'logistica' : cat.id}
                      className="w-3.5 h-3.5"
                    />
                  )}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-8 py-8 pb-32">
        {loading ? (
          <p className="text-center py-24 text-[15px] text-[#888]">Cargando oportunidades…</p>
        ) : error ? (
          <p className="text-center py-24 text-[15px] text-[#DC2626]">{error}</p>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[16px] font-medium text-[#1A1A1A] mb-2">
              {activeTab === 'favorites'
                ? 'Todavía no tenés favoritos'
                : activeTab === 'upcoming'
                  ? 'No hay oportunidades próximas'
                  : 'No hay oportunidades en esta categoría'}
            </p>
            <p className="text-[14px] text-[#888]">
              {activeTab === 'favorites'
                ? 'Tocá el corazón en una oportunidad para guardarla acá.'
                : 'Probá con otro filtro o categoría.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <DesktopOpportunityCard
                key={opp.id}
                opportunity={opp}
                isFavorite={favorites.has(opp.id)}
                onToggleFavorite={() => onToggleFavorite(opp.id)}
                onSelect={() => onSelectOpportunity(opp)}
              />
            ))}
          </div>
        )}
      </main>

      <DesktopFloatingBar
        active="explore"
        onExplore={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onPortfolio={onGoToPortfolio}
      />
    </>
  )
}
