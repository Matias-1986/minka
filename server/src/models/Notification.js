import mongoose from 'mongoose'

const { Schema } = mongoose

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['investment', 'return', 'report', 'system', 'payment'],
      default: 'system',
    },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity' },
    investmentId: { type: Schema.Types.ObjectId, ref: 'Investment' },
    title: String,
    subtitle: String,
    description: { type: String, required: true },
    body: String,
    imageUrl: String,
    read: { type: Boolean, default: false },
    readAt: Date,
    showBanner: { type: Boolean, default: false },
    actionUrl: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true },
)

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
