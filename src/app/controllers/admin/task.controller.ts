import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { myDataSource } from '../../../configs'
import { CACHING_TIME } from '../../../environments'
import { dataMapping, dataMappingSuccess, genPagination, myMapOmit, numberInputs } from '../../../utilities'
import { Projects, Tasks, Users } from '../../entities/admin'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

class TaskControllerClass {
  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { perPage, page } = numberInputs(req.body)

      const tasks = await myDataSource
        .createQueryBuilder(Tasks, 'tasks')
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getMany()

      const tasksLength = await myDataSource
        .createQueryBuilder(Tasks, 'tasks')
        .cache(CACHING_TIME)
        .skip((page - 1) * perPage)
        .take(perPage || 1)
        .getCount()

      if (!tasks || tasks?.length === 0) return res.status(404).json(dataMapping({ message: 'No tasks' }))
      const mappingTasks = myMapOmit(tasks, [])

      res
        .status(200)
        .json(dataMappingSuccess({ data: mappingTasks, pagination: genPagination(page, perPage, tasksLength) }))
    } catch (error: any) {
      res.status(500).json(error)
    }
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

export const TaskController = new TaskControllerClass()
