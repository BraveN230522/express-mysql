import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { UserController } from '../../controllers/admin'

const router = express.Router()

router.get(authAdminRoutes.users, UserController.getUser)
router.get(authAdminRoutes.users + '/:id', UserController.getUserDetails)
router.get(authAdminRoutes.users + '/projects/:id', UserController.getUserProjects)
router.get(authAdminRoutes.users + '/tasks/:id', UserController.getUserDetails)
router.post(authAdminRoutes.users, UserController.createUser)

export { router as adminUserRouter }
