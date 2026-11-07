import { Router } from 'express'
import { PaymentMethod } from '../models/PaymentMethod.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

function serializeMethod(m) {
  return {
    id: m._id,
    type: m.type,
    label: m.label,
    detail: m.detail,
    default: m.isDefault,
    cryptoAsset: m.cryptoAsset,
    cryptoNetwork: m.cryptoNetwork,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({
      userId: req.userId,
      isActive: true,
    }).sort({ isDefault: -1, createdAt: -1 })

    res.json({ data: methods.map(serializeMethod) })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { type, label, detail, isDefault, cryptoAsset, cryptoNetwork, walletAddress, cardLast4 } =
      req.body

    if (!type || !label) {
      return res.status(400).json({ error: 'type y label son requeridos' })
    }

    if (isDefault) {
      await PaymentMethod.updateMany({ userId: req.userId }, { isDefault: false })
    }

    const method = await PaymentMethod.create({
      userId: req.userId,
      type,
      label,
      detail,
      isDefault: Boolean(isDefault),
      cryptoAsset,
      cryptoNetwork,
      walletAddress,
      cardLast4,
      cardBrand: type === 'card' ? 'VISA' : undefined,
    })

    res.status(201).json({ data: serializeMethod(method) })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true },
    )

    if (!method) {
      return res.status(404).json({ error: 'Método no encontrado' })
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
