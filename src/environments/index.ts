import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = Number(process.env.PORT) as number
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) as number
export const JWT_KEY = process.env.JWT_KEY as string
export const CACHING_TIME = 60000
