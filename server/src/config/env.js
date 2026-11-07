import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/minka',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  demoUserId: process.env.DEMO_USER_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'minka-dev-secret-change-in-production',
  apiPublicUrl: process.env.API_PUBLIC_URL || 'http://localhost:4000',
}
