import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { myDataSource } from '../../../configs'
import { Auth, Users } from '../../entities/admin'
import bcrypt from 'bcrypt'
import { JWT_KEY, SALT_ROUNDS } from '../../../environments'
import { dataMappingSuccess } from '../../../utilities'
import _ from 'lodash'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

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
