import { DataSource } from 'typeorm'

export const myDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Jqka123456',
  database: 'mydb',
  entities: ['src/app/entities/admin/*.ts', 'src/app/entities/user/*.ts'],
  logging: true,
  synchronize: true,
})
