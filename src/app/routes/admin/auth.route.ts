import express from 'express'
import { noAuthAdminRoutes } from '../../../configs'
import { AuthController } from '../../controllers/admin'

const router = express.Router()

router.post(noAuthAdminRoutes.login, AuthController.login)

export { router as adminAuthRouter }
