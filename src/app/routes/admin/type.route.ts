import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { TypeController } from '../../controllers/admin'
import { createTypeValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.types, TypeController.getType)
router.post(authAdminRoutes.types, createTypeValidation, TypeController.createType)

export { router as adminTypeRouter }
