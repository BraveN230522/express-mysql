import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess } from '../../../utilities'
import { Priorities } from '../../entities/admin'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

class PriorityControllerClass {
  async getPriority(req: Request, res: Response, next: NextFunction) {
    const priorities = await myDataSource.getRepository(Priorities).find()
    if (!priorities || priorities?.length === 0)
      return res.status(404).json(dataMapping({ message: 'No priorities found' }))

    res.status(200).json(dataMappingSuccess({ data: priorities }))
  }

  async createPriority(req: Request, res: Response, next: NextFunction) {
    const { name, order } = req.body

    const priority = new Priorities()
    priority.name = name
    priority.order = order

    await myDataSource.manager.save(priority)

    res.status(200).json(dataMappingSuccess({ data: priority }))
  }
}

export const PriorityController = new PriorityControllerClass()
