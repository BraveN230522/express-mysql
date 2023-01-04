import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { PriorityController } from '../../controllers/admin'
import { createTaskValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.priorities, PriorityController.getStatus)
router.get(authAdminRoutes.priorities + '/:id', PriorityController.getTaskDetails)
router.post(authAdminRoutes.priorities, PriorityController.createTask)

export { router as adminPriorityRouter }
