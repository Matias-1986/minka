import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Tablas maestras configurables desde backoffice.
 * type: category | risk | listing_status | publication_status
 */
const masterSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['category', 'risk', 'listing_status', 'publication_status'],
      required: true,
    },
    code: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    description: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: {
      icon: String,
      color: String,
    },
  },
  { timestamps: true },
)

masterSchema.index({ type: 1, code: 1 }, { unique: true })
masterSchema.index({ type: 1, isActive: 1, sortOrder: 1 })

export const Master = mongoose.model('Master', masterSchema)
