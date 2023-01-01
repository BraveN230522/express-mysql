import { UserStatus } from './../../../enums/user'
import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess, myMapOmit, myMapPick } from '../../../utilities'
import { Projects, Users } from '../../entities/admin'
import _ from 'lodash'
import { CACHING_TIME } from '../../../environments'
import { In } from 'typeorm'

class UserControllerClass {
  async getUser(req: Request, res: Response, next: NextFunction) {
    const users = await myDataSource.getRepository(Users).find()
    if (!users || users?.length === 0) return res.status(404).json(dataMapping({ message: 'No users' }))
    const mappingUsers = myMapOmit(users, ['password'])

    res.status(200).json(dataMappingSuccess({ data: mappingUsers }))
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id)
    const user = await myDataSource.getRepository(Users).findOneBy({ id: userId })
    const projects = await myDataSource
      .createQueryBuilder(Users, 'user')
      .cache(CACHING_TIME)
      .where('user.id = :id', { id: userId })
      .innerJoin('users_projects', 'users_projects')
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
    const userId = Number(req.params.id)
    const user = await myDataSource.getRepository(Users).findOne({
      relations: {
        projects: true,
      },
      where: {
        id: userId,
      },
    })

    const userProjects = _.pick(user, ['projects'])

    res.status(200).json(dataMappingSuccess({ data: userProjects }))
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

export const UserController = new UserControllerClass()
