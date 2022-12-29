import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = Number(process.env.PORT) || 1999
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
export const JWT_KEY = process.env.JWT_KEY
