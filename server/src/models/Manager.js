import mongoose from 'mongoose'

const { Schema } = mongoose

const otherProjectSchema = new Schema(
  {
    title: String,
    meta: String,
    status: String,
    statusType: { type: String, enum: ['active', 'closed'] },
    imageUrl: String,
  },
  { _id: false },
)

const platformStatsSchema = new Schema(
  {
    funded: Number,
    closedWithoutIssues: Number,
    paymentsOnTime: String,
    verifiedAt: String,
  },
  { _id: false },
)

/**
 * Gestores / desarrolladores de proyectos (CRUD desde backoffice).
 */
const managerSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    initials: { type: String, required: true },
    name: { type: String, required: true },
    subtitle: String,
    role: String,
    stats: String,
    foundedYear: Number,
    about: String,
    hasPlatformHistory: { type: Boolean, default: false },
    cuit: String,
    yearsOperating: Number,
    deliveredProjects: Number,
    documentationStatus: String,
    platformStats: platformStatsSchema,
    otherProjects: [otherProjectSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Manager = mongoose.model('Manager', managerSchema)
