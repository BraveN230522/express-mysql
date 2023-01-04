import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { TaskController } from '../../controllers/admin'
import { createTaskValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.tasks, TaskController.getTask)
router.get(authAdminRoutes.tasks + '/:id', TaskController.getTaskDetails)
router.post(authAdminRoutes.tasks, createTaskValidation, TaskController.createTask)

export { router as adminTaskRouter }
