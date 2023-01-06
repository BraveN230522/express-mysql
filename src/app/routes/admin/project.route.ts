import express from 'express'
import { authAdminRoutes } from '../../../configs'
import { ProjectController } from '../../controllers/admin'
import {
  AddMemberToProjectValidation,
  createProjectValidation,
  removeMemberToProjectValidation,
} from '../../validators/admin'

const router = express.Router()

router.get(authAdminRoutes.projects, ProjectController.getProject)
router.get(authAdminRoutes.projects + '/:id', ProjectController.getProjectDetails)
router.get(authAdminRoutes.projects + '/members/:id', ProjectController.getProjectMembers)
router.post(authAdminRoutes.projects, createProjectValidation, ProjectController.createProject)
router.patch(authAdminRoutes.projects + '/:id', createProjectValidation, ProjectController.updateProject)
router.patch(
  authAdminRoutes.projects + '/member/:id',
  AddMemberToProjectValidation,
  ProjectController.AddMemberToProject
)
router.delete(
  authAdminRoutes.projects + '/member/:id',
  removeMemberToProjectValidation,
  ProjectController.removeMemberToProject
)
// router.get(authAdminRoutes.projects + '/tasks/:id', ProjectController.getProjectDetails)

export { router as adminProjectRouter }
