import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { assignIfHasKey, dataMapping, dataMappingSuccess, errorMapping } from '../../../utilities'
import { Priorities } from '../../entities/admin'

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

  async updatePriority(req: Request, res: Response, next: NextFunction) {
    try {
      const priorityId = Number(req.params.id)
      const statusRepo = myDataSource.getRepository(Priorities)
      const statusToUpdate = await statusRepo.findOneBy({
        id: priorityId,
      })
      if (statusToUpdate) {
        assignIfHasKey(statusToUpdate, req.body)

        const [__, statusResponse] = await Promise.all([
          statusRepo.save(statusToUpdate),
          myDataSource.getRepository(Priorities).findOneBy({ id: priorityId }),
        ])
        if (statusResponse) {
          const mappingPriority = { ...statusResponse, ...statusToUpdate }
          res.status(200).json(dataMappingSuccess({ data: mappingPriority }))
        }
      } else {
        res.status(400).json(errorMapping(`Priority not found`))
      }
    } catch (error) {
      res.status(400).json(errorMapping(error))
    }
  }
}

export const PriorityController = new PriorityControllerClass()
