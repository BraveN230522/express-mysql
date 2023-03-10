import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { UserController } from '../../controllers/admin'
import { createUserValidation, updateUserValidation } from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.users, UserController.getUser)
router.get(authAdminRoutes.users + '/:id', UserController.getUserDetails)
router.get(authAdminRoutes.users + '/projects/:id', UserController.getUserProjects)
router.get(authAdminRoutes.users + '/tasks/:id', UserController.getUserTasks)
router.get(authAdminRoutes.users + '/tasks/:id', UserController.getUserDetails)
router.post(authAdminRoutes.users, createUserValidation, UserController.createUser)
router.patch(authAdminRoutes.users + '/:id', updateUserValidation, UserController.updateUser)
router.delete(authAdminRoutes.users + '/:id', UserController.deleteUser)

export { router as adminUserRouter }
