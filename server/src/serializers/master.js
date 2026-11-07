export function serializeMaster(doc) {
  const m = doc.toObject ? doc.toObject() : doc
  return {
    id: m._id,
    type: m.type,
    code: m.code,
    label: m.label,
    description: m.description,
    sortOrder: m.sortOrder,
    isActive: m.isActive,
    metadata: m.metadata || {},
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }
}

export function serializeManagerAdmin(doc) {
  const m = doc.toObject ? doc.toObject() : doc
  return {
    id: m._id,
    slug: m.slug,
    initials: m.initials,
    name: m.name,
    subtitle: m.subtitle,
    role: m.role,
    stats: m.stats,
    foundedYear: m.foundedYear,
    about: m.about,
    hasPlatformHistory: m.hasPlatformHistory,
    cuit: m.cuit,
    yearsOperating: m.yearsOperating,
    deliveredProjects: m.deliveredProjects,
    documentationStatus: m.documentationStatus,
    platformStats: m.platformStats,
    otherProjects: m.otherProjects || [],
    isActive: m.isActive,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }
}
