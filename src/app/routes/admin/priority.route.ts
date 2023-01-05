import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { PriorityController } from '../../controllers/admin'
import { createStatusValidation, createTaskValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.priorities, PriorityController.getPriority)
router.post(authAdminRoutes.priorities, createStatusValidation('Priorities'), PriorityController.createPriority)

export { router as adminPriorityRouter }
