import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { myDataSource } from '../../../configs'
import { CACHING_TIME } from '../../../environments'
import {
  dataMapping,
  dataMappingSuccess,
  errorMapping,
  genPagination,
  myMapOmit,
  numberInputs,
} from '../../../utilities'
import { Priorities, Projects, Statuses, Tasks, Types, Users } from '../../entities/admin'
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
    const task = await myDataSource
      .getRepository(Tasks)
      .findOne({ where: { id: taskId }, relations: ['user', 'project', 'status', 'priority', 'type'] })

    if (!task || _.isEmpty(task)) return res.status(404).json(dataMapping({ message: 'No tasks found' }))

    return res.status(200).json(
      dataMappingSuccess({
        data: task,
      })
    )
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, typeId, priorityId, statusId, startDate, endDate, userId, projectId } = req.body
      const user = await myDataSource.getRepository(Users).findOneBy({ id: userId })
      const project = await myDataSource.getRepository(Projects).findOneBy({ id: projectId })
      const type = await myDataSource.getRepository(Types).findOneBy({ id: typeId })
      const priority = await myDataSource.getRepository(Priorities).findOneBy({ id: priorityId })
      const status = await myDataSource.getRepository(Statuses).findOneBy({ id: statusId })

      if (user && project && type && priority && status) {
        const task = new Tasks()
        task.name = name
        task.startDate = startDate
        task.endDate = endDate
        task.type = type
        task.priority = priority
        task.status = status
        task.user = user
        task.project = project

        await myDataSource.manager.save(task)

        res.status(200).json(dataMappingSuccess({ data: task }))
      }
    } catch (error) {
      res.status(400).json(dataMapping(error))
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id)
      const taskToUpdate = await myDataSource.getRepository(Tasks).findOneBy({
        id: taskId,
      })
      if (taskToUpdate)
        myDataSource.createQueryBuilder(Tasks, 'tasks').delete().from(Tasks).where('id = :id', { id: taskId }).execute()
      else return res.status(404).json(errorMapping('Task not found'))

      return res.status(200).json(dataMapping({ message: 'Delete task successfully' }))
    } catch (error) {
      return res.status(400).json(errorMapping(error))
    }
  }
}

export const TaskController = new TaskControllerClass()
