import mongoose from 'mongoose'
import { connectDb } from '../config/db.js'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { Manager } from '../models/Manager.js'
import { Opportunity } from '../models/Opportunity.js'
import { Investment } from '../models/Investment.js'
import { Notification } from '../models/Notification.js'
import { OpportunityReport } from '../models/OpportunityReport.js'
import { PaymentMethod } from '../models/PaymentMethod.js'
import { Master } from '../models/Master.js'
import { hashPassword } from '../utils/password.js'
import { MASTERS } from './masterSeedData.js'
import {
  ADMIN_USER,
  VIEWER_USER,
  DEMO_USER,
  MANAGERS,
  OPPORTUNITIES,
  HOLDINGS,
  NOTIFICATIONS,
  REPORTS,
} from './seedData.js'

async function clearCollections() {
  const collections = [
    'users',
    'managers',
    'opportunities',
    'investments',
    'payments',
    'paymentmethods',
    'notifications',
    'opportunityreports',
    'favorites',
    'masters',
  ]
  for (const name of collections) {
    try {
      await mongoose.connection.collection(name).deleteMany({})
    } catch {
      // collection may not exist yet
    }
  }
}

async function seed() {
  await connectDb()
  console.log('Limpiando colecciones...')
  await clearCollections()

  const user = await User.create({
    ...DEMO_USER,
    passwordHash: hashPassword(DEMO_USER.password),
    roles: ['investor'],
    kycStatus: 'verified',
  })
  console.log(`Usuario demo: ${user._id} (${user.email})`)

  const admin = await User.create({
    ...ADMIN_USER,
    passwordHash: hashPassword(ADMIN_USER.password),
    roles: ['admin'],
    kycStatus: 'verified',
  })
  const viewer = await User.create({
    ...VIEWER_USER,
    passwordHash: hashPassword(VIEWER_USER.password),
    roles: ['viewer'],
    kycStatus: 'verified',
  })
  console.log(`Admin backoffice: ${admin.email} / ${ADMIN_USER.password}`)
  console.log(`Viewer backoffice: ${viewer.email} / ${VIEWER_USER.password}`)

  const managerMap = new Map()
  for (const m of MANAGERS) {
    const doc = await Manager.create(m)
    managerMap.set(m.slug, doc._id)
  }
  console.log(`${managerMap.size} gestores creados`)

  for (const m of MASTERS) {
    await Master.create(m)
  }
  console.log(`${MASTERS.length} registros maestros`)

  const oppMap = new Map()
  for (const o of OPPORTUNITIES) {
    const { managerSlug, ...rest } = o
    const doc = await Opportunity.create({
      ...rest,
      managerId: managerMap.get(managerSlug),
      publicationStatus: 'published',
      publishedAt: new Date(),
      tnaLabel: `${rest.tnaPercent}% TNA est.`,
      termLabel: `${rest.termMonths} meses`,
    })
    oppMap.set(o.legacyId, doc._id)
  }
  console.log(`${oppMap.size} oportunidades creadas`)

  for (const h of HOLDINGS) {
    const oppId = oppMap.get(h.legacyOpportunityId)
    const opp = await Opportunity.findById(oppId)
    await Investment.create({
      userId: user._id,
      opportunityId: oppId,
      operationRef: h.operationRef,
      status: 'active',
      investedUsd: h.investedUsd,
      commissionUsd: h.investedUsd * 0.005,
      totalPaidUsd: h.investedUsd * 1.005,
      accumulatedReturnUsd: h.accumulatedReturnUsd,
      returnPercent: h.returnPercent,
      termMonths: opp.termMonths,
      monthsElapsed: h.monthsElapsed,
      nextPayoutDateLabel: h.nextPayoutDateLabel,
      nextPayoutUsd: h.nextPayoutUsd,
      payouts: h.payouts,
      activatedAt: new Date(),
    })
  }
  console.log(`${HOLDINGS.length} inversiones en cartera`)

  for (const n of NOTIFICATIONS) {
    const createdAt = new Date(Date.now() - (n.hoursAgo || 1) * 3600000)
    await Notification.create({
      userId: user._id,
      opportunityId: oppMap.get(n.legacyOpportunityId),
      type: n.type,
      title: n.title,
      subtitle: n.subtitle,
      description: n.description,
      body: n.body,
      read: n.read,
      showBanner: n.showBanner,
      imageUrl: n.imageUrl,
      createdAt,
      updatedAt: createdAt,
    })
  }
  console.log(`${NOTIFICATIONS.length} notificaciones`)

  for (const r of REPORTS) {
    await OpportunityReport.create({
      opportunityId: oppMap.get(r.legacyOpportunityId),
      label: r.label,
      badgeNew: r.isNew,
      publishedAt: new Date(),
    })
  }
  console.log(`${REPORTS.length} informes`)

  await PaymentMethod.create([
    {
      userId: user._id,
      type: 'card',
      label: 'Tarjeta Visa',
      detail: '**** 4832',
      isDefault: true,
      cardBrand: 'VISA',
      cardLast4: '4832',
    },
    {
      userId: user._id,
      type: 'crypto',
      label: 'Billetera USDT',
      detail: 'Polygon · 0x782c…7B3a',
      cryptoAsset: 'usdt',
      cryptoNetwork: 'Polygon',
      walletAddress: '0x782c820C80D352125a3b664B8e5f4a2C9d1E7B3a',
    },
  ])
  console.log('2 métodos de pago')

  console.log('\n--- Seed completado ---')
  console.log(`Agregá a server/.env:`)
  console.log(`DEMO_USER_ID=${user._id}`)
  console.log(`\nHeader para requests: X-User-Id: ${user._id}`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
