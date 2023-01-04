import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { StatusController } from '../../controllers/admin'
import { createStatusValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.statuses, StatusController.getStatus)
router.post(authAdminRoutes.statuses, createStatusValidation, StatusController.createStatus)

export { router as adminStatusRouter }
