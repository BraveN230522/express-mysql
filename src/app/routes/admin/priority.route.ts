import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { PriorityController } from '../../controllers/admin'
import { createStatusValidation, isShowValidation, orderValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.priorities, PriorityController.getPriority)
router.post(authAdminRoutes.priorities, createStatusValidation('Priorities'), PriorityController.createPriority)
router.patch(authAdminRoutes.priorities + '/:id', isShowValidation, orderValidation, PriorityController.updatePriority)

export { router as adminPriorityRouter }
