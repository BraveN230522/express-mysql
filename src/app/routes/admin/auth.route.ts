import express from 'express'
import { noAuthAdminRoutes } from '../../../configs'
import { AuthController } from '../../controllers/admin'
import { loginValidation } from '../../validators/admin'

const router = express.Router()

router.post(noAuthAdminRoutes.login, loginValidation, AuthController.login)

export { router as adminAuthRouter }
