import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Métodos de pago guardados del usuario (tarjeta, crypto wallet, etc.).
 */
const paymentMethodSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['card', 'crypto', 'wallet', 'bank'],
      required: true,
    },
    label: { type: String, required: true },
    detail: String,
    isDefault: { type: Boolean, default: false },
    cardBrand: String,
    cardLast4: String,
    cardExpiry: String,
    cryptoAsset: { type: String, enum: ['usdt', 'usdc'] },
    cryptoNetwork: String,
    walletAddress: String,
    provider: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

paymentMethodSchema.index({ userId: 1, isActive: 1 })

export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema)
