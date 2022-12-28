import { AuthController } from '../../app/controllers/admin'
import { noAuthAdminRoutes } from '../../configs'
import express from 'express'

const router = express.Router()

router.post(noAuthAdminRoutes.login, AuthController.login)

export { router as adminRouter }
