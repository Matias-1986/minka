import { Router } from 'express'
import { Notification } from '../models/Notification.js'
import { requireAuth } from '../middleware/auth.js'
import { relativeTimeEs } from '../utils/format.js'

const router = Router()

router.use(requireAuth)

function serializeNotification(n) {
  const opp = n.opportunityId
  const opportunityId =
    opp && typeof opp === 'object' && opp.legacyId != null ? opp.legacyId : n.opportunityId

  return {
    id: n._id,
    type: n.type,
    opportunityId,
    title: n.title,
    subtitle: n.subtitle,
    description: n.description,
    body: n.body,
    time: relativeTimeEs(n.createdAt),
    read: n.read,
    showBanner: n.showBanner,
    image: n.imageUrl,
    createdAt: n.createdAt,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.userId }
    if (req.query.unread === 'true') filter.read = false

    const notifications = await Notification.find(filter)
      .populate('opportunityId', 'legacyId')
      .sort({ createdAt: -1 })
      .lean()
    const unreadCount = notifications.filter((n) => !n.read).length

    res.json({
      data: notifications.map(serializeNotification),
      meta: { unreadCount, total: notifications.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.userId,
    })
      .populate('opportunityId', 'legacyId')
      .lean()

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }

    res.json({ data: serializeNotification(notification) })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true, readAt: new Date() },
      { new: true },
    ).lean()

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }

    res.json({ data: serializeNotification(notification) })
  } catch (err) {
    next(err)
  }
})

router.post('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true, readAt: new Date() },
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
