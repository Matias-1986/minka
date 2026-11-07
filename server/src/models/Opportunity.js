import mongoose from 'mongoose'

const { Schema } = mongoose

const technicalDetailSchema = new Schema(
  { label: String, value: String },
  { _id: false },
)

const participantSchema = new Schema(
  {
    name: String,
    role: String,
    verified: Boolean,
    initials: String,
  },
  { _id: false },
)

const documentSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: String,
    fileSizeBytes: Number,
    mimeType: { type: String, default: 'application/pdf' },
    sortOrder: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
)

/**
 * Oportunidades de inversión (proyectos).
 * publicationStatus: flujo backoffice (borrador → publicado).
 * listingStatus: visibilidad para inversores (abiertas / próximas / cerradas).
 */
const opportunitySchema = new Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true },
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['real-estate', 'agro', 'energia', 'logistica', 'empresas'],
      required: true,
    },
    categoryLabel: { type: String, required: true },
    typeLabel: String,
    location: String,
    risk: { type: String, enum: ['Bajo', 'Medio', 'Alto'], default: 'Medio' },
    termMonths: { type: Number, required: true },
    termLabel: String,
    tnaPercent: { type: Number, required: true },
    tnaLabel: String,
    fundedPercent: { type: Number, default: 0 },
    fundedCurrentUsd: { type: Number, default: 0 },
    fundedGoalUsd: { type: Number, required: true },
    minInvestmentUsd: { type: Number, required: true },
    maxInvestmentUsd: { type: Number, default: 100000 },
    imageUrl: String,
    about: String,
    aboutExtended: String,
    technicalDetails: [technicalDetailSchema],
    participants: [participantSchema],
    managerId: { type: Schema.Types.ObjectId, ref: 'Manager', required: true },
    documents: [documentSchema],
    publicationStatus: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    listingStatus: {
      type: String,
      enum: ['open', 'upcoming', 'closed'],
      default: 'open',
    },
    publishedAt: Date,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

opportunitySchema.index({ category: 1, listingStatus: 1, publicationStatus: 1 })
opportunitySchema.index({ publicationStatus: 1, listingStatus: 1 })

export const Opportunity = mongoose.model('Opportunity', opportunitySchema)
