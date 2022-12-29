import { DataSource } from 'typeorm'

export const myDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Jqka123456',
  database: 'mydb',
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: true,
})
