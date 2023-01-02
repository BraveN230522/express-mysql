import { UserStatus } from '../../../enums/user'
import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess, genPagination, myMapOmit, myMapPick, numberInputs } from '../../../utilities'
import { Projects, Users } from '../../entities/admin'
import _ from 'lodash'
import { CACHING_TIME } from '../../../environments'
import { In } from 'typeorm'

class ProjectControllerClass {
  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { perPage, page } = numberInputs(req.body)

      const projects = await myDataSource
        .createQueryBuilder(Projects, 'projects')
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getMany()

      const projectsLength = await myDataSource
        .createQueryBuilder(Projects, 'projects')
        .cache(CACHING_TIME)
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getCount()

      if (!projects || projects?.length === 0) return res.status(404).json(dataMapping({ message: 'No projects' }))
      const mappingProjects = myMapOmit(projects, [])

      res
        .status(200)
        .json(dataMappingSuccess({ data: mappingProjects, pagination: genPagination(page, perPage, projectsLength) }))
    } catch (error: any) {
      res.status(600).json(error)
    }
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
    const { perPage, page } = numberInputs(req.body)
    try {
      const projectMembersLength = await myDataSource
        .createQueryBuilder(Users, 'users')
        .cache(CACHING_TIME)
        .innerJoin('users_projects', 'users_projects', 'users_projects.userId = users.id')
        .innerJoin('projects', 'projects', 'projects.id = users_projects.projectId')
        .where('projects.id = :id', { id: projectId })
        .getCount()

      const projectMembers = await myDataSource
        .createQueryBuilder(Users, 'users')
        .distinct(true)
        .innerJoin('users_projects', 'users_projects', 'users_projects.userId = users.id')
        .innerJoin('projects', 'projects', 'projects.id = users_projects.projectId')
        .where('projects.id = :id', { id: projectId })
        // .orderBy('users.id')
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getMany()

      res.status(200).json(
        dataMappingSuccess({
          data: projectMembers,
          pagination: genPagination(page, perPage, projectMembersLength),
        })
      )
    } catch (error) {
      res.status(500).json(error)
    }
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
