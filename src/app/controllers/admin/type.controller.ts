import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { myDataSource } from '../../../configs'
import { Auth, Projects, Statuses, Tasks, Users } from '../../entities/admin'
import bcrypt from 'bcrypt'
import { CACHING_TIME, JWT_KEY, SALT_ROUNDS } from '../../../environments'
import { dataMapping, dataMappingSuccess, genPagination, myMapOmit, numberInputs } from '../../../utilities'
import _ from 'lodash'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

class TypeControllerClass {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    const statuses = await myDataSource.getRepository(Statuses).find()
    if (!statuses || statuses?.length === 0) return res.status(404).json(dataMapping({ message: 'No statuses' }))
    // const mappingstatuses = myMapOmit(statuses, ['password'])

    res.status(200).json(dataMappingSuccess({ data: statuses }))
  }

  async getTaskDetails(req: Request, res: Response, next: NextFunction) {
    const taskId = Number(req.params.id)
    const task = await myDataSource.getRepository(Tasks).findOneBy({ id: taskId })

    if (!task || _.isEmpty(task)) return res.status(404).json(dataMapping({ message: 'No tasks found' }))

    return res.status(200).json(
      dataMappingSuccess({
        data: task,
      })
    )
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    const { name, typeId, priorityId, statusId, startDate, endDate, userId, projectId } = req.body
    const user = await myDataSource.getRepository(Users).findOneBy({ id: userId })
    const project = await myDataSource.getRepository(Projects).findOneBy({ id: projectId })

    if (user && project) {
      const task = new Tasks()
      task.name = name
      task.type = typeId
      task.priority = priorityId
      task.status = statusId
      task.startDate = startDate
      task.endDate = endDate
      task.user = user
      task.project = project

      // await myDataSource.manager.save(task)

      res.status(200).json(dataMappingSuccess({ data: task }))
    }
  }
}

export const TypeController = new TypeControllerClass()
