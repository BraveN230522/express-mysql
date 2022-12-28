import mysql from 'mysql'

export const mysqlCon = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Jqka123456',
  database: 'mydb',
})
