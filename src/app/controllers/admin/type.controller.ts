import { NextFunction, Request, Response } from 'express'
import { myDataSource } from '../../../configs'
import { dataMapping, dataMappingSuccess } from '../../../utilities'
import { Types } from '../../entities/admin'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

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

    // await myDataSource.manager.save(type)

    res.status(200).json(dataMappingSuccess({ data: type }))
  }
}

export const TypeController = new TypeControllerClass()
