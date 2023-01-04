import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { TypeController } from '../../controllers/admin'
import { createTaskValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.types, TypeController.getStatus)
router.get(authAdminRoutes.types + '/:id', TypeController.getTaskDetails)
router.post(authAdminRoutes.types, TypeController.createTask)

export { router as adminTypeRouter }
