import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { myDataSource } from '../../../configs'
import { JWT_KEY } from '../../../environments'
import { dataMappingSuccess } from '../../../utilities'
import { Auth } from '../../entities/admin'

class AuthControllerClass {
  async login(req: Request, res: Response, next: NextFunction) {
    const user = await myDataSource.getRepository(Auth).findOneBy({
      username: req.body.username,
    })

    const match = await bcrypt.compare(req.body.password || '', user?.password || '')
    if (!match) return res.status(401).send({ error: 'Login failed! Check authentication credentials' })

    const token = jwt.sign({ id: user?.id, username: user?.username }, JWT_KEY || '1')
    const mappingUser = _.omit({ ...user, token: 'Bearer ' + token }, ['password'])

    await myDataSource.createQueryBuilder().update(Auth).set({ token }).where('id = :id', { id: user?.id }).execute()
    res.json(
      dataMappingSuccess({
        data: mappingUser,
      })
    )
  }
}

export const AuthController = new AuthControllerClass()
