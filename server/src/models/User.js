import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Usuarios de la plataforma (inversores hoy; admins vía roles para backoffice).
 */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    dni: { type: String, trim: true },
    avatarUrl: { type: String },
    roles: {
      type: [{ type: String, enum: ['investor', 'admin', 'viewer', 'operator'] }],
      default: ['investor'],
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified',
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

userSchema.index({ roles: 1 })
userSchema.index({ kycStatus: 1 })

export const User = mongoose.model('User', userSchema)
