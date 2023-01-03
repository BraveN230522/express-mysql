import { UserStatus } from '../../../enums/user'
import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess, genPagination, myMapOmit, myMapPick, numberInputs } from '../../../utilities'
import { Projects, Users } from '../../entities/admin'
import _ from 'lodash'
import { CACHING_TIME } from '../../../environments'
import { In } from 'typeorm'
import slugify from 'slugify'

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
      res.status(500).json(error)
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

  async createProject(req: Request, res: Response, next: NextFunction) {
    const { name, slug, startDate, endDate } = req.body
    const project = new Projects()
    project.name = name
    project.slug = slugify(slug, '_')
    project.startDate = startDate
    project.endDate = endDate

    await myDataSource.manager.save(project)

    res.status(200).json(dataMappingSuccess({ data: project }))
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    const { name, slug, startDate, endDate } = req.body
    const projectId = Number(req.params.id)
    const projectRepository = myDataSource.getRepository(Projects)
    const projectToUpdate = await projectRepository.findOneBy({
      id: projectId,
    })

    if (projectToUpdate) {
      projectToUpdate.name = name
      projectToUpdate.slug = slugify(slug, '_')
      projectToUpdate.startDate = startDate
      projectToUpdate.endDate = endDate

      await projectRepository.save(projectToUpdate)
      res.status(200).json(dataMappingSuccess({ data: projectToUpdate }))
    }
  }

  async AddMemberToProject(req: Request, res: Response, next: NextFunction) {
    const projectId = Number(req.params.id)
    const projectRepository = myDataSource.getRepository(Projects)
    const projectToUpdate = await projectRepository.findOne({
      where: { id: projectId },
      relations: ['users'],
    })

    const members: number[] = JSON.parse(req.body.memberIds)

    const membersOfProject = await myDataSource.getRepository(Users).find({ where: { id: In(members) } })
    if (projectToUpdate) {
      const memberShouldBeAdded = _.differenceBy(membersOfProject, projectToUpdate.users, 'id')

      projectToUpdate.users = [...projectToUpdate.users, ...memberShouldBeAdded]
      await projectRepository.save(projectToUpdate)
      res.status(200).json(dataMappingSuccess({ data: projectToUpdate }))
    }
  }
}

export const ProjectController = new ProjectControllerClass()
