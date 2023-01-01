import { UserStatus } from '../../../enums/user'
import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess, myMapOmit, myMapPick } from '../../../utilities'
import { Projects, Users } from '../../entities/admin'
import _ from 'lodash'
import { CACHING_TIME } from '../../../environments'
import { In } from 'typeorm'

class ProjectControllerClass {
  async getProject(req: Request, res: Response, next: NextFunction) {
    const projects = await myDataSource.getRepository(Projects).find()
    if (!projects || projects?.length === 0) return res.status(404).json(dataMapping({ message: 'No projects' }))
    const mappingProjects = myMapOmit(projects, [])

    res.status(200).json(dataMappingSuccess({ data: mappingProjects }))
  }

  async getProjectDetails(req: Request, res: Response, next: NextFunction) {
    const projectId = Number(req.params.id)
    const project = await myDataSource.getRepository(Projects).findOneBy({ id: projectId })

    if (!project || _.isEmpty(project)) return res.status(404).json(dataMapping({ message: 'No project found' }))

    return res.status(200).json(
      dataMappingSuccess({
        data: project,
      })
    )
  }

  async getProjectMembers(req: Request, res: Response, next: NextFunction) {
    const projectId = Number(req.params.id)
    const project = await myDataSource.getRepository(Projects).findOne({
      relations: {
        users: true,
      },
      where: {
        id: projectId,
      },
    })

    const projectMembers = _.pick(project, ['users'])
    // const userProjects = _.pick(user, ['projects'])

    res.status(200).json(dataMappingSuccess({ data: projectMembers }))
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const usersTableLength = await myDataSource.createQueryBuilder(Users, 'user').cache(CACHING_TIME).getCount()
    const user = new Users()
    const projects: number[] = JSON.parse(req.body.defaultProject)

    const projectsOfUser = await myDataSource.getRepository(Projects).find({ where: { id: In(projects) } })

    user.inviteId = 'Invite' + (usersTableLength + 1)
    user.projects = projectsOfUser
    user.status = UserStatus.Inactive

    await myDataSource.manager.save(user)

    //Response handling
    const mappingUser = _.omit(user, ['projects'])
    res.status(200).json(dataMappingSuccess({ data: mappingUser }))
  }
}

export const ProjectController = new ProjectControllerClass()
