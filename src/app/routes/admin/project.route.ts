import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { ProjectController } from '../../controllers/admin'

const router = express.Router()

router.get(authAdminRoutes.projects, ProjectController.getProject)
router.get(authAdminRoutes.projects + '/:id', ProjectController.getProjectDetails)
router.get(authAdminRoutes.projects + '/members/:id', ProjectController.getProjectMembers)
// router.get(authAdminRoutes.projects + '/tasks/:id', ProjectController.getProjectDetails)
// router.post(authAdminRoutes.projects, ProjectController.createProject)

export { router as adminProjectRouter }
