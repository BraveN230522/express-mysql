import { NextFunction, Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import { asyncFilter, isHexColorRegex, isJsonString } from '../../../utilities'
import { myDataSource } from '../../../configs'
import moment from 'moment'

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

export const createProjectValidation = [
  check('name').notEmpty().withMessage('Name is a require field'),
  check('slug').notEmpty().withMessage('Slug is a require field'),
  check('startDate')
    .notEmpty()
    .withMessage('Start date is a require field')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Start date is invalid')
    .custom((startDate: string, { req }) => {
      const endDate = req.body.endDate
      const diffTime = moment(startDate, 'YYYY-MM-DD').diff(endDate)
      return diffTime ? diffTime <= 0 : true
    })
    .withMessage('Start date must be less than end date'),

  check('endDate')
    .notEmpty()
    .withMessage('End date is a require field')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('End date is invalid'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] })
    }
    next()
  },
]

export const AddMemberToProjectValidation = [
  check('memberIds')
    .notEmpty()
    .withMessage('Member list is a require field')
    .custom(async (memberIds: string, { req }) => {
      if (isJsonString(req.body.memberIds)) {
        const defaultMemArr: number[] = JSON.parse(memberIds)
        if (Array.isArray(defaultMemArr)) {
          const notExistedMems = await asyncFilter(defaultMemArr, async (memberId: number) => {
            const existQuery = await myDataSource.manager.query(
              `SELECT exists ( SELECT * FROM users WHERE users.id = ${memberId}) as exist`
            )
            const isExist = existQuery[0].exist === '1'
            return !isExist
          })
          if (notExistedMems.length > 0) {
            throw new Error(`${notExistedMems.toString()} ${notExistedMems.length > 1 ? 'are' : 'is'} not existed`)
          }
        } else throw new Error('Member list must be an array')
      } else throw new Error('Member list must be an array')
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

export const createTaskValidation = [
  check('name').notEmpty().withMessage('Name is a require field'),
  check('projectId').notEmpty().withMessage('Project is a require field'),
  check('startDate')
    .notEmpty()
    .withMessage('Start date is a require field')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Start date is invalid')
    .custom((startDate: string, { req }) => {
      const endDate = req.body.endDate
      const diffTime = moment(startDate, 'YYYY-MM-DD').diff(endDate)
      return diffTime ? diffTime <= 0 : true
    })
    .withMessage('Start date must be less than end date'),

  check('endDate')
    .notEmpty()
    .withMessage('End date is a require field')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('End date is invalid'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] })
    }
    next()
  },
]

export const createStatusValidation = (entity = 'statuses') => [
  check('name')
    .notEmpty()
    .withMessage('Name is a require field')
    .custom(async (name: string, { req }) => {
      const existQuery = await myDataSource.manager.query(
        `SELECT exists ( SELECT * FROM ${entity} WHERE ${entity}.name = "${name}") as exist`
      )
      const isExist = existQuery[0].exist === '1'
      if (isExist) throw new Error(`${name} is existed`)
      return true
    }),
  check('order')
    .notEmpty()
    .withMessage('Order is a require field')
    .custom(async (order: string, { req }) => {
      const existQuery = await myDataSource.manager.query(
        `SELECT exists ( SELECT * FROM ${entity} WHERE ${entity}.order = ${order}) as exist`
      )
      const isExist = existQuery[0].exist === '1'
      if (isExist) throw new Error(`Order ${order} is existed`)
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

export const createTypeValidation = [
  check('name')
    .notEmpty()
    .withMessage('Name is a require field')
    .custom(async (name: string, { req }) => {
      const existQuery = await myDataSource.manager.query(
        `SELECT exists ( SELECT * FROM types WHERE types.name = "${name}") as exist`
      )
      const isExist = existQuery[0].exist === '1'
      if (isExist) throw new Error(`${name} is existed`)
      return true
    }),
  check('color')
    .notEmpty()
    .withMessage('Order is a require field')
    .custom(async (color: string, { req }) => {
      if (!isHexColorRegex(color)) throw new Error(`Color must be hex color`)
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
