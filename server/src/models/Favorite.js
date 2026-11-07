import mongoose from 'mongoose'

const { Schema } = mongoose

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  },
  { timestamps: true },
)

favoriteSchema.index({ userId: 1, opportunityId: 1 }, { unique: true })

export const Favorite = mongoose.model('Favorite', favoriteSchema)
