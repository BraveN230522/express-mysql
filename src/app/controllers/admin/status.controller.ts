import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { myDataSource } from '../../../configs'
import { assignIfHasKey, dataMapping, dataMappingSuccess, errorMapping } from '../../../utilities'
import { Statuses } from '../../entities/admin'

class StatusControllerClass {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    const statuses: Statuses[] = await myDataSource.query(
      'SELECT * FROM statuses order by statuses.order = 1 desc, statuses.order = 0 asc'
    )
    if (!statuses || statuses?.length === 0) return res.status(404).json(dataMapping({ message: 'No statuses found' }))

    const mappingResponse = _.map(statuses, (status) => {
      return {
        ...status,
        isShow: !!status.isShow,
      }
    })

    res.status(200).json(dataMappingSuccess({ data: mappingResponse }))
  }

  async createStatus(req: Request, res: Response, next: NextFunction) {
    const { name, order } = req.body

    const status = new Statuses()
    status.name = name
    status.order = order

    await myDataSource.manager.save(status)

    res.status(200).json(dataMappingSuccess({ data: status }))
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const statusId = Number(req.params.id)
      const statusRepo = myDataSource.getRepository(Statuses)
      const statusToUpdate = await statusRepo.findOneBy({
        id: statusId,
      })
      if (statusToUpdate) {
        assignIfHasKey(statusToUpdate, req.body)

        const [__, statusResponse] = await Promise.all([
          statusRepo.save(statusToUpdate),
          myDataSource.getRepository(Statuses).findOneBy({ id: statusId }),
        ])
        if (statusResponse) {
          const mappingStatus = { ...statusResponse, ...statusToUpdate }
          res.status(200).json(dataMappingSuccess({ data: mappingStatus }))
        }
      } else {
        res.status(400).json(errorMapping(`Status not found`))
      }
    } catch (error) {
      res.status(400).json(errorMapping(error))
    }
  }
}

export const StatusController = new StatusControllerClass()
