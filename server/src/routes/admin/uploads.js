import { Router } from 'express'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { requireAdminAuth, requirePermission } from '../../middleware/adminAuth.js'
import { env } from '../../config/env.js'

const router = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../../../uploads/opportunities')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Formato no permitido. Usá JPG, PNG, WebP o GIF.'))
      return
    }
    cb(null, true)
  },
})

router.post(
  '/opportunity-image',
  requireAdminAuth,
  requirePermission('opportunities:write'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' })
    }

    const url = `${env.apiPublicUrl}/uploads/opportunities/${req.file.filename}`
    res.status(201).json({
      data: {
        url,
        filename: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    })
  },
)

export default router
