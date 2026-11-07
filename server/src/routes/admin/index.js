import { Router } from 'express'
import authRouter from './auth.js'
import dashboardRouter from './dashboard.js'
import opportunitiesRouter from './opportunities.js'
import usersRouter from './users.js'
import investorsRouter from './investors.js'
import investmentsRouter from './investments.js'
import managersRouter from './managers.js'
import mastersRouter from './masters.js'
import uploadsRouter from './uploads.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/dashboard', dashboardRouter)
router.use('/opportunities', opportunitiesRouter)
router.use('/users', usersRouter)
router.use('/investors', investorsRouter)
router.use('/investments', investmentsRouter)
router.use('/managers', managersRouter)
router.use('/masters', mastersRouter)
router.use('/uploads', uploadsRouter)

export default router
