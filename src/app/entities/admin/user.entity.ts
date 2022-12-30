import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Projects } from './project.entity'

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
