import mongoose from 'mongoose'

const { Schema } = mongoose

const payoutSchema = new Schema(
  {
    date: Date,
    dateLabel: String,
    amountUsd: Number,
    status: { type: String, enum: ['pending', 'credited', 'failed'], default: 'credited' },
    statusLabel: String,
  },
  { _id: false },
)

/**
 * Inversión de un usuario en un proyecto (holding en cartera).
 */
const investmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    operationRef: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending_payment', 'active', 'completed', 'cancelled', 'failed'],
      default: 'pending_payment',
    },
    investedUsd: { type: Number, required: true },
    commissionUsd: { type: Number, default: 0 },
    totalPaidUsd: { type: Number, default: 0 },
    accumulatedReturnUsd: { type: Number, default: 0 },
    returnPercent: { type: Number, default: 0 },
    termMonths: Number,
    monthsElapsed: { type: Number, default: 0 },
    nextPayoutDate: Date,
    nextPayoutDateLabel: String,
    nextPayoutUsd: Number,
    payouts: [payoutSchema],
    activatedAt: Date,
    completedAt: Date,
  },
  { timestamps: true },
)

investmentSchema.index({ userId: 1, status: 1 })
investmentSchema.index({ opportunityId: 1 })
investmentSchema.index({ userId: 1, opportunityId: 1 })

export const Investment = mongoose.model('Investment', investmentSchema)
