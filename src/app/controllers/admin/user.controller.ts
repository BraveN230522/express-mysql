import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess, myMapOmit } from '../../../utilities'
import { Users } from '../../entities/admin'
import _ from 'lodash'

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

    if (!user || _.isEmpty(user)) return res.status(404).json(dataMapping({ message: 'No user found' }))

    res.status(200).json(dataMappingSuccess({ data: user }))
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const user = new Users()
    user.inviteId = 'Invite' + user.id
  }
}

export const UserController = new UserControllerClass()
