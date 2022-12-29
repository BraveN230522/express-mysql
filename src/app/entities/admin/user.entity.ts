import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  inviteId: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  status: string
}
