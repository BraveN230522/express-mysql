import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { StatusController } from '../../controllers/admin'
import { createStatusValidation, isShowValidation, orderValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.statuses, StatusController.getStatus)
router.post(authAdminRoutes.statuses, createStatusValidation(), StatusController.createStatus)
router.patch(authAdminRoutes.statuses + '/:id', isShowValidation, orderValidation, StatusController.updateStatus)

export { router as adminStatusRouter }
