import { Router } from 'express'
import { Investment } from '../models/Investment.js'
import { Payment } from '../models/Payment.js'
import { Opportunity } from '../models/Opportunity.js'
import { requireAuth } from '../middleware/auth.js'
import {
  COMMISSION_RATE,
  generateOperationRef,
} from '../utils/format.js'

const router = Router()

router.use(requireAuth)

const ARS_RATE = 1500

router.post('/', async (req, res, next) => {
  try {
    const { opportunityId, amountUsd } = req.body

    if (!opportunityId || !amountUsd || amountUsd <= 0) {
      return res.status(400).json({ error: 'opportunityId y amountUsd son requeridos' })
    }

    const oppQuery = /^\d+$/.test(String(opportunityId))
      ? { legacyId: Number(opportunityId) }
      : { _id: opportunityId }

    const opportunity = await Opportunity.findOne({
      ...oppQuery,
      publicationStatus: 'published',
      listingStatus: 'open',
    })

    if (!opportunity) {
      return res.status(404).json({ error: 'Oportunidad no disponible para inversión' })
    }

    if (amountUsd < opportunity.minInvestmentUsd) {
      return res.status(400).json({
        error: `El monto mínimo es USD ${opportunity.minInvestmentUsd}`,
      })
    }

    if (amountUsd > opportunity.maxInvestmentUsd) {
      return res.status(400).json({
        error: `El monto máximo es USD ${opportunity.maxInvestmentUsd}`,
      })
    }

    const commissionUsd = amountUsd * COMMISSION_RATE
    const totalUsd = amountUsd + commissionUsd
    const operationRef = generateOperationRef()

    const investment = await Investment.create({
      userId: req.userId,
      opportunityId: opportunity._id,
      operationRef,
      status: 'pending_payment',
      investedUsd: amountUsd,
      commissionUsd,
      totalPaidUsd: totalUsd,
      termMonths: opportunity.termMonths,
    })

    res.status(201).json({
      data: {
        investmentId: investment._id,
        operationRef,
        amountUsd,
        commissionUsd,
        totalUsd,
        totalArs: totalUsd * ARS_RATE,
        opportunityId: opportunity.legacyId ?? opportunity._id,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/payments', async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!investment) {
      return res.status(404).json({ error: 'Inversión no encontrada' })
    }

    const {
      method,
      subMethod,
      walletProvider,
      cryptoAsset,
      cryptoNetwork,
    } = req.body

    if (!['ars', 'usd', 'crypto'].includes(method)) {
      return res.status(400).json({ error: 'Método de pago inválido' })
    }

    const totalArs = investment.totalPaidUsd * ARS_RATE
    const cryptoPayAmount = method === 'crypto' ? investment.investedUsd * 1.00111 : undefined

    const payment = await Payment.create({
      investmentId: investment._id,
      userId: req.userId,
      operationRef: investment.operationRef,
      amountUsd: investment.investedUsd,
      commissionUsd: investment.commissionUsd,
      totalUsd: investment.totalPaidUsd,
      totalArs,
      currency: method === 'ars' ? 'ars' : 'usd',
      method,
      subMethod,
      walletProvider,
      cryptoAsset,
      cryptoNetwork,
      cryptoPayAmount,
      cryptoWalletAddress:
        method === 'crypto' ? '0x782c820C80D352125a3b664B8e5f4a2C9d1E7B3a' : undefined,
      status: 'pending',
    })

    const isPending = subMethod === 'transfer' || method === 'crypto'

    res.status(201).json({
      data: {
        paymentId: payment._id,
        operationRef: payment.operationRef,
        status: payment.status,
        isPendingPayment: isPending,
        cryptoPayAmount,
        cryptoWalletAddress: payment.cryptoWalletAddress,
        transfer: subMethod === 'transfer'
          ? {
              cbu: '000009943000009876543',
              alias: method === 'usd' ? 'MINCA.USD' : 'MINCA.INVERSION',
              holder: 'MINCA S.A.',
            }
          : undefined,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/payments/:paymentId/confirm', async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!investment) {
      return res.status(404).json({ error: 'Inversión no encontrada' })
    }

    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      investmentId: investment._id,
    })

    if (!payment) {
      return res.status(404).json({ error: 'Pago no encontrado' })
    }

    const { simulateFailure, failureVariant } = req.body

    if (simulateFailure) {
      payment.status = 'failed'
      payment.failureVariant = failureVariant || 'transfer'
      payment.failureReason = 'Simulación de error (ensayo)'
      await payment.save()
      investment.status = 'failed'
      await investment.save()
      return res.json({ data: { status: 'failed', failureVariant: payment.failureVariant } })
    }

    const isPending = payment.subMethod === 'transfer' || payment.method === 'crypto'

    if (isPending) {
      payment.status = 'processing'
      await payment.save()
      return res.json({
        data: {
          status: 'waiting',
          operationRef: investment.operationRef,
          paymentId: payment._id,
        },
      })
    }

    payment.status = 'completed'
    payment.paidAt = new Date()
    await payment.save()

    investment.status = 'active'
    investment.activatedAt = new Date()
    await investment.save()

    res.json({
      data: {
        status: 'completed',
        investmentId: investment._id,
        operationRef: investment.operationRef,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean()

    if (!investment) {
      return res.status(404).json({ error: 'Inversión no encontrada' })
    }

    const payments = await Payment.find({ investmentId: investment._id })
      .sort({ createdAt: -1 })
      .lean()

    res.json({ data: { ...investment, payments } })
  } catch (err) {
    next(err)
  }
})

export default router
