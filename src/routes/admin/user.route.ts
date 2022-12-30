import { UserController } from '../../app/controllers/admin'
import { authAdminRoutes } from '../../configs'
import express from 'express'

const router = express.Router()

router.get(authAdminRoutes.users, UserController.getUser)
router.get(authAdminRoutes.users + '/:id', UserController.getUserDetails)

export { router as adminUserRouter }
