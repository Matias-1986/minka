import mongoose from 'mongoose'
import { env } from './env.js'
import '../models/User.js'
import '../models/Manager.js'
import '../models/Opportunity.js'
import '../models/OpportunityReport.js'
import '../models/Investment.js'
import '../models/Payment.js'
import '../models/PaymentMethod.js'
import '../models/Notification.js'
import '../models/Favorite.js'
import '../models/Master.js'

export async function connectDb() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongoUri)
  console.log(`MongoDB conectado: ${env.mongoUri}`)
}
