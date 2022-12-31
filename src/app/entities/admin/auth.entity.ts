import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column({
    unique: true,
    nullable: true,
  })
  token: string
}
