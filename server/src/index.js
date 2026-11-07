import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import opportunitiesRouter from './routes/opportunities.js'
import portfolioRouter from './routes/portfolio.js'
import investmentsRouter from './routes/investments.js'
import notificationsRouter from './routes/notifications.js'
import usersRouter from './routes/users.js'
import paymentMethodsRouter from './routes/paymentMethods.js'
import favoritesRouter from './routes/favorites.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin/index.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'minka-api', db: 'minka' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/opportunities', opportunitiesRouter)
app.use('/api/v1/portfolio', portfolioRouter)
app.use('/api/v1/investments', investmentsRouter)
app.use('/api/v1/notifications', notificationsRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/payment-methods', paymentMethodsRouter)
app.use('/api/v1/favorites', favoritesRouter)
app.use('/api/v1/admin', adminRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'La imagen no puede superar 5 MB' })
  }
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  })
})

await connectDb()

app.listen(env.port, () => {
  console.log(`MINKA API escuchando en http://localhost:${env.port}`)
})
