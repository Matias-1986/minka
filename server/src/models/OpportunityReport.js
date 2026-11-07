import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Informes periódicos de avance por proyecto (notificaciones + detalle inversión).
 */
const opportunityReportSchema = new Schema(
  {
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    label: { type: String, required: true },
    periodStart: Date,
    periodEnd: Date,
    fileUrl: String,
    summary: String,
    badgeNew: { type: Boolean, default: false },
    publishedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

opportunityReportSchema.index({ opportunityId: 1, publishedAt: -1 })

export const OpportunityReport = mongoose.model('OpportunityReport', opportunityReportSchema)
