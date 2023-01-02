import { NextFunction, Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import { asyncFilter, isJsonString } from '../../../utilities'
import { myDataSource } from '../../../configs'

export const loginValidation = [
  check('username').notEmpty().withMessage('Username is a require field'),
  check('password')
    .notEmpty()
    .withMessage('Password is a require field')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] })
    }

    next()
  },
]

export const createUserValidation = [
  check('defaultProject')
    .notEmpty()
    .withMessage('Default project is a require field')
    .custom(async (defaultProject: string, { req }) => {
      if (isJsonString(req.body.defaultProject)) {
        const defaultProjectArr: number[] = JSON.parse(defaultProject)
        if (Array.isArray(defaultProjectArr)) {
          const notExistedProject = await asyncFilter(defaultProjectArr, async (projectId: number) => {
            const existQuery = await myDataSource.manager.query(
              `SELECT exists ( SELECT * FROM projects WHERE projects.id = ${projectId}) as exist`
            )
            const isExist = existQuery[0].exist === '1'
            return !isExist
          })
          if (notExistedProject.length > 0) {
            throw new Error(
              `${notExistedProject.toString()} ${notExistedProject.length > 1 ? 'are' : 'is'} not existed`
            )
          }
        } else throw new Error('Default project must be an array')
      } else throw new Error('Default project must be an array')
      return true
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] })
    }
    next()
  },
]
