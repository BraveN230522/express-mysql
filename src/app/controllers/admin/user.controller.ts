import { UserStatus } from './../../../enums/user'
import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import {
  dataMapping,
  dataMappingSuccess,
  errorMapping,
  genPagination,
  myMapOmit,
  myMapPick,
  numberInputs,
} from '../../../utilities'
import { Projects, Users } from '../../entities/admin'
import _ from 'lodash'
import { CACHING_TIME } from '../../../environments'
import { In } from 'typeorm'

class UserControllerClass {
  async getUser(req: Request, res: Response, next: NextFunction) {
    const { perPage, page } = numberInputs(req.body)
    try {
      const users = await myDataSource
        .createQueryBuilder(Users, 'users')
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getMany()

      const usersLength = await myDataSource
        .createQueryBuilder(Users, 'users')
        .cache(CACHING_TIME)
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getCount()

      if (!users || users?.length === 0) return res.status(404).json(dataMapping({ message: 'No users' }))
      const mappingUsers = myMapOmit(users, ['password'])

      res
        .status(200)
        .json(dataMappingSuccess({ data: mappingUsers, pagination: genPagination(page, perPage, usersLength) }))
    } catch (error) {
      console.log({ error })
      res.status(500).json(error)
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id)
    const user = await myDataSource.getRepository(Users).findOneBy({ id: userId })
    const projects = await myDataSource
      .createQueryBuilder(Users, 'users')
      .cache(CACHING_TIME)
      .innerJoin('users_projects', 'up', 'up.userId = users.id')
      .where('users.id = :id', { id: userId })
      .getRawMany()

    if (!user || _.isEmpty(user)) return res.status(404).json(dataMapping({ message: 'No user found' }))

    return res.status(200).json(
      dataMappingSuccess({
        data: {
          ...user,
          projectCount: projects.length,
          taskCount: projects.length,
        },
      })
    )
  }

  async getUserProjects(req: Request, res: Response, next: NextFunction) {
    const { perPage, page } = numberInputs(req.body)
    const userId = Number(req.params.id)
    try {
      const projectsOfUser = await myDataSource
        .createQueryBuilder(Projects, 'projects')
        .distinct(true)
        .innerJoin('users_projects', 'users_projects', 'users_projects.projectId = projects.id')
        .innerJoin('users', 'users', 'users.id = users_projects.userId')
        .where('users.id = :id', { id: userId })
        // .orderBy('projects.id')
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getMany()

      const projectsOfUserLength = await myDataSource
        .createQueryBuilder(Projects, 'projects')
        .cache(CACHING_TIME)
        .innerJoin('users_projects', 'users_projects', 'users_projects.projectId = projects.id')
        .innerJoin('users', 'users', 'users.id = users_projects.userId')
        .where('users.id = :id', { id: userId })
        .getCount()

      res
        .status(200)
        .json(
          dataMappingSuccess({ data: projectsOfUser, pagination: genPagination(page, perPage, projectsOfUserLength) })
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

  //TODO: Need to update
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, dob, status } = req.body
    const userId = Number(req.params.id)
    const user = myDataSource.getRepository(Users)
    const userToUpdate = await user.findOneBy({
      id: userId,
    })

    if (userToUpdate) {
      userToUpdate.name = name
      userToUpdate.email = email
      userToUpdate.dob = dob
      userToUpdate.status = status

      await user.save(userToUpdate)
      res.status(200).json(dataMappingSuccess({ data: userToUpdate }))
    } else {
      res.status(400).json(errorMapping(`User not found`))
    }
  }
}

export const UserController = new UserControllerClass()
