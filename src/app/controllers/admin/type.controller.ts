import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { assignIfHasKey, dataMapping, dataMappingSuccess, errorMapping } from '../../../utilities'
import { Types } from '../../entities/admin'

class TypeControllerClass {
  async getType(req: Request, res: Response, next: NextFunction) {
    const types = await myDataSource.getRepository(Types).find()
    if (!types || types?.length === 0) return res.status(404).json(dataMapping({ message: 'No types found' }))

    res.status(200).json(dataMappingSuccess({ data: types }))
  }

  async createType(req: Request, res: Response, next: NextFunction) {
    const { name, color } = req.body

    const type = new Types()
    type.name = name
    type.color = color

    await myDataSource.manager.save(type)

    res.status(200).json(dataMappingSuccess({ data: type }))
  }

  async updateType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = Number(req.params.id)
      const typeRepo = myDataSource.getRepository(Types)
      const typeToUpdate = await typeRepo.findOneBy({
        id: typeId,
      })
      if (typeToUpdate) {
        assignIfHasKey(typeToUpdate, req.body)

        const [__, typeResponse] = await Promise.all([
          typeRepo.save(typeToUpdate),
          myDataSource.getRepository(Types).findOneBy({ id: typeId }),
        ])
        if (typeResponse) {
          const mappingUser = { ...typeResponse, ...typeToUpdate }
          res.status(200).json(dataMappingSuccess({ data: mappingUser }))
        }
      } else {
        res.status(400).json(errorMapping(`User not found`))
      }
    } catch (error) {
      res.status(400).json(errorMapping(error))
    }
  }
}

export const TypeController = new TypeControllerClass()
