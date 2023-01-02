import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { UserController } from '../../controllers/admin'
import { createUserValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.users, UserController.getUser)
router.get(authAdminRoutes.users + '/:id', UserController.getUserDetails)
router.get(authAdminRoutes.users + '/projects/:id', UserController.getUserProjects)
router.get(authAdminRoutes.users + '/tasks/:id', UserController.getUserDetails)
router.post(authAdminRoutes.users, createUserValidation, UserController.createUser)

export { router as adminUserRouter }
