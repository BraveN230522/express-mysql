import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { UserController } from '../../controllers/admin'

const router = express.Router()

router.get(authAdminRoutes.users, UserController.getUser)
router.get(authAdminRoutes.users + '/:id', UserController.getUserDetails)

export { router as adminUserRouter }
