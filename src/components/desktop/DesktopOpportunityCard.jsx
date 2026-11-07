import CategoryIcon from './CategoryIcon'

export default function DesktopOpportunityCard({
  opportunity,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) {
  const {
    title,
    categoryLabel,
    tnaValue,
    category,
    image,
    funded,
    minInvestment,
  } = opportunity

  return (
    <article
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm">
        <span className="text-white text-[12px] font-semibold">{tnaValue}</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Agregar a favoritos"
      >
        <svg
          className="w-[17px] h-[17px]"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'white' : 'none'}
          stroke="white"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-1.5 mb-1 text-white/85">
          <CategoryIcon category={category} className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wide">{categoryLabel}</span>
        </div>
        <h2 className="text-white text-[18px] font-semibold leading-tight mb-3">{title}</h2>

        <div className="h-1 rounded-full bg-white/25 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-white/90 transition-all"
            style={{ width: `${funded}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white/80 font-medium">{funded}% fondeado</span>
          <span className="text-white/90 font-semibold">Desde {minInvestment}</span>
        </div>
      </div>
    </article>
  )
}
