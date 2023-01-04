import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess } from '../../../utilities'
import { Statuses } from '../../entities/admin'

class StatusControllerClass {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    const statuses = await myDataSource.getRepository(Statuses).find()
    if (!statuses || statuses?.length === 0) return res.status(404).json(dataMapping({ message: 'No statuses' }))

    res.status(200).json(dataMappingSuccess({ data: statuses }))
  }

  async createStatus(req: Request, res: Response, next: NextFunction) {
    const { name, order } = req.body

    const status = new Statuses()
    status.name = name
    status.order = order

    // await myDataSource.manager.save(status)

    res.status(200).json(dataMappingSuccess({ data: status }))
  }
}

export const StatusController = new StatusControllerClass()
