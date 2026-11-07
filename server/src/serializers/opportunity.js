function serializeManager(manager) {
  if (!manager) return null
  const m = manager.toObject ? manager.toObject() : manager
  return {
    initials: m.initials,
    name: m.name,
    subtitle: m.subtitle,
    role: m.role,
    stats: m.stats,
    foundedYear: m.foundedYear,
    hasPlatformHistory: m.hasPlatformHistory,
    about: m.about,
    cuit: m.cuit,
    yearsOperating: m.yearsOperating,
    deliveredProjects: m.deliveredProjects,
    documentationStatus: m.documentationStatus,
    platformStats: m.platformStats,
    otherProjects: (m.otherProjects || []).map((p) => ({
      title: p.title,
      meta: p.meta,
      status: p.status,
      statusType: p.statusType,
      image: p.imageUrl || p.image,
    })),
  }
}

export function serializeOpportunityListItem(opp, { isFavorite = false } = {}) {
  const o = opp.toObject ? opp.toObject() : opp
  const manager = o.managerId?.initials ? o.managerId : null

  return {
    id: o.legacyId ?? o._id,
    _id: o._id,
    slug: o.slug,
    title: o.title,
    category: o.category,
    categoryLabel: o.categoryLabel,
    tna: o.tnaLabel || `${o.tnaPercent}% TNA est.`,
    tnaValue: `${o.tnaPercent}%`,
    typeLabel: o.typeLabel,
    location: o.location,
    risk: o.risk,
    term: o.termLabel || `${o.termMonths} meses`,
    funded: o.fundedPercent,
    fundedCurrent: formatNumber(o.fundedCurrentUsd),
    fundedTotal: formatNumber(o.fundedGoalUsd),
    minInvestment: `USD ${formatNumber(o.minInvestmentUsd)}`,
    maxAmount: o.maxInvestmentUsd,
    image: o.imageUrl,
    listingStatus: o.listingStatus,
    isFavorite,
  }
}

export function serializeOpportunityDetail(opp, { isFavorite = false } = {}) {
  const base = serializeOpportunityListItem(opp, { isFavorite })
  const o = opp.toObject ? opp.toObject() : opp
  const managerDoc = o.managerId?.name ? o.managerId : null

  return {
    ...base,
    about: o.about,
    aboutExtended: o.aboutExtended,
    technicalDetails: o.technicalDetails || [],
    participants: o.participants || [],
    manager: serializeManager(managerDoc),
    documents: (o.documents || []).map((d) => ({
      title: d.title,
      meta: d.fileSizeBytes
        ? `Formato PDF (${(d.fileSizeBytes / 1_000_000).toFixed(1)} MB)`
        : 'Formato PDF',
      fileUrl: d.fileUrl,
    })),
  }
}

function formatNumber(n) {
  return Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })
}
