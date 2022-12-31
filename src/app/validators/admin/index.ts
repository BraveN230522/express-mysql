import { NextFunction, Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

export const loginValidation = [
  check('username').notEmpty().withMessage('Username is a require field'),
  check('password')
    .notEmpty()
    .withMessage('Password is a require field')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] })
    }

    next()
  },
]
