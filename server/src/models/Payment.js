import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Intentos de pago asociados a una inversión (flujo ARS/USD/crypto/tarjeta/transferencia).
 */
const paymentSchema = new Schema(
  {
    investmentId: { type: Schema.Types.ObjectId, ref: 'Investment', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    operationRef: { type: String, required: true },
    amountUsd: { type: Number, required: true },
    commissionUsd: { type: Number, default: 0 },
    totalUsd: { type: Number, required: true },
    totalArs: Number,
    currency: { type: String, enum: ['ars', 'usd'], default: 'usd' },
    method: {
      type: String,
      enum: ['ars', 'usd', 'crypto'],
      required: true,
    },
    subMethod: {
      type: String,
      enum: ['wallet', 'transfer', 'card'],
    },
    walletProvider: String,
    cryptoAsset: { type: String, enum: ['usdt', 'usdc'] },
    cryptoNetwork: { type: String, enum: ['ethereum', 'polygon', 'tron'] },
    cryptoPayAmount: Number,
    cryptoWalletAddress: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'expired'],
      default: 'pending',
    },
    failureReason: String,
    failureVariant: { type: String, enum: ['transfer', 'card', 'crypto-network'] },
    externalReference: String,
    paidAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true },
)

paymentSchema.index({ investmentId: 1 })
paymentSchema.index({ userId: 1, status: 1 })
paymentSchema.index({ operationRef: 1 })

export const Payment = mongoose.model('Payment', paymentSchema)
