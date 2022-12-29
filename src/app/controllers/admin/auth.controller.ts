import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
// import { ADMIN_INFO, ADMIN_LOGIN, tokenAdmin } from '../../../db'

class AuthControllerClass {
  login(req: Request, res: Response, next: NextFunction) {
    res.json('hello')
  }
}

export const AuthController = new AuthControllerClass()
