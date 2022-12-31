import { Express, NextFunction, Request, Response } from 'express'
import { expressjwt } from 'express-jwt'
import { adminAuthRouter, adminUserRouter } from './admin'
import { adminRoute, myDataSource, noAuthAdminRoutes } from '../../configs'
import { Auth } from '../entities/admin'
import { noAuthRoutesToArr } from '../../utilities'

export const route = (app: Express) => {
  app.use(
    expressjwt({
      secret: process.env.JWT_KEY || '1',
      algorithms: ['HS256'],
      getToken: async (req: Request): Promise<any> => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          if (process.env.ENV === 'PROD') {
            const username = req.body.username
            const admin = await myDataSource.getRepository(Auth).findOneBy({ username: username })

            if (req.headers.authorization.split(' ')[1] !== admin?.token) return undefined
            else return req.headers.authorization.split(' ')[1]
          }
          if (process.env.ENV === 'DEV') {
            return req.headers.authorization.split(' ')[1]
          }
        }
        return undefined
      },
    }).unless({ path: noAuthRoutesToArr(noAuthAdminRoutes, adminRoute) })
  )

  app.use(adminRoute, adminAuthRouter)
  app.use(adminRoute, adminUserRouter)

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({ error: 'Not found' })
  })
}
