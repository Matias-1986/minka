export function serializeAdminInvestor(user, stats) {
  const base = serializeAdminUser(user)
  return {
    ...base,
    totalInvestedUsd: stats?.totalInvestedUsd || 0,
    accumulatedReturnUsd: stats?.accumulatedReturnUsd || 0,
    activeInvestments: stats?.activeCount || 0,
    investmentCount: stats?.investmentCount || 0,
  }
}

export function serializeAdminInvestorDetail(user, stats, extra = {}) {
  return {
    ...serializeAdminInvestor(user, stats),
    investments: extra.investments || [],
    paymentMethodsCount: extra.paymentMethodsCount || 0,
  }
}

export function serializeAdminUser(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    dni: user.dni,
    roles: user.roles,
    kycStatus: user.kycStatus,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  }
}

export function serializeAdminOpportunity(opp) {
  const o = opp.toObject ? opp.toObject() : opp
  const manager = o.managerId?.name ? o.managerId : null

  return {
    id: o._id,
    legacyId: o.legacyId,
    slug: o.slug,
    title: o.title,
    category: o.category,
    categoryLabel: o.categoryLabel,
    typeLabel: o.typeLabel,
    location: o.location,
    risk: o.risk,
    termMonths: o.termMonths,
    tnaPercent: o.tnaPercent,
    fundedPercent: o.fundedPercent,
    fundedCurrentUsd: o.fundedCurrentUsd,
    fundedGoalUsd: o.fundedGoalUsd,
    minInvestmentUsd: o.minInvestmentUsd,
    maxInvestmentUsd: o.maxInvestmentUsd,
    imageUrl: o.imageUrl,
    about: o.about,
    publicationStatus: o.publicationStatus,
    listingStatus: o.listingStatus,
    featured: o.featured,
    publishedAt: o.publishedAt,
    managerId: manager?._id || o.managerId,
    managerName: manager?.name,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }
}

export function serializeAdminInvestment(inv) {
  const i = inv.toObject ? inv.toObject() : inv
  const user = i.userId?.email ? i.userId : null
  const opp = i.opportunityId?.title ? i.opportunityId : null

  return {
    id: i._id,
    operationRef: i.operationRef,
    status: i.status,
    investedUsd: i.investedUsd,
    totalPaidUsd: i.totalPaidUsd,
    accumulatedReturnUsd: i.accumulatedReturnUsd,
    userId: user?._id || i.userId,
    userEmail: user?.email,
    userName: user ? `${user.firstName} ${user.lastName}` : undefined,
    opportunityId: opp?._id || i.opportunityId,
    opportunityTitle: opp?.title,
    createdAt: i.createdAt,
    activatedAt: i.activatedAt,
  }
}
