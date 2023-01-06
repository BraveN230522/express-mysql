import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { TypeController } from '../../controllers/admin'
import { createTypeValidation, isShowValidation, updateTypeValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.types, TypeController.getType)
router.post(authAdminRoutes.types, createTypeValidation, TypeController.createType)
router.patch(authAdminRoutes.types + '/:id', isShowValidation, updateTypeValidation, TypeController.updateType)

export { router as adminTypeRouter }
